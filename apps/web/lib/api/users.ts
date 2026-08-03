import { api } from '../api'

export const usersAPI = {
  getProfile: () =>
    api.get<any>('/user/profile'),

  updateProfile: (data: {
    goal?: string
    onboarding_done?: boolean
    display_name?: string
  }) => api.patch<any>('/user/profile', data),

  getTopicStatus: () =>
    api.get<any>('/user/topic-status'),

  getSessions: (limit = 5, topicId?: string) => {
    const params: Record<string, string> = {
      limit: String(limit)
    }
    if (topicId) params.topic_id = topicId
    return api.get<any>('/user/sessions', params)
  },

  getTopWeaknesses: (limit = 5) =>
    api.get<any>('/user/top-weaknesses', { limit: String(limit) }),
}
