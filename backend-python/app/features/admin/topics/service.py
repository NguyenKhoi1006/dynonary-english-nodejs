from typing import Optional, Dict, Any, List, Tuple
from google.cloud.firestore import SERVER_TIMESTAMP
from app.firebase import get_firestore_db
from app.shared.firestore_helpers import serialize_doc

TOPICS_COL = "topics"
ADMIN_LOGS_COL = "admin_logs"


async def list_topics(
    page: int = 1,
    pageSize: int = 50,
    topic_type: str = "",
    search: str = "",
) -> Tuple[List[Dict[str, Any]], int]:
    db = get_firestore_db()
    all_docs = list(db.collection(TOPICS_COL).stream())
    all_docs.sort(key=lambda d: d.to_dict().get("order", 0))

    topics = []
    for doc in all_docs:
        data = serialize_doc(doc.to_dict())
        data["id"] = doc.id
        if topic_type and data.get("type") != topic_type:
            continue
        if search:
            q = search.lower()
            if q not in data.get("title", "").lower():
                continue
        topics.append(data)

    total = len(topics)
    start = (page - 1) * pageSize
    end = start + pageSize
    return topics[start:end], total


async def get_topic(topic_id: str) -> Optional[Dict[str, Any]]:
    db = get_firestore_db()
    doc = db.collection(TOPICS_COL).document(topic_id).get()
    if not doc.exists:
        return None
    data = serialize_doc(doc.to_dict())
    data["id"] = doc.id
    return data


async def create_topic(data: Dict[str, Any], admin_uid: str) -> Dict[str, Any]:
    db = get_firestore_db()
    doc_ref = db.collection(TOPICS_COL).document()
    data["createdAt"] = SERVER_TIMESTAMP
    data["updatedAt"] = SERVER_TIMESTAMP
    doc_ref.set(data)

    db.collection(ADMIN_LOGS_COL).add({
        "adminUid": admin_uid,
        "action": "create_topic",
        "targetId": doc_ref.id,
        "details": {"title": data.get("title"), "type": data.get("type")},
        "timestamp": SERVER_TIMESTAMP,
    })

    created = doc_ref.get().to_dict() or {}
    result = serialize_doc(created)
    result["id"] = doc_ref.id
    return result


async def update_topic(topic_id: str, data: Dict[str, Any], admin_uid: str) -> Optional[Dict[str, Any]]:
    db = get_firestore_db()
    doc_ref = db.collection(TOPICS_COL).document(topic_id)
    if not doc_ref.get().exists:
        return None

    data["updatedAt"] = SERVER_TIMESTAMP
    doc_ref.update(data)

    db.collection(ADMIN_LOGS_COL).add({
        "adminUid": admin_uid,
        "action": "update_topic",
        "targetId": topic_id,
        "details": {k: v for k, v in data.items() if k != "updatedAt"},
        "timestamp": SERVER_TIMESTAMP,
    })

    updated = doc_ref.get().to_dict() or {}
    result = serialize_doc(updated)
    result["id"] = doc_ref.id
    return result


async def delete_topic(topic_id: str, admin_uid: str) -> bool:
    db = get_firestore_db()
    doc_ref = db.collection(TOPICS_COL).document(topic_id)
    if not doc_ref.get().exists:
        return False
    doc = doc_ref.get().to_dict() or {}
    doc_ref.delete()

    db.collection(ADMIN_LOGS_COL).add({
        "adminUid": admin_uid,
        "action": "delete_topic",
        "targetId": topic_id,
        "details": {"title": doc.get("title")},
        "timestamp": SERVER_TIMESTAMP,
    })
    return True
