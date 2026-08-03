import { api } from '../api'

export const sessionsAPI = {
  getActive: (topicId: string) =>
    api.get<any>('/session/active', { topic_id: topicId }),

  start: (topicId: string) =>
    api.post<any>('/session/start', { topic_id: topicId }),

  analyzeStage1: (sessionId: string, response: string) =>
    api.post<any>('/session/analyze/stage1', {
      session_id: sessionId,
      stage1_response: response
    }),

  analyzeStage2: (
    sessionId: string,
    probeResponses: { probe_id: string; response: string }[]
  ) =>
    api.post<any>('/session/analyze/stage2', {
      session_id: sessionId,
      probe_responses: probeResponses
    }),

  analyzeStage3: (sessionId: string, response: string) =>
    api.post<any>('/session/analyze/stage3', {
      session_id: sessionId,
      stage3_response: response
    }),

  evaluate: (sessionId: string) =>
    api.post<any>('/session/evaluate', { session_id: sessionId }),

  getResults: (sessionId: string) =>
    api.get<any>(`/session/${sessionId}/results`),
}
