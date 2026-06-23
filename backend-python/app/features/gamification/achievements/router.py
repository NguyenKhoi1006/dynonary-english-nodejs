from fastapi import APIRouter, Depends
from app.dependencies import verify_firebase_token
from app.features.gamification.achievements import service as achievements_service
from app.features.gamification.achievements.schema import (
    AchievementListResponse,
    CheckAchievementsRequest,
    CheckAchievementsResponse,
)

router = APIRouter(prefix="/achievements", tags=["Gamification - Achievements"])


@router.get("/", response_model=AchievementListResponse)
async def get_achievements(user: dict = Depends(verify_firebase_token)):
    uid = user.get("uid", "")
    return await achievements_service.get_achievements(uid)


@router.post("/check", response_model=CheckAchievementsResponse)
async def check_achievements(
    body: CheckAchievementsRequest,
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    return await achievements_service.check_achievements(uid, body.eventType, body.eventValue)
