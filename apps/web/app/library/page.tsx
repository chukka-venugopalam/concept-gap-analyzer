'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { topicsAPI } from '@/lib/api/topics'

interface PracticeProblem {
  platform: string
  title: string
  url: string
  difficulty: string
}

interface ResourceLink {
  title: string
  url: string
}

interface ConceptItem {
  id: string
  name: string
  importance_weight?: number
  definition?: string
  real_world_example?: string | null
  resources?: ResourceLink[]
  practice_problems?: PracticeProblem[]
}

const IMPORTANCE_CONFIG: Record<
  number,
  { label: string; borderClass?: string; bgClass?: string; textClass?: string; borderColor?: string; color?: string }
> = {
  3: {
    label: 'Core / High Importance',
    borderClass: 'border-l-accent',
    bgClass: 'bg-accent/10',
    textClass: 'text-accent',
  },
  2: {
    label: 'Key Concept',
    borderColor: 'var(--tier-key)',
    color: 'var(--tier-key)',
  },
  1: {
    label: 'Foundational',
    borderColor: 'var(--tier-foundational)',
    color: 'var(--tier-foundational)',
  },
}

export default function LibraryPage() {
  const [topics, setTopics] = useState<any[]>([])
  const [selectedTopicId, setSelectedTopicId] = useState<string>('')
  const [concepts, setConcepts] = useState<ConceptItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Load topics dynamically
  useEffect(() => {
    async function loadTopics() {
      try {
        const res = await topicsAPI.getAll()
        const list = Array.isArray(res) ? res : res?.topics || res?.data?.topics || []
        if (Array.isArray(list) && list.length > 0) {
          setTopics(list)
          setSelectedTopicId((prev) => prev || list[0].id)
        }
      } catch (err: any) {
        console.error('Failed loading topics:', err)
      }
    }
    loadTopics()
  }, [])

  useEffect(() => {
    async function loadLibrary() {
      if (!selectedTopicId) return
      try {
        setLoading(true)
        setError('')
        const res = await topicsAPI.getLibrary(selectedTopicId)
        const libraryData = res?.data || res
        setConcepts(libraryData?.nodes || [])
      } catch (err: any) {
        console.error('Failed loading concept library:', err)
        setError(err.message || 'Failed loading concept library')
      } finally {
        setLoading(false)
      }
    }
    if (selectedTopicId) {
      loadLibrary()
    }
  }, [selectedTopicId])

  const currentTopic = topics.find((t) => t.id === selectedTopicId) || topics[0] || { id: selectedTopicId, name: selectedTopicId }

  const filteredConcepts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return concepts
    return concepts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.definition && c.definition.toLowerCase().includes(q)) ||
        (c.real_world_example && c.real_world_example.toLowerCase().includes(q))
    )
  }, [concepts, searchQuery])

  const getDifficultyBadge = (difficulty: string) => {
    const diff = (difficulty || '').toLowerCase()
    if (diff === 'easy') {
      return <Badge variant="known">Easy</Badge>
    }
    if (diff === 'medium') {
      return <Badge variant="weak">Medium</Badge>
    }
    if (diff === 'hard') {
      return <Badge variant="missing">Hard</Badge>
    }
    return <Badge variant="default">{difficulty}</Badge>
  }

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-6">
        <span className="text-xs uppercase font-mono tracking-widest text-accent font-semibold block mb-1">
          Reference & Practice
        </span>
        <h1 className="font-display font-bold text-2xl text-primary">
          Concept Library
        </h1>
        <p className="text-xs text-secondary mt-1">
          Complete encyclopedia of core concepts, real-world examples, verified study resources, and curated practice problems.
        </p>
      </div>

      {/* Topic Picker */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {topics.map((topic) => {
          const active = topic.id === selectedTopicId
          return (
            <button
              key={topic.id}
              onClick={() => {
                setSelectedTopicId(topic.id)
                setSearchQuery('')
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                active
                  ? 'bg-accent/15 border-accent text-primary shadow-accent'
                  : 'bg-surface border-border text-secondary hover:text-primary hover:border-border-subtle'
              }`}
            >
              {topic.name}
            </button>
          )
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-3 rounded-xl border border-border">
        <div className="relative flex-1">
          <svg
            className="w-4 h-4 text-secondary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Filter ${currentTopic.name} concepts by name or keyword...`}
            className="w-full bg-surface-2 pl-9 pr-8 py-2 text-xs rounded-lg text-primary placeholder-muted outline-none border border-border focus:border-accent transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-primary text-xs"
              aria-label="Clear filter"
            >
              ✕
            </button>
          )}
        </div>

        <span className="text-xs font-mono text-secondary shrink-0 self-center">
          Showing <strong className="text-primary">{filteredConcepts.length}</strong> of{' '}
          {concepts.length} concepts
        </span>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-lg bg-missing-dim text-missing border border-missing/20 text-xs mb-6">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
        </div>
      ) : filteredConcepts.length === 0 ? (
        <div className="bg-surface rounded-xl p-10 border border-border text-center">
          <p className="text-sm text-secondary mb-3">
            No concepts matched &quot;{searchQuery}&quot; in {currentTopic.name}.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs font-medium text-accent hover:underline"
          >
            Clear search filter
          </button>
        </div>
      ) : (
        /* Concept Cards List */
        <div className="space-y-4">
          {filteredConcepts.map((concept) => {
            const weight = concept.importance_weight || 2
            const config = IMPORTANCE_CONFIG[weight] || IMPORTANCE_CONFIG[2]

            // Group practice problems by platform
            const problemsByPlatform: Record<string, PracticeProblem[]> = {}
            if (concept.practice_problems) {
              concept.practice_problems.forEach((p) => {
                const platform = p.platform || 'General'
                if (!problemsByPlatform[platform]) problemsByPlatform[platform] = []
                problemsByPlatform[platform].push(p)
              })
            }

            return (
              <div
                key={concept.id}
                className={`bg-surface rounded-xl p-5 md:p-6 border border-border border-l-4 ${config.borderClass ?? ''} transition-all hover:border-border-subtle shadow-sm`}
                style={config.borderColor ? { borderLeftColor: config.borderColor } : undefined}
              >
                {/* Header: Name + Importance Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                  <h3 className="font-display font-bold text-base md:text-lg text-primary">
                    {concept.name}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium shrink-0 self-start sm:self-center ${config.bgClass ?? ''} ${config.textClass ?? ''} border border-current/20`}
                    style={config.color ? { color: config.color, backgroundColor: `color-mix(in srgb, ${config.color} 10%, transparent)` } : undefined}
                  >
                    {config.label}
                  </span>
                </div>

                {/* Definition */}
                {concept.definition && (
                  <p className="text-xs md:text-sm text-secondary leading-relaxed mb-3">
                    {concept.definition}
                  </p>
                )}

                {/* Real-world Example */}
                {concept.real_world_example && (
                  <div className="p-3.5 mb-4 rounded-lg bg-bg border border-border text-xs">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold block mb-1">
                      In Practice:
                    </span>
                    <p className="text-secondary italic leading-relaxed">
                      {concept.real_world_example}
                    </p>
                  </div>
                )}

                {/* Dual Sub-Grid: Resources & Practice Problems */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-border/80">
                  {/* Study Resources */}
                  <div>
                    <h4 className="text-[11px] font-mono uppercase tracking-wider text-muted mb-2 font-semibold">
                      Study Resources
                    </h4>
                    {concept.resources && concept.resources.length > 0 ? (
                      <ul className="space-y-1.5">
                        {concept.resources.map((res, i) => (
                          <li key={i}>
                            <a
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-accent hover:underline font-medium inline-flex items-center gap-1 group"
                            >
                              <span className="group-hover:text-primary transition-colors">
                                {res.title}
                              </span>
                              <span className="text-[10px] text-muted group-hover:text-accent">
                                ↗
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-muted italic">
                        No study links added yet.
                      </p>
                    )}
                  </div>

                  {/* Practice Problems */}
                  <div>
                    <h4 className="text-[11px] font-mono uppercase tracking-wider text-muted mb-2 font-semibold">
                      Practice Problems
                    </h4>
                    {Object.keys(problemsByPlatform).length > 0 ? (
                      <div className="space-y-2.5">
                        {Object.entries(problemsByPlatform).map(
                          ([platform, problems]) => (
                            <div key={platform}>
                              <span className="text-[10px] font-mono text-secondary font-semibold uppercase block mb-1">
                                {platform}
                              </span>
                              <ul className="space-y-1.5">
                                {problems.map((prob, i) => (
                                  <li
                                    key={i}
                                    className="flex items-center justify-between gap-2"
                                  >
                                    <a
                                      href={prob.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-primary hover:text-accent hover:underline font-medium truncate inline-flex items-center gap-1 group"
                                    >
                                      <span className="truncate">
                                        {prob.title}
                                      </span>
                                      <span className="text-[10px] text-muted group-hover:text-accent shrink-0">
                                        ↗
                                      </span>
                                    </a>
                                    <div className="shrink-0">
                                      {getDifficultyBadge(prob.difficulty)}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-muted italic">
                        No practice problems added yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </AppShell>
  )
}
