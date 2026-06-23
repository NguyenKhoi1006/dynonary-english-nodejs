from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional

from app.features.admin.dependencies import verify_admin
from app.features.admin.placement_tests.schema import (
    PlacementTestCreate, PlacementTestUpdate, PlacementTestOut, PlacementTestListResponse,
)
from app.features.admin.placement_tests import service as tests_service

router = APIRouter(prefix="/placement-tests", tags=["Admin - Placement Tests"])


@router.get("/list", response_model=PlacementTestListResponse)
async def list_tests(
    page: int = Query(1, ge=1),
    pageSize: int = Query(20, ge=1, le=100),
    admin: dict = Depends(verify_admin),
):
    tests, total = await tests_service.list_tests(page=page, pageSize=pageSize)
    return PlacementTestListResponse(
        tests=[PlacementTestOut(**t) for t in tests],
        total=total,
    )


@router.get("/{test_id}")
async def get_test(test_id: str, admin: dict = Depends(verify_admin)):
    test = await tests_service.get_test(test_id)
    if not test:
        raise HTTPException(status_code=404, detail="Placement test not found")
    return test


@router.post("/", status_code=201)
async def create_test(body: PlacementTestCreate, admin: dict = Depends(verify_admin)):
    admin_uid = admin.get("uid", "")
    result = await tests_service.create_test(body.model_dump(), admin_uid)
    return result


@router.put("/{test_id}")
async def update_test(test_id: str, body: PlacementTestUpdate, admin: dict = Depends(verify_admin)):
    admin_uid = admin.get("uid", "")
    updates = body.model_dump(exclude_none=True)
    result = await tests_service.update_test(test_id, updates, admin_uid)
    if not result:
        raise HTTPException(status_code=404, detail="Placement test not found")
    return result


@router.delete("/{test_id}")
async def delete_test(test_id: str, admin: dict = Depends(verify_admin)):
    admin_uid = admin.get("uid", "")
    success = await tests_service.delete_test(test_id, admin_uid)
    if not success:
        raise HTTPException(status_code=404, detail="Placement test not found")
    return {"message": "Deleted successfully"}
