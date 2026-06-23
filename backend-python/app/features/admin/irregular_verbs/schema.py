from pydantic import BaseModel, Field
from typing import Optional, List


class IrregularVerbOut(BaseModel):
    id: str
    v1: str
    v2: str
    v3: str
    mean: str


class IrregularVerbCreate(BaseModel):
    v1: str = Field(..., min_length=1, max_length=50)
    v2: str = Field(..., min_length=1, max_length=100)
    v3: str = Field(..., min_length=1, max_length=100)
    mean: str = Field(..., min_length=1, max_length=200)


class IrregularVerbUpdate(BaseModel):
    v1: Optional[str] = Field(None, min_length=1, max_length=50)
    v2: Optional[str] = Field(None, min_length=1, max_length=100)
    v3: Optional[str] = Field(None, min_length=1, max_length=100)
    mean: Optional[str] = Field(None, min_length=1, max_length=200)


class IrregularVerbListResponse(BaseModel):
    verbs: List[IrregularVerbOut]
    total: int
    page: int
    pageSize: int


class BulkImportRequest(BaseModel):
    verbs: List[IrregularVerbCreate]


class BulkImportResponse(BaseModel):
    imported: int
    message: str
