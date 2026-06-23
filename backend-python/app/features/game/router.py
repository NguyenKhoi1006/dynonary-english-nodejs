from fastapi import APIRouter, Depends, Query
from typing import List
from app.features.game.schema import SaveGameRequest, GameResultResponse, GameResultListResponse
from app.features.game import service as game_service
from app.dependencies import verify_firebase_token

router = APIRouter()


@router.post("/save-result", response_model=dict)
async def save_game_result(
    body: SaveGameRequest,
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    doc_id = await game_service.save_game_result(
        user_id=uid,
        game_type=body.gameType,
        score=body.score,
        correct_count=body.correctCount,
        total_questions=body.totalQuestions,
    )
    return {"message": "success", "id": doc_id}


@router.get("/results", response_model=GameResultListResponse)
async def get_game_results(
    limit: int = Query(20, ge=1, le=100),
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    results = await game_service.get_game_results(uid, limit)
    return {"results": results}
