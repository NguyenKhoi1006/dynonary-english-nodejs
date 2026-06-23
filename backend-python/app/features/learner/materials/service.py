from typing import Optional, Dict, Any, List, Tuple
from app.firebase import get_firestore_db
from app.shared.firestore_helpers import serialize_doc

MATERIALS_COL = "learning_materials"


async def list_materials(
    level: str = "",
    type_filter: str = "",
    page: int = 1,
    pageSize: int = 20,
) -> Tuple[List[Dict[str, Any]], int]:
    db = get_firestore_db()
    query = db.collection(MATERIALS_COL).where("published", "==", True).order_by("order")

    try:
        all_docs = list(query.stream())
    except Exception:
        all_docs = [d for d in db.collection(MATERIALS_COL).stream() if d.to_dict().get("published")]
        all_docs.sort(key=lambda d: d.to_dict().get("order", 0))

    materials = []
    for doc in all_docs:
        data = serialize_doc(doc.to_dict())
        data["id"] = doc.id

        if level and data.get("level") != level:
            continue
        if type_filter and data.get("type") != type_filter:
            continue

        # Strip full content for list view (keep preview)
        data.pop("content", None)
        materials.append(data)

    total = len(materials)
    start = (page - 1) * pageSize
    end = start + pageSize
    return materials[start:end], total


async def get_material_detail(material_id: str, user_membership: str = "free", premium_expiry=None) -> Optional[Dict[str, Any]]:
    db = get_firestore_db()
    doc = db.collection(MATERIALS_COL).document(material_id).get()
    if not doc.exists:
        return None

    data = serialize_doc(doc.to_dict())
    data["id"] = doc.id

    if not data.get("published"):
        return None

    # Premium check: if user is free, show only preview
    is_premium = data.get("isPremium", False)
    if is_premium and user_membership != "premium":
        # Check if premium is still valid
        data["content"] = data.get("previewContent", "")  # show only preview
        data["isLocked"] = True
    else:
        data["isLocked"] = False

    return data
