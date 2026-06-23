from pydantic import BaseModel
from typing import Optional


class CheckInResponse(BaseModel):
    message: str
    streak: int
    longestStreak: int
    xpEarned: int
    totalXp: int


class StreakResponse(BaseModel):
    streak: int
    longestStreak: int
    lastCheckIn: Optional[str] = None
    frozen: bool = False
