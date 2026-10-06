"""
CareerAI Backend Configuration via Pydantic Settings
"""
from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    PROJECT_NAME: str = "CareerAI - AI Job & Resume Matching Platform"
    API_V1_STR: str = "/api/v1"
    
    # URLs
    FRONTEND_URL: str = "http://localhost:3000"
    BACKEND_URL: str = "http://localhost:8000"
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # Database & Redis
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres_secure_pass@localhost:5432/career_ai_db"
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # JWT Secrets
    JWT_SECRET: str = "super_secret_jwt_key_careerai_production_2026"
    JWT_REFRESH_SECRET: str = "super_secret_refresh_key_careerai_production_2026"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # OTP Configuration
    OTP_EXPIRE_SECONDS: int = 300
    OTP_RESEND_COOLDOWN_SECONDS: int = 60
    
    # AI & Embeddings
    GEMINI_API_KEY: str = Field(default="", env="GEMINI_API_KEY")
    EMBEDDING_DIMENSION: int = 768
    AI_MODEL_NAME: str = "gemini-3.8-flash"
    
    # Matching Engine Weights
    WEIGHT_REQUIRED_SKILLS: float = 0.40
    WEIGHT_PREFERRED_SKILLS: float = 0.20
    WEIGHT_EXPERIENCE: float = 0.15
    WEIGHT_EDUCATION: float = 0.10
    WEIGHT_SEMANTIC_SIMILARITY: float = 0.10
    WEIGHT_LOCATION: float = 0.05

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore"

settings = Settings()
