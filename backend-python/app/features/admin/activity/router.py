from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional

from app.features.admin.dependencies import verify_admin
from app.features.admin.activity import service as activity_service

router = APIRouter(prefix="/activity", tags=["Admin - Activity"])


@router.get("/logs")
async def get_admin_logs(
    page: int = Query(1, ge=1),
    pageSize: int = Query(50, ge=1, le=200),
    action: str = Query(""),
    admin: dict = Depends(verify_admin),
):
    logs, total = await activity_service.get_admin_logs(
        page=page, pageSize=pageSize, action=action
    )
    return {
        "logs": logs,
        "total": total,
        "page": page,
        "pageSize": pageSize,
    }


@router.get("/users/{uid}/logs")
async def get_user_activity_logs(
    uid: str,
    page: int = Query(1, ge=1),
    pageSize: int = Query(50, ge=1, le=200),
    admin: dict = Depends(verify_admin),
):
    logs, total = await activity_service.get_user_activity_logs(
        uid=uid, page=page, pageSize=pageSize
    )
    return {
        "logs": logs,
        "total": total,
        "page": page,
        "pageSize": pageSize,
    }
