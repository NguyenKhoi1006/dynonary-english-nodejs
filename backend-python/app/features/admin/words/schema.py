from pydantic import BaseModel, Field
from typing import Optional, List


class WordOut(BaseModel):
    id: str
    word: str
    mean: str = ""
    type: str = ""
    level: str = ""
    phonetic: str = ""
    specialty: str = ""
    topic: List[str] = []
    examples: List[str] = []
    img: str = ""
    synonyms: str = ""
    note: str = ""
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None


class WordCreate(BaseModel):
    word: str = Field(..., min_length=1, max_length=50)
    mean: str = ""
    type: Optional[str] = None
    level: Optional[str] = None
    phonetic: str = ""
    specialty: Optional[str] = None
    topic: List[str] = []
    examples: List[str] = []
    img: str = ""
    synonyms: str = ""
    note: str = ""


class WordUpdate(BaseModel):
    word: Optional[str] = Field(None, min_length=1, max_length=50)
    mean: Optional[str] = None
    type: Optional[str] = None
    level: Optional[str] = None
    phonetic: Optional[str] = None
    specialty: Optional[str] = None
    topic: Optional[List[str]] = None
    examples: Optional[List[str]] = None
    img: Optional[str] = None
    synonyms: Optional[str] = None
    note: Optional[str] = None


class WordListResponse(BaseModel):
    words: List[WordOut]
    total: int
    page: int
    pageSize: int
