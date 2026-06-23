from typing import List, Dict, Any
from app.firebase import get_firestore_db
from app.shared.firestore_helpers import serialize_doc

VERBS_COL = "irregular_verbs"


async def get_all_verbs() -> List[Dict[str, Any]]:
    """Get all irregular verbs sorted by v1."""
    db = get_firestore_db()
    all_docs = list(db.collection(VERBS_COL).stream())
    all_docs.sort(key=lambda d: d.to_dict().get("v1", ""))

    results = []
    for doc in all_docs:
        data = serialize_doc(doc.to_dict())
        data["id"] = doc.id
        results.append(data)
    return results
