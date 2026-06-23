from fastapi import APIRouter, HTTPException, Depends
from app.dependencies import verify_firebase_token
from app.features.gamification.streak import service as streak_service
from app.features.gamification.streak.schema import CheckInResponse, StreakResponse

router = APIRouter(prefix="/streak", tags=["Gamification - Streak"])


@router.get("/", response_model=StreakResponse)
async def get_streak(user: dict = Depends(verify_firebase_token)):
    uid = user.get("uid", "")
    result = await streak_service.get_streak(uid)
    return result


@router.post("/check-in", response_model=CheckInResponse)
async def check_in(user: dict = Depends(verify_firebase_token)):
    uid = user.get("uid", "")
    result = await streak_service.check_in(uid)
    return result
