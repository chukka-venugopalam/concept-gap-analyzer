'use client'

import React, { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { AppShell } from '@/components/layout/AppShell'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import {
  interviewQuestionsAPI,
  InterviewQuestion,
} from '@/lib/api/interview_questions'

const QUESTION_TYPES = [
  { id: 'all', label: 'All Types' },
  { id: 'coding', label: 'Coding' },
  { id: 'theory', label: 'Theory & Complexity' },
  { id: 'behavioral', label: 'Behavioral & Leadership' },
  { id: 'real_world', label: 'Real-World & Production' },
]

function renderPromptWithLinks(text: string) {
  const urlRegex = /(https?:\/\/[^\s\)]+)/g
  const parts = text.split(urlRegex)
  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline inline-flex items-center gap-0.5 font-medium break-all"
        >
          <span>{part}</span>
          <span className="text-[10px] no-underline">↗</span>
        </a>
      )
    }
    return <React.Fragment key={index}>{part}</React.Fragment>
  })
}

export default function InterviewQuestionsPage() {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([])
  const [companies, setCompanies] = useState<string[]>([])
  const [selectedCompany, setSelectedCompany] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [expandedNotes, setExpandedNotes] = useState<Record<number, boolean>>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  // Load distinct companies on mount
  useEffect(() => {
    async function loadCompanies() {
      try {
        const res = await interviewQuestionsAPI.getCompanies()
        const list = Array.isArray(res)
          ? res
          : res?.companies || res?.data?.companies || []
        if (Array.isArray(list)) {
          setCompanies(list)
        }
      } catch (err: any) {
        console.error('Failed loading companies:', err)
      }
    }
    loadCompanies()
  }, [])

  // Load questions when filter dropdowns change
  useEffect(() => {
    async function loadQuestions() {
      try {
        setLoading(true)
        setError('')
        const filters: { company?: string; question_type?: string } = {}
        if (selectedCompany && selectedCompany !== 'all') {
          filters.company = selectedCompany
        }
        if (selectedType && selectedType !== 'all') {
          filters.question_type = selectedType
        }

        const res = await interviewQuestionsAPI.getAll(filters)
        const qData = res?.data || res
        const list = Array.isArray(qData)
          ? qData
          : Array.isArray(qData?.questions)
          ? qData.questions
          : []
        setQuestions(list)
      } catch (err: any) {
        console.error('Failed loading interview questions:', err)
        setError(err.message || 'Failed loading interview questions')
      } finally {
        setLoading(false)
      }
    }
    loadQuestions()
  }, [selectedCompany, selectedType])

  const toggleNotes = (id: number) => {
    setExpandedNotes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const filteredQuestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return questions
    return questions.filter((item) => {
      const matchPrompt = item.prompt?.toLowerCase().includes(q)
      const matchNote = item.company_note?.toLowerCase().includes(q)
      const matchCompany = item.company?.toLowerCase().includes(q)
      const matchConcept = item.concept_name?.toLowerCase().includes(q)
      const matchTopic = item.topic_name?.toLowerCase().includes(q)
      return (
        matchPrompt ||
        matchNote ||
        matchCompany ||
        matchConcept ||
        matchTopic
      )
    })
  }, [questions, searchQuery])

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'coding':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-accent-dim text-accent border border-accent/20">
            Coding
          </span>
        )
      case 'theory':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-surface-2 text-secondary border border-border">
            Theory
          </span>
        )
      case 'behavioral':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-known-dim text-known border border-known/20">
            Behavioral
          </span>
        )
      case 'real_world':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-weak-dim text-weak border border-weak/20">
            Real-World
          </span>
        )
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-surface-2 text-secondary border border-border">
            {type}
          </span>
        )
    }
  }

  const getDifficultyBadge = (difficulty?: string | null) => {
    if (!difficulty) return null
    const diff = difficulty.toLowerCase()
    if (diff === 'easy') return <Badge variant="known">Easy</Badge>
    if (diff === 'medium') return <Badge variant="weak">Medium</Badge>
    if (diff === 'hard') return <Badge variant="missing">Hard</Badge>
    return <Badge variant="default">{difficulty}</Badge>
  }

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-6">
        <span className="text-xs uppercase font-mono tracking-widest text-accent font-semibold block mb-1">
          Company Prep & Questions
        </span>
        <h1 className="font-display font-bold text-2xl text-primary">
          Interview Questions
        </h1>
        <p className="text-xs text-secondary mt-1">
          Verified company interview styles, leadership principle pairings, live coding prompts, and technical defenses.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 p-4 rounded-xl bg-surface border border-border space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Company Dropdown */}
          <div className="sm:w-52">
            <label className="text-[10px] font-mono uppercase tracking-wider text-muted block mb-1 font-semibold">
              Company
            </label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full bg-surface-2 px-3 py-2 text-xs rounded-lg text-primary border border-border focus:border-accent outline-none cursor-pointer"
            >
              <option value="all">All Companies</option>
              {companies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Question Type Dropdown */}
          <div className="sm:w-56">
            <label className="text-[10px] font-mono uppercase tracking-wider text-muted block mb-1 font-semibold">
              Question Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-surface-2 px-3 py-2 text-xs rounded-lg text-primary border border-border focus:border-accent outline-none cursor-pointer"
            >
              {QUESTION_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="flex-1">
            <label className="text-[10px] font-mono uppercase tracking-wider text-muted block mb-1 font-semibold">
              Search Keywords
            </label>
            <div className="relative">
              <svg
                className="w-3.5 h-3.5 text-secondary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
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
                placeholder="Filter by prompt, note, concept..."
                className="w-full bg-surface-2 pl-8 pr-8 py-2 text-xs rounded-lg text-primary placeholder-muted outline-none border border-border focus:border-accent transition-colors"
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
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-secondary pt-1 border-t border-border-subtle">
          <span>
            Showing <strong className="text-primary">{filteredQuestions.length}</strong> questions
            {selectedCompany !== 'all' && ` for ${selectedCompany}`}
            {selectedType !== 'all' && ` (${selectedType})`}
          </span>
          {(selectedCompany !== 'all' || selectedType !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCompany('all')
                setSelectedType('all')
                setSearchQuery('')
              }}
              className="text-xs text-accent hover:underline font-medium"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-missing-dim text-missing border border-missing/20 text-xs mb-6">
          {error}
        </div>
      )}

      {/* Questions List */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="bg-surface rounded-xl p-10 border border-border text-center">
          <p className="text-sm text-secondary mb-3">
            No interview questions matched your current filters.
          </p>
          <button
            onClick={() => {
              setSelectedCompany('all')
              setSelectedType('all')
              setSearchQuery('')
            }}
            className="text-xs font-medium text-accent hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q) => {
            const isExpanded = !!expandedNotes[q.id]

            return (
              <div
                key={q.id}
                className="bg-surface rounded-xl p-5 md:p-6 border border-border hover:border-border-subtle shadow-sm transition-all space-y-3.5"
              >
                {/* Header: Company, Question Type, Difficulty, Concept link */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-display font-bold bg-surface-2 border border-border text-primary">
                      {q.company}
                    </span>
                    {getTypeBadge(q.question_type)}
                    {getDifficultyBadge(q.difficulty)}
                  </div>

                  {q.concept_name && q.topic_id && (
                    <Link
                      href={`/topics/${q.topic_id}/library`}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-muted hover:text-accent transition-colors shrink-0"
                    >
                      <span>{q.concept_name}</span>
                      {q.topic_name && (
                        <span className="text-secondary">({q.topic_name})</span>
                      )}
                      <span>↗</span>
                    </Link>
                  )}
                </div>

                {/* Prompt with clickable links */}
                <div className="text-sm md:text-base font-medium text-primary leading-relaxed">
                  {renderPromptWithLinks(q.prompt)}
                </div>

                {/* Prominent Company Note (Core Differentiator) */}
                {q.company_note && (
                  <div className="p-3.5 rounded-lg bg-bg border border-border text-xs">
                    <div className="flex items-center gap-1.5 mb-1 text-accent font-semibold font-mono text-[11px] uppercase tracking-wider">
                      <svg
                        className="w-3.5 h-3.5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{q.company} Interview Pattern & Focus:</span>
                    </div>
                    <p className="text-secondary leading-relaxed">
                      {q.company_note}
                    </p>
                  </div>
                )}

                {/* Expandable Reference Notes */}
                {q.reference_notes && (
                  <div className="pt-1">
                    <button
                      onClick={() => toggleNotes(q.id)}
                      className="text-xs font-mono text-secondary hover:text-primary inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <svg
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      <span>
                        {isExpanded
                          ? 'Hide Solution Guidance & Key Points'
                          : 'View Solution Guidance & Key Points'}
                      </span>
                    </button>
                    {isExpanded && (
                      <div className="mt-2.5 p-3 rounded-lg bg-surface-2 border border-border text-xs text-secondary leading-relaxed animate-in fade-in duration-150">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-muted block mb-1 font-semibold">
                          Reference & Complexity Notes:
                        </span>
                        <p>{q.reference_notes}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Start Mock Interview — coding questions only */}
                {q.question_type === 'coding' && (
                  <div className="pt-1 flex justify-end">
                    <Link
                      href={`/interview/mock/${q.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent/90 transition-colors"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Start Mock Interview
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </AppShell>
  )
}
