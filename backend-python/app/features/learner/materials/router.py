from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional

from app.dependencies import verify_firebase_token
from app.features.learner.materials import service as materials_service

router = APIRouter(prefix="/materials", tags=["Learner - Materials"])


@router.get("/list")
async def list_materials(
    level: str = Query(""),
    type: str = Query(""),
    page: int = Query(1, ge=1),
    pageSize: int = Query(20, ge=1, le=50),
    user: dict = Depends(verify_firebase_token),
):
    materials, total = await materials_service.list_materials(
        level=level, type_filter=type, page=page, pageSize=pageSize
    )
    return {"materials": materials, "total": total}


@router.get("/{material_id}")
async def get_material_detail(
    material_id: str,
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    # Get user's membership status from Firestore
    from app.firebase import get_firestore_db
    db = get_firestore_db()
    user_doc = db.collection("users").document(uid).get()
    membership = "free"
    premium_expiry = None
    if user_doc.exists:
        ud = user_doc.to_dict()
        membership = ud.get("membership", "free")
        premium_expiry = ud.get("premiumExpiry")

    material = await materials_service.get_material_detail(
        material_id, membership, premium_expiry
    )
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    return material
