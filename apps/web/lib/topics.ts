export type TopicId = string

export interface Topic {
  id: string
  name: string
  description?: string
  display_order?: number
  displayOrder?: number
  concept_count?: number
}
