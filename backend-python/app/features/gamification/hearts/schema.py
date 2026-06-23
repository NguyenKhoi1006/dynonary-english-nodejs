from pydantic import BaseModel
from typing import Optional


class HeartsResponse(BaseModel):
    hearts: int
    maxHearts: int
    nextRechargeAt: Optional[str] = None
    fullyCharged: bool


class HeartConsumeRequest(BaseModel):
    count: int = 1


class HeartConsumeResponse(BaseModel):
    hearts: int
    success: bool
    message: str


class HeartRefillResponse(BaseModel):
    hearts: int
    maxHearts: int
    message: str
