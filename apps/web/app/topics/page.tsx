'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AppShell } from '@/components/layout/AppShell'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { usersAPI } from '@/lib/api/users'
import { getScoreColor } from '@/lib/utils'

interface TopicStatusItem {
  topic_id: string
  topic_name: string
  topic_description?: string
  concept_count?: number
  last_score?: number | null
  last_session_at?: string | null
  session_count: number
  status: 'not_started' | 'in_progress' | 'strong'
}

export default function TopicsPage() {
  const router = useRouter()
  const [topics, setTopics] = useState<TopicStatusItem[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  useEffect(() => {
    async function loadTopics() {
      try {
        const result = await usersAPI.getTopicStatus()
        const topicList = Array.isArray(result)
          ? result
          : Array.isArray(result?.topics)
          ? result.topics
          : []
        setTopics(topicList)
      } catch (error) {
        console.error('Failed to load topics:', error)
        setTopics([])
      } finally {
        setLoading(false)
      }
    }
    loadTopics()
  }, [])

  const stats = useMemo(() => {
    const total = topics.length
    const strong = topics.filter((t) => t.status === 'strong').length
    const inProgress = topics.filter((t) => t.status === 'in_progress').length
    const notStarted = topics.filter((t) => t.status === 'not_started').length
    return { total, strong, inProgress, notStarted }
  }, [topics])

  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchName = t.topic_name?.toLowerCase().includes(q)
        const matchDesc = t.topic_description?.toLowerCase().includes(q)
        return matchName || matchDesc
      }
      return true
    })
  }, [topics, statusFilter, searchQuery])

  const getStatusBadge = (status: string) => {
    if (status === 'strong') return <Badge variant="known">Strong</Badge>
    if (status === 'in_progress') return <Badge variant="weak">In Progress</Badge>
    return <Badge variant="default">Not Started</Badge>
  }

  return (
    <AppShell>
      {/* Header section */}
      <div className="mb-8">
        <span className="text-xs uppercase font-mono tracking-widest text-accent font-semibold block mb-1">
          Topic Catalog & Diagnostic Browser
        </span>
        <h1 className="font-display font-bold text-3xl text-primary mb-2">
          Diagnostic Domains
        </h1>
        <p className="text-secondary text-sm max-w-2xl leading-relaxed">
          Comprehensive curriculum spanning foundational data structures, algorithmic patterns, and interview strategies.
          Select any topic to view its concept graph, study resources, or launch an interactive diagnostic session.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8">
        <div className="bg-surface rounded-xl p-4 border border-border">
          <span className="text-xs font-mono text-muted block mb-1">Total Domains</span>
          <span className="text-2xl font-display font-bold text-primary">{stats.total}</span>
        </div>
        <div className="bg-surface rounded-xl p-4 border border-border">
          <span className="text-xs font-mono text-muted block mb-1">Strong / Mastered</span>
          <span className="text-2xl font-display font-bold text-known">{stats.strong}</span>
        </div>
        <div className="bg-surface rounded-xl p-4 border border-border">
          <span className="text-xs font-mono text-muted block mb-1">In Progress</span>
          <span className="text-2xl font-display font-bold text-weak">{stats.inProgress}</span>
        </div>
        <div className="bg-surface rounded-xl p-4 border border-border">
          <span className="text-xs font-mono text-muted block mb-1">Not Started</span>
          <span className="text-2xl font-display font-bold text-secondary">{stats.notStarted}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-3.5 rounded-xl bg-surface border border-border">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {[
            { id: 'all', label: 'All Topics' },
            { id: 'not_started', label: 'Not Started' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'strong', label: 'Strong' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
                statusFilter === tab.id
                  ? 'bg-accent/15 border-accent text-primary'
                  : 'bg-surface-2 border-transparent text-secondary hover:text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative sm:w-72">
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
            placeholder="Search topics..."
            className="w-full bg-surface-2 pl-9 pr-8 py-1.5 text-xs rounded-lg text-primary placeholder-muted outline-none border border-border focus:border-accent transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-primary text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Topic Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : filteredTopics.length === 0 ? (
        <div className="bg-surface rounded-xl p-12 border border-border text-center">
          <p className="text-secondary text-sm mb-3">
            No topics matched your search or filter criteria.
          </p>
          <button
            onClick={() => {
              setStatusFilter('all')
              setSearchQuery('')
            }}
            className="text-xs font-medium text-accent hover:underline"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTopics.map((topic) => {
            const count = topic.concept_count && topic.concept_count > 0 ? topic.concept_count : 15
            const isCompleted = topic.session_count > 0 && topic.last_score !== null && topic.last_score !== undefined

            return (
              <div
                key={topic.topic_id}
                className="bg-surface rounded-xl p-5 md:p-6 border border-border hover:border-border-subtle transition-all duration-200 flex flex-col justify-between shadow-sm space-y-4"
              >
                <div>
                  {/* Top Header: Name + Badge */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <h2 className="font-display font-bold text-lg text-primary leading-snug">
                      {topic.topic_name}
                    </h2>
                    <div className="shrink-0">
                      {getStatusBadge(topic.status)}
                    </div>
                  </div>

                  {/* Description if present */}
                  {topic.topic_description && (
                    <p className="text-xs text-secondary line-clamp-2 leading-relaxed mb-4">
                      {topic.topic_description}
                    </p>
                  )}

                  {/* Key Topic Stats: Concept Count & Duration */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-surface-2 border border-border text-xs mb-4">
                    <div>
                      <span className="text-[10px] font-mono text-muted uppercase tracking-wider block">
                        Concepts
                      </span>
                      <span className="font-display font-semibold text-primary">
                        {count} concepts
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-muted uppercase tracking-wider block">
                        Est. Time
                      </span>
                      <span className="font-display font-semibold text-primary">
                        ~15 mins
                      </span>
                    </div>
                  </div>

                  {/* Diagnostic Performance / Last Score */}
                  <div className="mb-4">
                    {isCompleted ? (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-baseline text-xs">
                          <span className="text-secondary font-medium">Last Diagnostic Score</span>
                          <span
                            className="font-display font-bold text-base"
                            style={{ color: getScoreColor(topic.last_score!) }}
                          >
                            {topic.last_score}/100
                          </span>
                        </div>
                        <ProgressBar
                          value={topic.last_score!}
                          color={getScoreColor(topic.last_score!)}
                          showPercent={false}
                        />
                        <div className="flex justify-between text-[11px] text-muted font-mono pt-0.5">
                          <span>{topic.session_count} session{topic.session_count === 1 ? '' : 's'} completed</span>
                          {topic.last_session_at && (
                            <span>{new Date(topic.last_session_at).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-lg border border-dashed border-border text-center text-xs text-secondary">
                        No diagnostic attempts yet
                      </div>
                    )}
                  </div>

                  {/* Quick Hub Links */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 border-t border-border-subtle text-xs">
                    <Link
                      href={`/topics/${topic.topic_id}/graph`}
                      className="text-secondary hover:text-accent font-medium inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Graph</span>
                      <span className="text-[10px]">↗</span>
                    </Link>
                    <Link
                      href={`/topics/${topic.topic_id}/library`}
                      className="text-secondary hover:text-accent font-medium inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Library</span>
                      <span className="text-[10px]">↗</span>
                    </Link>
                    {topic.session_count > 0 && (
                      <Link
                        href={`/topics/${topic.topic_id}/history`}
                        className="text-secondary hover:text-accent font-medium inline-flex items-center gap-1 transition-colors"
                      >
                        <span>History</span>
                        <span className="text-[10px]">↗</span>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Primary Action Button */}
                <Button
                  variant={topic.status === 'not_started' ? 'primary' : 'secondary'}
                  className="w-full mt-2"
                  onClick={() => router.push(`/session/${topic.topic_id}/intro`)}
                >
                  {topic.status === 'not_started' ? 'Start Diagnostic →' : 'Re-diagnose →'}
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </AppShell>
  )
}
