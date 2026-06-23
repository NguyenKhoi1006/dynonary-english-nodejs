from fastapi import APIRouter, Query, Depends
from app.features.highscore.schema import UpsertScoreRequest, LeaderboardResponse, LeaderboardEntryResponse
from app.features.highscore import service as highscore_service
from app.dependencies import verify_firebase_token

router = APIRouter()


@router.get("/leaderboard", response_model=LeaderboardResponse)
async def get_leaderboard(
    gameType: str = Query(...),
    limit: int = Query(20, ge=1, le=100),
):
    entries = await highscore_service.get_leaderboard(gameType, limit)
    return {"leaderboard": entries}


@router.post("/upsert-score", response_model=dict)
async def upsert_score(
    body: UpsertScoreRequest,
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    await highscore_service.upsert_score(
        user_id=uid,
        game_type=body.gameType,
        score=body.score,
        display_name=body.displayName,
        photo_url=body.photoURL,
    )
    return {"message": "success"}
