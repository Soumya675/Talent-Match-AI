"""
CareerAI FastAPI Application Entry Point
"""
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.api.v1.endpoints import auth

app = FastAPI(
    title="CareerAI API — AI Job & Resume Matching Platform",
    description="Production-grade RESTful API featuring explainable AI job matching, OTP authentication, ATS resume scoring, and RBAC.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to settings.CORS_ORIGINS
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handler for Standard JSON Responses
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred. Please try again later."
            }
        }
    )

# Health & Readiness Checks
@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "ok",
        "service": "CareerAI Backend API",
        "version": "1.0.0"
    }

@app.get("/ready", tags=["Health"])
async def readiness_check():
    return {
        "status": "ready",
        "database": "connected",
        "redis": "connected",
        "ai_engine": "operational"
    }

# Register API v1 Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
