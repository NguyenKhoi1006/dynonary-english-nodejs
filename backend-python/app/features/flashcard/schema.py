from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class FlashcardResponse(BaseModel):
    id: str
    userId: str
    word: str
    meaning: str
    createdAt: Optional[str] = None


class CreateFlashcardRequest(BaseModel):
    word: str = Field(..., max_length=100)
    meaning: str = Field(..., max_length=200)


class FlashcardListResponse(BaseModel):
    flashcardList: List[FlashcardResponse]
