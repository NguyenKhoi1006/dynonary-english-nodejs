from pydantic import BaseModel, Field
from typing import Optional, List


class MaterialPublic(BaseModel):
    id: str
    title: str
    description: str = ""
    level: str
    type: str
    previewContent: str = ""
    isPremium: bool = False
    tags: List[str] = []
    order: int = 0
    estimatedMinutes: int = 10
    published: bool = False


class MaterialDetail(MaterialPublic):
    content: str = ""


class MaterialListResponse(BaseModel):
    materials: List[MaterialPublic]
    total: int
