from typing import List, Dict, Any
from app.firebase import get_firestore_db
from app.shared.firestore_helpers import serialize_doc

TOPICS_COL = "topics"


async def get_topics(topic_type: str = "") -> List[Dict[str, Any]]:
    """Get all topics, optionally filtered by type."""
    db = get_firestore_db()
    all_docs = list(db.collection(TOPICS_COL).stream())
    all_docs.sort(key=lambda d: d.to_dict().get("order", 0))

    results = []
    for doc in all_docs:
        data = serialize_doc(doc.to_dict())
        data["id"] = doc.id
        if topic_type and data.get("type") != topic_type:
            continue
        results.append(data)
    return results
