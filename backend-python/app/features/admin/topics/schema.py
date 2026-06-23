from pydantic import BaseModel, Field
from typing import Optional, List


class TopicOut(BaseModel):
    id: str
    key: str
    title: str
    type: str = "vocab"
    icon: str = ""
    order: int = 0
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None


class TopicCreate(BaseModel):
    key: str = Field(..., min_length=1, max_length=10)
    title: str = Field(..., min_length=1, max_length=100)
    type: str = Field("vocab", pattern=r"^(vocab|sentence)$")
    icon: str = ""
    order: int = 0


class TopicUpdate(BaseModel):
    key: Optional[str] = Field(None, min_length=1, max_length=10)
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    type: Optional[str] = Field(None, pattern=r"^(vocab|sentence)$")
    icon: Optional[str] = None
    order: Optional[int] = None


class TopicListResponse(BaseModel):
    topics: List[TopicOut]
    total: int
    page: int
    pageSize: int
