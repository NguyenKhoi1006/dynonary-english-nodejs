from fastapi import APIRouter, Depends
from app.dependencies import verify_firebase_token
from app.features.gamification.skill_tree import service as skill_tree_service
from app.features.gamification.skill_tree.schema import (
    SkillTreeResponse,
    CompleteLessonRequest,
    SkillProgressResponse,
    AvailableNodesResponse,
)

router = APIRouter(prefix="/skill-tree", tags=["Gamification - Skill Tree"])


@router.get("/", response_model=SkillTreeResponse)
async def get_skill_tree(user: dict = Depends(verify_firebase_token)):
    uid = user.get("uid", "")
    return await skill_tree_service.get_skill_tree(uid)


@router.post("/complete-lesson", response_model=SkillProgressResponse)
async def complete_lesson(
    body: CompleteLessonRequest,
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    return await skill_tree_service.complete_skill_lesson(uid, body.nodeId)


@router.get("/available", response_model=AvailableNodesResponse)
async def get_available_nodes(user: dict = Depends(verify_firebase_token)):
    uid = user.get("uid", "")
    return await skill_tree_service.get_available_nodes(uid)
