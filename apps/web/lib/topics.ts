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
  },
  {
    id: 'dynamic_programming',
    name: 'Dynamic Programming',
    displayOrder: 5
  },
  {
    id: 'heaps',
    name: 'Heaps',
    displayOrder: 6
  },
  {
    id: 'tries',
    name: 'Tries',
    displayOrder: 7
  }
] as const

export type TopicId = typeof TOPICS[number]['id']
