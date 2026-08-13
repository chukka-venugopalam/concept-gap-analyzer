from fastapi import APIRouter
from api.v1 import auth, users, topics, sessions

router = APIRouter(prefix="/api/v1")

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
