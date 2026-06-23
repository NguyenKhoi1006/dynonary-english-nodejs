from fastapi import HTTPException, Depends
from app.dependencies import verify_firebase_token
from app.firebase import get_firestore_db


async def verify_admin(token: dict = Depends(verify_firebase_token)) -> dict:
    """Verify Firebase token AND check that the user has role == 'admin'."""
    uid = token.get("uid", "")
    db = get_firestore_db()
    user_doc = db.collection("users").document(uid).get()

    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="User not found")

    user_data = user_doc.to_dict()
    if user_data.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Forbidden: Admin access required")

    return token
