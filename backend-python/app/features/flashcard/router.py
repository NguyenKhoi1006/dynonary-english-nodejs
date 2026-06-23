from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.features.flashcard.schema import (
    FlashcardResponse,
    CreateFlashcardRequest,
    FlashcardListResponse,
)
from app.features.flashcard import service as flashcard_service
from app.dependencies import verify_firebase_token

router = APIRouter()


@router.get("/", response_model=FlashcardListResponse)
async def get_flashcards(user: dict = Depends(verify_firebase_token)):
    uid = user.get("uid", "")
    flashcard_list = await flashcard_service.get_flashcards(uid)
    return {"flashcardList": flashcard_list}


@router.post("/add", response_model=dict)
async def add_flashcard(
    body: CreateFlashcardRequest,
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    doc_id = await flashcard_service.add_flashcard(uid, body.word, body.meaning)
    return {"message": "success", "id": doc_id}


@router.delete("/{flashcard_id}", response_model=dict)
async def delete_flashcard(
    flashcard_id: str,
    user: dict = Depends(verify_firebase_token),
):
    success = await flashcard_service.delete_flashcard(flashcard_id)
    if not success:
        raise HTTPException(status_code=404, detail="Flashcard not found")
    return {"message": "success"}
