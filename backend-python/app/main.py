import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings

from app.features.account.router import router as account_router
from app.features.word.router import router as word_router
from app.features.flashcard.router import router as flashcard_router
from app.features.game.router import router as game_router
from app.features.highscore.router import router as highscore_router
from app.features.sentence.router import router as sentence_router
from app.features.blog.router import router as blog_router
from app.features.common.router import router as common_router
from app.features.admin.router import admin_router
from app.features.learner.router import learner_router
from app.features.topics.router import router as topics_router
from app.features.irregular_verbs.router import router as irregular_verbs_router
from app.features.gamification.router import gamification_router

app = FastAPI(
    title="Dynonary API",
    version="1.0.0",
    description="Dynonary - Learn English with Python backend",
)

# CORS
origins = [o.strip() for o in settings.cors_origins.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

uploads_dir = os.path.join(os.path.dirname(__file__), "../uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# Health check
@app.get("/health")
async def health():
    return {"status": "ok", "service": "dynonary-api"}

# Mount feature routers
BASE_URL = "/apis"
app.include_router(account_router, prefix=f"{BASE_URL}/account", tags=["Account"])
app.include_router(word_router, prefix=f"{BASE_URL}/word", tags=["Word"])
app.include_router(flashcard_router, prefix=f"{BASE_URL}/flashcard", tags=["Flashcard"])
app.include_router(game_router, prefix=f"{BASE_URL}/games", tags=["Game"])
app.include_router(highscore_router, prefix=f"{BASE_URL}/highscore", tags=["Highscore"])
app.include_router(sentence_router, prefix=f"{BASE_URL}/sentence", tags=["Sentence"])
app.include_router(blog_router, prefix=f"{BASE_URL}/blog", tags=["Blog"])
app.include_router(common_router, prefix=f"{BASE_URL}/common", tags=["Common"])
app.include_router(admin_router, prefix=f"{BASE_URL}/admin", tags=["Admin"])
app.include_router(learner_router, prefix=f"{BASE_URL}/learner", tags=["Learner"])
app.include_router(topics_router, prefix=f"{BASE_URL}/topics", tags=["Topics"])
app.include_router(irregular_verbs_router, prefix=f"{BASE_URL}/irregular-verbs", tags=["Irregular Verbs"])
app.include_router(gamification_router, prefix=f"{BASE_URL}", tags=["Gamification"])
