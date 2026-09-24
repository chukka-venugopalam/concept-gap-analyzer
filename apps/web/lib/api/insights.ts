import { api } from '../api'

export const insightsAPI = {
  getMisconceptionLeaderboard: (limit = 20) =>
    api.get<any>(`/insights/misconceptions?limit=${limit}`),

  getConceptMisconceptionStats: (conceptId: string) =>
    api.get<any>(`/insights/misconceptions/${conceptId}`),
}
