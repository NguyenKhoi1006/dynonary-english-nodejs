from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class AvailabilitySlot(BaseModel):
    dayOfWeek: str = Field(..., pattern=r"^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$")
    startTime: str = Field(..., pattern=r"^\d{2}:\d{2}$")
    endTime: str = Field(..., pattern=r"^\d{2}:\d{2}$")


class SetAvailabilityRequest(BaseModel):
    slots: List[AvailabilitySlot]


class AvailabilityResponse(BaseModel):
    uid: str
    tutorId: str
    slots: List[AvailabilitySlot]


class BookingCreate(BaseModel):
    tutorId: str
    courseId: Optional[str] = None
    date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    startTime: str = Field(..., pattern=r"^\d{2}:\d{2}$")
    endTime: str = Field(..., pattern=r"^\d{2}:\d{2}$")
    note: str = ""


class BookingResponse(BaseModel):
    uid: str
    studentId: str
    studentName: str
    studentAvt: str
    tutorId: str
    tutorName: str
    tutorAvt: str
    courseId: Optional[str] = None
    courseName: Optional[str] = None
    date: str
    startTime: str
    endTime: str
    status: str = "pending"
    note: str = ""
    createdDate: Optional[str] = None

    class Config:
        from_attributes = True


class BookingListResponse(BaseModel):
    bookings: List[BookingResponse]
    total: int


class SessionNote(BaseModel):
    note: str = Field("", max_length=5000)
    rating: Optional[int] = Field(None, ge=1, le=5)


class SessionResponse(BaseModel):
    uid: str
    studentId: str
    studentName: str
    studentAvt: str
    tutorId: str
    tutorName: str
    tutorAvt: str
    courseId: Optional[str] = None
    courseName: Optional[str] = None
    date: str
    startTime: str
    endTime: str
    status: str = "completed"
    note: str = ""
    tutorNote: str = ""
    studentNote: str = ""
    createdDate: Optional[str] = None

    class Config:
        from_attributes = True


class SessionListResponse(BaseModel):
    sessions: List[SessionResponse]
    total: int
