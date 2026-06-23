from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional

from app.features.admin.dependencies import verify_admin
from app.features.admin.tests.schema import TestCreate, TestUpdate, TestOut, TestListResponse
from app.features.admin.tests import service as tests_service

router = APIRouter(prefix="/tests", tags=["Admin - Tests"])


@router.get("/list", response_model=TestListResponse)
async def list_tests(
    page: int = Query(1, ge=1),
    pageSize: int = Query(20, ge=1, le=100),
    level: str = Query(""),
    type: str = Query(""),
    published: str = Query(""),
    search: str = Query(""),
    admin: dict = Depends(verify_admin),
):
    tests, total = await tests_service.list_tests(
        page=page, pageSize=pageSize, level=level,
        type_filter=type, published=published, search=search,
    )
    return TestListResponse(
        tests=[TestOut(**t) for t in tests],
        total=total, page=page, pageSize=pageSize,
    )


@router.get("/{test_id}")
async def get_test(test_id: str, admin: dict = Depends(verify_admin)):
    test = await tests_service.get_test(test_id)
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    return test


@router.post("/", status_code=201)
async def create_test(body: TestCreate, admin: dict = Depends(verify_admin)):
    admin_uid = admin.get("uid", "")
    result = await tests_service.create_test(body.model_dump(), admin_uid)
    return result


@router.put("/{test_id}")
async def update_test(test_id: str, body: TestUpdate, admin: dict = Depends(verify_admin)):
    admin_uid = admin.get("uid", "")
    updates = body.model_dump(exclude_none=True)
    result = await tests_service.update_test(test_id, updates, admin_uid)
    if not result:
        raise HTTPException(status_code=404, detail="Test not found")
    return result


@router.delete("/{test_id}")
async def delete_test(test_id: str, admin: dict = Depends(verify_admin)):
    admin_uid = admin.get("uid", "")
    success = await tests_service.delete_test(test_id, admin_uid)
    if not success:
        raise HTTPException(status_code=404, detail="Test not found")
    return {"message": "Deleted successfully"}
