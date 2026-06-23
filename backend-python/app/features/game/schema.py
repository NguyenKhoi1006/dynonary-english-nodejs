from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.shared.constants import GAME_TYPES


class GameResultResponse(BaseModel):
    id: str
    userId: str
    gameType: str
    score: int
    correctCount: int
    totalQuestions: int
    playedAt: Optional[str] = None


class SaveGameRequest(BaseModel):
    gameType: str = Field(..., pattern="^(" + "|".join(GAME_TYPES) + ")$")
    score: int = Field(..., ge=0)
    correctCount: int = Field(..., ge=0)
    totalQuestions: int = Field(..., ge=1)


class GameResultListResponse(BaseModel):
    results: List[GameResultResponse]
