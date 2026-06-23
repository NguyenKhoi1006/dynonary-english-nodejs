from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional

from app.features.admin.dependencies import verify_admin
from app.features.admin.irregular_verbs.schema import (
    IrregularVerbCreate, IrregularVerbUpdate, IrregularVerbOut,
    IrregularVerbListResponse, BulkImportRequest, BulkImportResponse,
)
from app.features.admin.irregular_verbs import service as verbs_service

router = APIRouter(prefix="/irregular-verbs", tags=["Admin - Irregular Verbs"])


@router.get("/list", response_model=IrregularVerbListResponse)
async def list_verbs(
    page: int = Query(1, ge=1),
    pageSize: int = Query(50, ge=1, le=500),
    search: str = Query(""),
    admin: dict = Depends(verify_admin),
):
    verbs, total = await verbs_service.list_irregular_verbs(
        page=page, pageSize=pageSize, search=search,
    )
    return IrregularVerbListResponse(
        verbs=[IrregularVerbOut(**v) for v in verbs],
        total=total, page=page, pageSize=pageSize,
    )


@router.get("/{verb_id}")
async def get_verb(verb_id: str, admin: dict = Depends(verify_admin)):
    verb = await verbs_service.get_irregular_verb(verb_id)
    if not verb:
        raise HTTPException(status_code=404, detail="Verb not found")
    return verb


@router.post("/", status_code=201)
async def create_verb(body: IrregularVerbCreate, admin: dict = Depends(verify_admin)):
    admin_uid = admin.get("uid", "")
    result = await verbs_service.create_irregular_verb(body.model_dump(), admin_uid)
    return result


@router.post("/bulk-import", status_code=201)
async def bulk_import_verbs(body: BulkImportRequest, admin: dict = Depends(verify_admin)):
    admin_uid = admin.get("uid", "")
    count = await verbs_service.bulk_import_verbs(
        [v.model_dump() for v in body.verbs], admin_uid
    )
    return BulkImportResponse(imported=count, message=f"Imported {count} verbs")


@router.put("/{verb_id}")
async def update_verb(verb_id: str, body: IrregularVerbUpdate, admin: dict = Depends(verify_admin)):
    admin_uid = admin.get("uid", "")
    updates = body.model_dump(exclude_none=True)
    result = await verbs_service.update_irregular_verb(verb_id, updates, admin_uid)
    if not result:
        raise HTTPException(status_code=404, detail="Verb not found")
    return result


@router.delete("/{verb_id}")
async def delete_verb(verb_id: str, admin: dict = Depends(verify_admin)):
    admin_uid = admin.get("uid", "")
    success = await verbs_service.delete_irregular_verb(verb_id, admin_uid)
    if not success:
        raise HTTPException(status_code=404, detail="Verb not found")
    return {"message": "Deleted successfully"}
