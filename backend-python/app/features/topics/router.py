from fastapi import APIRouter, Query
from typing import Optional
from app.features.topics.service import get_topics

router = APIRouter()


@router.get("/")
async def list_topics(
    type: str = Query("", description="Filter by type: 'vocab' or 'sentence'"),
):
    """Public endpoint: get topics list. Replaces hardcoded constant/topics.js and constant/sentence-topics.js."""
    topics = await get_topics(topic_type=type)
    return {"topics": topics}
