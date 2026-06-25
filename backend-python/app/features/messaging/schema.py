from pydantic import BaseModel, Field
from typing import Optional, List


class MessageCreate(BaseModel):
    receiverId: str
    content: str = Field(..., min_length=1, max_length=5000)
    sessionId: Optional[str] = None


class MessageResponse(BaseModel):
    uid: str
    senderId: str
    senderName: str
    senderAvt: str
    receiverId: str
    receiverName: str
    receiverAvt: str
    content: str
    sessionId: str = ""
    isRead: bool = False
    createdDate: Optional[str] = None

    class Config:
        from_attributes = True


class ConversationResponse(BaseModel):
    userId: str
    userName: str
    userAvt: str
    lastMessage: str
    lastMessageDate: Optional[str] = None
    unreadCount: int = 0


class ConversationListResponse(BaseModel):
    conversations: List[ConversationResponse]


class MessageListResponse(BaseModel):
    messages: List[MessageResponse]
    total: int
