from typing import Optional, Dict, Any, List
from google.cloud.firestore import SERVER_TIMESTAMP
from app.firebase import get_firestore_db
from app.shared.firestore_helpers import serialize_doc

AVAILABILITY_COL = "availability"
BOOKINGS_COL = "bookings"
SESSIONS_COL = "sessions"


async def set_availability(tutor_uid: str, slots: List[Dict[str, str]]) -> Dict[str, Any]:
    db = get_firestore_db()

    existing = db.collection(AVAILABILITY_COL).where("tutorId", "==", tutor_uid).limit(1).stream()
    doc_id = None
    for doc in existing:
        doc_id = doc.id

    data = {
        "tutorId": tutor_uid,
        "slots": slots,
        "updatedDate": SERVER_TIMESTAMP,
    }

    if doc_id:
        db.collection(AVAILABILITY_COL).document(doc_id).update(data)
    else:
        data["createdDate"] = SERVER_TIMESTAMP
        doc_ref = db.collection(AVAILABILITY_COL).document()
        doc_ref.set(data)
        doc_id = doc_ref.id

    data["uid"] = doc_id
    return serialize_doc(data)


async def get_availability(tutor_uid: str) -> Optional[Dict[str, Any]]:
    db = get_firestore_db()
    docs = db.collection(AVAILABILITY_COL).where("tutorId", "==", tutor_uid).limit(1).stream()
    for doc in docs:
        data = serialize_doc(doc.to_dict())
        data["uid"] = doc.id
        return data
    return None


async def get_tutor_availability_by_tutor_id(tutor_id: str) -> Optional[Dict[str, Any]]:
    return await get_availability(tutor_id)


async def create_booking(
    student_id: str,
    student_name: str,
    student_avt: str,
    data: Dict[str, Any],
) -> Dict[str, Any]:
    db = get_firestore_db()
    tutor_uid = data.get("tutorId", "")

    tutor_doc = db.collection("tutors").document(tutor_uid).get()
    tutor_name = ""
    tutor_avt = ""
    if tutor_doc.exists:
        tutor_data = tutor_doc.to_dict() or {}
        tutor_name = tutor_data.get("name", "")
        tutor_avt = tutor_data.get("avt", "")

    course_name = ""
    course_id = data.get("courseId")
    if course_id:
        course_doc = db.collection("courses").document(course_id).get()
        if course_doc.exists:
            course_name = (course_doc.to_dict() or {}).get("title", "")

    booking = {
        "studentId": student_id,
        "studentName": student_name,
        "studentAvt": student_avt,
        "tutorId": tutor_uid,
        "tutorName": tutor_name,
        "tutorAvt": tutor_avt,
        "courseId": course_id or "",
        "courseName": course_name,
        "date": data.get("date", ""),
        "startTime": data.get("startTime", ""),
        "endTime": data.get("endTime", ""),
        "status": "pending",
        "note": data.get("note", ""),
        "createdDate": SERVER_TIMESTAMP,
    }

    doc_ref = db.collection(BOOKINGS_COL).document()
    doc_ref.set(booking)
    booking["uid"] = doc_ref.id
    return serialize_doc(booking)


async def update_booking_status(booking_id: str, status: str) -> bool:
    db = get_firestore_db()
    doc_ref = db.collection(BOOKINGS_COL).document(booking_id)
    doc = doc_ref.get()
    if not doc.exists:
        return False
    doc_ref.update({"status": status})
    return True


async def get_bookings_for_student(student_id: str) -> List[Dict[str, Any]]:
    db = get_firestore_db()
    docs = db.collection(BOOKINGS_COL).where("studentId", "==", student_id).order_by("createdDate", direction="DESCENDING").stream()
    results = []
    for doc in docs:
        data = serialize_doc(doc.to_dict())
        data["uid"] = doc.id
        results.append(data)
    return results


async def get_bookings_for_tutor(tutor_uid: str) -> List[Dict[str, Any]]:
    db = get_firestore_db()
    docs = db.collection(BOOKINGS_COL).where("tutorId", "==", tutor_uid).order_by("createdDate", direction="DESCENDING").stream()
    results = []
    for doc in docs:
        data = serialize_doc(doc.to_dict())
        data["uid"] = doc.id
        results.append(data)
    return results


async def confirm_booking(booking_id: str) -> Optional[Dict[str, Any]]:
    db = get_firestore_db()
    doc_ref = db.collection(BOOKINGS_COL).document(booking_id)
    doc = doc_ref.get()
    if not doc.exists:
        return None

    doc_ref.update({"status": "confirmed"})
    booking_data = serialize_doc(doc.to_dict())
    booking_data["uid"] = doc.id

    session = {
        "studentId": booking_data.get("studentId", ""),
        "studentName": booking_data.get("studentName", ""),
        "studentAvt": booking_data.get("studentAvt", ""),
        "tutorId": booking_data.get("tutorId", ""),
        "tutorName": booking_data.get("tutorName", ""),
        "tutorAvt": booking_data.get("tutorAvt", ""),
        "courseId": booking_data.get("courseId", ""),
        "courseName": booking_data.get("courseName", ""),
        "date": booking_data.get("date", ""),
        "startTime": booking_data.get("startTime", ""),
        "endTime": booking_data.get("endTime", ""),
        "status": "confirmed",
        "note": booking_data.get("note", ""),
        "tutorNote": "",
        "studentNote": "",
        "createdDate": SERVER_TIMESTAMP,
    }
    session_ref = db.collection(SESSIONS_COL).document()
    session_ref.set(session)
    session["uid"] = session_ref.id
    return serialize_doc(session)


async def get_sessions_for_user(user_id: str, role: str) -> List[Dict[str, Any]]:
    db = get_firestore_db()
    field = "studentId" if role == "student" else "tutorId"
    docs = db.collection(SESSIONS_COL).where(field, "==", user_id).order_by("date", direction="DESCENDING").stream()
    results = []
    for doc in docs:
        data = serialize_doc(doc.to_dict())
        data["uid"] = doc.id
        results.append(data)
    return results


async def get_session(session_id: str) -> Optional[Dict[str, Any]]:
    db = get_firestore_db()
    doc = db.collection(SESSIONS_COL).document(session_id).get()
    if not doc.exists:
        return None
    data = serialize_doc(doc.to_dict())
    data["uid"] = doc.id
    return data


async def update_session(session_id: str, updates: Dict[str, Any]) -> bool:
    db = get_firestore_db()
    doc_ref = db.collection(SESSIONS_COL).document(session_id)
    doc = doc_ref.get()
    if not doc.exists:
        return False
    safe_updates = {k: v for k, v in updates.items() if v is not None}
    if safe_updates:
        doc_ref.update(safe_updates)
    return True


async def complete_session(session_id: str, tutor_note: str = "") -> bool:
    db = get_firestore_db()
    doc_ref = db.collection(SESSIONS_COL).document(session_id)
    doc = doc_ref.get()
    if not doc.exists:
        return False
    doc_ref.update({"status": "completed", "tutorNote": tutor_note})

    session_data = doc.to_dict() or {}
    tutor_id = session_data.get("tutorId", "")
    if tutor_id:
        tutor_doc = db.collection("tutors").document(tutor_id).get()
        if tutor_doc.exists:
            current_sessions = tutor_doc.to_dict().get("totalSessions", 0)
            db.collection("tutors").document(tutor_id).update({
                "totalSessions": current_sessions + 1,
            })
    return True
