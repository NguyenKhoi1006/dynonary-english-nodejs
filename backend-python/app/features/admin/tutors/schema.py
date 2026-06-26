from pydantic import BaseModel, Field
from typing import Optional, List

class TutorAdminListItem(BaseModel):
    uid: str
    userId: str
    name: str
    email: str
    avt: str
    bio: str
    subjects: List[str] = Field(default_factory=list)
    hourlyRate: float = 0.0
    level: str = "intermediate"
    rating: float = 0.0
    totalSessions: int = 0
    totalStudents: int = 0
    totalReviews: int = 0
    isAvailable: bool = True
    applicationStatus: str = "approved"  # pending | approved | rejected
    createdDate: Optional[str] = None

class TutorAdminListResponse(BaseModel):
    tutors: List[TutorAdminListItem]
    total: int
    page: int
    pageSize: int

class TutorAdminDetailResponse(TutorAdminListItem):
    qualifications: List[str] = Field(default_factory=list)
    videoIntro: str = ""
    userEmail: str = ""
    userMembership: str = "free"
    userStatus: str = "active"
