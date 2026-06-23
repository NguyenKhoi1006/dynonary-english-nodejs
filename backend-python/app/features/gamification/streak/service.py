from typing import Optional, Dict, Any
from datetime import datetime, timezone, timedelta
from google.cloud.firestore import SERVER_TIMESTAMP
from app.firebase import get_firestore_db
from app.shared.firestore_helpers import serialize_doc
from app.features.gamification.constants import XP_PER_STREAK_BONUS, STREAK_MILESTONES

STREAKS_COL = "streaks"
USERS_COL = "users"


def _get_today() -> datetime:
    """Return midnight UTC of the current day."""
    return datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)


async def get_streak(uid: str) -> Optional[Dict[str, Any]]:
    db = get_firestore_db()
    doc = db.collection(STREAKS_COL).document(uid).get()
    if not doc.exists:
        return {
            "streak": 0,
            "longestStreak": 0,
            "lastCheckIn": None,
            "frozen": False,
        }
    data = serialize_doc(doc.to_dict())
    return data


async def check_in(uid: str) -> Dict[str, Any]:
    db = get_firestore_db()
    now = datetime.now(timezone.utc)
    today = _get_today()
    yesterday = today - timedelta(days=1)

    # Get user doc for totalXp
    user_doc = db.collection(USERS_COL).document(uid).get()
    user_data = user_doc.to_dict() if user_doc.exists else {}
    current_xp = user_data.get("xp", 0)

    # Get or create streak doc
    streak_ref = db.collection(STREAKS_COL).document(uid)
    streak_doc = streak_ref.get()
    streak_data = streak_doc.to_dict() if streak_doc.exists else {}

    current_streak = streak_data.get("streak", 0)
    longest_streak = streak_data.get("longestStreak", 0)
    last_check_str = streak_data.get("lastCheckIn")

    last_check: Optional[datetime] = None
    if last_check_str:
        if isinstance(last_check_str, datetime):
            last_check = last_check_str
        elif hasattr(last_check_str, "seconds"):
            last_check = datetime.fromtimestamp(
                last_check_str.seconds + last_check_str.nanoseconds / 1e9,
                tz=timezone.utc,
            )

    # Already checked in today?
    if last_check and last_check.replace(hour=0, minute=0, second=0, microsecond=0) == today:
        return {
            "message": "already checked in",
            "streak": current_streak,
            "longestStreak": longest_streak,
            "xpEarned": 0,
            "totalXp": current_xp,
        }

    # Determine if streak continues or resets
    if last_check:
        last_day = last_check.replace(hour=0, minute=0, second=0, microsecond=0)
        if last_day == yesterday:
            # Consecutive day
            current_streak += 1
        elif last_day < yesterday:
            # Missed a day → reset
            current_streak = 1
        # If last_day == today, handled above
    else:
        # First ever check-in
        current_streak = 1

    # Track longest streak
    if current_streak > longest_streak:
        longest_streak = current_streak

    # XP earned: base + streak bonus
    xp_earned = XP_PER_STREAK_BONUS
    if current_streak > 1:
        xp_earned += min(current_streak * 2, 50)  # cap streak bonus

    new_xp = current_xp + xp_earned

    # Save streak
    streak_ref.set({
        "streak": current_streak,
        "longestStreak": longest_streak,
        "lastCheckIn": SERVER_TIMESTAMP,
        "frozen": False,
        "updatedAt": SERVER_TIMESTAMP,
    }, merge=True)

    # Update user XP
    db.collection(USERS_COL).document(uid).update({
        "xp": new_xp,
        "lastActiveAt": SERVER_TIMESTAMP,
        "totalStudyDays": current_streak,
    })

    return {
        "message": "checked in",
        "streak": current_streak,
        "longestStreak": longest_streak,
        "xpEarned": xp_earned,
        "totalXp": new_xp,
    }
