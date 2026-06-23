from fastapi import APIRouter, HTTPException, Depends, Query

from app.dependencies import verify_firebase_token
from app.features.learner.tests import service as tests_service

router = APIRouter(prefix="/tests", tags=["Learner - Tests"])


@router.get("/list")
async def list_tests(
    level: str = Query(""),
    type: str = Query(""),
    page: int = Query(1, ge=1),
    pageSize: int = Query(20, ge=1, le=50),
    user: dict = Depends(verify_firebase_token),
):
    tests, total = await tests_service.list_tests(
        level=level, type_filter=type, page=page, pageSize=pageSize
    )
    return {"tests": tests, "total": total}
