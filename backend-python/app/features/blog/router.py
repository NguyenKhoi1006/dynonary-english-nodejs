from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.features.blog.schema import BlogPostResponse, BlogListResponse
from app.features.blog import service as blog_service

router = APIRouter()


@router.get("/", response_model=BlogListResponse)
async def get_blog_posts(limit: int = Query(50, ge=1, le=100)):
    blog_list = await blog_service.get_blog_posts(limit)
    return {"blogList": blog_list}


@router.get("/{post_id}", response_model=BlogPostResponse)
async def get_blog_post(post_id: str):
    post = await blog_service.get_blog_post(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return BlogPostResponse(**post)
