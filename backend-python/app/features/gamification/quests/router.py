from fastapi import APIRouter, Depends
from app.dependencies import verify_firebase_token
from app.features.gamification.quests import service as quests_service
from app.features.gamification.quests.schema import (
    DailyQuestsResponse,
    QuestProgressRequest,
    QuestProgressResponse,
)

router = APIRouter(prefix="/quests", tags=["Gamification - Daily Quests"])


@router.get("/", response_model=DailyQuestsResponse)
async def get_quests(user: dict = Depends(verify_firebase_token)):
    uid = user.get("uid", "")
    return await quests_service.get_or_create_daily_quests(uid)


@router.post("/progress", response_model=QuestProgressResponse)
async def update_progress(
    body: QuestProgressRequest,
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    return await quests_service.update_quest_progress(uid, body.questId, body.progressDelta)
