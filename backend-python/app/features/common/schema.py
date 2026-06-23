from pydantic import BaseModel, Field
from typing import Optional


class VerifyCodeRequest(BaseModel):
    email: str
    verifyCode: str = Field(..., min_length=6, max_length=6)


class SendVerifyCodeRequest(BaseModel):
    email: str


class MessageResponse(BaseModel):
    message: str


class VerifyCodeResponse(BaseModel):
    message: str
