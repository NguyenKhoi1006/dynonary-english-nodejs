from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional

from app.features.admin.dependencies import verify_admin
from app.features.admin.blog.schema import BlogCreate, BlogUpdate, BlogOut, BlogListResponse
from app.features.admin.blog import service as blog_service

router = APIRouter(prefix="/blog", tags=["Admin - Blog"])


@router.get("/list", response_model=BlogListResponse)
async def list_posts(
    page: int = Query(1, ge=1),
    pageSize: int = Query(20, ge=1, le=100),
    type: str = Query(""),
    search: str = Query(""),
    admin: dict = Depends(verify_admin),
):
    posts, total = await blog_service.list_posts(
        page=page, pageSize=pageSize, post_type=type, search=search,
    )
    return BlogListResponse(
        posts=[BlogOut(**p) for p in posts],
        total=total, page=page, pageSize=pageSize,
    )


@router.get("/{post_id}")
async def get_post(post_id: str, admin: dict = Depends(verify_admin)):
    post = await blog_service.get_post(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.post("/", status_code=201)
async def create_post(body: BlogCreate, admin: dict = Depends(verify_admin)):
    admin_uid = admin.get("uid", "")
    result = await blog_service.create_post(body.model_dump(), admin_uid)
    return result


@router.put("/{post_id}")
async def update_post(post_id: str, body: BlogUpdate, admin: dict = Depends(verify_admin)):
    admin_uid = admin.get("uid", "")
    updates = body.model_dump(exclude_none=True)
    result = await blog_service.update_post(post_id, updates, admin_uid)
    if not result:
        raise HTTPException(status_code=404, detail="Post not found")
    return result


@router.delete("/{post_id}")
async def delete_post(post_id: str, admin: dict = Depends(verify_admin)):
    admin_uid = admin.get("uid", "")
    success = await blog_service.delete_post(post_id, admin_uid)
    if not success:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"message": "Deleted successfully"}
