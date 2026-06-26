from fastapi import Header, HTTPException, Depends
from firebase_admin import auth as firebase_auth
from app.firebase import get_firebase_auth, get_firestore_db
from typing import Set


async def verify_firebase_token(
    authorization: str = Header(None),
    auth: firebase_auth = Depends(get_firebase_auth),
) -> dict:
    """Verify Firebase ID token from Authorization header."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid authorization scheme")
    
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except firebase_auth.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except firebase_auth.ExpiredIdTokenError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception:
        raise HTTPException(status_code=401, detail="Authentication failed")


def verify_role(allowed_roles: Set[str]):
    """Dependency factory: verify Firebase token AND check that user has one of allowed_roles.
    
    Usage:
        @router.get("/my-data")
        async def my_data(user: dict = Depends(verify_role({"student", "tutor"}))):
            ...
    """
    async def _check_role(token: dict = Depends(verify_firebase_token)) -> dict:
        uid = token.get("uid", "")
        if not uid:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        db = get_firestore_db()
        user_doc = db.collection("users").document(uid).get()

        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User not found")

        user_data = user_doc.to_dict()
        user_role = user_data.get("role", "")
        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=403,
                detail=f"Forbidden: Requires one of roles {allowed_roles}",
            )

        return token

    return _check_role
