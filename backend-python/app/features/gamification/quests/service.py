import random
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from google.cloud.firestore import SERVER_TIMESTAMP
from app.firebase import get_firestore_db
from app.shared.firestore_helpers import serialize_doc
from app.features.gamification.constants import DAILY_QUEST_POOL, XP_PER_DAILY_QUEST

DAILY_QUESTS_COL = "daily_quests"
USERS_COL = "users"
QUESTS_PER_DAY = 3


def _today_str() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


async def get_or_create_daily_quests(uid: str) -> Dict[str, Any]:
    db = get_firestore_db()
    today = _today_str()

    doc = db.collection(DAILY_QUESTS_COL).document(uid).get()

    if doc.exists:
        data = doc.to_dict()
        if data.get("date") == today:
            # Return existing quests
            quests = data.get("quests", [])
            completed = sum(1 for q in quests if q.get("completed"))
            return {
                "date": today,
                "quests": quests,
                "totalCompleted": completed,
            }

    # Pick 3 random quests from pool
    selected = random.sample(DAILY_QUEST_POOL, min(QUESTS_PER_DAY, len(DAILY_QUEST_POOL)))
    quests = [
        {
            "id": q["id"],
            "title": q["title"],
            "description": q["description"],
            "target": q["target"],
            "xpReward": q["xp_reward"],
            "progress": 0,
            "completed": False,
        }
        for q in selected
    ]

    db.collection(DAILY_QUESTS_COL).document(uid).set({
        "date": today,
        "quests": quests,
        "updatedAt": SERVER_TIMESTAMP,
    })

    return {
        "date": today,
        "quests": quests,
        "totalCompleted": 0,
    }


async def update_quest_progress(uid: str, quest_id: str, delta: int = 1) -> Dict[str, Any]:
    db = get_firestore_db()

    doc = db.collection(DAILY_QUESTS_COL).document(uid).get()
    if not doc.exists:
        return {"questId": quest_id, "progress": 0, "completed": False, "xpAwarded": 0}

    data = doc.to_dict()
    quests = data.get("quests", [])
    xp_awarded = 0

    for q in quests:
        if q["id"] == quest_id:
            if q.get("completed"):
                break
            q["progress"] = q.get("progress", 0) + delta
            target = q.get("target", 1)

            if q["progress"] >= target:
                q["completed"] = True
                q["progress"] = target
                xp_awarded = q.get("xpReward", XP_PER_DAILY_QUEST)

                # Award XP to user
                user_doc = db.collection(USERS_COL).document(uid).get()
                if user_doc.exists:
                    curr_xp = user_doc.to_dict().get("xp", 0)
                    db.collection(USERS_COL).document(uid).update({
                        "xp": curr_xp + xp_awarded,
                    })

            break

    db.collection(DAILY_QUESTS_COL).document(uid).update({
        "quests": quests,
        "updatedAt": SERVER_TIMESTAMP,
    })

    return {
        "questId": quest_id,
        "progress": q.get("progress", 0),
        "completed": q.get("completed", False),
        "xpAwarded": xp_awarded,
    }
