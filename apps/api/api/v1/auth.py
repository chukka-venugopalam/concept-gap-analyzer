from fastapi import APIRouter, Depends
from core.auth import get_current_user, CurrentUser
from core.database import get_db
from models.api.requests import SyncUserRequest
from repositories.user_repository import user_repo

router = APIRouter()

@router.post("/sync-user")
async def sync_user(
    body: SyncUserRequest,
    user: CurrentUser = Depends(get_current_user),
    db=Depends(get_db)
):
    result = await user_repo.create(
        db, body.email,
        body.display_name
    )
    is_new = result.get('is_new', False)
    return {
        "data": {
            "user_id": result['id'],
            "is_new_user": is_new,
            "onboarding_done":
                result.get('onboarding_done', False),
            "goal": result.get('goal')
        }
    }
