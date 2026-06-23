from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime


class UserProfileResponse(BaseModel):
    uid: str
    email: str
    name: str = ""
    username: str = ""
    avt: str = ""
    coin: int = 0
    favoriteList: List[str] = []
    createdDate: Optional[str] = None
    provider: str = "password"
    role: str = "learner"
    membership: str = "free"
    level: Optional[str] = None
    status: str = "active"
    xp: int = 0


class UpdateProfileRequest(BaseModel):
    name: Optional[str] = Field(None, max_length=50)
    username: Optional[str] = Field(None, max_length=50)


class ToggleFavoriteRequest(BaseModel):
    word: str
    isAdd: bool = False


class UpdateCoinRequest(BaseModel):
    newCoin: int = Field(..., ge=0)


class UpdateAvtRequest(BaseModel):
    avtSrc: str


class MessageResponse(BaseModel):
    message: str


class VerifyCodeRequest(BaseModel):
    email: str
    verifyCode: str
    password: str = Field(..., min_length=6)
