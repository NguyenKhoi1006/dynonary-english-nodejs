from pydantic import BaseModel
from typing import Optional, List


class AchievementOut(BaseModel):
    id: str
    title: str
    description: str
    icon: str
    xpReward: int
    unlockedAt: Optional[str] = None
    progress: int = 0
    target: int = 1


class AchievementListResponse(BaseModel):
    achievements: List[AchievementOut]
    totalXpFromAchievements: int


class CheckAchievementsRequest(BaseModel):
    eventType: str
    eventValue: int = 1


class CheckAchievementsResponse(BaseModel):
    newAchievements: List[AchievementOut]
    xpAwarded: int
