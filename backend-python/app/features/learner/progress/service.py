from typing import Optional, Dict, Any, List
from google.cloud.firestore import SERVER_TIMESTAMP
from datetime import datetime, timezone, timedelta
from app.firebase import get_firestore_db
from app.shared.firestore_helpers import serialize_doc

USERS_COL = "users"
PROGRESS_COL = "user_progress"
TESTS_COL = "tests"
ATTEMPTS_COL = "user_placement_attempts"

LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"]
LEVEL_ORDER = {"A1": 1, "A2": 2, "B1": 3, "B2": 4, "C1": 5, "C2": 6}

XP_PER_MATERIAL = 50
XP_PER_TEST_PASS = 100
XP_PER_LEVEL_UP = 500


async def get_user_progress(uid: str) -> Optional[Dict[str, Any]]:
    db = get_firestore_db()

    # Get user info
    user_doc = db.collection(USERS_COL).document(uid).get()
    if not user_doc.exists:
        return None

    user_data = user_doc.to_dict()
    current_level = user_data.get("level")
    xp = user_data.get("xp", 0)
    study_days = user_data.get("totalStudyDays", 0)

    # Get progress for each level
    progress_docs = db.collection(PROGRESS_COL).document(uid).collection("levels").stream()
    levels = {}
    for doc in progress_docs:
        data = serialize_doc(doc.to_dict())
        levels[doc.id] = data

    # Fill in missing levels as "locked"
    levels_locked = True
    for level in LEVELS:
        if level in levels:
            continue
        if level == current_level:
            levels[level] = {"level": level, "status": "in_progress", "progress": 0, "materialsCompleted": [], "testsPassed": [], "levelUpAttempts": 0}
        elif levels_locked:
            levels[level] = {"level": level, "status": "locked", "progress": 0, "materialsCompleted": [], "testsPassed": [], "levelUpAttempts": 0}
        else:
            levels[level] = {"level": level, "status": "locked", "progress": 0, "materialsCompleted": [], "testsPassed": [], "levelUpAttempts": 0}
        if level == current_level:
            levels_locked = False

    return {
        "userId": uid,
        "levels": levels,
        "totalXp": xp,
        "totalStudyDays": study_days,
        "currentLevel": current_level,
    }


async def complete_material(uid: str, material_id: str) -> Dict[str, Any]:
    db = get_firestore_db()

    # Get user to determine current level
    user_doc = db.collection(USERS_COL).document(uid).get()
    if not user_doc.exists:
        return {"error": "User not found"}
    user_data = user_doc.to_dict()
    current_level = user_data.get("level", "A1")

    # Update progress for this level
    level_progress_ref = db.collection(PROGRESS_COL).document(uid).collection("levels").document(current_level)
    level_data = level_progress_ref.get().to_dict() or {}

    completed = level_data.get("materialsCompleted", [])
    if material_id not in completed:
        completed.append(material_id)

    progress_pct = min(100, int((len(completed) / 20) * 100))  # assume 20 materials per level

    level_progress_ref.set({
        "level": current_level,
        "status": "in_progress",
        "materialsCompleted": completed,
        "progress": progress_pct,
    }, merge=True)

    # Grant XP
    new_xp = (user_data.get("xp", 0) + XP_PER_MATERIAL)
    db.collection(USERS_COL).document(uid).update({
        "xp": new_xp,
        "lastActiveAt": SERVER_TIMESTAMP,
    })

    return {
        "xp": XP_PER_MATERIAL,
        "totalXp": new_xp,
        "progress": progress_pct,
    }


async def submit_level_up(uid: str, test_id: str) -> Dict[str, Any]:
    db = get_firestore_db()

    # Get test
    test_doc = db.collection(TESTS_COL).document(test_id).get()
    if not test_doc.exists:
        return {"error": "Test not found"}
    test_data = test_doc.to_dict()

    # Get user
    user_doc = db.collection(USERS_COL).document(uid).get()
    if not user_doc.exists:
        return {"error": "User not found"}
    user_data = user_doc.to_dict()
    current_level = user_data.get("level", "A1")

    # For simplicity, generate a simulated score
    # In production, the test would be taken question by question
    questions = test_data.get("questions", [])
    total = len(questions)

    # Simulate 70-90% correct (for now)
    import random
    correct = random.randint(int(total * 0.7), int(total * 0.9))
    percentage = round((correct / total) * 100, 1) if total > 0 else 0
    passed = percentage >= test_data.get("passScore", 70)

    # Save attempt
    attempt_ref = db.collection(ATTEMPTS_COL).document()
    attempt_data = {
        "userId": uid,
        "testId": test_id,
        "type": "level_up",
        "score": correct,
        "totalQuestions": total,
        "percentage": percentage,
        "resultLevel": None,
        "passed": passed,
        "answers": [],
        "startedAt": SERVER_TIMESTAMP,
        "completedAt": SERVER_TIMESTAMP,
    }
    attempt_ref.set(attempt_data)

    new_level = None
    if passed:
        # Determine next level
        current_rank = LEVEL_ORDER.get(current_level, 0)
        if current_rank < len(LEVELS):
            next_level = LEVELS[current_rank]  # advance one step
            new_level = next_level

            db.collection(USERS_COL).document(uid).update({
                "level": new_level,
                "levelAssignedAt": SERVER_TIMESTAMP,
                "xp": user_data.get("xp", 0) + XP_PER_LEVEL_UP,
            })

            # Mark current level as completed
            db.collection(PROGRESS_COL).document(uid).collection("levels").document(current_level).set({
                "status": "completed",
                "completedAt": SERVER_TIMESTAMP,
            }, merge=True)
        else:
            # Already at max level
            passed = False
            new_level = current_level
            return {
                "passed": False, "score": correct, "totalQuestions": total,
                "percentage": percentage, "newLevel": None,
                "message": "You are already at the highest level (C2)!",
            }

    return {
        "passed": passed,
        "score": correct,
        "totalQuestions": total,
        "percentage": percentage,
        "newLevel": new_level,
        "message": f"You {'passed' if passed else 'did not pass'}. {'Level up to ' + new_level + '!' if passed else 'Try again after 3 days.'}",
    }
