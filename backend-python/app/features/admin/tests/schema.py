from pydantic import BaseModel, Field
from typing import Optional, List


class QuestionSchema(BaseModel):
    id: str = ""
    questionText: str
    options: List[str]
    correctAnswer: int = Field(..., ge=0, le=3)
    type: str = Field("grammar", pattern=r"^(grammar|vocabulary|reading|listening)$")
    level: Optional[str] = None


class TestOut(BaseModel):
    id: str
    title: str
    description: str = ""
    level: str = "A1"
    type: str = "practice"
    timeLimit: int = 15
    passScore: int = 70
    questions: List[QuestionSchema] = []
    isPremium: bool = False
    createdBy: str = ""
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None
    published: bool = False


class TestCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = ""
    level: str = Field("A1", pattern=r"^(A1|A2|B1|B2|C1|C2)$")
    type: str = Field("practice", pattern=r"^(practice|assessment|level_up)$")
    timeLimit: int = Field(15, ge=1, le=180)
    passScore: int = Field(70, ge=0, le=100)
    questions: List[QuestionSchema] = []
    isPremium: bool = False
    published: bool = False


class TestUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    level: Optional[str] = Field(None, pattern=r"^(A1|A2|B1|B2|C1|C2)$")
    type: Optional[str] = Field(None, pattern=r"^(practice|assessment|level_up)$")
    timeLimit: Optional[int] = Field(None, ge=1, le=180)
    passScore: Optional[int] = Field(None, ge=0, le=100)
    questions: Optional[List[QuestionSchema]] = None
    isPremium: Optional[bool] = None
    published: Optional[bool] = None


class TestListResponse(BaseModel):
    tests: List[TestOut]
    total: int
    page: int
    pageSize: int
