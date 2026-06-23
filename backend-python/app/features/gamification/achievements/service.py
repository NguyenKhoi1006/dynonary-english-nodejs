from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from google.cloud.firestore import SERVER_TIMESTAMP
from app.firebase import get_firestore_db
from app.shared.firestore_helpers import serialize_doc
from app.features.gamification.constants import ACHIEVEMENT_DEFINITIONS, XP_PER_ACHIEVEMENT

USER_ACHIEVEMENTS_COL = "user_achievements"
USERS_COL = "users"


async def get_achievements(uid: str) -> Dict[str, Any]:
    db = get_firestore_db()

    # Get user's achievement progress
    doc = db.collection(USER_ACHIEVEMENTS_COL).document(uid).get()
    user_data = doc.to_dict() if doc.exists else {}

    unlocked = user_data.get("unlocked", {})
    progress_data = user_data.get("progress", {})
    total_xp = user_data.get("totalXpFromAchievements", 0)

    achievements = []
    for ach_id, ach_def in ACHIEVEMENT_DEFINITIONS.items():
        is_unlocked = ach_id in unlocked
        unlocked_at = None
        if is_unlocked:
            ua = unlocked[ach_id]
            if isinstance(ua, dict):
                unlocked_at = ua.get("unlockedAt")
        if unlocked_at and hasattr(unlocked_at, "seconds"):
            unlocked_at = datetime.fromtimestamp(
                unlocked_at.seconds + unlocked_at.nanoseconds / 1e9
            ).isoformat()

        prog = progress_data.get(ach_id, {})
        current_progress = prog.get("current", 0) if isinstance(prog, dict) else 0
        target = prog.get("target", ach_def.get("target", 1)) if isinstance(prog, dict) else 1

        if is_unlocked:
            current_progress = target

        achievements.append({
            "id": ach_id,
            "title": ach_def["title"],
            "description": ach_def["description"],
            "icon": ach_def["icon"],
            "xpReward": ach_def["xp_reward"],
            "unlockedAt": unlocked_at,
            "progress": current_progress,
            "target": target,
        })

    return {
        "achievements": achievements,
        "totalXpFromAchievements": total_xp,
    }


async def check_achievements(uid: str, event_type: str, event_value: int = 1) -> Dict[str, Any]:
    db = get_firestore_db()

    # Get current user achievement data
    doc = db.collection(USER_ACHIEVEMENTS_COL).document(uid).get()
    user_data = doc.to_dict() if doc.exists else {}
    unlocked = user_data.get("unlocked", {})
    progress_data = user_data.get("progress", {})
    total_xp = user_data.get("totalXpFromAchievements", 0)

    # Get user XP
    user_doc = db.collection(USERS_COL).document(uid).get()
    user_info = user_doc.to_dict() if user_doc.exists else {}
    current_xp = user_info.get("xp", 0)

    newly_unlocked = []
    xp_awarded = 0

    # Map event types to achievement IDs
    for ach_id, ach_def in ACHIEVEMENT_DEFINITIONS.items():
        if ach_id in unlocked:
            continue

        should_unlock = _check_event(ach_id, event_type, event_value, progress_data, user_info)

        if should_unlock:
            # Unlock achievement
            unlocked[ach_id] = {"unlockedAt": SERVER_TIMESTAMP}
            xp_awarded += ach_def["xp_reward"]
            total_xp += ach_def["xp_reward"]
            current_xp += ach_def["xp_reward"]

            newly_unlocked.append({
                "id": ach_id,
                "title": ach_def["title"],
                "description": ach_def["description"],
                "icon": ach_def["icon"],
                "xpReward": ach_def["xp_reward"],
                "unlockedAt": datetime.now(timezone.utc).isoformat(),
                "progress": 1,
                "target": 1,
            })

    # Update progress for incremental achievements
    if event_type == "lessons_completed":
        for ach_id in ["lessons_10", "lessons_50", "lessons_100"]:
            if ach_id not in unlocked:
                prog = progress_data.get(ach_id, {"current": 0, "target": ACHIEVEMENT_DEFINITIONS[ach_id].get("target", 10)})
                if isinstance(prog, dict):
                    prog["current"] = prog.get("current", 0) + event_value
                    progress_data[ach_id] = prog

    if event_type == "xp_earned":
        for ach_id in ["level_5", "level_10", "level_25"]:
            if ach_id not in unlocked:
                prog = progress_data.get(ach_id, {"current": 0, "target": 5 if "5" in ach_id else 10 if "10" in ach_id else 25})
                if isinstance(prog, dict):
                    # Check user level from XP
                    user_level = min(25, (user_info.get("xp", 0) // 100) + 1)
                    prog["current"] = user_level
                    progress_data[ach_id] = prog

    # Save
    db.collection(USER_ACHIEVEMENTS_COL).document(uid).set({
        "unlocked": unlocked,
        "progress": progress_data,
        "totalXpFromAchievements": total_xp,
        "updatedAt": SERVER_TIMESTAMP,
    }, merge=True)

    db.collection(USERS_COL).document(uid).update({
        "xp": current_xp,
    })

    return {
        "newAchievements": newly_unlocked,
        "xpAwarded": xp_awarded,
    }


def _check_event(ach_id: str, event_type: str, event_value: int, progress: dict, user: dict) -> bool:
    """Check if a specific achievement condition is met."""
    xp_total = user.get("xp", 0)
    user_level = min(25, (xp_total // 100) + 1)
    streak = user.get("totalStudyDays", 0)
    lessons = sum(
        p.get("current", 0) for p in progress.values() if isinstance(p, dict)
    )

    checks = {
        "first_lesson": event_type == "lessons_completed" and event_value >= 1,
        "lessons_10": (progress.get("lessons_10", {}).get("current", 0) + event_value) >= 10 if event_type == "lessons_completed" else False,
        "lessons_50": (progress.get("lessons_50", {}).get("current", 0) + event_value) >= 50 if event_type == "lessons_completed" else False,
        "lessons_100": (progress.get("lessons_100", {}).get("current", 0) + event_value) >= 100 if event_type == "lessons_completed" else False,
        "level_5": user_level >= 5,
        "level_10": user_level >= 10,
        "level_25": user_level >= 25,
        "streak_7": streak >= 7 and event_type == "streak_milestone",
        "streak_30": streak >= 30 and event_type == "streak_milestone",
        "streak_100": streak >= 100 and event_type == "streak_milestone",
    }

    return checks.get(ach_id, False)
