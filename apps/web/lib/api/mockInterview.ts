import { api } from '../api'

export const mockInterviewAPI = {
  start: (interviewQuestionId: number) =>
    api.post<any>('/mock-interview/start', {
      interview_question_id: interviewQuestionId,
    }),

  submitTurn: (sessionId: string, message: string) =>
    api.post<any>(`/mock-interview/${sessionId}/turn`, { message }),

  finish: (sessionId: string, finalCode?: string) =>
    api.post<any>(`/mock-interview/${sessionId}/finish`, {
      final_code: finalCode ?? null,
    }),
}
