from pydantic import BaseModel
from typing import Optional, List


class BlogPostResponse(BaseModel):
    id: str
    title: str
    content: str
    excerpt: str = ""
    imageUrl: str = ""
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None


class BlogListResponse(BaseModel):
    blogList: List[BlogPostResponse]
