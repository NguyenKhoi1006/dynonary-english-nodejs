from fastapi import APIRouter, HTTPException, Depends, Query

from app.dependencies import verify_firebase_token, verify_role

STUDENT_OR_TUTOR = Depends(verify_role({"student", "tutor"}))
from app.features.messaging.schema import (
    MessageCreate,
    MessageResponse,
    MessageListResponse,
    ConversationResponse,
    ConversationListResponse,
)
from app.features.messaging import service as messaging_service

router = APIRouter(prefix="/messaging", tags=["Messaging"])


@router.post("/send")
async def send_message(
    body: MessageCreate,
    user: dict = STUDENT_OR_TUTOR,
):
    uid = user.get("uid", "")
    profile = await _get_user_info(uid)
    sender_name = profile.get("name", "") if profile else ""
    sender_avt = profile.get("avt", "") if profile else ""

    msg = await messaging_service.send_message(
        sender_id=uid,
        sender_name=sender_name,
        sender_avt=sender_avt,
        receiver_id=body.receiverId,
        content=body.content,
        session_id=body.sessionId or "",
    )
    return {"message": "Gửi tin nhắn thành công", "uid": msg.get("uid")}


@router.get("/conversations", response_model=ConversationListResponse)
async def get_conversations(user: dict = STUDENT_OR_TUTOR):
    uid = user.get("uid", "")
    conversations = await messaging_service.get_conversations(uid)
    return ConversationListResponse(
        conversations=[ConversationResponse(**c) for c in conversations],
    )


@router.get("/messages/{otherId}", response_model=MessageListResponse)
async def get_messages(
    otherId: str,
    user: dict = STUDENT_OR_TUTOR,
):
    uid = user.get("uid", "")
    messages = await messaging_service.get_messages(uid, otherId)
    return MessageListResponse(
        messages=[MessageResponse(**m) for m in messages],
        total=len(messages),
    )


@router.put("/read/{otherId}")
async def mark_as_read(
    otherId: str,
    user: dict = STUDENT_OR_TUTOR,
):
    uid = user.get("uid", "")
    await messaging_service.mark_as_read(uid, otherId)
    return {"message": "Đã đánh dấu đã đọc"}


async def _get_user_info(user_id: str):
    from app.firebase import get_firestore_db
    db = get_firestore_db()
    doc = db.collection("users").document(user_id).get()
    if doc.exists:
        return doc.to_dict()
    return None
