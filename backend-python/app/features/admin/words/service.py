from typing import Optional, Dict, Any, List, Tuple
from google.cloud.firestore import SERVER_TIMESTAMP
from app.firebase import get_firestore_db
from app.shared.firestore_helpers import serialize_doc

WORDS_COL = "words"
ADMIN_LOGS_COL = "admin_logs"


async def list_words(
    page: int = 1,
    pageSize: int = 20,
    level: str = "",
    word_type: str = "",
    topic: str = "",
    search: str = "",
) -> Tuple[List[Dict[str, Any]], int]:
    db = get_firestore_db()
    all_docs = list(db.collection(WORDS_COL).stream())
    all_docs.sort(key=lambda d: d.to_dict().get("word", ""))

    words = []
    for doc in all_docs:
        data = serialize_doc(doc.to_dict())
        data["id"] = doc.id
        if level and data.get("level") != level:
            continue
        if word_type and data.get("type") != word_type:
            continue
        if topic and topic not in data.get("topic", []):
            continue
        if search:
            q = search.lower()
            if q not in data.get("word", "").lower() and q not in data.get("mean", "").lower():
                continue
        words.append(data)

    total = len(words)
    start = (page - 1) * pageSize
    end = start + pageSize
    return words[start:end], total


async def get_word(word_id: str) -> Optional[Dict[str, Any]]:
    db = get_firestore_db()
    doc = db.collection(WORDS_COL).document(word_id).get()
    if not doc.exists:
        return None
    data = serialize_doc(doc.to_dict())
    data["id"] = doc.id
    return data


async def create_word(data: Dict[str, Any], admin_uid: str) -> Dict[str, Any]:
    db = get_firestore_db()
    doc_ref = db.collection(WORDS_COL).document()
    data["createdAt"] = SERVER_TIMESTAMP
    data["updatedAt"] = SERVER_TIMESTAMP
    doc_ref.set(data)

    db.collection(ADMIN_LOGS_COL).add({
        "adminUid": admin_uid,
        "action": "create_word",
        "targetId": doc_ref.id,
        "details": {"word": data.get("word")},
        "timestamp": SERVER_TIMESTAMP,
    })

    created = doc_ref.get().to_dict() or {}
    result = serialize_doc(created)
    result["id"] = doc_ref.id
    return result


async def update_word(word_id: str, data: Dict[str, Any], admin_uid: str) -> Optional[Dict[str, Any]]:
    db = get_firestore_db()
    doc_ref = db.collection(WORDS_COL).document(word_id)
    if not doc_ref.get().exists:
        return None

    data["updatedAt"] = SERVER_TIMESTAMP
    doc_ref.update(data)

    db.collection(ADMIN_LOGS_COL).add({
        "adminUid": admin_uid,
        "action": "update_word",
        "targetId": word_id,
        "details": {k: v for k, v in data.items() if k != "updatedAt"},
        "timestamp": SERVER_TIMESTAMP,
    })

    updated = doc_ref.get().to_dict() or {}
    result = serialize_doc(updated)
    result["id"] = doc_ref.id
    return result


async def delete_word(word_id: str, admin_uid: str) -> bool:
    db = get_firestore_db()
    doc_ref = db.collection(WORDS_COL).document(word_id)
    if not doc_ref.get().exists:
        return False
    doc = doc_ref.get().to_dict() or {}
    doc_ref.delete()

    db.collection(ADMIN_LOGS_COL).add({
        "adminUid": admin_uid,
        "action": "delete_word",
        "targetId": word_id,
        "details": {"word": doc.get("word")},
        "timestamp": SERVER_TIMESTAMP,
    })
    return True
