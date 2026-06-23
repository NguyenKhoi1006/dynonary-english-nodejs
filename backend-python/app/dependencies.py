from fastapi import Header, HTTPException, Depends
from firebase_admin import auth as firebase_auth
from app.firebase import get_firebase_auth


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
