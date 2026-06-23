from typing import List, Dict, Any
from google.cloud.firestore import SERVER_TIMESTAMP
from app.firebase import get_firestore_db
from app.shared.firestore_helpers import serialize_doc

GAMES_COL = "gameResults"


async def save_game_result(
    user_id: str,
    game_type: str,
    score: int,
    correct_count: int,
    total_questions: int,
) -> str:
    """Save a game result."""
    db = get_firestore_db()
    doc_ref = db.collection(GAMES_COL).add({
        "userId": user_id,
        "gameType": game_type,
        "score": score,
        "correctCount": correct_count,
        "totalQuestions": total_questions,
        "playedAt": SERVER_TIMESTAMP,
    })
    return doc_ref[1].id


async def get_game_results(user_id: str, limit: int = 20) -> List[Dict[str, Any]]:
    """Get game results for a user."""
    db = get_firestore_db()
    docs = (
        db.collection(GAMES_COL)
        .where("userId", "==", user_id)
        .order_by("playedAt", direction="DESCENDING")
        .limit(limit)
        .stream()
    )
    results = []
    for doc in docs:
        data = serialize_doc(doc.to_dict())
        data["id"] = doc.id
        results.append(data)
    return results
