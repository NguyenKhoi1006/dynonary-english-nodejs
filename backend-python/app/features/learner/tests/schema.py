from pydantic import BaseModel
from typing import Optional, List


class TestPublic(BaseModel):
    id: str
    title: str
    description: str = ""
    level: str
    type: str
    timeLimit: int = 15
    passScore: int = 70
    questions: List[dict] = []
    published: bool = False


class TestListResponse(BaseModel):
    tests: List[TestPublic]
    total: int
