from typing import Optional, Dict, Any, List
from google.cloud.firestore import SERVER_TIMESTAMP, ArrayUnion, ArrayRemove
from app.firebase import get_firestore_db, get_firebase_auth
from app.shared.constants import MAX_FAVORITES_LEN, MAX_USER_COIN
from app.shared.helpers import create_username
from app.shared.firestore_helpers import serialize_doc

USERS_COL = "users"


async def get_user_profile(uid: str) -> Optional[Dict[str, Any]]:
    """Get user profile by Firebase UID."""
    db = get_firestore_db()
    doc = db.collection(USERS_COL).document(uid).get()
    if not doc.exists:
        return None
    data = serialize_doc(doc.to_dict())
    data["uid"] = doc.id
    return data


async def create_user_profile(
    uid: str,
    email: str,
    name: str = "",
    username: str = "",
    avt: str = "",
    provider: str = "password",
) -> Dict[str, Any]:
    """Create a new user profile in Firestore."""
    db = get_firestore_db()
    if not username:
        username = create_username(email, uid)

    profile = {
        "email": email,
        "name": name or email.split("@")[0],
        "username": username,
        "avt": avt or "",
        "coin": 0,
        "favoriteList": [],
        "createdDate": SERVER_TIMESTAMP,
        "provider": provider,
        "role": "learner",
        "membership": "free",
        "level": None,
        "status": "active",
        "xp": 0,
    }

    db.collection(USERS_COL).document(uid).set(profile)
    profile["uid"] = uid
    return profile


async def update_user_profile(uid: str, name: str, new_username: str) -> Dict[str, Any]:
    """Update user profile name and username."""
    db = get_firestore_db()
    user_ref = db.collection(USERS_COL).document(uid)

    user_data = user_ref.get().to_dict() or {}
    old_username = user_data.get("username", "")

    if old_username.lower() != new_username.lower():
        existing = (
            db.collection(USERS_COL)
            .where("username", "==", new_username)
            .limit(1)
            .stream()
        )
        if any(doc.id != uid for doc in existing):
            return {"status": False, "message": "username đã được sử dụng"}

    user_ref.update({"name": name, "username": new_username})
    return {"status": True, "message": "success"}


async def update_avatar(uid: str, avatar_url: str) -> str:
    """Update user avatar URL."""
    db = get_firestore_db()
    db.collection(USERS_COL).document(uid).update({"avt": avatar_url})
    return avatar_url


async def update_coin(uid: str, new_coin: int) -> bool:
    """Update user coin balance."""
    if new_coin < 0 or new_coin > MAX_USER_COIN:
        return False
    db = get_firestore_db()
    db.collection(USERS_COL).document(uid).update({"coin": new_coin})
    return True


async def toggle_favorite(uid: str, word: str, is_add: bool) -> bool:
    """Add or remove a word from user's favorites."""
    db = get_firestore_db()
    user_ref = db.collection(USERS_COL).document(uid)
    user_data = user_ref.get().to_dict() or {}
    favorite_list = user_data.get("favoriteList", [])

    if is_add:
        if word in favorite_list:
            return False
        if len(favorite_list) >= MAX_FAVORITES_LEN:
            return False
        user_ref.update({"favoriteList": ArrayUnion([word])})
    else:
        if word not in favorite_list:
            return False
        user_ref.update({"favoriteList": ArrayRemove([word])})

    return True


async def get_user_info(uid: str) -> Optional[Dict[str, Any]]:
    """Get user info by Firebase UID."""
    return await get_user_profile(uid)


async def is_exist_account(email: str) -> bool:
    """Check if an account exists by email."""
    try:
        auth = get_firebase_auth()
        auth.get_user_by_email(email)
        return True
    except Exception:
        return False
