from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class LessonItem(BaseModel):
    title: str = Field(..., max_length=200)
    description: str = ""
    contentType: str = Field(default="video", pattern=r"^(video|pdf|text|link)$")
    contentUrl: str = ""
    duration: int = 0
    order: int = 0
    isFreePreview: bool = False


class CourseBase(BaseModel):
    title: str = Field(..., max_length=200)
    description: str = Field(..., max_length=5000)
    subject: str = ""
    level: str = "beginner"
    price: float = Field(default=0.0, ge=0)
    thumbnail: str = ""
    maxStudents: int = Field(default=0, ge=0)
    isPublished: bool = False


class CourseCreate(CourseBase):
    lessons: List[LessonItem] = Field(default_factory=list)


class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    subject: Optional[str] = None
    level: Optional[str] = None
    price: Optional[float] = None
    thumbnail: Optional[str] = None
    maxStudents: Optional[int] = None
    isPublished: Optional[bool] = None


class LessonResponse(LessonItem):
    uid: str
    courseId: str
    createdDate: Optional[str] = None


class CourseResponse(CourseBase):
    uid: str
    tutorId: str
    tutorName: str
    tutorAvt: str
    totalLessons: int = 0
    totalStudents: int = 0
    totalDuration: int = 0
    rating: float = 0.0
    createdDate: Optional[str] = None
    lessons: List[LessonResponse] = Field(default_factory=list)

    class Config:
        from_attributes = True


class CourseListItem(BaseModel):
    uid: str
    tutorId: str
    tutorName: str
    tutorAvt: str
    title: str
    subject: str
    level: str
    price: float
    thumbnail: str
    totalLessons: int
    totalStudents: int
    rating: float
    isPublished: bool


class CourseListResponse(BaseModel):
    courses: List[CourseListItem]
    total: int
    page: int
    pageSize: int


class LessonCreate(BaseModel):
    title: str = Field(..., max_length=200)
    description: str = ""
    contentType: str = "video"
    contentUrl: str = ""
    duration: int = 0
    order: int = 0
    isFreePreview: bool = False


class LessonUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    contentType: Optional[str] = None
    contentUrl: Optional[str] = None
    duration: Optional[int] = None
    order: Optional[int] = None
    isFreePreview: Optional[bool] = None
