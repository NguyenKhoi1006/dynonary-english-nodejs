from fastapi import APIRouter, Query
from typing import Optional
from app.features.sentence.schema import SentenceListResponse
from app.features.sentence import service as sentence_service

router = APIRouter()


@router.get("/", response_model=SentenceListResponse)
async def get_sentences(
    topic: Optional[str] = Query(None),
    limit: int = Query(200, ge=1, le=500),
):
    sentence_list = await sentence_service.get_sentences(topic, limit)
    return {"sentenceList": sentence_list}
