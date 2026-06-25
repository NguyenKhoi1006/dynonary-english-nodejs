from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from app.features.account.schema import (
    UserProfileResponse,
    UpdateProfileRequest,
    ToggleFavoriteRequest,
    UpdateCoinRequest,
    UpdateAvtRequest,
    MessageResponse,
    VerifyCodeRequest,
)
from app.features.account import service as account_service
from app.dependencies import verify_firebase_token
import base64

router = APIRouter()


@router.get("/user-info", response_model=UserProfileResponse)
async def get_user_info(user: dict = Depends(verify_firebase_token)):
    uid = user.get("uid", "")
    profile = await account_service.get_user_profile(uid)
    if not profile:
        # Auto-create profile if not exists (first login)
        profile = await account_service.create_user_profile(
            uid=uid,
            email=user.get("email", ""),
            name=user.get("name", ""),
            provider=user.get("firebase", {}).get("sign_in_provider", "password"),
        )
    return UserProfileResponse(**profile)


@router.get("/user-profile")
async def get_user_profile_endpoint(user: dict = Depends(verify_firebase_token)):
    uid = user.get("uid", "")
    profile = await account_service.get_user_profile(uid)
    if not profile:
        raise HTTPException(status_code=403, detail="User not found")
    return {
        "email": profile.get("email", ""),
        "createdDate": str(profile.get("createdDate", "")),
    }


@router.put("/update-profile", response_model=MessageResponse)
async def update_profile(
    body: UpdateProfileRequest,
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    if not body.name and not body.username and not body.role:
        raise HTTPException(status_code=400, detail="Nothing to update")
    
    result = await account_service.update_user_profile(
        uid=uid,
        name=body.name or "",
        new_username=body.username or "",
        new_role=body.role or "",
    )
    if not result.get("status"):
        raise HTTPException(status_code=400, detail=result.get("message", "Update failed"))
    return {"message": "success"}


@router.post("/upload-avt")
async def upload_avatar_file(
    file: UploadFile = File(...),
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File phải là ảnh")

    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Ảnh tối đa 5MB")

    try:
        b64 = base64.b64encode(contents).decode("utf-8")
        data_url = f"data:{file.content_type};base64,{b64}"
        await account_service.update_avatar(uid, data_url)
        return {"newSrc": data_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload thất bại: {str(e)}")


@router.put("/update-avt", response_model=dict)
async def update_avatar(
    body: UpdateAvtRequest,
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    if not body.avtSrc:
        raise HTTPException(status_code=400, detail="Missing avatar URL")
    
    new_avt = await account_service.update_avatar(uid, body.avtSrc)
    return {"newSrc": new_avt}


@router.put("/update-coin", response_model=MessageResponse)
async def update_coin(
    body: UpdateCoinRequest,
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    success = await account_service.update_coin(uid, body.newCoin)
    if not success:
        raise HTTPException(status_code=406, detail="Invalid coin value")
    return {"message": "success"}


@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(
    body: VerifyCodeRequest,
):
    """Reset password using verification code."""
    from app.features.common import service as common_service
    
    result = await common_service.check_verify_code(body.verifyCode, body.email)
    if not result.get("status"):
        raise HTTPException(status_code=400, detail=result.get("message", "Invalid code"))
    
    try:
        auth = __import__("app.firebase", fromlist=["get_firebase_auth"]).get_firebase_auth()
        user = auth.get_user_by_email(body.email)
        auth.update_user(user.uid, password=body.password)
        await common_service.remove_verify_code(body.email)
        return {"message": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi dịch vụ, thử lại sau: {str(e)}")


@router.put("/toggle-favorite", response_model=MessageResponse)
async def toggle_favorite(
    body: ToggleFavoriteRequest,
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    success = await account_service.toggle_favorite(uid, body.word, body.isAdd)
    if not success:
        raise HTTPException(
            status_code=409,
            detail="Số từ đã vượt quá số lượng tối đa hoặc từ đã tồn tại",
        )
    return {"message": "success"}
