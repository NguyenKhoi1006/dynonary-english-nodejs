from typing import Optional, Dict, Any, List
from google.cloud.firestore import SERVER_TIMESTAMP
from app.firebase import get_firestore_db
from app.shared.firestore_helpers import serialize_doc

COURSES_COL = "courses"
LESSONS_COL = "lessons"

DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100


async def create_course(tutor_uid: str, tutor_name: str, tutor_avt: str, data: Dict[str, Any]) -> Dict[str, Any]:
    db = get_firestore_db()

    course = {
        "tutorId": tutor_uid,
        "tutorName": tutor_name,
        "tutorAvt": tutor_avt,
        "title": data.get("title", ""),
        "description": data.get("description", ""),
        "subject": data.get("subject", ""),
        "level": data.get("level", "beginner"),
        "price": data.get("price", 0),
        "thumbnail": data.get("thumbnail", ""),
        "maxStudents": data.get("maxStudents", 0),
        "isPublished": data.get("isPublished", False),
        "totalLessons": 0,
        "totalStudents": 0,
        "totalDuration": 0,
        "rating": 0.0,
        "createdDate": SERVER_TIMESTAMP,
    }

    doc_ref = db.collection(COURSES_COL).document()
    doc_ref.set(course)

    lessons_data = data.get("lessons", [])
    for lesson in lessons_data:
        lesson_data = {
            "courseId": doc_ref.id,
            "title": lesson.get("title", ""),
            "description": lesson.get("description", ""),
            "contentType": lesson.get("contentType", "video"),
            "contentUrl": lesson.get("contentUrl", ""),
            "duration": lesson.get("duration", 0),
            "order": lesson.get("order", 0),
            "isFreePreview": lesson.get("isFreePreview", False),
            "createdDate": SERVER_TIMESTAMP,
        }
        db.collection(LESSONS_COL).add(lesson_data)

    total_duration = sum(l.get("duration", 0) for l in lessons_data)
    doc_ref.update({
        "totalLessons": len(lessons_data),
        "totalDuration": total_duration,
    })

    course["uid"] = doc_ref.id
    course["totalLessons"] = len(lessons_data)
    course["totalDuration"] = total_duration
    return serialize_doc(course)


async def get_course(course_id: str) -> Optional[Dict[str, Any]]:
    db = get_firestore_db()
    doc = db.collection(COURSES_COL).document(course_id).get()
    if not doc.exists:
        return None
    data = serialize_doc(doc.to_dict())
    data["uid"] = doc.id
    return data


async def update_course(course_id: str, updates: Dict[str, Any]) -> bool:
    db = get_firestore_db()
    doc_ref = db.collection(COURSES_COL).document(course_id)
    doc = doc_ref.get()
    if not doc.exists:
        return False
    safe_updates = {k: v for k, v in updates.items() if v is not None}
    if safe_updates:
        doc_ref.update(safe_updates)
    return True


async def delete_course(course_id: str) -> bool:
    db = get_firestore_db()
    doc = db.collection(COURSES_COL).document(course_id).get()
    if not doc.exists:
        return False
    db.collection(COURSES_COL).document(course_id).delete()
    lessons = db.collection(LESSONS_COL).where("courseId", "==", course_id).stream()
    for lesson in lessons:
        db.collection(LESSONS_COL).document(lesson.id).delete()
    return True


async def list_courses(
    page: int = 1,
    page_size: int = DEFAULT_PAGE_SIZE,
    search: str = "",
    subject: str = "",
    level: str = "",
    tutor_id: str = "",
    published_only: bool = True,
) -> tuple[List[Dict[str, Any]], int]:
    db = get_firestore_db()
    query = db.collection(COURSES_COL)

    if tutor_id:
        query = query.where("tutorId", "==", tutor_id)
    if subject:
        query = query.where("subject", "==", subject)
    if level:
        query = query.where("level", "==", level)
    if published_only:
        query = query.where("isPublished", "==", True)

    query = query.order_by("createdDate", direction="DESCENDING")

    all_docs = list(query.stream())
    all_courses = []
    for doc in all_docs:
        data = serialize_doc(doc.to_dict())
        data["uid"] = doc.id
        if search and search.lower() not in data.get("title", "").lower():
            continue
        all_courses.append(data)

    total = len(all_courses)
    start = (page - 1) * page_size
    end = start + page_size
    paginated = all_courses[start:end]

    return paginated, total


async def get_courses_by_tutor(tutor_id: str) -> List[Dict[str, Any]]:
    db = get_firestore_db()
    docs = db.collection(COURSES_COL).where("tutorId", "==", tutor_id).order_by("createdDate", direction="DESCENDING").stream()
    results = []
    for doc in docs:
        data = serialize_doc(doc.to_dict())
        data["uid"] = doc.id
        results.append(data)
    return results


async def get_lessons(course_id: str) -> List[Dict[str, Any]]:
    db = get_firestore_db()
    docs = db.collection(LESSONS_COL).where("courseId", "==", course_id).order_by("order").stream()
    results = []
    for doc in docs:
        data = serialize_doc(doc.to_dict())
        data["uid"] = doc.id
        results.append(data)
    return results


async def add_lesson(course_id: str, lesson_data: Dict[str, Any]) -> Dict[str, Any]:
    db = get_firestore_db()
    course_doc = db.collection(COURSES_COL).document(course_id).get()
    if not course_doc.exists:
        return None

    lesson = {
        "courseId": course_id,
        "title": lesson_data.get("title", ""),
        "description": lesson_data.get("description", ""),
        "contentType": lesson_data.get("contentType", "video"),
        "contentUrl": lesson_data.get("contentUrl", ""),
        "duration": lesson_data.get("duration", 0),
        "order": lesson_data.get("order", 0),
        "isFreePreview": lesson_data.get("isFreePreview", False),
        "createdDate": SERVER_TIMESTAMP,
    }
    _, ref = db.collection(LESSONS_COL).add(lesson)
    lesson["uid"] = ref.id

    course_data = course_doc.to_dict() or {}
    current_lessons = course_data.get("totalLessons", 0)
    current_duration = course_data.get("totalDuration", 0)
    db.collection(COURSES_COL).document(course_id).update({
        "totalLessons": current_lessons + 1,
        "totalDuration": current_duration + lesson.get("duration", 0),
    })

    return serialize_doc(lesson)


async def update_lesson(lesson_id: str, updates: Dict[str, Any]) -> bool:
    db = get_firestore_db()
    doc_ref = db.collection(LESSONS_COL).document(lesson_id)
    doc = doc_ref.get()
    if not doc.exists:
        return False
    safe_updates = {k: v for k, v in updates.items() if v is not None}
    if safe_updates:
        doc_ref.update(safe_updates)
    return True


async def delete_lesson(lesson_id: str) -> bool:
    db = get_firestore_db()
    doc = db.collection(LESSONS_COL).document(lesson_id).get()
    if not doc.exists:
        return False
    lesson_data = doc.to_dict() or {}
    course_id = lesson_data.get("courseId", "")

    db.collection(LESSONS_COL).document(lesson_id).delete()

    if course_id:
        course_doc = db.collection(COURSES_COL).document(course_id).get()
        if course_doc.exists:
            course_data = course_doc.to_dict() or {}
            current_lessons = course_data.get("totalLessons", 0)
            current_duration = course_data.get("totalDuration", 0)
            db.collection(COURSES_COL).document(course_id).update({
                "totalLessons": max(0, current_lessons - 1),
                "totalDuration": max(0, current_duration - lesson_data.get("duration", 0)),
            })
    return True


async def increment_student_count(course_id: str) -> None:
    db = get_firestore_db()
    course_ref = db.collection(COURSES_COL).document(course_id)
    doc = course_ref.get()
    if doc.exists:
        current = doc.to_dict().get("totalStudents", 0)
        course_ref.update({"totalStudents": current + 1})
