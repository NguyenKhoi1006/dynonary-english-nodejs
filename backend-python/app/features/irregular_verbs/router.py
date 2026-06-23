from fastapi import APIRouter
from app.features.irregular_verbs.service import get_all_verbs

router = APIRouter()


@router.get("/")
async def list_irregular_verbs():
    """Public endpoint: get all irregular verbs. Replaces hardcoded constant/irregular-verb.min.js."""
    verbs = await get_all_verbs()
    return {"verbs": verbs}
