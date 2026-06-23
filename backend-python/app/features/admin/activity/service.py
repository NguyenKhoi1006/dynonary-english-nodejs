from typing import List, Dict, Any, Tuple
from app.firebase import get_firestore_db
from app.shared.firestore_helpers import serialize_doc

ADMIN_LOGS_COL = "admin_logs"
USER_ACTIVITY_COL = "user_activity"


async def get_admin_logs(
    page: int = 1,
    pageSize: int = 50,
    action: str = "",
) -> Tuple[List[Dict[str, Any]], int]:
    """Get admin action logs."""
    db = get_firestore_db()

    try:
        query = db.collection(ADMIN_LOGS_COL).order_by("timestamp", direction="DESCENDING")
        # Note: Firestore requires composite index for order_by + where
        # To keep things simple for Spark plan, we filter in memory
        all_docs = list(query.stream())
    except Exception:
        # Fallback: query without ordering if index missing
        all_docs = list(db.collection(ADMIN_LOGS_COL).stream())
        all_docs.sort(key=lambda d: _get_timestamp_seconds(d.to_dict().get("timestamp", 0)), reverse=True)

    logs = []
    for doc in all_docs:
        data = serialize_doc(doc.to_dict())
        data["id"] = doc.id

        if action and action.lower() not in data.get("action", "").lower():
            continue

        logs.append(data)

    total = len(logs)
    start = (page - 1) * pageSize
    end = start + pageSize

    return logs[start:end], total


async def get_user_activity_logs(
    uid: str,
    page: int = 1,
    pageSize: int = 50,
) -> Tuple[List[Dict[str, Any]], int]:
    """Get activity logs for a specific user."""
    db = get_firestore_db()

    try:
        logs_ref = db.collection(USER_ACTIVITY_COL).document(uid).collection("logs")
        query = logs_ref.order_by("timestamp", direction="DESCENDING")
        all_docs = list(query.stream())
    except Exception:
        all_docs = list(
            db.collection(USER_ACTIVITY_COL).document(uid).collection("logs").stream()
        )
        all_docs.sort(key=lambda d: _get_timestamp_seconds(d.to_dict().get("timestamp", 0)), reverse=True)

    logs = []
    for doc in all_docs:
        data = serialize_doc(doc.to_dict())
        data["id"] = doc.id
        log = _get_timestamp_seconds(doc.to_dict().get("timestamp", 0))
        logs.append(data)

    total = len(logs)
    start = (page - 1) * pageSize
    end = start + pageSize

    return logs[start:end], total


def _get_timestamp_seconds(ts) -> float:
    """Extract seconds from Firestore Timestamp or return 0."""
    if hasattr(ts, "seconds"):
        return ts.seconds + ts.nanoseconds / 1e9
    return 0
