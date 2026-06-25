from pydantic import BaseModel, Field
from typing import Optional, List


class ReviewCreate(BaseModel):
    tutorId: str
    sessionId: str
    rating: int = Field(..., ge=1, le=5)
    comment: str = Field("", max_length=2000)


class ReviewResponse(BaseModel):
    uid: str
    studentId: str
    studentName: str
    studentAvt: str
    tutorId: str
    sessionId: str
    rating: int
    comment: str
    createdDate: Optional[str] = None

    class Config:
        from_attributes = True


class ReviewListResponse(BaseModel):
    reviews: List[ReviewResponse]
    total: int
    averageRating: float = 0.0
    ratingCounts: dict = {
        "1": 0, "2": 0, "3": 0, "4": 0, "5": 0
    }
