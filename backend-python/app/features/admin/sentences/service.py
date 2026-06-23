from typing import Optional, Dict, Any, List, Tuple
from google.cloud.firestore import SERVER_TIMESTAMP
from app.firebase import get_firestore_db
from app.shared.firestore_helpers import serialize_doc

SENTENCES_COL = "sentences"
ADMIN_LOGS_COL = "admin_logs"


async def list_sentences(
    page: int = 1,
    pageSize: int = 20,
    topic: str = "",
    search: str = "",
) -> Tuple[List[Dict[str, Any]], int]:
    db = get_firestore_db()
    all_docs = list(db.collection(SENTENCES_COL).stream())
    all_docs.sort(key=lambda d: d.create_time or 0, reverse=True)

    sentences = []
    for doc in all_docs:
        data = serialize_doc(doc.to_dict())
        data["id"] = doc.id
        if topic and data.get("topic") != topic:
            continue
        if search:
            q = search.lower()
            sentence = data.get("sentence", "").lower()
            meaning = data.get("meaning", "").lower()
            if q not in sentence and q not in meaning:
                continue
        sentences.append(data)

    total = len(sentences)
    start = (page - 1) * pageSize
    end = start + pageSize
    return sentences[start:end], total


async def get_sentence(sentence_id: str) -> Optional[Dict[str, Any]]:
    db = get_firestore_db()
    doc = db.collection(SENTENCES_COL).document(sentence_id).get()
    if not doc.exists:
        return None
    data = serialize_doc(doc.to_dict())
    data["id"] = doc.id
    return data


async def create_sentence(data: Dict[str, Any], admin_uid: str) -> Dict[str, Any]:
    db = get_firestore_db()
    doc_ref = db.collection(SENTENCES_COL).document()
    data["createdAt"] = SERVER_TIMESTAMP
    doc_ref.set(data)

    db.collection(ADMIN_LOGS_COL).add({
        "adminUid": admin_uid,
        "action": "create_sentence",
        "targetId": doc_ref.id,
        "details": {"sentence": data.get("sentence")[:50]},
        "timestamp": SERVER_TIMESTAMP,
    })

    created = doc_ref.get().to_dict() or {}
    result = serialize_doc(created)
    result["id"] = doc_ref.id
    return result


async def update_sentence(sentence_id: str, data: Dict[str, Any], admin_uid: str) -> Optional[Dict[str, Any]]:
    db = get_firestore_db()
    doc_ref = db.collection(SENTENCES_COL).document(sentence_id)
    if not doc_ref.get().exists:
        return None

    data["updatedAt"] = SERVER_TIMESTAMP
    doc_ref.update(data)

    db.collection(ADMIN_LOGS_COL).add({
        "adminUid": admin_uid,
        "action": "update_sentence",
        "targetId": sentence_id,
        "details": {k: v for k, v in data.items() if k != "updatedAt"},
        "timestamp": SERVER_TIMESTAMP,
    })

    updated = doc_ref.get().to_dict() or {}
    result = serialize_doc(updated)
    result["id"] = doc_ref.id
    return result


async def delete_sentence(sentence_id: str, admin_uid: str) -> bool:
    db = get_firestore_db()
    doc_ref = db.collection(SENTENCES_COL).document(sentence_id)
    if not doc_ref.get().exists:
        return False
    doc = doc_ref.get().to_dict() or {}
    doc_ref.delete()

    db.collection(ADMIN_LOGS_COL).add({
        "adminUid": admin_uid,
        "action": "delete_sentence",
        "targetId": sentence_id,
        "details": {"sentence": (doc.get("sentence") or "")[:50]},
        "timestamp": SERVER_TIMESTAMP,
    })
    return True
