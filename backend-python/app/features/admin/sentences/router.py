from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional

from app.features.admin.dependencies import verify_admin
from app.features.admin.sentences.schema import SentenceCreate, SentenceUpdate, SentenceOut, SentenceListResponse
from app.features.admin.sentences import service as sentences_service

router = APIRouter(prefix="/sentences", tags=["Admin - Sentences"])


@router.get("/list", response_model=SentenceListResponse)
async def list_sentences(
    page: int = Query(1, ge=1),
    pageSize: int = Query(20, ge=1, le=100),
    topic: str = Query(""),
    search: str = Query(""),
    admin: dict = Depends(verify_admin),
):
    sentences, total = await sentences_service.list_sentences(
        page=page, pageSize=pageSize, topic=topic, search=search,
    )
    return SentenceListResponse(
        sentences=[SentenceOut(**s) for s in sentences],
        total=total, page=page, pageSize=pageSize,
    )


@router.get("/{sentence_id}")
async def get_sentence(sentence_id: str, admin: dict = Depends(verify_admin)):
    sentence = await sentences_service.get_sentence(sentence_id)
    if not sentence:
        raise HTTPException(status_code=404, detail="Sentence not found")
    return sentence


@router.post("/", status_code=201)
async def create_sentence(body: SentenceCreate, admin: dict = Depends(verify_admin)):
    admin_uid = admin.get("uid", "")
    result = await sentences_service.create_sentence(body.model_dump(), admin_uid)
    return result


@router.put("/{sentence_id}")
async def update_sentence(sentence_id: str, body: SentenceUpdate, admin: dict = Depends(verify_admin)):
    admin_uid = admin.get("uid", "")
    updates = body.model_dump(exclude_none=True)
    result = await sentences_service.update_sentence(sentence_id, updates, admin_uid)
    if not result:
        raise HTTPException(status_code=404, detail="Sentence not found")
    return result


@router.delete("/{sentence_id}")
async def delete_sentence(sentence_id: str, admin: dict = Depends(verify_admin)):
    admin_uid = admin.get("uid", "")
    success = await sentences_service.delete_sentence(sentence_id, admin_uid)
    if not success:
        raise HTTPException(status_code=404, detail="Sentence not found")
    return {"message": "Deleted successfully"}
