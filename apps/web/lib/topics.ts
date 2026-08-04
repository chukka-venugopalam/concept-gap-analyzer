export const TOPICS = [
  {
    id: 'arrays_hashing',
    name: 'Arrays & Hashing',
    displayOrder: 1
  },
  {
    id: 'linked_lists',
    name: 'Linked Lists',
    displayOrder: 2
  },
  {
    id: 'binary_trees',
    name: 'Binary Trees',
    displayOrder: 3
  },
  {
    id: 'graphs',
    name: 'Graphs',
    displayOrder: 4
  }
] as const

export type TopicId = typeof TOPICS[number]['id']
