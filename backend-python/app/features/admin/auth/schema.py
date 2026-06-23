from pydantic import BaseModel, EmailStr


class AdminLoginRequest(BaseModel):
    email: str
    password: str


class AdminLoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    uid: str
    name: str
    email: str
    avt: str
    role: str = "admin"


class AdminRefreshRequest(BaseModel):
    refresh_token: str


class AdminRefreshResponse(BaseModel):
    access_token: str
    refresh_token: str
