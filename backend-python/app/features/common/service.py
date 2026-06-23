from typing import Optional, Dict, Any
from google.cloud.firestore import SERVER_TIMESTAMP
from app.firebase import get_firestore_db

VERIFY_COL = "verifyCodes"
CONTRIBUTIONS_COL = "contributions"


async def save_verify_code(code: str, email: str) -> None:
    """Save a verification code for password reset."""
    db = get_firestore_db()
    doc_id = f"reset_{email.replace('@', '_').replace('.', '_')}"
    db.collection(VERIFY_COL).document(doc_id).set({
        "email": email,
        "code": code,
        "createdAt": SERVER_TIMESTAMP,
    })


async def check_verify_code(code: str, email: str) -> dict:
    """Check if a verification code is valid."""
    db = get_firestore_db()
    doc_id = f"reset_{email.replace('@', '_').replace('.', '_')}"
    doc = db.collection(VERIFY_COL).document(doc_id).get()
    
    if not doc.exists:
        return {"status": False, "message": "Mã xác nhận không tồn tại"}
    
    data = doc.to_dict()
    if data.get("code") != code:
        return {"status": False, "message": "Mã xác nhận không đúng"}
    
    return {"status": True, "message": "OK"}


async def remove_verify_code(email: str) -> None:
    """Remove a verification code after use."""
    db = get_firestore_db()
    doc_id = f"reset_{email.replace('@', '_').replace('.', '_')}"
    db.collection(VERIFY_COL).document(doc_id).delete()


async def check_pending_contribution(word: str) -> bool:
    """Check if there's a pending contribution for a word."""
    db = get_firestore_db()
    docs = (
        db.collection(CONTRIBUTIONS_COL)
        .where("word", "==", word)
        .where("status", "==", "pending")
        .limit(1)
        .stream()
    )
    return any(True for _ in docs)


async def create_contribution(
    user_id: str,
    word: str,
    meaning: str,
    phonetic: str = "",
    example: str = "",
) -> str:
    """Create a new word contribution."""
    db = get_firestore_db()
    doc_ref = db.collection(CONTRIBUTIONS_COL).add({
        "userId": user_id,
        "word": word,
        "meaning": meaning,
        "phonetic": phonetic,
        "example": example,
        "status": "pending",
        "createdAt": SERVER_TIMESTAMP,
    })
    return doc_ref[1].id
