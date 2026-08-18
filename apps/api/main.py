from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import traceback
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
        pool = await get_pool()
        async with pool.acquire() as conn:
            await conn.execute("ALTER TABLE sessions ADD COLUMN IF NOT EXISTS extraction_degraded BOOLEAN DEFAULT FALSE;")
        print("[STARTUP] Database connected successfully and schema updated")
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

print(f"[CORS DEBUG] Allowed origins: {settings.origins_list}")

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

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"[GLOBAL ERROR] {type(exc).__name__}: {exc}")
    print(traceback.format_exc())
    origin = request.headers.get("origin", "*")
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "internal_error",
                "message": str(exc)
            }
        },
        headers={
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Credentials": "true"
        }
    )

@app.get("/api/v1/health")
async def health():
    return {"data": {"status": "ok", "version": "1.0.1-step1"}}

@app.get("/api/v1/debug/cors")
async def debug_cors():
    return {
        "allowed_origins": settings.allowed_origins,
        "origins_list": settings.origins_list,
        "environment": settings.environment
    }

@app.get("/api/v1/debug/dburl")
async def debug_dburl():
    url = settings.database_url
    import re
    masked = re.sub(r':([^:@]+)@', ':***@', url)
    return {"database_url_masked": masked}

app.include_router(router)
