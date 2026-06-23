from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional

from app.features.admin.dependencies import verify_admin
from app.features.admin.users.schema import (
    UserListResponse,
    UserListItem,
    UpdateUserRequest,
    PremiumGrantRequest,
    BanActionResponse,
)
from app.features.admin.users import service as user_service

router = APIRouter(prefix="/users", tags=["Admin - Users"])


@router.get("/list", response_model=UserListResponse)
async def list_users(
    page: int = Query(1, ge=1),
    pageSize: int = Query(20, ge=1, le=100),
    search: str = Query("", max_length=100),
    role: str = Query(""),
    status: str = Query(""),
    membership: str = Query(""),
    level: str = Query(""),
    admin: dict = Depends(verify_admin),
):
    users, total = await user_service.list_users(
        page=page,
        pageSize=pageSize,
        search=search,
        role=role,
        status=status,
        membership=membership,
        level=level,
    )
    return UserListResponse(
        users=[UserListItem(**u) for u in users],
        total=total,
        page=page,
        pageSize=pageSize,
    )


@router.get("/{uid}")
async def get_user(uid: str, admin: dict = Depends(verify_admin)):
    user = await user_service.get_user_detail(uid)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/{uid}")
async def update_user(
    uid: str,
    body: UpdateUserRequest,
    admin: dict = Depends(verify_admin),
):
    admin_uid = admin.get("uid", "")
    updates = body.model_dump(exclude_none=True)
    success = await user_service.update_user(uid, updates, admin_uid)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Updated successfully"}


@router.put("/{uid}/ban", response_model=BanActionResponse)
async def toggle_ban(uid: str, admin: dict = Depends(verify_admin)):
    admin_uid = admin.get("uid", "")
    new_status = await user_service.toggle_ban(uid, admin_uid)
    if new_status is None:
        raise HTTPException(status_code=404, detail="User not found")
    return BanActionResponse(
        message=f"User is now {new_status}",
        uid=uid,
        status=new_status,
    )


@router.put("/{uid}/premium")
async def grant_premium(
    uid: str,
    body: PremiumGrantRequest,
    admin: dict = Depends(verify_admin),
):
    admin_uid = admin.get("uid", "")
    result = await user_service.grant_premium(uid, body.durationDays, admin_uid)
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "message": f"Premium granted for {body.durationDays} days",
        "uid": uid,
        "membership": "premium",
        "premiumExpiry": result.get("premiumExpiry"),
    }
