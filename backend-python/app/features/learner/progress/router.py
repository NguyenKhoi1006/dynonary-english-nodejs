from fastapi import APIRouter, HTTPException, Depends
from app.dependencies import verify_firebase_token

from app.features.learner.progress.schema import CompleteMaterialRequest, LevelUpSubmit, UserProgressResponse, LevelUpResult
from app.features.learner.progress import service as progress_service

router = APIRouter(prefix="/progress", tags=["Learner - Progress"])


@router.get("/")
async def get_progress(user: dict = Depends(verify_firebase_token)):
    uid = user.get("uid", "")
    progress = await progress_service.get_user_progress(uid)
    if not progress:
        raise HTTPException(status_code=404, detail="User not found")
    return progress


@router.post("/complete-material")
async def complete_material(
    body: CompleteMaterialRequest,
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    result = await progress_service.complete_material(uid, body.materialId)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


@router.post("/level-up")
async def level_up(
    body: LevelUpSubmit,
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    result = await progress_service.submit_level_up(uid, body.testId)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result
