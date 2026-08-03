from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime

class APIResponse(BaseModel):
    data: Any
    meta: dict = {"version": "1.0"}

class ErrorResponse(BaseModel):
    error: dict
    meta: dict = {"version": "1.0"}

class UserProfile(BaseModel):
    user_id: str
    email: str
    display_name: Optional[str]
    goal: Optional[str]
    onboarding_done: bool

class TopicStatus(BaseModel):
    topic_id: str
    topic_name: str
    last_score: Optional[int]
    session_count: int
    status: str
    last_session_at: Optional[datetime]

class ProbeItem(BaseModel):
    id: str
    context_reference: str
    question: str
    target_concept_id: str

class ChallengeTask(BaseModel):
    id: str
    instruction: str
    content: str
    type: str = "error_correction"

class ConceptKnown(BaseModel):
    concept_id: str
    concept_name: str
    evidence_quote: str
    stage_source: int

class ConceptWeak(BaseModel):
    concept_id: str
    concept_name: str
    gap_explanation: str
    evidence_quote: str
    stage_source: int

class ConceptMissing(BaseModel):
    concept_id: str
    concept_name: str
    importance: str
    prerequisite_for: list[str] = []

class MisconceptionItem(BaseModel):
    concept_id: str
    concept_name: str
    what_user_said: str
    correction: str
    confidence: float
    evidence_quote: str

class NextConceptItem(BaseModel):
    concept_id: str
    concept_name: str
    reason: str

class ScoreDetail(BaseModel):
    overall: int
    coverage: int
    depth: int
    accuracy: int
    connectivity: int
    delta: Optional[int]
    previous_score: Optional[int]

class UnderstandingProfile(BaseModel):
    session_id: str
    topic_id: str
    topic_name: str
    session_number: int
    score: ScoreDetail
    concepts: dict
    misconceptions: list[MisconceptionItem]
    next_concepts: list[NextConceptItem]
    completed_at: Optional[datetime]
    duration_seconds: Optional[int]
