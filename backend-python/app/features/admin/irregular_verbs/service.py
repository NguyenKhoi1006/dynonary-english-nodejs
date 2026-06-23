from typing import Optional, Dict, Any, List, Tuple
from google.cloud.firestore import SERVER_TIMESTAMP
from app.firebase import get_firestore_db
from app.shared.firestore_helpers import serialize_doc

VERBS_COL = "irregular_verbs"
ADMIN_LOGS_COL = "admin_logs"


async def list_irregular_verbs(
    page: int = 1,
    pageSize: int = 50,
    search: str = "",
) -> Tuple[List[Dict[str, Any]], int]:
    db = get_firestore_db()
    all_docs = list(db.collection(VERBS_COL).stream())
    all_docs.sort(key=lambda d: d.to_dict().get("v1", ""))

    verbs = []
    for doc in all_docs:
        data = serialize_doc(doc.to_dict())
        data["id"] = doc.id
        if search:
            q = search.lower()
            v1 = data.get("v1", "").lower()
            mean = data.get("mean", "").lower()
            if q not in v1 and q not in mean:
                continue
        verbs.append(data)

    total = len(verbs)
    start = (page - 1) * pageSize
    end = start + pageSize
    return verbs[start:end], total


async def get_irregular_verb(verb_id: str) -> Optional[Dict[str, Any]]:
    db = get_firestore_db()
    doc = db.collection(VERBS_COL).document(verb_id).get()
    if not doc.exists:
        return None
    data = serialize_doc(doc.to_dict())
    data["id"] = doc.id
    return data


async def create_irregular_verb(data: Dict[str, Any], admin_uid: str) -> Dict[str, Any]:
    db = get_firestore_db()
    doc_ref = db.collection(VERBS_COL).document()
    data["createdAt"] = SERVER_TIMESTAMP
    data["updatedAt"] = SERVER_TIMESTAMP
    doc_ref.set(data)

    db.collection(ADMIN_LOGS_COL).add({
        "adminUid": admin_uid,
        "action": "create_irregular_verb",
        "targetId": doc_ref.id,
        "details": {"v1": data.get("v1")},
        "timestamp": SERVER_TIMESTAMP,
    })

    created = doc_ref.get().to_dict() or {}
    result = serialize_doc(created)
    result["id"] = doc_ref.id
    return result


async def update_irregular_verb(verb_id: str, data: Dict[str, Any], admin_uid: str) -> Optional[Dict[str, Any]]:
    db = get_firestore_db()
    doc_ref = db.collection(VERBS_COL).document(verb_id)
    if not doc_ref.get().exists:
        return None

    data["updatedAt"] = SERVER_TIMESTAMP
    doc_ref.update(data)

    db.collection(ADMIN_LOGS_COL).add({
        "adminUid": admin_uid,
        "action": "update_irregular_verb",
        "targetId": verb_id,
        "details": {k: v for k, v in data.items() if k != "updatedAt"},
        "timestamp": SERVER_TIMESTAMP,
    })

    updated = doc_ref.get().to_dict() or {}
    result = serialize_doc(updated)
    result["id"] = doc_ref.id
    return result


async def delete_irregular_verb(verb_id: str, admin_uid: str) -> bool:
    db = get_firestore_db()
    doc_ref = db.collection(VERBS_COL).document(verb_id)
    if not doc_ref.get().exists:
        return False
    doc = doc_ref.get().to_dict() or {}
    doc_ref.delete()

    db.collection(ADMIN_LOGS_COL).add({
        "adminUid": admin_uid,
        "action": "delete_irregular_verb",
        "targetId": verb_id,
        "details": {"v1": doc.get("v1")},
        "timestamp": SERVER_TIMESTAMP,
    })
    return True


async def bulk_import_verbs(verbs: List[Dict[str, Any]], admin_uid: str) -> int:
    """Import multiple irregular verbs at once."""
    db = get_firestore_db()
    batch = db.batch()
    verb_refs = []
    count = 0

    for verb in verbs:
        v1 = verb.get("v1", "").strip()
        if not v1:
            continue
        doc_ref = db.collection(VERBS_COL).document()
        verb["createdAt"] = SERVER_TIMESTAMP
        verb["updatedAt"] = SERVER_TIMESTAMP
        batch.set(doc_ref, verb)
        verb_refs.append(doc_ref)
        count += 1

    batch.commit()

    db.collection(ADMIN_LOGS_COL).add({
        "adminUid": admin_uid,
        "action": "bulk_import_irregular_verbs",
        "details": {"count": count},
        "timestamp": SERVER_TIMESTAMP,
    })

    return count
