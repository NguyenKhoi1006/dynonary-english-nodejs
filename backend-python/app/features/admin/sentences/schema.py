from pydantic import BaseModel, Field
from typing import Optional, List


class SentenceOut(BaseModel):
    id: str
    sentence: str
    meaning: str = ""
    topic: str = ""
    note: str = ""
    createdAt: Optional[str] = None


class SentenceCreate(BaseModel):
    sentence: str = Field(..., min_length=1, max_length=500)
    meaning: str = ""
    topic: str = ""
    note: str = ""


class SentenceUpdate(BaseModel):
    sentence: Optional[str] = Field(None, min_length=1, max_length=500)
    meaning: Optional[str] = None
    topic: Optional[str] = None
    note: Optional[str] = None


class SentenceListResponse(BaseModel):
    sentences: List[SentenceOut]
    total: int
    page: int
    pageSize: int
