from fastapi import APIRouter, Depends

from app.features.admin.dependencies import verify_admin
from app.features.admin.dashboard import service as dashboard_service

router = APIRouter(prefix="/dashboard", tags=["Admin - Dashboard"])


@router.get("/stats")
async def get_dashboard_stats(admin: dict = Depends(verify_admin)):
    stats = await dashboard_service.get_stats()
    return stats
