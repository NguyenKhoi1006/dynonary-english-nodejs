from pydantic import BaseModel, Field
from typing import Optional, List


class PlacementQuestionSchema(BaseModel):
    id: str = ""
    questionText: str
    options: List[str]
    correctAnswer: int = Field(..., ge=0, le=3)
    type: str = Field("grammar", pattern=r"^(grammar|vocabulary|reading|listening)$")
    level: Optional[str] = None


class PlacementTestOut(BaseModel):
    id: str
    title: str
    description: str = ""
    type: str = "initial"
    timeLimit: int = 30
    passScore: int = 70
    questions: List[PlacementQuestionSchema] = []
    createdBy: str = ""
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None


class PlacementTestCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = ""
    type: str = Field("initial", pattern=r"^(initial|placement)$")
    timeLimit: int = Field(30, ge=1, le=180)
    passScore: int = Field(70, ge=0, le=100)
    questions: List[PlacementQuestionSchema] = []


class PlacementTestUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    type: Optional[str] = Field(None, pattern=r"^(initial|placement)$")
    timeLimit: Optional[int] = Field(None, ge=1, le=180)
    passScore: Optional[int] = Field(None, ge=0, le=100)
    questions: Optional[List[PlacementQuestionSchema]] = None


class PlacementTestListResponse(BaseModel):
    tests: List[PlacementTestOut]
    total: int
