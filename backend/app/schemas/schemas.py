"""
Pydantic v2 Data Validation Schemas
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from uuid import UUID
from datetime import datetime

# Base Response Wrapper
class APIResponse(BaseModel):
    success: bool = True
    message: str = "Operation successful"
    data: Optional[Dict[str, Any]] = None
    error: Optional[Dict[str, Any]] = None

# OTP & Auth Schemas
class SendOTPRequest(BaseModel):
    destination: str = Field(..., description="Email or Mobile phone number")
    channel: str = Field(default="EMAIL", pattern="^(EMAIL|SMS)$")

class SendOTPResponse(BaseModel):
    success: bool = True
    message: str = "OTP sent successfully"
    expires_in: int = 300
    resend_after: int = 60

class VerifyOTPRequest(BaseModel):
    destination: str
    otp: str = Field(..., min_length=6, max_length=6)
    role_requested: Optional[str] = "CANDIDATE"

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class PasswordLoginRequest(BaseModel):
    email: EmailStr
    password: str

# Resume & Matching Schemas
class ResumeParseResponse(BaseModel):
    resume_id: UUID
    ats_score: int
    strengths: List[str]
    improvement_recommendations: List[str]
    missing_keywords: List[str]
    extracted_skills: List[str]
    extracted_experience_years: float

class JobMatchScoreBreakdown(BaseModel):
    overall_score: float
    required_skill_score: float
    preferred_skill_score: float
    experience_score: float
    education_score: float
    semantic_score: float
    location_score: float
    matched_skills: List[str]
    missing_skills: List[str]
    explanation: str
    strengths: List[str]
    areas_for_growth: List[str]

# Job Schemas
class JobCreate(BaseModel):
    title: str
    description: str
    responsibilities: List[str] = []
    requirements: List[str] = []
    required_skills: List[str]
    preferred_skills: List[str] = []
    employment_type: str = "FULL_TIME"
    work_mode: str = "REMOTE"
    location: str
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    experience_min: int = 0
    experience_max: Optional[int] = None

class JobResponse(JobCreate):
    id: UUID
    company_id: UUID
    status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
