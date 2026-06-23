from fastapi import HTTPException, Depends, Header
from firebase_admin import auth as firebase_auth
from app.firebase import get_firestore_db, get_firebase_auth


async def verify_admin(
    authorization: str = Header(None),
    auth: firebase_auth = Depends(get_firebase_auth),
) -> dict:
    """Verify Firebase ID token from Authorization header AND check admin role."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid authorization scheme")

    # Verify the Firebase ID token (works for both client SDK and REST API tokens)
    try:
        decoded_token = auth.verify_id_token(token)
    except firebase_auth.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except firebase_auth.ExpiredIdTokenError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception:
        raise HTTPException(status_code=401, detail="Authentication failed")

    uid = decoded_token.get("uid", "")
    if not uid:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    # Check admin role in Firestore
    db = get_firestore_db()
    user_doc = db.collection("users").document(uid).get()

    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="User not found")

    user_data = user_doc.to_dict()
    if user_data.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Forbidden: Admin access required")

    return decoded_token
