from typing import Optional, List, Dict, Any
from app.firebase import get_firestore_db
from app.shared.firestore_helpers import serialize_doc

BLOG_COL = "blog"


async def get_blog_posts(max_results: int = 50) -> List[Dict[str, Any]]:
    """Get blog posts sorted by creation date descending."""
    db = get_firestore_db()
    docs = (
        db.collection(BLOG_COL)
        .order_by("createdAt", direction="DESCENDING")
        .limit(max_results)
        .stream()
    )
    results = []
    for doc in docs:
        data = serialize_doc(doc.to_dict())
        data["id"] = doc.id
        results.append(data)
    return results


async def get_blog_post(post_id: str) -> Optional[Dict[str, Any]]:
    """Get a single blog post by ID."""
    db = get_firestore_db()
    doc = db.collection(BLOG_COL).document(post_id).get()
    if not doc.exists:
        return None
    data = serialize_doc(doc.to_dict())
    data["id"] = doc.id
    return data
