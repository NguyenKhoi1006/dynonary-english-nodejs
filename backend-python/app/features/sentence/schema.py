from pydantic import BaseModel, Field
from typing import Optional, List


class SentenceResponse(BaseModel):
    id: str
    sentence: str
    meaning: str
    topic: str = ""
    note: str = ""


class SentenceListResponse(BaseModel):
    sentenceList: List[SentenceResponse]
