from pydantic import BaseModel
from typing import List, Optional, Any


class SkillNodeOut(BaseModel):
    id: str
    title: str
    description: str
    position: dict
    dependencies: List[str] = []
    status: str = "locked"
    progress: int = 0
    totalLessons: int = 4
    lessonsCompleted: int = 0


class SkillTreeResponse(BaseModel):
    version: int
    nodes: List[SkillNodeOut]


class CompleteLessonRequest(BaseModel):
    nodeId: str


class SkillProgressResponse(BaseModel):
    nodeId: str
    status: str
    progress: int
    xpEarned: int


class AvailableNodesResponse(BaseModel):
    nodeIds: List[str]
