from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional

from app.dependencies import verify_firebase_token
from app.features.scheduling.schema import (
    SetAvailabilityRequest,
    AvailabilityResponse,
    AvailabilitySlot,
    BookingCreate,
    BookingResponse,
    BookingListResponse,
    SessionResponse,
    SessionListResponse,
    SessionNote,
)
from app.features.scheduling import service as scheduling_service
from app.features.tutors import service as tutor_service

router = APIRouter(prefix="/scheduling", tags=["Scheduling"])


@router.post("/availability")
async def set_availability(
    body: SetAvailabilityRequest,
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    tutor = await tutor_service.get_tutor_by_user_id(uid)
    if not tutor:
        raise HTTPException(status_code=403, detail="Chỉ gia sư mới có thể cài đặt lịch")

    result = await scheduling_service.set_availability(
        tutor_uid=tutor["uid"],
        slots=[s.model_dump() for s in body.slots],
    )
    return {"message": "Cập nhật lịch thành công", "uid": result.get("uid")}


@router.get("/availability/{tutorId}", response_model=AvailabilityResponse)
async def get_availability(tutorId: str):
    availability = await scheduling_service.get_availability(tutorId)
    if not availability:
        return AvailabilityResponse(uid="", tutorId=tutorId, slots=[])
    return AvailabilityResponse(**availability)


async def _get_user_info(user_id: str):
    from app.firebase import get_firestore_db
    db = get_firestore_db()
    doc = db.collection("users").document(user_id).get()
    if doc.exists:
        return doc.to_dict()
    return None


@router.post("/book")
async def create_booking(
    body: BookingCreate,
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    profile = await _get_user_info(uid)
    student_name = profile.get("name", "") if profile else ""
    student_avt = profile.get("avt", "") if profile else ""

    booking = await scheduling_service.create_booking(
        student_id=uid,
        student_name=student_name,
        student_avt=student_avt,
        data=body.model_dump(),
    )
    return {"message": "Đặt lịch thành công", "uid": booking.get("uid")}


@router.get("/my-bookings", response_model=BookingListResponse)
async def get_my_bookings(user: dict = Depends(verify_firebase_token)):
    uid = user.get("uid", "")
    bookings = await scheduling_service.get_bookings_for_student(uid)
    return BookingListResponse(
        bookings=[BookingResponse(**b) for b in bookings],
        total=len(bookings),
    )


@router.get("/tutor-bookings", response_model=BookingListResponse)
async def get_tutor_bookings(user: dict = Depends(verify_firebase_token)):
    uid = user.get("uid", "")
    tutor = await tutor_service.get_tutor_by_user_id(uid)
    if not tutor:
        raise HTTPException(status_code=403, detail="Chỉ gia sư mới xem được")

    bookings = await scheduling_service.get_bookings_for_tutor(tutor["uid"])
    return BookingListResponse(
        bookings=[BookingResponse(**b) for b in bookings],
        total=len(bookings),
    )


@router.put("/bookings/{bookingId}/confirm")
async def confirm_booking(
    bookingId: str,
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    tutor = await tutor_service.get_tutor_by_user_id(uid)
    if not tutor:
        raise HTTPException(status_code=403, detail="Chỉ gia sư mới có thể xác nhận")

    session = await scheduling_service.confirm_booking(bookingId)
    if not session:
        raise HTTPException(status_code=404, detail="Không tìm thấy lịch đặt")
    return {"message": "Đã xác nhận lịch học", "sessionUid": session.get("uid")}


@router.put("/bookings/{bookingId}/cancel")
async def cancel_booking(
    bookingId: str,
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    success = await scheduling_service.update_booking_status(bookingId, "cancelled")
    if not success:
        raise HTTPException(status_code=404, detail="Không tìm thấy lịch đặt")
    return {"message": "Đã hủy lịch đặt"}


@router.get("/my-sessions", response_model=SessionListResponse)
async def get_my_sessions(
    role: str = Query("student", pattern=r"^(student|tutor)$"),
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    if role == "tutor":
        tutor = await tutor_service.get_tutor_by_user_id(uid)
        if not tutor:
            raise HTTPException(status_code=403, detail="Không tìm thấy gia sư")
        user_id = tutor["uid"]
    else:
        user_id = uid

    sessions = await scheduling_service.get_sessions_for_user(user_id, role)
    return SessionListResponse(
        sessions=[SessionResponse(**s) for s in sessions],
        total=len(sessions),
    )


@router.get("/sessions/{sessionId}", response_model=SessionResponse)
async def get_session(sessionId: str):
    session = await scheduling_service.get_session(sessionId)
    if not session:
        raise HTTPException(status_code=404, detail="Không tìm thấy buổi học")
    return SessionResponse(**session)


@router.put("/sessions/{sessionId}/complete")
async def complete_session(
    sessionId: str,
    body: SessionNote,
    user: dict = Depends(verify_firebase_token),
):
    success = await scheduling_service.complete_session(sessionId, tutor_note=body.note)
    if not success:
        raise HTTPException(status_code=404, detail="Không tìm thấy buổi học")
    return {"message": "Đã hoàn thành buổi học"}
