from typing import Optional, Dict, Any
from datetime import datetime, timezone, timedelta
from google.cloud.firestore import SERVER_TIMESTAMP
from app.firebase import get_firestore_db
from app.shared.firestore_helpers import serialize_doc
from app.features.gamification.constants import MAX_HEARTS, HEART_RECHARGE_MINUTES

HEARTS_COL = "hearts"
USERS_COL = "users"


def _calc_recharge(hearts: int, last_recharge: Optional[datetime]) -> tuple[int, Optional[datetime]]:
    """Calculate how many hearts should have recharged based on elapsed time."""
    if hearts >= MAX_HEARTS or last_recharge is None:
        return hearts, None

    now = datetime.now(timezone.utc)
    elapsed = (now - last_recharge).total_seconds() / 60  # minutes
    recharge_count = int(elapsed // HEART_RECHARGE_MINUTES)

    if recharge_count <= 0:
        return hearts, last_recharge

    new_hearts = min(hearts + recharge_count, MAX_HEARTS)
    # Calculate when the next recharge will happen
    remaining_minutes = elapsed % HEART_RECHARGE_MINUTES
    next_recharge = now - timedelta(minutes=remaining_minutes) + timedelta(minutes=HEART_RECHARGE_MINUTES)

    return new_hearts, next_recharge


async def get_hearts(uid: str) -> Dict[str, Any]:
    db = get_firestore_db()
    doc = db.collection(HEARTS_COL).document(uid).get()

    if not doc.exists:
        # Create default hearts record
        now = datetime.now(timezone.utc)
        db.collection(HEARTS_COL).document(uid).set({
            "hearts": MAX_HEARTS,
            "maxHearts": MAX_HEARTS,
            "lastRechargeAt": SERVER_TIMESTAMP,
            "updatedAt": SERVER_TIMESTAMP,
        })
        return {
            "hearts": MAX_HEARTS,
            "maxHearts": MAX_HEARTS,
            "nextRechargeAt": None,
            "fullyCharged": True,
        }

    data = serialize_doc(doc.to_dict())
    hearts = data.get("hearts", MAX_HEARTS)
    max_h = data.get("maxHearts", MAX_HEARTS)
    last_recharge_str = data.get("lastRechargeAt")

    last_recharge = None
    if last_recharge_str:
        try:
            last_recharge = datetime.fromisoformat(last_recharge_str)
        except (ValueError, TypeError):
            last_recharge = None

    new_hearts, next_recharge = _calc_recharge(hearts, last_recharge)

    # Update if hearts changed
    if new_hearts != hearts:
        db.collection(HEARTS_COL).document(uid).update({
            "hearts": new_hearts,
            "lastRechargeAt": SERVER_TIMESTAMP if new_hearts < MAX_HEARTS else SERVER_TIMESTAMP,
            "updatedAt": SERVER_TIMESTAMP,
        })

    fully_charged = new_hearts >= max_h
    next_str = None
    if not fully_charged and next_recharge:
        next_str = next_recharge.isoformat()

    return {
        "hearts": new_hearts,
        "maxHearts": max_h,
        "nextRechargeAt": next_str,
        "fullyCharged": fully_charged,
    }


async def consume_heart(uid: str, count: int = 1) -> Dict[str, Any]:
    db = get_firestore_db()

    # Get current state (auto-recharges in get_hearts logic)
    current = await get_hearts(uid)
    hearts = current["hearts"]

    if hearts <= 0:
        return {
            "hearts": 0,
            "success": False,
            "message": "No hearts remaining. Wait for recharge.",
        }

    new_hearts = max(0, hearts - count)
    db.collection(HEARTS_COL).document(uid).update({
        "hearts": new_hearts,
        "lastRechargeAt": SERVER_TIMESTAMP,
        "updatedAt": SERVER_TIMESTAMP,
    })

    return {
        "hearts": new_hearts,
        "success": True,
        "message": f"Consumed {count} heart(s). {new_hearts} remaining.",
    }


async def refill_hearts(uid: str) -> Dict[str, Any]:
    db = get_firestore_db()
    db.collection(HEARTS_COL).document(uid).set({
        "hearts": MAX_HEARTS,
        "maxHearts": MAX_HEARTS,
        "lastRechargeAt": SERVER_TIMESTAMP,
        "updatedAt": SERVER_TIMESTAMP,
    }, merge=True)

    return {
        "hearts": MAX_HEARTS,
        "maxHearts": MAX_HEARTS,
        "message": "Hearts refilled!",
    }
