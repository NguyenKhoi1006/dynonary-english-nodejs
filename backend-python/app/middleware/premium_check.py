from fastapi import HTTPException, Depends
from datetime import datetime, timezone
from app.dependencies import verify_firebase_token
from app.firebase import get_firestore_db


async def require_premium(token: dict = Depends(verify_firebase_token)) -> dict:
    """Verify the user has active premium membership."""
    uid = token.get("uid", "")
    db = get_firestore_db()
    user_doc = db.collection("users").document(uid).get()

    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="User not found")

    user_data = user_doc.to_dict()
    membership = user_data.get("membership", "free")
    premium_expiry = user_data.get("premiumExpiry")

    if membership != "premium":
        raise HTTPException(status_code=403, detail="Premium membership required")

    # Check expiry
    if premium_expiry:
        if hasattr(premium_expiry, "seconds"):
            expiry = datetime.fromtimestamp(premium_expiry.seconds, tz=timezone.utc)
            if expiry < datetime.now(timezone.utc):
                raise HTTPException(status_code=403, detail="Premium membership expired")

    return token
