from pydantic import BaseModel, Field
from typing import Optional, List, Dict


class QuestionPublic(BaseModel):
    id: str
    questionText: str
    options: List[str]
    type: str = "grammar"
    level: Optional[str] = None


class PlacementTestOut(BaseModel):
    id: str
    title: str
    description: str = ""
    type: str = "initial"
    timeLimit: int
    questions: List[QuestionPublic]


class SubmitAnswer(BaseModel):
    questionId: str
    selectedIndex: int


class PlacementSubmit(BaseModel):
    testId: str
    answers: List[SubmitAnswer]


class SectionScore(BaseModel):
    correct: int
    total: int
    percentage: float


class PlacementResult(BaseModel):
    score: int
    totalQuestions: int
    percentage: float
    resultLevel: str
    passed: bool
    details: List[dict]
    sectionBreakdown: Dict[str, SectionScore] = {}
    canDo: str = ""


class AttemptHistory(BaseModel):
    id: str
    testId: str
    type: str
    score: int
    resultLevel: str
    passed: bool
    completedAt: Optional[str] = None
