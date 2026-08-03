export interface UserProfile {
  user_id: string
  email: string
  display_name: string | null
  goal: string | null
  onboarding_done: boolean
}

export interface Topic {
  id: string
  name: string
  description: string
  concept_count: number
  display_order: number
}

export interface ProbeItem {
  id: string
  context_reference: string
  question: string
  target_concept_id: string
}

export interface ChallengeTask {
  id: string
  instruction: string
  content: string
  type: string
}

export interface ScoreDetail {
  overall: number
  coverage: number
  depth: number
  accuracy: number
  connectivity: number
  delta?: number | null
  previous_score?: number | null
}

export interface ConceptKnown {
  concept_id: string
  concept_name: string
  evidence_quote: string
  stage_source: number
}

export interface ConceptWeak {
  concept_id: string
  concept_name: string
  gap_explanation: string
  evidence_quote: string
  stage_source: number
}

export interface ConceptMissing {
  concept_id: string
  concept_name: string
  importance: string
  prerequisite_for: string[]
}

export interface MisconceptionItem {
  concept_id: string
  concept_name: string
  what_user_said: string
  correction: string
  confidence: number
  evidence_quote: string
}

export interface NextConceptItem {
  concept_id: string
  concept_name: string
  reason: string
}

export interface UnderstandingProfile {
  session_id: string
  topic_id: string
  topic_name: string
  session_number: number
  score: ScoreDetail
  concepts: {
    known: ConceptKnown[]
    weak: ConceptWeak[]
    missing: ConceptMissing[]
  }
  misconceptions: MisconceptionItem[]
  next_concepts: NextConceptItem[]
  completed_at: string | null
  duration_seconds: number | null
}
