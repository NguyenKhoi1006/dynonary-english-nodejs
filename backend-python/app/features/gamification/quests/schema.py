from pydantic import BaseModel
from typing import List, Optional


class QuestOut(BaseModel):
    id: str
    title: str
    description: str
    target: int
    xpReward: int
    progress: int = 0
    completed: bool = False


class DailyQuestsResponse(BaseModel):
    date: str
    quests: List[QuestOut]
    totalCompleted: int


class QuestProgressRequest(BaseModel):
    questId: str
    progressDelta: int = 1


class QuestProgressResponse(BaseModel):
    questId: str
    progress: int
    completed: bool
    xpAwarded: int
