from pydantic import BaseModel, Field
from typing import Optional, List


class MaterialOut(BaseModel):
    id: str
    title: str
    description: str = ""
    level: str = "A1"
    type: str = "lesson"
    content: str = ""
    previewContent: str = ""
    isPremium: bool = False
    tags: List[str] = []
    order: int = 0
    estimatedMinutes: int = 10
    published: bool = False
    createdBy: str = ""
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None


class MaterialCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = ""
    level: str = Field("A1", pattern=r"^(A1|A2|B1|B2|C1|C2)$")
    type: str = Field("lesson", pattern=r"^(lesson|document|video|exercise|audio)$")
    content: str = ""
    previewContent: str = ""
    isPremium: bool = False
    tags: List[str] = []
    order: int = 0
    estimatedMinutes: int = 10
    published: bool = False


class MaterialUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    level: Optional[str] = Field(None, pattern=r"^(A1|A2|B1|B2|C1|C2)$")
    type: Optional[str] = Field(None, pattern=r"^(lesson|document|video|exercise|audio)$")
    content: Optional[str] = None
    previewContent: Optional[str] = None
    isPremium: Optional[bool] = None
    tags: Optional[List[str]] = None
    order: Optional[int] = None
    estimatedMinutes: Optional[int] = None
    published: Optional[bool] = None


class MaterialListResponse(BaseModel):
    materials: List[MaterialOut]
    total: int
    page: int
    pageSize: int
