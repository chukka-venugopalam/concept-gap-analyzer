import { api } from '../api'

export const topicsAPI = {
  getAll: () =>
    api.get<any>('/topics'),

  getSessions: (topicId: string) =>
    api.get<any>(`/topics/${topicId}/sessions`),

  getGraph: (topicId: string) =>
    api.get<any>(`/topics/${topicId}/graph`),

  getLibrary: (topicId: string) =>
    api.get<any>(`/topics/${topicId}/library`),
}
