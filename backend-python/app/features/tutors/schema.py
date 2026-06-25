from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class TutorProfileBase(BaseModel):
    bio: str = ""
    subjects: List[str] = Field(default_factory=list)
    hourlyRate: float = Field(default=0.0, ge=0)
    level: str = "intermediate"
    qualifications: List[str] = Field(default_factory=list)
    videoIntro: str = ""
    isAvailable: bool = True


class TutorProfileCreate(TutorProfileBase):
    pass


class TutorProfileUpdate(BaseModel):
    bio: Optional[str] = None
    subjects: Optional[List[str]] = None
    hourlyRate: Optional[float] = None
    level: Optional[str] = None
    qualifications: Optional[List[str]] = None
    videoIntro: Optional[str] = None
    isAvailable: Optional[bool] = None


class TutorProfileResponse(TutorProfileBase):
    uid: str
    userId: str
    name: str
    email: str
    avt: str
    rating: float = 0.0
    totalReviews: int = 0
    totalSessions: int = 0
    totalStudents: int = 0
    createdDate: Optional[str] = None

    class Config:
        from_attributes = True


class TutorListItem(BaseModel):
    uid: str
    userId: str
    name: str
    avt: str
    subjects: List[str] = Field(default_factory=list)
    hourlyRate: float = 0.0
    rating: float = 0.0
    totalReviews: int = 0
    totalSessions: int = 0
    level: str = "intermediate"
    isAvailable: bool = True


class TutorListResponse(BaseModel):
    tutors: List[TutorListItem]
    total: int
    page: int
    pageSize: int


class TutorApplicationRequest(BaseModel):
    bio: str = Field(..., min_length=10, max_length=5000)
    subjects: List[str] = Field(..., min_length=1)
    hourlyRate: float = Field(..., ge=0)
    level: str = "intermediate"
    qualifications: List[str] = Field(default_factory=list)
    videoIntro: str = ""
