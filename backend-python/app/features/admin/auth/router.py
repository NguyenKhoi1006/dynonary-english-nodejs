import httpx
from fastapi import APIRouter, HTTPException, Depends
from app.config import settings
from app.firebase import get_firestore_db
from app.features.admin.auth.schema import (
    AdminLoginRequest,
    AdminLoginResponse,
)

router = APIRouter(prefix="/auth", tags=["Admin - Auth"])

FIREBASE_SIGN_IN_URL = (
    f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword"
    f"?key={settings.firebase_web_api_key}"
)
FIREBASE_TOKEN_REFRESH_URL = "https://securetoken.googleapis.com/v1/token"


@router.post("/login", response_model=AdminLoginResponse)
async def admin_login(body: AdminLoginRequest):
    """Admin login via Firebase REST API (no client SDK needed)."""
    if not settings.firebase_web_api_key:
        raise HTTPException(status_code=500, detail="Firebase Web API Key not configured")

    # 1. Sign in with Firebase REST API
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            FIREBASE_SIGN_IN_URL,
            json={
                "email": body.email,
                "password": body.password,
                "returnSecureToken": True,
            },
        )

    if resp.status_code != 200:
        error_data = resp.json().get("error", {})
        error_msg = error_data.get("message", "INVALID_LOGIN_CREDENTIALS")
        if error_msg == "EMAIL_NOT_FOUND":
            raise HTTPException(status_code=401, detail="Email không tồn tại")
        elif error_msg == "INVALID_PASSWORD":
            raise HTTPException(status_code=401, detail="Sai mật khẩu")
        elif error_msg == "USER_DISABLED":
            raise HTTPException(status_code=403, detail="Tài khoản đã bị vô hiệu hóa")
        else:
            raise HTTPException(status_code=401, detail="Đăng nhập thất bại")

    data = resp.json()
    firebase_uid = data.get("localId", "")
    id_token = data.get("idToken", "")
    refresh_token = data.get("refreshToken", "")

    if not firebase_uid:
        raise HTTPException(status_code=401, detail="Đăng nhập thất bại")

    # 2. Check admin role in Firestore
    db = get_firestore_db()
    user_doc = db.collection("users").document(firebase_uid).get()

    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")

    user_data = user_doc.to_dict()
    if user_data.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Tài khoản không có quyền admin")

    if user_data.get("status") == "banned":
        raise HTTPException(status_code=403, detail="Tài khoản đã bị khóa")

    # 3. Return admin info + tokens
    return AdminLoginResponse(
        access_token=id_token,
        refresh_token=refresh_token,
        uid=firebase_uid,
        name=user_data.get("name", ""),
        email=user_data.get("email", body.email),
        avt=user_data.get("avt", ""),
        role="admin",
    )
