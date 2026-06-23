from fastapi import APIRouter

from app.features.learner.placement.router import router as placement_router
from app.features.learner.progress.router import router as progress_router
from app.features.learner.materials.router import router as materials_router
from app.features.learner.tests.router import router as tests_router

learner_router = APIRouter()


@learner_router.get("/health")
async def learner_health():
    return {"status": "ok", "service": "dynonary-learner-api"}


learner_router.include_router(placement_router)
learner_router.include_router(progress_router)
learner_router.include_router(materials_router)
learner_router.include_router(tests_router)
