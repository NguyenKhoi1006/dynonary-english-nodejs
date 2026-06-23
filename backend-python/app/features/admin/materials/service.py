from typing import Optional, Dict, Any, List, Tuple
from google.cloud.firestore import SERVER_TIMESTAMP
from app.firebase import get_firestore_db
from app.shared.firestore_helpers import serialize_doc

MATERIALS_COL = "learning_materials"
ADMIN_LOGS_COL = "admin_logs"


async def list_materials(
    page: int = 1,
    pageSize: int = 20,
    level: str = "",
    type_filter: str = "",
    published: str = "",
    search: str = "",
) -> Tuple[List[Dict[str, Any]], int]:
    db = get_firestore_db()
    query = db.collection(MATERIALS_COL).order_by("order")

    try:
        all_docs = list(query.stream())
    except Exception:
        all_docs = list(db.collection(MATERIALS_COL).stream())
        all_docs.sort(key=lambda d: d.to_dict().get("order", 0))

    materials = []
    for doc in all_docs:
        data = serialize_doc(doc.to_dict())
        data["id"] = doc.id

        if level and data.get("level") != level:
            continue
        if type_filter and data.get("type") != type_filter:
            continue
        if published == "true" and not data.get("published"):
            continue
        if published == "false" and data.get("published"):
            continue
        if search:
            q = search.lower()
            if q not in data.get("title", "").lower() and q not in data.get("description", "").lower():
                continue

        materials.append(data)

    total = len(materials)
    start = (page - 1) * pageSize
    end = start + pageSize
    return materials[start:end], total


async def get_material(material_id: str) -> Optional[Dict[str, Any]]:
    db = get_firestore_db()
    doc = db.collection(MATERIALS_COL).document(material_id).get()
    if not doc.exists:
        return None
    data = serialize_doc(doc.to_dict())
    data["id"] = doc.id
    return data


async def create_material(data: Dict[str, Any], admin_uid: str) -> Dict[str, Any]:
    db = get_firestore_db()
    doc_ref = db.collection(MATERIALS_COL).document()
    data["createdBy"] = admin_uid
    data["createdAt"] = SERVER_TIMESTAMP
    data["updatedAt"] = SERVER_TIMESTAMP
    doc_ref.set(data)

    db.collection(ADMIN_LOGS_COL).add({
        "adminUid": admin_uid,
        "action": "create_material",
        "targetId": doc_ref.id,
        "details": {"title": data.get("title")},
        "timestamp": SERVER_TIMESTAMP,
    })

    created = doc_ref.get().to_dict() or {}
    result = serialize_doc(created)
    result["id"] = doc_ref.id
    return result


async def update_material(material_id: str, data: Dict[str, Any], admin_uid: str) -> Optional[Dict[str, Any]]:
    db = get_firestore_db()
    doc_ref = db.collection(MATERIALS_COL).document(material_id)
    if not doc_ref.get().exists:
        return None

    data["updatedAt"] = SERVER_TIMESTAMP
    doc_ref.update(data)

    db.collection(ADMIN_LOGS_COL).add({
        "adminUid": admin_uid,
        "action": "update_material",
        "targetId": material_id,
        "details": {k: v for k, v in data.items() if k != "updatedAt"},
        "timestamp": SERVER_TIMESTAMP,
    })

    updated = doc_ref.get().to_dict() or {}
    result = serialize_doc(updated)
    result["id"] = doc_ref.id
    return result


async def delete_material(material_id: str, admin_uid: str) -> bool:
    db = get_firestore_db()
    doc_ref = db.collection(MATERIALS_COL).document(material_id)
    if not doc_ref.get().exists:
        return False

    doc = doc_ref.get().to_dict() or {}
    doc_ref.delete()

    db.collection(ADMIN_LOGS_COL).add({
        "adminUid": admin_uid,
        "action": "delete_material",
        "targetId": material_id,
        "details": {"title": doc.get("title")},
        "timestamp": SERVER_TIMESTAMP,
    })
    return True
