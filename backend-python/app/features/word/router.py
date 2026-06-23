from fastapi import APIRouter, HTTPException, Query, Depends
from typing import Optional
from app.features.word.schema import (
    ContributeWordRequest,
    WordPackResponse,
    WordSearchResponse,
    WordDetailResponse,
    WordExistenceResponse,
    WordResponse,
)
from app.features.word import service as word_service
from app.features.common import service as common_service
from app.dependencies import verify_firebase_token

router = APIRouter()


@router.get("/exist", response_model=WordExistenceResponse)
async def check_word_existence(
    word: str = Query(...),
    type: Optional[str] = Query(None),
):
    is_exist = await word_service.check_word_existence(word)
    return {"isExist": is_exist}


@router.get("/pack")
async def get_word_pack(
    page: int = Query(1, ge=1),
    perPage: int = Query(8, ge=1, le=100),
    packInfo: Optional[str] = Query("{}"),
):
    import json
    pack_info = json.loads(packInfo)
    skip = (page - 1) * perPage
    pack_list = await word_service.get_word_pack(pack_info, skip, perPage)
    total = await word_service.count_word_pack(pack_info)
    return {"packList": pack_list, "total": total}


@router.get("/search-word", response_model=WordSearchResponse)
async def search_word(
    searchWord: str = Query(""),
    limit: int = Query(20, ge=1, le=100),
):
    word_list = await word_service.search_word(searchWord, limit)
    return {"list": word_list}


@router.get("/word-details", response_model=WordDetailResponse)
async def word_details(word: str = Query(...)):
    data = await word_service.get_word_detail(word)
    return {"wordDetails": data}


@router.get("/favorite-list")
async def favorite_list(
    user: dict = Depends(verify_firebase_token),
):
    uid = user.get("uid", "")
    if not uid:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    # Get user's favorite list
    db = __import__("app.firebase", fromlist=["get_firestore_db"]).get_firestore_db()
    user_doc = db.collection("users").document(uid).get()
    if not user_doc.exists:
        return {"wordPack": []}
    
    favorite_list = user_doc.to_dict().get("favoriteList", [])
    word_pack = await word_service.get_favorite_list(favorite_list)
    return {"wordPack": word_pack}


@router.post("/contribute/add-word")
async def contribute_word(
    body: ContributeWordRequest,
    user: dict = Depends(verify_firebase_token),
):
    # Check if word already exists
    is_exist = await word_service.check_word_existence(body.word)
    # Also check contributions
    is_pending = await common_service.check_pending_contribution(body.word)
    
    if is_exist or is_pending:
        raise HTTPException(status_code=406, detail="Từ này đã tồn tại")
    
    # Submit contribution
    await common_service.create_contribution(
        user_id=user.get("uid", ""),
        word=body.word,
        meaning=body.mean,
        phonetic=body.phonetic,
        example="\n".join(body.examples) if body.examples else "",
    )
    return {"message": "success"}
