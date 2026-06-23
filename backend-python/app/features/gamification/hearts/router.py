from fastapi import APIRouter, Depends
from app.dependencies import verify_firebase_token
from app.features.gamification.hearts import service as hearts_service
from app.features.gamification.hearts.schema import (
    HeartsResponse,
    HeartConsumeRequest,
    HeartConsumeResponse,
    HeartRefillResponse,
)

router = APIRouter(prefix="/hearts", tags=["Gamification - Hearts"])


@router.get("/", response_model=HeartsResponse)
async def get_hearts(user: dict = Depends(verify_firebase_token)):
    uid = user.get("uid", "")
    return await hearts_service.get_hearts(uid)


@router.post("/consume", response_model=HeartConsumeResponse)
async def consume_heart(
    body: HeartConsumeRequest,
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    return await hearts_service.consume_heart(uid, body.count)


@router.post("/refill", response_model=HeartRefillResponse)
async def refill_hearts(user: dict = Depends(verify_firebase_token)):
    uid = user.get("uid", "")
    return await hearts_service.refill_hearts(uid)
