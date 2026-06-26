from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional

from app.features.admin.dependencies import verify_admin
from app.features.admin.tutors.schema import (
    TutorAdminListItem, TutorAdminListResponse, TutorAdminDetailResponse,
)
from app.features.admin.tutors import service as admin_tutor_service

router = APIRouter(prefix="/tutors", tags=["Admin - Tutors"])


@router.get("/list", response_model=TutorAdminListResponse)
async def list_tutors(
    page: int = Query(1, ge=1),
    pageSize: int = Query(20, ge=1, le=100),
    search: str = Query(""),
    status: str = Query(""),
    admin: dict = Depends(verify_admin),
):
    tutors, total = await admin_tutor_service.list_all_tutors(
        page=page, page_size=pageSize, search=search, status=status,
    )
    return TutorAdminListResponse(
        tutors=[TutorAdminListItem(**t) for t in tutors],
        total=total, page=page, pageSize=pageSize,
    )


@router.get("/{tutor_id}", response_model=TutorAdminDetailResponse)
async def get_tutor(tutor_id: str, admin: dict = Depends(verify_admin)):
    tutor = await admin_tutor_service.get_tutor_detail(tutor_id)
    if not tutor:
        raise HTTPException(status_code=404, detail="Tutor not found")
    return TutorAdminDetailResponse(**tutor)


@router.put("/{tutor_id}/approve")
async def approve_tutor(tutor_id: str, admin: dict = Depends(verify_admin)):
    admin_uid = admin.get("uid", "")
    success = await admin_tutor_service.approve_tutor(tutor_id, admin_uid)
    if not success:
        raise HTTPException(status_code=404, detail="Tutor not found")
    return {"message": "Tutor approved successfully"}


@router.put("/{tutor_id}/reject")
async def reject_tutor(tutor_id: str, admin: dict = Depends(verify_admin)):
    admin_uid = admin.get("uid", "")
    success = await admin_tutor_service.reject_tutor(tutor_id, admin_uid)
    if not success:
        raise HTTPException(status_code=404, detail="Tutor not found")
    return {"message": "Tutor rejected successfully"}
