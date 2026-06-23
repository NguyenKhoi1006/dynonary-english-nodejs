from typing import Optional, Dict, Any, List, Tuple
from google.cloud.firestore import SERVER_TIMESTAMP
from app.firebase import get_firestore_db
from app.shared.firestore_helpers import serialize_doc

PLACEMENT_COL = "placement_tests"
ADMIN_LOGS_COL = "admin_logs"


async def list_tests(page: int = 1, pageSize: int = 20) -> Tuple[List[Dict[str, Any]], int]:
    db = get_firestore_db()
    all_docs = list(db.collection(PLACEMENT_COL).stream())
    all_docs.sort(key=lambda d: d.create_time or 0, reverse=True)

    tests = []
    for doc in all_docs:
        data = serialize_doc(doc.to_dict())
        data["id"] = doc.id
        tests.append(data)

    total = len(tests)
    start = (page - 1) * pageSize
    end = start + pageSize
    return tests[start:end], total


async def get_test(test_id: str) -> Optional[Dict[str, Any]]:
    db = get_firestore_db()
    doc = db.collection(PLACEMENT_COL).document(test_id).get()
    if not doc.exists:
        return None
    data = serialize_doc(doc.to_dict())
    data["id"] = doc.id
    return data


async def create_test(data: Dict[str, Any], admin_uid: str) -> Dict[str, Any]:
    db = get_firestore_db()
    doc_ref = db.collection(PLACEMENT_COL).document()

    import uuid
    for q in data.get("questions", []):
        if not q.get("id"):
            q["id"] = uuid.uuid4().hex[:8]

    data["createdBy"] = admin_uid
    data["createdAt"] = SERVER_TIMESTAMP
    data["updatedAt"] = SERVER_TIMESTAMP
    doc_ref.set(data)

    db.collection(ADMIN_LOGS_COL).add({
        "adminUid": admin_uid,
        "action": "create_placement_test",
        "targetId": doc_ref.id,
        "details": {"title": data.get("title")},
        "timestamp": SERVER_TIMESTAMP,
    })

    created = doc_ref.get().to_dict() or {}
    result = serialize_doc(created)
    result["id"] = doc_ref.id
    return result


async def update_test(test_id: str, data: Dict[str, Any], admin_uid: str) -> Optional[Dict[str, Any]]:
    db = get_firestore_db()
    doc_ref = db.collection(PLACEMENT_COL).document(test_id)
    if not doc_ref.get().exists:
        return None

    import uuid
    for q in data.get("questions", []):
        if not q.get("id"):
            q["id"] = uuid.uuid4().hex[:8]

    data["updatedAt"] = SERVER_TIMESTAMP
    doc_ref.update(data)

    db.collection(ADMIN_LOGS_COL).add({
        "adminUid": admin_uid,
        "action": "update_placement_test",
        "targetId": test_id,
        "details": {k: v for k, v in data.items() if k != "updatedAt"},
        "timestamp": SERVER_TIMESTAMP,
    })

    updated = doc_ref.get().to_dict() or {}
    result = serialize_doc(updated)
    result["id"] = doc_ref.id
    return result


async def delete_test(test_id: str, admin_uid: str) -> bool:
    db = get_firestore_db()
    doc_ref = db.collection(PLACEMENT_COL).document(test_id)
    if not doc_ref.get().exists:
        return False
    doc = doc_ref.get().to_dict() or {}
    doc_ref.delete()

    db.collection(ADMIN_LOGS_COL).add({
        "adminUid": admin_uid,
        "action": "delete_placement_test",
        "targetId": test_id,
        "details": {"title": doc.get("title")},
        "timestamp": SERVER_TIMESTAMP,
    })
    return True
