"""
Authentication API Endpoints: Email/SMS OTP, Password, Token Refresh
"""
from fastapi import APIRouter, HTTPException, status
from app.schemas.schemas import SendOTPRequest, SendOTPResponse, VerifyOTPRequest, TokenResponse, PasswordLoginRequest
from app.services.otp_service import OTPService
from app.core.security import create_access_token, create_refresh_token, verify_password, get_password_hash
import uuid

router = APIRouter(prefix="/auth", tags=["Authentication"])

# In-memory mock user database for dev verification
MOCK_USERS = {
    "candidate@careerai.io": {
        "id": str(uuid.uuid4()),
        "email": "candidate@careerai.io",
        "phone": "+1555019283",
        "role": "CANDIDATE",
        "password_hash": get_password_hash("Password123!")
    },
    "employer@techcorp.com": {
        "id": str(uuid.uuid4()),
        "email": "employer@techcorp.com",
        "phone": "+1555019284",
        "role": "EMPLOYER",
        "password_hash": get_password_hash("Password123!")
    },
    "admin@careerai.io": {
        "id": str(uuid.uuid4()),
        "email": "admin@careerai.io",
        "phone": "+1555019285",
        "role": "ADMIN",
        "password_hash": get_password_hash("Password123!")
    }
}

@router.post("/send-otp", response_model=SendOTPResponse)
async def send_otp(req: SendOTPRequest):
    """
    Step 1: Generates 6-digit OTP, stores hash with 300s expiration, dispatches via Email or SMS.
    """
    otp_code, expires_in = OTPService.create_and_store_otp(req.destination, req.channel)
    # In development / sandbox, print OTP to console log for testing
    print(f"[OTP Dispatch] Sent code {otp_code} to {req.destination} via {req.channel}")
    
    return SendOTPResponse(
        success=True,
        message=f"6-digit verification code sent to {req.destination}",
        expires_in=expires_in,
        resend_after=60
    )

@router.post("/verify-otp", response_model=TokenResponse)
async def verify_otp(req: VerifyOTPRequest):
    """
    Step 2: Validates the 6-digit OTP code and issues JWT access and refresh tokens.
    """
    is_valid, msg = OTPService.verify_otp(req.destination, req.otp)
    if not is_valid:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=msg)

    # Lookup or create user
    user = MOCK_USERS.get(req.destination)
    if not user:
        user = {
            "id": str(uuid.uuid4()),
            "email": req.destination if "@" in req.destination else None,
            "phone": req.destination if "@" not in req.destination else None,
            "role": req.role_requested or "CANDIDATE",
        }
        MOCK_USERS[req.destination] = user

    access_token = create_access_token(subject=user["id"], role=user["role"])
    refresh_token = create_refresh_token(subject=user["id"])

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user={"id": user["id"], "email": user.get("email"), "phone": user.get("phone"), "role": user["role"]}
    )

@router.post("/login", response_model=TokenResponse)
async def login_with_password(req: PasswordLoginRequest):
    """
    Password fallback login
    """
    user = MOCK_USERS.get(req.email)
    if not user or not verify_password(req.password, user.get("password_hash", "")):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    access_token = create_access_token(subject=user["id"], role=user["role"])
    refresh_token = create_refresh_token(subject=user["id"])

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user={"id": user["id"], "email": user["email"], "role": user["role"]}
    )

@router.post("/logout")
async def logout():
    return {"success": True, "message": "Logged out successfully"}
