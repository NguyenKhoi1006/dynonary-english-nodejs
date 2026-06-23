from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional

from app.features.admin.dependencies import verify_admin
from app.features.admin.words.schema import WordCreate, WordUpdate, WordOut, WordListResponse
from app.features.admin.words import service as words_service

router = APIRouter(prefix="/words", tags=["Admin - Words"])


@router.get("/list", response_model=WordListResponse)
async def list_words(
    page: int = Query(1, ge=1),
    pageSize: int = Query(20, ge=1, le=100),
    level: str = Query(""),
    type: str = Query(""),
    topic: str = Query(""),
    search: str = Query(""),
    admin: dict = Depends(verify_admin),
):
    words, total = await words_service.list_words(
        page=page, pageSize=pageSize, level=level,
        word_type=type, topic=topic, search=search,
    )
    return WordListResponse(
        words=[WordOut(**w) for w in words],
        total=total, page=page, pageSize=pageSize,
    )


@router.get("/{word_id}")
async def get_word(word_id: str, admin: dict = Depends(verify_admin)):
    word = await words_service.get_word(word_id)
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    return word


@router.post("/", status_code=201)
async def create_word(body: WordCreate, admin: dict = Depends(verify_admin)):
    admin_uid = admin.get("uid", "")
    result = await words_service.create_word(body.model_dump(), admin_uid)
    return result


@router.put("/{word_id}")
async def update_word(word_id: str, body: WordUpdate, admin: dict = Depends(verify_admin)):
    admin_uid = admin.get("uid", "")
    updates = body.model_dump(exclude_none=True)
    result = await words_service.update_word(word_id, updates, admin_uid)
    if not result:
        raise HTTPException(status_code=404, detail="Word not found")
    return result


@router.delete("/{word_id}")
async def delete_word(word_id: str, admin: dict = Depends(verify_admin)):
    admin_uid = admin.get("uid", "")
    success = await words_service.delete_word(word_id, admin_uid)
    if not success:
        raise HTTPException(status_code=404, detail="Word not found")
    return {"message": "Deleted successfully"}
