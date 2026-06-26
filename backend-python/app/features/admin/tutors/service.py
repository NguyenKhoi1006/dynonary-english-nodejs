from typing import Optional, Dict, Any, List
from google.cloud.firestore import SERVER_TIMESTAMP
from app.firebase import get_firestore_db
from app.shared.firestore_helpers import serialize_doc

TUTORS_COL = "tutors"
USERS_COL = "users"


async def list_all_tutors(
    page: int = 1,
    page_size: int = 20,
    search: str = "",
    status: str = "",
    sort_by: str = "createdDate",
) -> tuple[List[Dict[str, Any]], int]:
    db = get_firestore_db()
    query = db.collection(TUTORS_COL)

    docs = list(query.stream())
    all_tutors = []
    user_ids = set()

    for doc in docs:
        data = serialize_doc(doc.to_dict())
        data["uid"] = doc.id
        user_ids.add(data.get("userId", ""))
        all_tutors.append(data)

    # Batch fetch user info
    user_map = {}
    for uid in user_ids:
        if uid:
            user_doc = db.collection(USERS_COL).document(uid).get()
            if user_doc.exists:
                user_map[uid] = user_doc.to_dict()

    # Enrich with user info
    for data in all_tutors:
        uid = data.get("userId", "")
        user_info = user_map.get(uid, {})
        data["name"] = user_info.get("name", data.get("name", ""))
        data["email"] = user_info.get("email", data.get("email", ""))
        data["avt"] = user_info.get("avt", data.get("avt", ""))
        data["applicationStatus"] = data.get("applicationStatus", "approved")

    # Filter
    if search:
        s = search.lower()
        all_tutors = [t for t in all_tutors if s in t.get("name", "").lower() or s in t.get("email", "").lower()]
    if status:
        all_tutors = [t for t in all_tutors if t.get("applicationStatus") == status]

    total = len(all_tutors)
    start = (page - 1) * page_size
    end = start + page_size
    paginated = all_tutors[start:end]

    return paginated, total


async def get_tutor_detail(tutor_id: str) -> Optional[Dict[str, Any]]:
    db = get_firestore_db()
    doc = db.collection(TUTORS_COL).document(tutor_id).get()
    if not doc.exists:
        return None

    data = serialize_doc(doc.to_dict())
    data["uid"] = doc.id

    # Fetch user info
    user_id = data.get("userId", "")
    user_doc = db.collection(USERS_COL).document(user_id).get()
    if user_doc.exists:
        user_data = user_doc.to_dict()
        data["userEmail"] = user_data.get("email", "")
        data["userMembership"] = user_data.get("membership", "free")
        data["userStatus"] = user_data.get("status", "active")
        data["name"] = user_data.get("name", data.get("name", ""))
        data["email"] = user_data.get("email", data.get("email", ""))
        data["avt"] = user_data.get("avt", data.get("avt", ""))

    return data


async def approve_tutor(tutor_id: str, admin_uid: str) -> bool:
    db = get_firestore_db()
    doc = db.collection(TUTORS_COL).document(tutor_id).get()
    if not doc.exists:
        return False

    data = doc.to_dict() or {}
    user_id = data.get("userId", "")

    if user_id:
        # Update user role to "tutor"
        db.collection(USERS_COL).document(user_id).update({"role": "tutor"})

    # Update tutor profile
    db.collection(TUTORS_COL).document(tutor_id).update({
        "applicationStatus": "approved",
        "isAvailable": True,
    })

    # Log activity
    db.collection("admin_logs").add({
        "action": "approve_tutor",
        "adminId": admin_uid,
        "targetId": tutor_id,
        "targetUserId": user_id,
        "timestamp": SERVER_TIMESTAMP,
    })

    return True


async def reject_tutor(tutor_id: str, admin_uid: str) -> bool:
    db = get_firestore_db()
    doc = db.collection(TUTORS_COL).document(tutor_id).get()
    if not doc.exists:
        return False

    db.collection(TUTORS_COL).document(tutor_id).update({
        "applicationStatus": "rejected",
        "isAvailable": False,
    })

    db.collection("admin_logs").add({
        "action": "reject_tutor",
        "adminId": admin_uid,
        "targetId": tutor_id,
        "timestamp": SERVER_TIMESTAMP,
    })

    return True
