from typing import Optional, List, Dict, Any
from app.firebase import get_firestore_db
from app.shared.firestore_helpers import serialize_doc

SENTENCES_COL = "sentences"


async def get_sentences(topic: Optional[str] = None, max_results: int = 200) -> List[Dict[str, Any]]:
    """Get sentences, optionally filtered by topic."""
    db = get_firestore_db()
    query = db.collection(SENTENCES_COL)
    
    if topic:
        query = query.where("topic", "==", topic)
    
    docs = query.limit(max_results).stream()
    
    results = []
    for doc in docs:
        data = serialize_doc(doc.to_dict())
        data["id"] = doc.id
        results.append(data)
    return results
