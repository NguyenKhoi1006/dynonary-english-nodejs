"""
Gamification parent router — aggregates all gamification sub-routers.
"""
from fastapi import APIRouter

from app.features.gamification.streak.router import router as streak_router
from app.features.gamification.hearts.router import router as hearts_router
from app.features.gamification.achievements.router import router as achievements_router
from app.features.gamification.quests.router import router as quests_router
from app.features.gamification.skill_tree.router import router as skill_tree_router

gamification_router = APIRouter(prefix="/gamification", tags=["Gamification"])

gamification_router.include_router(streak_router)
gamification_router.include_router(hearts_router)
gamification_router.include_router(achievements_router)
gamification_router.include_router(quests_router)
gamification_router.include_router(skill_tree_router)
