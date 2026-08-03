from pydantic import BaseModel, Field
from typing import Optional

class SyncUserRequest(BaseModel):
    email: str
    display_name: Optional[str] = None

class UpdateProfileRequest(BaseModel):
    goal: Optional[str] = None
    onboarding_done: Optional[bool] = None
    display_name: Optional[str] = None

class StartSessionRequest(BaseModel):
    topic_id: str

class Stage1Request(BaseModel):
    session_id: str
    stage1_response: str = Field(min_length=50)

class ProbeResponse(BaseModel):
    probe_id: str
    response: str

class Stage2Request(BaseModel):
    session_id: str
    probe_responses: list[ProbeResponse]

class Stage3Request(BaseModel):
    session_id: str
    stage3_response: str = Field(min_length=20)

class EvaluateRequest(BaseModel):
    session_id: str
