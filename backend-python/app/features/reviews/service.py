from typing import Optional, Dict, Any, List
from google.cloud.firestore import SERVER_TIMESTAMP
from app.firebase import get_firestore_db
from app.shared.firestore_helpers import serialize_doc
from app.features.tutors import service as tutor_service

REVIEWS_COL = "reviews"


async def create_review(
    student_id: str,
    student_name: str,
    student_avt: str,
    tutor_id: str,
    session_id: str,
    rating: int,
    comment: str,
) -> Optional[Dict[str, Any]]:
    db = get_firestore_db()

    existing = db.collection(REVIEWS_COL).where("sessionId", "==", session_id).limit(1).stream()
    if any(existing):
        return None

    review = {
        "studentId": student_id,
        "studentName": student_name,
        "studentAvt": student_avt,
        "tutorId": tutor_id,
        "sessionId": session_id,
        "rating": rating,
        "comment": comment,
        "createdDate": SERVER_TIMESTAMP,
    }
    doc_ref = db.collection(REVIEWS_COL).document()
    doc_ref.set(review)
    review["uid"] = doc_ref.id

    await _update_tutor_rating(tutor_id)
    return serialize_doc(review)


async def get_reviews_for_tutor(tutor_id: str) -> List[Dict[str, Any]]:
    db = get_firestore_db()
    docs = db.collection(REVIEWS_COL).where("tutorId", "==", tutor_id).order_by("createdDate", direction="DESCENDING").stream()
    results = []
    for doc in docs:
        data = serialize_doc(doc.to_dict())
        data["uid"] = doc.id
        results.append(data)
    return results


async def get_review_stats(tutor_id: str) -> Dict[str, Any]:
    db = get_firestore_db()
    docs = db.collection(REVIEWS_COL).where("tutorId", "==", tutor_id).stream()

    total = 0
    rating_sum = 0
    rating_counts = {"1": 0, "2": 0, "3": 0, "4": 0, "5": 0}

    for doc in docs:
        data = doc.to_dict() or {}
        r = data.get("rating", 0)
        total += 1
        rating_sum += r
        key = str(r)
        if key in rating_counts:
            rating_counts[key] += 1

    average = round(rating_sum / total, 1) if total > 0 else 0.0
    return {
        "total": total,
        "averageRating": average,
        "ratingCounts": rating_counts,
    }


async def _update_tutor_rating(tutor_id: str) -> None:
    stats = await get_review_stats(tutor_id)
    db = get_firestore_db()
    db.collection("tutors").document(tutor_id).update({
        "rating": stats["averageRating"],
        "totalReviews": stats["total"],
    })
