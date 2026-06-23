from pydantic import BaseModel, Field
from typing import Optional, List


class BlogOut(BaseModel):
    id: str
    title: str
    content: str = ""
    description: str = ""
    type: str = "grammar"
    tags: List[str] = []
    level: str = ""
    image: str = ""
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None


class BlogCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    content: str = ""
    description: str = ""
    type: str = Field("grammar", pattern=r"^(grammar|blog)$")
    tags: List[str] = []
    level: str = ""
    image: str = ""


class BlogUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    content: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = Field(None, pattern=r"^(grammar|blog)$")
    tags: Optional[List[str]] = None
    level: Optional[str] = None
    image: Optional[str] = None


class BlogListResponse(BaseModel):
    posts: List[BlogOut]
    total: int
    page: int
    pageSize: int
