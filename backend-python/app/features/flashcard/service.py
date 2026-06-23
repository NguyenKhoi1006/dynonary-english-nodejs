from typing import List, Dict, Any, Optional
from google.cloud.firestore import SERVER_TIMESTAMP
from app.firebase import get_firestore_db
from app.shared.firestore_helpers import serialize_doc

FLASHCARDS_COL = "flashcards"


async def get_flashcards(user_id: str) -> List[Dict[str, Any]]:
    """Get all flashcards for a user."""
    db = get_firestore_db()
    docs = (
        db.collection(FLASHCARDS_COL)
        .where("userId", "==", user_id)
        .stream()
    )
    results = []
    for doc in docs:
        data = serialize_doc(doc.to_dict())
        data["id"] = doc.id
        results.append(data)
    return results


async def add_flashcard(user_id: str, word: str, meaning: str) -> str:
    """Add a new flashcard for a user."""
    db = get_firestore_db()
    doc_ref = db.collection(FLASHCARDS_COL).add({
        "userId": user_id,
        "word": word,
        "meaning": meaning,
        "createdAt": SERVER_TIMESTAMP,
    })
    return doc_ref[1].id


async def delete_flashcard(flashcard_id: str) -> bool:
    """Delete a flashcard by ID."""
    db = get_firestore_db()
    doc = db.collection(FLASHCARDS_COL).document(flashcard_id).get()
    if not doc.exists:
        return False
    db.collection(FLASHCARDS_COL).document(flashcard_id).delete()
    return True
