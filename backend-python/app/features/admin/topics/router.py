from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional

from app.features.admin.dependencies import verify_admin
from app.features.admin.topics.schema import TopicCreate, TopicUpdate, TopicOut, TopicListResponse
from app.features.admin.topics import service as topics_service

router = APIRouter(prefix="/topics", tags=["Admin - Topics"])


@router.get("/list", response_model=TopicListResponse)
async def list_topics(
    page: int = Query(1, ge=1),
    pageSize: int = Query(50, ge=1, le=200),
    type: str = Query(""),
    search: str = Query(""),
    admin: dict = Depends(verify_admin),
):
    topics, total = await topics_service.list_topics(
        page=page, pageSize=pageSize, topic_type=type, search=search,
    )
    return TopicListResponse(
        topics=[TopicOut(**t) for t in topics],
        total=total, page=page, pageSize=pageSize,
    )


@router.get("/{topic_id}")
async def get_topic(topic_id: str, admin: dict = Depends(verify_admin)):
    topic = await topics_service.get_topic(topic_id)
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic


@router.post("/", status_code=201)
async def create_topic(body: TopicCreate, admin: dict = Depends(verify_admin)):
    admin_uid = admin.get("uid", "")
    result = await topics_service.create_topic(body.model_dump(), admin_uid)
    return result


@router.put("/{topic_id}")
async def update_topic(topic_id: str, body: TopicUpdate, admin: dict = Depends(verify_admin)):
    admin_uid = admin.get("uid", "")
    updates = body.model_dump(exclude_none=True)
    result = await topics_service.update_topic(topic_id, updates, admin_uid)
    if not result:
        raise HTTPException(status_code=404, detail="Topic not found")
    return result


@router.delete("/{topic_id}")
async def delete_topic(topic_id: str, admin: dict = Depends(verify_admin)):
    admin_uid = admin.get("uid", "")
    success = await topics_service.delete_topic(topic_id, admin_uid)
    if not success:
        raise HTTPException(status_code=404, detail="Topic not found")
    return {"message": "Deleted successfully"}
