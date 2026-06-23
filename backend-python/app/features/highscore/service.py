from typing import List, Dict, Any
from google.cloud.firestore import SERVER_TIMESTAMP
from app.firebase import get_firestore_db
from app.shared.firestore_helpers import serialize_doc

LEADERBOARD_COL = "leaderboard"


async def get_leaderboard(game_type: str, max_results: int = 20) -> List[Dict[str, Any]]:
    """Get leaderboard entries for a game type, sorted by score descending."""
    db = get_firestore_db()
    docs = (
        db.collection(LEADERBOARD_COL)
        .where("gameType", "==", game_type)
        .order_by("score", direction="DESCENDING")
        .limit(max_results)
        .stream()
    )
    results = []
    for doc in docs:
        data = serialize_doc(doc.to_dict())
        data["id"] = doc.id
        results.append(data)
    return results


async def upsert_score(
    user_id: str,
    game_type: str,
    score: int,
    display_name: str,
    photo_url: str = "",
) -> bool:
    """Upsert a leaderboard entry. Only updates if new score is higher."""
    db = get_firestore_db()
    
    # Find existing entry
    existing = (
        db.collection(LEADERBOARD_COL)
        .where("userId", "==", user_id)
        .where("gameType", "==", game_type)
        .limit(1)
        .stream()
    )
    
    for doc in existing:
        existing_data = doc.to_dict()
        if score <= existing_data.get("score", 0):
            return False  # Not a new high score
        # Update
        db.collection(LEADERBOARD_COL).document(doc.id).update({
            "score": score,
            "displayName": display_name,
            "photoURL": photo_url,
            "updatedAt": SERVER_TIMESTAMP,
        })
        return True
    
    # Create new entry
    db.collection(LEADERBOARD_COL).add({
        "userId": user_id,
        "gameType": game_type,
        "score": score,
        "displayName": display_name,
        "photoURL": photo_url,
        "updatedAt": SERVER_TIMESTAMP,
    })
    return True
