from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional

from app.features.admin.dependencies import verify_admin
from app.features.admin.materials.schema import MaterialCreate, MaterialUpdate, MaterialOut, MaterialListResponse
from app.features.admin.materials import service as materials_service

router = APIRouter(prefix="/materials", tags=["Admin - Materials"])


@router.get("/list", response_model=MaterialListResponse)
async def list_materials(
    page: int = Query(1, ge=1),
    pageSize: int = Query(20, ge=1, le=100),
    level: str = Query(""),
    type: str = Query(""),
    published: str = Query(""),
    search: str = Query(""),
    admin: dict = Depends(verify_admin),
):
    materials, total = await materials_service.list_materials(
        page=page, pageSize=pageSize, level=level,
        type_filter=type, published=published, search=search,
    )
    return MaterialListResponse(
        materials=[MaterialOut(**m) for m in materials],
        total=total, page=page, pageSize=pageSize,
    )


@router.get("/{material_id}")
async def get_material(material_id: str, admin: dict = Depends(verify_admin)):
    material = await materials_service.get_material(material_id)
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    return material


@router.post("/", status_code=201)
async def create_material(body: MaterialCreate, admin: dict = Depends(verify_admin)):
    admin_uid = admin.get("uid", "")
    result = await materials_service.create_material(body.model_dump(), admin_uid)
    return result


@router.put("/{material_id}")
async def update_material(material_id: str, body: MaterialUpdate, admin: dict = Depends(verify_admin)):
    admin_uid = admin.get("uid", "")
    updates = body.model_dump(exclude_none=True)
    result = await materials_service.update_material(material_id, updates, admin_uid)
    if not result:
        raise HTTPException(status_code=404, detail="Material not found")
    return result


@router.delete("/{material_id}")
async def delete_material(material_id: str, admin: dict = Depends(verify_admin)):
    admin_uid = admin.get("uid", "")
    success = await materials_service.delete_material(material_id, admin_uid)
    if not success:
        raise HTTPException(status_code=404, detail="Material not found")
    return {"message": "Deleted successfully"}
