from pydantic import BaseModel, Field
from typing import Optional, List
from app.shared.constants import WORD_TYPES, WORD_LEVELS


class WordResponse(BaseModel):
    id: str
    word: str
    mean: str
    type: str
    level: str
    phonetic: str = ""
    examples: List[str] = []
    picture: Optional[str] = None
    specialty: str = "0"
    topics: List[str] = []
    synonyms: List[str] = []
    antonyms: List[str] = []
    note: str = ""
    isChecked: bool = False


class WordPackResponse(BaseModel):
    packList: List[WordResponse]
    total: int


class WordSearchResponse(BaseModel):
    list: List[WordResponse]


class WordDetailResponse(BaseModel):
    wordDetails: Optional[WordResponse] = None


class WordExistenceResponse(BaseModel):
    isExist: bool


class ContributeWordRequest(BaseModel):
    word: str = Field(..., max_length=50)
    mean: str = Field(..., max_length=100)
    type: str = Field(default="", pattern="^(" + "|".join(WORD_TYPES) + ")$")
    phonetic: str = Field(default="", max_length=50)
    examples: Optional[List[str]] = None
    picture: Optional[str] = None
    specialty: Optional[str] = "0"
    note: Optional[str] = ""
