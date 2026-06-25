from fastapi import APIRouter, HTTPException, Depends

from app.dependencies import verify_firebase_token
from app.features.reviews.schema import (
    ReviewCreate,
    ReviewResponse,
    ReviewListResponse,
)
from app.features.reviews import service as review_service

router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.post("/create")
async def create_review(
    body: ReviewCreate,
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    profile = await _get_student_info(uid)
    if not profile:
        raise HTTPException(status_code=404, detail="Không tìm thấy thông tin")

    review = await review_service.create_review(
        student_id=uid,
        student_name=profile.get("name", ""),
        student_avt=profile.get("avt", ""),
        tutor_id=body.tutorId,
        session_id=body.sessionId,
        rating=body.rating,
        comment=body.comment,
    )
    if not review:
        raise HTTPException(status_code=409, detail="Bạn đã đánh giá buổi học này rồi")
    return {"message": "Đánh giá thành công", "uid": review.get("uid")}


@router.get("/tutor/{tutorId}", response_model=ReviewListResponse)
async def get_tutor_reviews(tutorId: str):
    stats = await review_service.get_review_stats(tutorId)
    reviews = await review_service.get_reviews_for_tutor(tutorId)
    return ReviewListResponse(
        reviews=[ReviewResponse(**r) for r in reviews],
        total=stats["total"],
        averageRating=stats["averageRating"],
        ratingCounts=stats["ratingCounts"],
    )


async def _get_student_info(user_id: str):
    from app.firebase import get_firestore_db
    db = get_firestore_db()
    doc = db.collection("users").document(user_id).get()
    if doc.exists:
        return doc.to_dict()
    return None
