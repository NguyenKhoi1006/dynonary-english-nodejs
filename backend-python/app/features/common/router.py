from fastapi import APIRouter, HTTPException
from app.features.common.schema import (
    SendVerifyCodeRequest,
    VerifyCodeRequest,
    MessageResponse,
)
from app.features.common import service as common_service
from app.features.account import service as account_service
from app.shared.helpers import generate_verify_code
from app.shared.constants import VERIFY_CODE_LEN
from app.config import settings

router = APIRouter()


@router.get("/send-verify-code", response_model=MessageResponse)
async def send_verify_code(email: str):
    """Send a verification code to email for password reset."""
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    
    # Check if account exists
    exists = await account_service.is_exist_account(email)
    if not exists:
        raise HTTPException(status_code=400, detail="Tài khoản không tồn tại")
    
    verify_code = generate_verify_code(VERIFY_CODE_LEN)
    await common_service.save_verify_code(verify_code, email)
    
    # Note: In production, send email here
    # For now, return code in response (dev mode)
    if settings.debug:
        return {"message": f"Mã xác nhận: {verify_code}"}
    
    return {"message": "Gửi mã thành công. Hãy kiểm tra Email của bạn"}
