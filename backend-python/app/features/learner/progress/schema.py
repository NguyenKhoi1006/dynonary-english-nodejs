from pydantic import BaseModel, Field
from typing import Optional, List


class CompleteMaterialRequest(BaseModel):
    materialId: str


class LevelUpSubmit(BaseModel):
    testId: str


class ProgressOut(BaseModel):
    level: str
    status: str = "locked"
    progress: int = 0
    materialsCompleted: List[str] = []
    testsPassed: List[str] = []
    levelUpAttempts: int = 0


class UserProgressResponse(BaseModel):
    userId: str
    levels: dict  # level -> ProgressOut
    totalXp: int = 0
    totalStudyDays: int = 0
    currentLevel: Optional[str] = None


class LevelUpResult(BaseModel):
    passed: bool
    score: int
    totalQuestions: int
    percentage: float
    newLevel: Optional[str] = None
    message: str
