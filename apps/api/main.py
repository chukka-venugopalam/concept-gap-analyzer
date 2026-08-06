from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from core.config import settings
from core.database import get_pool, close_pool
from core.exceptions import CIPException
from api.v1.router import router

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[STARTUP] Starting CIP API...")
    print(f"[STARTUP] JWT Secret set: {bool(settings.supabase_jwt_secret)}")
    print(f"[STARTUP] DB URL set: {bool(settings.database_url)}")
    print(f"[STARTUP] XAI key set: {bool(settings.xai_api_key)}")
    try:
        await get_pool()
        print("[STARTUP] Database connected successfully")
    except Exception as e:
        print(f"[STARTUP] Database connection failed: {e}")
    yield
    await close_pool()

app = FastAPI(
    title="CIP API",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["GET","POST","PATCH","DELETE"],
    allow_headers=["Authorization","Content-Type"],
)

@app.exception_handler(CIPException)
async def cip_exception_handler(
    request: Request, exc: CIPException
):
    return JSONResponse(
        status_code=400,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message
            }
        }
    )

@app.get("/api/v1/health")
async def health():
    return {"data": {"status": "ok", "version": "1.0.0"}}

@app.get("/api/v1/debug/cors")
async def debug_cors():
    return {
        "allowed_origins": settings.allowed_origins,
        "origins_list": settings.origins_list,
        "environment": settings.environment
    }

app.include_router(router)
