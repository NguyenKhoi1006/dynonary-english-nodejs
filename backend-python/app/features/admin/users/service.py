from typing import Optional, Dict, Any, List, Tuple
from google.cloud.firestore import SERVER_TIMESTAMP
from app.firebase import get_firestore_db
from app.shared.firestore_helpers import serialize_doc

USERS_COL = "users"
ADMIN_LOGS_COL = "admin_logs"


async def list_users(
    page: int = 1,
    pageSize: int = 20,
    search: str = "",
    role: str = "",
    status: str = "",
    membership: str = "",
    level: str = "",
) -> Tuple[List[Dict[str, Any]], int]:
    """List users with pagination, search, and filters."""
    db = get_firestore_db()
    query = db.collection(USERS_COL)

    # Apply filters
    if role:
        query = query.where("role", "==", role)
    if status:
        query = query.where("status", "==", status)
    if membership:
        query = query.where("membership", "==", membership)
    if level:
        query = query.where("level", "==", level)

    # Search: Firestore doesn't support full-text search natively,
    # so we fetch all matching docs and filter client-side
    try:
        all_docs = list(query.stream())
    except Exception:
        all_docs = []

    users = []
    for doc in all_docs:
        data = serialize_doc(doc.to_dict())
        data["uid"] = doc.id

        # Client-side text search
        if search:
            q = search.lower()
            email = data.get("email", "").lower()
            name = data.get("name", "").lower()
            username = data.get("username", "").lower()
            if q not in email and q not in name and q not in username:
                continue

        users.append(data)

    # Sort by createdDate descending
    users.sort(key=lambda u: u.get("createdDate", "") or "", reverse=True)

    total = len(users)

    # Paginate
    start = (page - 1) * pageSize
    end = start + pageSize
    page_users = users[start:end]

    return page_users, total


async def get_user_detail(uid: str) -> Optional[Dict[str, Any]]:
    """Get full user details by UID."""
    db = get_firestore_db()
    doc = db.collection(USERS_COL).document(uid).get()
    if not doc.exists:
        return None
    data = serialize_doc(doc.to_dict())
    data["uid"] = doc.id
    return data


async def update_user(uid: str, updates: Dict[str, Any], admin_uid: str) -> bool:
    """Update user fields. Logs the action."""
    db = get_firestore_db()
    user_ref = db.collection(USERS_COL).document(uid)

    # Check user exists
    doc = user_ref.get()
    if not doc.exists:
        return False

    # Build update dict (only allowed fields)
    allowed_fields = {"name", "username", "role", "level", "membership", "status"}
    update_data = {k: v for k, v in updates.items() if k in allowed_fields and v is not None}

    if not update_data:
        return True  # nothing to update

    user_ref.update(update_data)

    # Log admin action
    db.collection(ADMIN_LOGS_COL).add({
        "adminUid": admin_uid,
        "action": "update_user",
        "targetId": uid,
        "details": update_data,
        "timestamp": SERVER_TIMESTAMP,
    })

    return True


async def toggle_ban(uid: str, admin_uid: str) -> Optional[str]:
    """Toggle user ban status. Returns new status or None if not found."""
    db = get_firestore_db()
    user_ref = db.collection(USERS_COL).document(uid)
    doc = user_ref.get()
    if not doc.exists:
        return None

    current_status = doc.to_dict().get("status", "active")
    new_status = "banned" if current_status == "active" else "active"

    user_ref.update({"status": new_status})

    # Log admin action
    db.collection(ADMIN_LOGS_COL).add({
        "adminUid": admin_uid,
        "action": f"{'ban' if new_status == 'banned' else 'unban'}_user",
        "targetId": uid,
        "details": {"previousStatus": current_status, "newStatus": new_status},
        "timestamp": SERVER_TIMESTAMP,
    })

    return new_status


async def grant_premium(uid: str, duration_days: int, admin_uid: str) -> Optional[Dict[str, Any]]:
    """Grant premium membership for a duration. Returns updated user or None."""
    from datetime import timedelta, datetime, timezone

    db = get_firestore_db()
    user_ref = db.collection(USERS_COL).document(uid)
    doc = user_ref.get()
    if not doc.exists:
        return None

    now = datetime.now(timezone.utc)
    expiry = now + timedelta(days=duration_days)

    user_ref.update({
        "membership": "premium",
        "premiumExpiry": expiry,
    })

    # Log admin action
    db.collection(ADMIN_LOGS_COL).add({
        "adminUid": admin_uid,
        "action": "premium_grant",
        "targetId": uid,
        "details": {"durationDays": duration_days, "expiresAt": expiry.isoformat()},
        "timestamp": SERVER_TIMESTAMP,
    })

    updated_doc = user_ref.get()
    result = serialize_doc(updated_doc.to_dict())
    result["uid"] = updated_doc.id
    return result
