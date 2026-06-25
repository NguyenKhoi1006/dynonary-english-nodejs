from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional

from app.dependencies import verify_firebase_token
from app.features.admin.dependencies import verify_admin
from app.features.tutors.schema import (
    TutorProfileResponse,
    TutorProfileUpdate,
    TutorListResponse,
    TutorListItem,
    TutorApplicationRequest,
)
from app.features.tutors import service as tutor_service
from app.features.account import service as account_service

router = APIRouter(prefix="/tutors", tags=["Tutors"])


@router.get("/list", response_model=TutorListResponse)
async def list_tutors(
    page: int = Query(1, ge=1),
    pageSize: int = Query(20, ge=1, le=100),
    search: str = Query("", max_length=100),
    subject: str = Query(""),
    level: str = Query(""),
    minRate: float = Query(0, ge=0),
    maxRate: float = Query(0, ge=0),
    sortBy: str = Query("rating", pattern=r"^(rating|hourlyRate|sessions)$"),
):
    tutors, total = await tutor_service.list_tutors(
        page=page,
        page_size=pageSize,
        search=search,
        subject=subject,
        level=level,
        min_rate=minRate,
        max_rate=maxRate,
        sort_by=sortBy,
    )
    return TutorListResponse(
        tutors=[TutorListItem(**t) for t in tutors],
        total=total,
        page=page,
        pageSize=pageSize,
    )


@router.get("/my-profile", response_model=TutorProfileResponse)
async def get_my_tutor_profile(user: dict = Depends(verify_firebase_token)):
    uid = user.get("uid", "")
    profile = await tutor_service.get_tutor_by_user_id(uid)
    if not profile:
        raise HTTPException(status_code=404, detail="Bạn chưa đăng ký làm gia sư")
    return TutorProfileResponse(**profile)


@router.get("/{uid}", response_model=TutorProfileResponse)
async def get_tutor_profile(uid: str):
    profile = await tutor_service.get_tutor_profile(uid)
    if not profile:
        raise HTTPException(status_code=404, detail="Không tìm thấy gia sư")
    return TutorProfileResponse(**profile)


@router.post("/apply")
async def apply_as_tutor(
    body: TutorApplicationRequest,
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    existing = await tutor_service.get_tutor_by_user_id(uid)
    if existing:
        raise HTTPException(status_code=409, detail="Bạn đã đăng ký làm gia sư rồi")

    profile = await account_service.get_user_profile(uid)
    if not profile:
        raise HTTPException(status_code=404, detail="Không tìm thấy thông tin người dùng")

    tutor = await tutor_service.create_tutor_profile(
        user_id=uid,
        name=profile.get("name", ""),
        email=profile.get("email", ""),
        avt=profile.get("avt", ""),
        bio=body.bio,
        subjects=body.subjects,
        hourly_rate=body.hourlyRate,
        level=body.level,
        qualifications=body.qualifications,
        video_intro=body.videoIntro,
    )
    return {"message": "Đăng ký gia sư thành công", "uid": tutor.get("uid")}


@router.put("/my-profile")
async def update_my_tutor_profile(
    body: TutorProfileUpdate,
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    profile = await tutor_service.get_tutor_by_user_id(uid)
    if not profile:
        raise HTTPException(status_code=404, detail="Bạn chưa đăng ký làm gia sư")

    updates = body.model_dump(exclude_none=True)
    success = await tutor_service.update_tutor_profile(profile["uid"], updates)
    if not success:
        raise HTTPException(status_code=404, detail="Cập nhật thất bại")
    return {"message": "Cập nhật thành công"}


@router.delete("/{uid}")
async def delete_tutor(
    uid: str,
    admin: dict = Depends(verify_admin),
):
    success = await tutor_service.delete_tutor_profile(uid)
    if not success:
        raise HTTPException(status_code=404, detail="Không tìm thấy gia sư")
    return {"message": "Đã xoá gia sư"}
