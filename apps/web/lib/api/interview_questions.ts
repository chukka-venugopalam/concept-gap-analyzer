import { api } from '../api'

export interface InterviewQuestion {
  id: number
  concept_id?: string | null
  concept_name?: string | null
  topic_id?: string | null
  topic_name?: string | null
  question_type: 'coding' | 'theory' | 'behavioral' | 'real_world'
  company: string
  prompt: string
  difficulty?: string | null
  company_note?: string | null
  reference_notes?: string | null
  display_order?: number
}

export interface InterviewQuestionFilters {
  company?: string
  question_type?: string
  concept_id?: string
}

export const interviewQuestionsAPI = {
  getAll: (filters?: InterviewQuestionFilters) => {
    const params: Record<string, string> = {}
    if (filters?.company) params.company = filters.company
    if (filters?.question_type) params.question_type = filters.question_type
    if (filters?.concept_id) params.concept_id = filters.concept_id
    return api.get<any>('/interview-questions', Object.keys(params).length ? params : undefined)
  },

  getCompanies: () =>
    api.get<any>('/interview-questions/companies'),
}
