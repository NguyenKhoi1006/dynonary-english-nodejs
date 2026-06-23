from fastapi import APIRouter, HTTPException, Depends, Query
from app.dependencies import verify_firebase_token

from app.features.learner.placement.schema import PlacementSubmit, PlacementResult
from app.features.learner.placement import service as placement_service

router = APIRouter(prefix="/placement", tags=["Learner - Placement"])


@router.get("/test")
async def get_placement_test(
    type: str = Query("initial"),
    user: dict = Depends(verify_firebase_token),
):
    test = await placement_service.get_placement_test(type)
    if not test:
        raise HTTPException(status_code=404, detail="No placement test available")
    # Strip correctAnswer from questions
    for q in test.get("questions", []):
        q.pop("correctAnswer", None)
    return test


@router.post("/submit")
async def submit_placement(
    body: PlacementSubmit,
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    answers = [a.model_dump() for a in body.answers]
    result = await placement_service.submit_placement(body.testId, uid, answers)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


@router.get("/history")
async def get_attempt_history(
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    history = await placement_service.get_attempt_history(uid)
    return {"attempts": history}
