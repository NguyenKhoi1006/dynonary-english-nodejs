from typing import Optional, Dict, Any, List
from google.cloud.firestore import SERVER_TIMESTAMP
from app.firebase import get_firestore_db
from app.shared.firestore_helpers import serialize_doc

MESSAGES_COL = "messages"


async def send_message(
    sender_id: str,
    sender_name: str,
    sender_avt: str,
    receiver_id: str,
    content: str,
    session_id: str = "",
) -> Dict[str, Any]:
    db = get_firestore_db()

    receiver_doc = db.collection("users").document(receiver_id).get()
    receiver_name = ""
    receiver_avt = ""
    if receiver_doc.exists:
        receiver_data = receiver_doc.to_dict() or {}
        receiver_name = receiver_data.get("name", "")
        receiver_avt = receiver_data.get("avt", "")

    message = {
        "senderId": sender_id,
        "senderName": sender_name,
        "senderAvt": sender_avt,
        "receiverId": receiver_id,
        "receiverName": receiver_name,
        "receiverAvt": receiver_avt,
        "content": content,
        "sessionId": session_id,
        "isRead": False,
        "createdDate": SERVER_TIMESTAMP,
    }
    doc_ref = db.collection(MESSAGES_COL).document()
    doc_ref.set(message)
    message["uid"] = doc_ref.id
    return serialize_doc(message)


async def get_conversations(user_id: str) -> List[Dict[str, Any]]:
    db = get_firestore_db()

    sent = db.collection(MESSAGES_COL).where("senderId", "==", user_id).order_by("createdDate", direction="DESCENDING").limit(1).stream()
    received = db.collection(MESSAGES_COL).where("receiverId", "==", user_id).order_by("createdDate", direction="DESCENDING").limit(1).stream()

    user_ids = set()
    for doc in sent:
        data = doc.to_dict() or {}
        user_ids.add(data.get("receiverId", ""))

    for doc in received:
        data = doc.to_dict() or {}
        user_ids.add(data.get("senderId", ""))

    conversations = []
    for other_id in user_ids:
        last = _get_last_message(user_id, other_id)
        if last:
            unread = _get_unread_count(user_id, other_id)
            is_other_sender = last.get("senderId") == other_id
            conversations.append({
                "userId": other_id,
                "userName": last.get("senderName") if is_other_sender else last.get("receiverName"),
                "userAvt": last.get("senderAvt") if is_other_sender else last.get("receiverAvt"),
                "lastMessage": last.get("content", ""),
                "lastMessageDate": last.get("createdDate"),
                "unreadCount": unread,
            })

    conversations.sort(key=lambda c: c.get("lastMessageDate") or "", reverse=True)
    return conversations


async def get_messages(user_id: str, other_id: str) -> List[Dict[str, Any]]:
    db = get_firestore_db()

    sent = db.collection(MESSAGES_COL).where("senderId", "==", user_id).where("receiverId", "==", other_id).order_by("createdDate").stream()
    received = db.collection(MESSAGES_COL).where("senderId", "==", other_id).where("receiverId", "==", user_id).order_by("createdDate").stream()

    all_msgs = []
    for doc in sent:
        data = serialize_doc(doc.to_dict())
        data["uid"] = doc.id
        all_msgs.append(data)

    for doc in received:
        data = serialize_doc(doc.to_dict())
        data["uid"] = doc.id
        all_msgs.append(data)

    all_msgs.sort(key=lambda m: m.get("createdDate") or "")

    _mark_as_read(user_id, other_id)
    return all_msgs


async def mark_as_read(user_id: str, other_id: str) -> None:
    _mark_as_read(user_id, other_id)


def _mark_as_read(user_id: str, other_id: str) -> None:
    db = get_firestore_db()
    docs = db.collection(MESSAGES_COL).where("senderId", "==", other_id).where("receiverId", "==", user_id).where("isRead", "==", False).stream()
    for doc in docs:
        db.collection(MESSAGES_COL).document(doc.id).update({"isRead": True})


def _get_last_message(user_id: str, other_id: str) -> Optional[Dict[str, Any]]:
    db = get_firestore_db()
    sent = db.collection(MESSAGES_COL).where("senderId", "==", user_id).where("receiverId", "==", other_id).order_by("createdDate", direction="DESCENDING").limit(1).stream()
    received = db.collection(MESSAGES_COL).where("senderId", "==", other_id).where("receiverId", "==", user_id).order_by("createdDate", direction="DESCENDING").limit(1).stream()

    last = None
    for doc in sent:
        data = serialize_doc(doc.to_dict())
        data["uid"] = doc.id
        if last is None or data.get("createdDate", "") > last.get("createdDate", ""):
            last = data
    for doc in received:
        data = serialize_doc(doc.to_dict())
        data["uid"] = doc.id
        if last is None or data.get("createdDate", "") > last.get("createdDate", ""):
            last = data
    return last


def _get_unread_count(user_id: str, other_id: str) -> int:
    db = get_firestore_db()
    docs = db.collection(MESSAGES_COL).where("senderId", "==", other_id).where("receiverId", "==", user_id).where("isRead", "==", False).stream()
    return sum(1 for _ in docs)
