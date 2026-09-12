from fastapi import APIRouter
from api.v1 import auth, users, topics, sessions, interview_questions, mock_interview

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
router.include_router(
    interview_questions.router,
    prefix="/interview-questions",
    tags=["interview_questions"]
)
router.include_router(
    mock_interview.router,
    prefix="/mock-interview",
    tags=["mock_interview"]
)
