from pydantic import BaseModel, Field
from typing import Optional, List
from app.shared.constants import LEADERBOARD_TYPES


class LeaderboardEntryResponse(BaseModel):
    id: str
    userId: str
    displayName: str
    photoURL: str = ""
    score: int
    gameType: str
    updatedAt: Optional[str] = None


class UpsertScoreRequest(BaseModel):
    gameType: str = Field(..., pattern="^(" + "|".join(LEADERBOARD_TYPES) + ")$")
    score: int = Field(..., ge=0)
    displayName: str = Field(..., max_length=50)
    photoURL: str = ""


class LeaderboardResponse(BaseModel):
    leaderboard: List[LeaderboardEntryResponse]
