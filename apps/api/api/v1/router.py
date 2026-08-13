from fastapi import APIRouter
import re
from core.config import settings
from api.v1 import auth, users, topics, sessions

router = APIRouter(prefix="/api/v1")

@router.get("/debug/dburl")
async def debug_dburl():
    url = settings.database_url
    masked = re.sub(r':([^:@]+)@', ':***@', url)
    return {"database_url_masked": masked}

router.include_router(
    auth.router, prefix="/auth", tags=["auth"]
)
router.include_router(
    users.router, prefix="/user", tags=["users"]
)
router.include_router(
    topics.router, prefix="/topics", tags=["topics"]
)
router.include_router(
    sessions.router, prefix="/session",
    tags=["sessions"]
)
