from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class UserListItem(BaseModel):
    uid: str
    email: str
    name: str = ""
    username: str = ""
    avt: str = ""
    coin: int = 0
    role: str = "student"
    membership: str = "free"
    level: Optional[str] = None
    status: str = "active"
    xp: int = 0
    createdDate: Optional[str] = None
    provider: str = "password"
    lastActiveAt: Optional[str] = None


class UserListResponse(BaseModel):
    users: List[UserListItem]
    total: int
    page: int
    pageSize: int


class UpdateUserRequest(BaseModel):
    name: Optional[str] = Field(None, max_length=50)
    username: Optional[str] = Field(None, max_length=50)
    role: Optional[str] = None  # "student" | "tutor" | "admin"
    level: Optional[str] = None  # A1-C2 or null to reset
    membership: Optional[str] = None  # "free" | "premium"
    status: Optional[str] = None  # "active" | "banned"


class PremiumGrantRequest(BaseModel):
    durationDays: int = Field(30, ge=1, le=3650)  # 1 day to 10 years


class BanActionResponse(BaseModel):
    message: str
    uid: str
    status: str
