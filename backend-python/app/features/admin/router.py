from fastapi import APIRouter

from app.features.admin.users.router import router as users_router
from app.features.admin.dashboard.router import router as dashboard_router
from app.features.admin.activity.router import router as activity_router
from app.features.admin.materials.router import router as materials_router
from app.features.admin.tests.router import router as tests_router
from app.features.admin.media.router import router as media_router
from app.features.admin.topics.router import router as admin_topics_router
from app.features.admin.irregular_verbs.router import router as admin_verbs_router
from app.features.admin.words.router import router as admin_words_router
from app.features.admin.sentences.router import router as admin_sentences_router
from app.features.admin.blog.router import router as admin_blog_router
from app.features.admin.placement_tests.router import router as admin_placement_tests_router
from app.features.admin.tutors.router import router as admin_tutors_router

admin_router = APIRouter()


@admin_router.get("/health")
async def admin_health():
    return {"status": "ok", "service": "dynonary-admin-api"}


# All routes below require admin authentication
admin_router.include_router(users_router)
admin_router.include_router(dashboard_router)
admin_router.include_router(activity_router)
admin_router.include_router(materials_router)
admin_router.include_router(tests_router)
admin_router.include_router(media_router)
admin_router.include_router(admin_topics_router)
admin_router.include_router(admin_verbs_router)
admin_router.include_router(admin_words_router)
admin_router.include_router(admin_sentences_router)
admin_router.include_router(admin_blog_router)
admin_router.include_router(admin_placement_tests_router)
admin_router.include_router(admin_tutors_router)
