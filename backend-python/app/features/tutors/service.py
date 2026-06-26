"""Tutor profile service with caching, async Firestore, and batched user info."""

from typing import Optional, Dict, Any, List
from google.cloud.firestore import SERVER_TIMESTAMP
from app.firebase import get_firestore_db
from app.shared.firestore_helpers import serialize_doc
from app.shared.cache import cached, invalidate_cache

TUTORS_COL = "tutors"
USERS_COL = "users"

DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100


async def get_tutor_profile(uid: str) -> Optional[Dict[str, Any]]:
    db = get_firestore_db()
    doc = db.collection(TUTORS_COL).document(uid).get()
    if not doc.exists:
        return None
    data = serialize_doc(doc.to_dict())
    data["uid"] = doc.id
    return data


async def get_tutor_by_user_id(user_id: str) -> Optional[Dict[str, Any]]:
    db = get_firestore_db()
    docs = db.collection(TUTORS_COL).where("userId", "==", user_id).limit(1).stream()
    for doc in docs:
        data = serialize_doc(doc.to_dict())
        data["uid"] = doc.id
        return data
    return None


async def create_tutor_profile(
    user_id: str,
    name: str,
    email: str,
    avt: str,
    bio: str,
    subjects: List[str],
    hourly_rate: float,
    level: str = "intermediate",
    qualifications: Optional[List[str]] = None,
    video_intro: str = "",
) -> Dict[str, Any]:
    db = get_firestore_db()

    profile = {
        "userId": user_id,
        "name": name,
        "email": email,
        "avt": avt,
        "bio": bio,
        "subjects": subjects,
        "hourlyRate": hourly_rate,
        "level": level,
        "qualifications": qualifications or [],
        "videoIntro": video_intro,
        "isAvailable": False,
        "applicationStatus": "pending",
        "rating": 0.0,
        "totalReviews": 0,
        "totalSessions": 0,
        "totalStudents": 0,
        "createdDate": SERVER_TIMESTAMP,
    }

    doc_ref = db.collection(TUTORS_COL).document()
    doc_ref.set(profile)
    profile["uid"] = doc_ref.id

    invalidate_cache("list_tutors")

    return serialize_doc(profile)


async def update_tutor_profile(uid: str, updates: Dict[str, Any]) -> bool:
    db = get_firestore_db()
    doc_ref = db.collection(TUTORS_COL).document(uid)
    doc = doc_ref.get()
    if not doc.exists:
        return False
    safe_updates = {k: v for k, v in updates.items() if v is not None}
    if safe_updates:
        doc_ref.update(safe_updates)
    invalidate_cache("get_tutor_profile")
    invalidate_cache("list_tutors")
    return True


@cached(ttl=30)
async def list_tutors(
    page: int = 1,
    page_size: int = DEFAULT_PAGE_SIZE,
    search: str = "",
    subject: str = "",
    level: str = "",
    min_rate: float = 0,
    max_rate: float = 0,
    sort_by: str = "rating",
) -> tuple[List[Dict[str, Any]], int]:
    db = get_firestore_db()
    query = db.collection(TUTORS_COL)

    if subject:
        query = query.where("subjects", "array_contains", subject)
    if level:
        query = query.where("level", "==", level)

    query = query.where("isAvailable", "==", True)
    query = query.order_by("rating", direction="DESCENDING")

    all_docs = list(query.stream())
    all_tutors = []
    user_ids = set()

    for doc in all_docs:
        data = serialize_doc(doc.to_dict())
        data["uid"] = doc.id
        user_ids.add(data.get("userId", ""))
        all_tutors.append(data)

    user_info_map = await _batch_get_user_info(list(user_ids))

    filtered_tutors = []
    for data in all_tutors:
        uid = data.get("userId", "")
        user_info = user_info_map.get(uid, {})
        data["name"] = user_info.get("name", data.get("name", ""))
        data["email"] = user_info.get("email", data.get("email", ""))
        data["avt"] = user_info.get("avt", data.get("avt", ""))

        if search:
            search_lower = search.lower()
            name_match = search_lower in data.get("name", "").lower()
            subjects_match = search_lower in " ".join(data.get("subjects", []))
            if not name_match and not subjects_match:
                continue

        if min_rate > 0 and data.get("hourlyRate", 0) < min_rate:
            continue
        if max_rate > 0 and data.get("hourlyRate", 0) > max_rate:
            continue

        filtered_tutors.append(data)

    total = len(filtered_tutors)

    if sort_by == "hourlyRate":
        filtered_tutors.sort(key=lambda t: t.get("hourlyRate", 0))
    elif sort_by == "sessions":
        filtered_tutors.sort(key=lambda t: t.get("totalSessions", 0), reverse=True)

    start = (page - 1) * page_size
    end = start + page_size
    paginated = filtered_tutors[start:end]

    return paginated, total


async def _batch_get_user_info(user_ids: List[str]) -> Dict[str, Dict[str, str]]:
    """Batch fetch user info from Firestore.

    Uses individual doc lookups since Firestore doesn't support
    a true 'IN' query on document IDs. For small batches this is fine.
    For large batches (>50), consider storing user info directly in the
    tutors collection to eliminate the join entirely.
    """
    if not user_ids:
        return {}

    db = get_firestore_db()
    result = {}

    for uid in user_ids:
        if not uid:
            continue
        doc = db.collection(USERS_COL).document(uid).get()
        if doc.exists:
            data = doc.to_dict()
            result[uid] = {
                "name": data.get("name", ""),
                "email": data.get("email", ""),
                "avt": data.get("avt", ""),
            }

    return result


async def update_tutor_stats(uid: str, field: str, value: Any) -> None:
    db = get_firestore_db()
    db.collection(TUTORS_COL).document(uid).update({field: value})
    invalidate_cache("get_tutor_profile")
    invalidate_cache("list_tutors")


async def delete_tutor_profile(uid: str) -> bool:
    db = get_firestore_db()
    doc = db.collection(TUTORS_COL).document(uid).get()
    if not doc.exists:
        return False
    db.collection(TUTORS_COL).document(uid).delete()
    invalidate_cache("get_tutor_profile")
    invalidate_cache("list_tutors")
    return True
