from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
import os
import uuid
import shutil

from app.features.admin.dependencies import verify_admin

router = APIRouter(prefix="/media", tags=["Admin - Media"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "../../../uploads")
ALLOWED_TYPES = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "audio/mpeg": "mp3",
    "audio/wav": "wav",
    "audio/ogg": "ogg",
    "application/pdf": "pdf",
}
MAX_SIZE = 10 * 1024 * 1024  # 10 MB


@router.post("/upload")
async def upload_media(
    file: UploadFile = File(...),
    admin: dict = Depends(verify_admin),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. Allowed: {', '.join(ALLOWED_TYPES.keys())}"
        )

    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 10 MB)")

    ext = ALLOWED_TYPES[file.content_type]
    filename = f"{uuid.uuid4().hex}.{ext}"

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as f:
        f.write(content)

    return {
        "url": f"/uploads/{filename}",
        "filename": filename,
        "size": len(content),
        "contentType": file.content_type,
    }
