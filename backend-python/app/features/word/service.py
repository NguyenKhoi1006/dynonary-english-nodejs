from typing import Optional, List, Dict, Any
from google.cloud.firestore import Query
from app.firebase import get_firestore_db
from app.shared.firestore_helpers import serialize_doc, serialize_docs

WORDS_COL = "words"


def _doc_to_word(doc) -> Dict[str, Any]:
    """Convert a Firestore document to word dict."""
    data = serialize_doc(doc.to_dict())
    data["id"] = doc.id
    return data


async def search_word(search_term: str, limit: int = 20) -> List[Dict[str, Any]]:
    """Search words by prefix."""
    db = get_firestore_db()
    search_lower = search_term.lower()
    
    # Firestore doesn't support regex, so get all and filter
    # For production, consider Algolia/MeiliSearch
    docs = (
        db.collection(WORDS_COL)
        .order_by("word")
        .limit(limit * 5)  # Over-fetch for client-side filter
        .stream()
    )
    
    results = []
    for doc in docs:
        data = doc.to_dict()
        word = data.get("word", "").lower()
        if word.startswith(search_lower) or search_lower in word:
            data["id"] = doc.id
            results.append(data)
            if len(results) >= limit:
                break
    
    return results


async def get_word_detail(word: str) -> Optional[Dict[str, Any]]:
    """Get word details by exact word match."""
    db = get_firestore_db()
    docs = (
        db.collection(WORDS_COL)
        .where("word", "==", word)
        .limit(1)
        .stream()
    )
    for doc in docs:
        data = doc.to_dict()
        data["id"] = doc.id
        return data
    return None


async def get_word_pack(
    pack_info: Dict[str, Any],
    skip: int = 0,
    per_page: int = 8,
) -> List[Dict[str, Any]]:
    """Get paginated word list with optional filters."""
    db = get_firestore_db()
    query = db.collection(WORDS_COL)
    
    filters = []
    if pack_info.get("type") and pack_info["type"] != "-1":
        filters.append(("type", "==", pack_info["type"]))
    if pack_info.get("level") and pack_info["level"] != "-1":
        filters.append(("level", "==", pack_info["level"]))
    
    # Apply filters
    for field, op, value in filters:
        query = query.where(field, op, value)
    
    query = query.order_by("word").limit(skip + per_page)
    docs = query.stream()
    
    all_results = [_doc_to_word(doc) for doc in docs]
    return all_results[skip:skip + per_page]


async def count_word_pack(pack_info: Dict[str, Any]) -> int:
    """Count words matching filters."""
    db = get_firestore_db()
    query = db.collection(WORDS_COL)
    
    if pack_info.get("type") and pack_info["type"] != "-1":
        query = query.where("type", "==", pack_info["type"])
    if pack_info.get("level") and pack_info["level"] != "-1":
        query = query.where("level", "==", pack_info["level"])
    
    # Firestore count is approximate with count aggregation
    docs = query.count().get()
    return docs[0][0].value if docs else 0


async def check_word_existence(word: str) -> bool:
    """Check if a word exists."""
    db = get_firestore_db()
    docs = (
        db.collection(WORDS_COL)
        .where("word", "==", word)
        .limit(1)
        .stream()
    )
    return any(True for _ in docs)


async def get_favorite_list(word_names: List[str]) -> List[Dict[str, Any]]:
    """Get word details for a list of word names (favorites)."""
    if not word_names:
        return []
    
    db = get_firestore_db()
    results = []
    
    for word_name in word_names:
        docs = (
            db.collection(WORDS_COL)
            .where("word", ">=", word_name)
            .where("word", "<=", word_name + "\uf8ff")
            .limit(1)
            .stream()
        )
        for doc in docs:
            data = doc.to_dict()
            data["id"] = doc.id
            results.append(data)
    
    return results
