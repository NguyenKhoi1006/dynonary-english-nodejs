from typing import Optional, Dict, Any, List, Tuple
from google.cloud.firestore import SERVER_TIMESTAMP
from app.firebase import get_firestore_db
from app.shared.firestore_helpers import serialize_doc

BLOG_COL = "blog"
ADMIN_LOGS_COL = "admin_logs"


async def list_posts(
    page: int = 1,
    pageSize: int = 20,
    post_type: str = "",
    search: str = "",
) -> Tuple[List[Dict[str, Any]], int]:
    db = get_firestore_db()
    all_docs = list(db.collection(BLOG_COL).stream())
    all_docs.sort(key=lambda d: d.create_time or 0, reverse=True)

    posts = []
    for doc in all_docs:
        data = serialize_doc(doc.to_dict())
        data["id"] = doc.id
        if post_type and data.get("type") != post_type:
            continue
        if search:
            q = search.lower()
            if q not in data.get("title", "").lower() and q not in data.get("description", "").lower():
                continue
        posts.append(data)

    total = len(posts)
    start = (page - 1) * pageSize
    end = start + pageSize
    return posts[start:end], total


async def get_post(post_id: str) -> Optional[Dict[str, Any]]:
    db = get_firestore_db()
    doc = db.collection(BLOG_COL).document(post_id).get()
    if not doc.exists:
        return None
    data = serialize_doc(doc.to_dict())
    data["id"] = doc.id
    return data


async def create_post(data: Dict[str, Any], admin_uid: str) -> Dict[str, Any]:
    db = get_firestore_db()
    doc_ref = db.collection(BLOG_COL).document()
    data["createdBy"] = admin_uid
    data["createdAt"] = SERVER_TIMESTAMP
    data["updatedAt"] = SERVER_TIMESTAMP
    doc_ref.set(data)

    db.collection(ADMIN_LOGS_COL).add({
        "adminUid": admin_uid,
        "action": "create_blog_post",
        "targetId": doc_ref.id,
        "details": {"title": data.get("title")},
        "timestamp": SERVER_TIMESTAMP,
    })

    created = doc_ref.get().to_dict() or {}
    result = serialize_doc(created)
    result["id"] = doc_ref.id
    return result


async def update_post(post_id: str, data: Dict[str, Any], admin_uid: str) -> Optional[Dict[str, Any]]:
    db = get_firestore_db()
    doc_ref = db.collection(BLOG_COL).document(post_id)
    if not doc_ref.get().exists:
        return None

    data["updatedAt"] = SERVER_TIMESTAMP
    doc_ref.update(data)

    db.collection(ADMIN_LOGS_COL).add({
        "adminUid": admin_uid,
        "action": "update_blog_post",
        "targetId": post_id,
        "details": {k: v for k, v in data.items() if k != "updatedAt"},
        "timestamp": SERVER_TIMESTAMP,
    })

    updated = doc_ref.get().to_dict() or {}
    result = serialize_doc(updated)
    result["id"] = doc_ref.id
    return result


async def delete_post(post_id: str, admin_uid: str) -> bool:
    db = get_firestore_db()
    doc_ref = db.collection(BLOG_COL).document(post_id)
    if not doc_ref.get().exists:
        return False
    doc = doc_ref.get().to_dict() or {}
    doc_ref.delete()

    db.collection(ADMIN_LOGS_COL).add({
        "adminUid": admin_uid,
        "action": "delete_blog_post",
        "targetId": post_id,
        "details": {"title": doc.get("title")},
        "timestamp": SERVER_TIMESTAMP,
    })
    return True
