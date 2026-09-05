'use client'

import React, { useEffect, useState } from 'react'
import * as d3 from 'd3'
import { useTheme } from 'next-themes'
import { Badge } from '@/components/ui/Badge'

export interface PracticeProblem {
  platform: string
  title: string
  url: string
  difficulty: string
}

export interface ResourceLink {
  title: string
  url: string
}

export interface NodeItem {
  id: string
  name: string
  importance_weight?: number
  status?: string
  topic_id?: string
  topic_name?: string
  definition?: string
  real_world_example?: string | null
  resources?: ResourceLink[]
  practice_problems?: PracticeProblem[]
}

export interface EdgeItem {
  source: string
  target: string
  type?: 'hard' | 'cross_topic' | 'prerequisite' | 'related'
  isCrossTopic?: boolean
}

export interface ConceptGraphProps {
  nodes: NodeItem[]
  edges: EdgeItem[]
  mode?: 'diagnostic' | 'library'
  height?: number
  width?: number
}

export const STATUS_COLORS: Record<string, string> = {
  known: '#1DB887',
  weak: '#E8A838',
  missing: '#E85555',
  misconception: '#C44FD4',
  not_assessed: '#4A4A6A',
}

export const STATUS_DIM_COLORS: Record<string, string> = {
  known: 'rgba(29,184,135,0.18)',
  weak: 'rgba(232,168,56,0.18)',
  missing: 'rgba(232,85,85,0.18)',
  misconception: 'rgba(196,79,212,0.18)',
  not_assessed: 'rgba(74,74,106,0.15)',
}

export const STATUS_LABELS: Record<string, string> = {
  known: 'Understood',
  weak: 'Needs Depth',
  missing: 'Not Covered',
  misconception: 'Misconception',
  not_assessed: 'Not Assessed',
}

export const LIBRARY_COLORS: Record<number, string> = {
  3: '#6B6BF0', // Core / High importance (fallback for dark)
  2: 'var(--tier-key)', // Key concept
  1: 'var(--tier-foundational)', // Foundational
}

export const LIBRARY_DIM_COLORS: Record<number, string> = {
  3: 'rgba(107,107,240,0.22)',
  2: 'var(--tier-key-dim)',
  1: 'var(--tier-foundational-dim)',
}

function splitLabel(name: string): string[] {
  if (name.length <= 14) return [name]
  const mid = Math.floor(name.length / 2)
  let bestSpace = -1
  let minDiff = Infinity
  for (let i = 0; i < name.length; i++) {
    if (name[i] === ' ') {
      const diff = Math.abs(i - mid)
      if (diff < minDiff) {
        minDiff = diff
        bestSpace = i
      }
    }
  }
  if (bestSpace !== -1 && bestSpace > 1 && bestSpace < name.length - 2) {
    return [name.slice(0, bestSpace), name.slice(bestSpace + 1)]
  }
  return [name.slice(0, Math.ceil(name.length / 2)), name.slice(Math.ceil(name.length / 2))]
}

export function ConceptGraph({
  nodes,
  edges,
  mode = 'diagnostic',
  width = 900,
  height = 600,
}: ConceptGraphProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isLight = mounted && theme === 'light'

  const accentColor = isLight ? '#C4183D' : '#6B6BF0'
  const mutedColor = isLight ? '#9A9AAA' : '#4A4A6A'
  const textColor = isLight ? '#1A1A1F' : '#F0F0F5'
  const notAssessedColor = isLight ? '#9A9AAA' : '#4A4A6A'

  const currentLibraryColors: Record<number, string> = {
    3: accentColor,
    2: 'var(--tier-key)',
    1: 'var(--tier-foundational)',
  }

  const currentLibraryDimColors: Record<number, string> = {
    3: isLight ? 'rgba(196,24,61,0.15)' : 'rgba(107,107,240,0.22)',
    2: 'var(--tier-key-dim)',
    1: 'var(--tier-foundational-dim)',
  }

  const currentStatusColors: Record<string, string> = {
    ...STATUS_COLORS,
    not_assessed: notAssessedColor,
  }

  const currentStatusDimColors: Record<string, string> = {
    ...STATUS_DIM_COLORS,
    not_assessed: isLight ? 'rgba(154,154,170,0.15)' : 'rgba(74,74,106,0.15)',
  }

  const [simNodes, setSimNodes] = useState<any[]>([])
  const [simLinks, setSimLinks] = useState<any[]>([])
  const [hoveredNode, setHoveredNode] = useState<NodeItem | null>(null)
  const [selectedNode, setSelectedNode] = useState<NodeItem | null>(null)

  useEffect(() => {
    if (!nodes || nodes.length === 0) return

    const nodesCopy = nodes.map((n) => ({ ...n }))
    const linksCopy = edges.map((e) => ({
      source: e.source,
      target: e.target,
      type: e.type || (e.isCrossTopic ? 'cross_topic' : 'hard'),
      isCrossTopic: e.isCrossTopic || e.type === 'cross_topic',
    }))

    const simulation = d3
      .forceSimulation(nodesCopy as any)
      .force(
        'link',
        d3
          .forceLink(linksCopy as any)
          .id((d: any) => d.id)
          .distance(110)
      )
      .force('charge', d3.forceManyBody().strength(-480))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force(
        'collision',
        d3.forceCollide().radius((d: any) => 30 + (d.importance_weight || 2) * 5)
      )

    simulation.on('tick', () => {
      nodesCopy.forEach((n: any) => {
        const r = 10 + (n.importance_weight || 2) * 5
        const labelPadding = 75
        n.x = Math.max(r + labelPadding, Math.min(width - r - labelPadding, n.x))
        n.y = Math.max(r + 35, Math.min(height - r - 35, n.y))
      })

      const resolvedLinks = linksCopy
        .filter(
          (l: any) =>
            l.source &&
            l.target &&
            l.source.x !== undefined &&
            l.target.x !== undefined
        )
        .map((l: any) => ({
          source: { id: l.source.id, x: l.source.x, y: l.source.y },
          target: { id: l.target.id, x: l.target.x, y: l.target.y },
          type: l.type,
          isCrossTopic: l.isCrossTopic,
        }))

      setSimNodes([...nodesCopy])
      setSimLinks(resolvedLinks)
    })

    return () => {
      simulation.stop()
    }
  }, [nodes, edges, width, height])

  const getNodeColor = (node: NodeItem) => {
    if (mode === 'library') {
      const weight = node.importance_weight || 2
      return currentLibraryColors[weight] || 'var(--tier-key)'
    }
    return currentStatusColors[node.status || ''] || currentStatusColors.not_assessed
  }

  const getNodeDimColor = (node: NodeItem) => {
    if (mode === 'library') {
      const weight = node.importance_weight || 2
      return currentLibraryDimColors[weight] || 'var(--tier-key-dim)'
    }
    return currentStatusDimColors[node.status || ''] || currentStatusDimColors.not_assessed
  }

  // Group practice problems by platform for selectedNode
  const problemsByPlatform: Record<string, PracticeProblem[]> = {}
  if (selectedNode?.practice_problems) {
    selectedNode.practice_problems.forEach((p) => {
      const platform = p.platform || 'General'
      if (!problemsByPlatform[platform]) problemsByPlatform[platform] = []
      problemsByPlatform[platform].push(p)
    })
  }

  const getDifficultyBadge = (difficulty: string) => {
    const diff = difficulty.toLowerCase()
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
    <div className="bg-surface rounded-xl p-4 border border-border flex flex-col items-center relative">
      <div className="w-full relative overflow-hidden rounded-lg bg-bg/50">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-[600px] select-none"
        >
          <defs>
            {/* Hard prerequisite arrowhead - theme accent */}
            <marker
              id="arrowhead-accent"
              viewBox="0 -5 10 10"
              refX="22"
              refY="0"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M0,-5L10,0L0,5" fill={accentColor} />
            </marker>

            {/* Cross-topic / related arrowhead - muted */}
            <marker
              id="arrowhead-muted"
              viewBox="0 -5 10 10"
              refX="22"
              refY="0"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M0,-5L10,0L0,5" fill={mutedColor} />
            </marker>

            {/* SVG Glow/Shadow Filter definitions - soft shadow in light mode, glow in dark mode */}
            <filter id="glow-accent" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow
                dx="0"
                dy={isLight ? 2 : 0}
                stdDeviation={isLight ? 2.5 : 6}
                floodColor={accentColor}
                floodOpacity={isLight ? 0.25 : 0.45}
              />
            </filter>
            <filter id="glow-known" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow
                dx="0"
                dy={isLight ? 2 : 0}
                stdDeviation={isLight ? 2.5 : 6}
                floodColor="#1DB887"
                floodOpacity={isLight ? 0.25 : 0.45}
              />
            </filter>
            <filter id="glow-weak" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow
                dx="0"
                dy={isLight ? 2 : 0}
                stdDeviation={isLight ? 2.5 : 6}
                floodColor="#E8A838"
                floodOpacity={isLight ? 0.25 : 0.45}
              />
            </filter>
            <filter id="glow-missing" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow
                dx="0"
                dy={isLight ? 2 : 0}
                stdDeviation={isLight ? 2.5 : 6}
                floodColor="#E85555"
                floodOpacity={isLight ? 0.25 : 0.45}
              />
            </filter>
            <filter id="glow-misconception" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow
                dx="0"
                dy={isLight ? 2 : 0}
                stdDeviation={isLight ? 2.5 : 6}
                floodColor="#C44FD4"
                floodOpacity={isLight ? 0.25 : 0.45}
              />
            </filter>
          </defs>

          {/* Edges */}
          <g>
            {simLinks.map((link, idx) => {
              const isCross = link.isCrossTopic || link.type === 'cross_topic'
              return (
                <line
                  key={idx}
                  x1={link.source.x}
                  y1={link.source.y}
                  x2={link.target.x}
                  y2={link.target.y}
                  stroke={isCross ? mutedColor : accentColor}
                  strokeWidth={isCross ? '1.5' : '1.75'}
                  strokeOpacity={isCross ? (isLight ? 0.5 : 0.4) : (isLight ? 0.75 : 0.85)}
                  strokeDasharray={isCross ? '4,4' : undefined}
                  markerEnd={isCross ? 'url(#arrowhead-muted)' : 'url(#arrowhead-accent)'}
                />
              )
            })}
          </g>

          {/* Nodes */}
          <g>
            {simNodes.map((node) => {
              const weight = node.importance_weight || 2
              const radius = 10 + weight * 5
              const auraRadius = radius + weight * 3
              const color = getNodeColor(node)
              const dimColor = getNodeDimColor(node)
              const isHovered = hoveredNode?.id === node.id
              const isSelected = selectedNode?.id === node.id

              let filterUrl: string | undefined = undefined
              if (mode === 'diagnostic' && node.status && node.status !== 'not_assessed') {
                filterUrl = `url(#glow-${node.status})`
              } else if (mode === 'library' && weight >= 3) {
                filterUrl = 'url(#glow-accent)'
              }

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x},${node.y})`}
                  className="cursor-pointer transition-transform"
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => {
                    if (mode === 'library') {
                      setSelectedNode(node)
                    } else {
                      setHoveredNode(node)
                    }
                  }}
                >
                  {/* Outer Aura Ring scaled by importance weight */}
                  {(weight >= 2 || isHovered || isSelected) && (
                    <circle
                      r={auraRadius}
                      fill={dimColor}
                      className="transition-all duration-300 pointer-events-none"
                    />
                  )}

                  {/* Core Node Circle with status/weight glow or shadow */}
                  <circle
                    r={radius}
                    fill={color}
                    filter={filterUrl}
                    stroke={
                      isSelected
                        ? (isLight ? '#1A1A1F' : '#FFFFFF')
                        : isHovered
                        ? (isLight ? '#4A4A6A' : '#F0F0F5')
                        : (isLight ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.3)')
                    }
                    strokeWidth={isSelected ? 3.5 : isHovered ? 2.5 : 1.5}
                  />

                  {/* Multi-line Label */}
                  <text
                    textAnchor="middle"
                    fill={textColor}
                    fontSize={weight >= 3 ? '11' : '10'}
                    fontWeight={weight >= 3 ? '600' : '500'}
                    className={`pointer-events-none font-mono select-none ${isLight ? '' : 'drop-shadow'}`}
                  >
                    {(() => {
                      const lines = splitLabel(node.name)
                      if (lines.length > 1) {
                        return (
                          <>
                            <tspan x="0" dy={radius + 12}>{lines[0]}</tspan>
                            <tspan x="0" dy="11">{lines[1]}</tspan>
                          </>
                        )
                      }
                      return <tspan x="0" dy={radius + 14}>{lines[0]}</tspan>
                    })()}
                  </text>
                </g>
              )
            })}
          </g>
        </svg>
      </div>

      {/* Mode-specific Footer / Legend / Inspector */}
      {mode === 'diagnostic' ? (
        <div className="mt-4 min-h-[32px] flex items-center justify-center">
          {hoveredNode ? (
            <div className="flex items-center gap-2 text-xs font-mono bg-surface-2 px-3 py-1.5 rounded-md border border-border">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{
                  backgroundColor:
                    currentStatusColors[hoveredNode.status || ''] || currentStatusColors.not_assessed,
                }}
              />
              <span className="font-bold text-primary">{hoveredNode.name}</span>
              <span className="text-secondary">•</span>
              <span className="text-secondary">
                {STATUS_LABELS[hoveredNode.status || ''] || 'Not Assessed'}
              </span>
            </div>
          ) : (
            <span className="text-xs text-muted font-mono italic">
              Hover or tap a concept node to view mastery status
            </span>
          )}
        </div>
      ) : (
        <div className="mt-4 min-h-[32px] flex items-center justify-center">
          <span className="text-xs text-muted font-mono italic">
            Click any concept node to view definition, resources, and practice problems
          </span>
        </div>
      )}

      {/* Library Mode: Selected Concept Detail Drawer / Side Sheet */}
      {mode === 'library' && selectedNode && (
        <div className="w-full mt-4 p-5 rounded-xl bg-surface-2 border border-border text-left animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-3 h-3 rounded-full inline-block"
                  style={{ backgroundColor: getNodeColor(selectedNode) }}
                />
                <h3 className="font-display font-bold text-base text-primary">
                  {selectedNode.name}
                </h3>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
                {selectedNode.importance_weight === 3
                  ? 'Core / High Priority'
                  : selectedNode.importance_weight === 1
                  ? 'Foundational'
                  : 'Key Concept'}
              </span>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-muted hover:text-primary text-sm p-1 rounded hover:bg-surface transition-colors cursor-pointer"
              aria-label="Close details"
            >
              ✕
            </button>
          </div>

          {selectedNode.definition && (
            <p className="text-xs text-secondary leading-relaxed mb-4">
              {selectedNode.definition}
            </p>
          )}

          {selectedNode.real_world_example && (
            <div className="p-3 mb-4 rounded-lg bg-bg border border-border text-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold block mb-1">
                In Practice:
              </span>
              <p className="text-secondary italic">
                {selectedNode.real_world_example}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border">
            {/* Study Resources */}
            <div>
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-muted mb-2">
                Study Resources
              </h4>
              {selectedNode.resources && selectedNode.resources.length > 0 ? (
                <ul className="space-y-1.5">
                  {selectedNode.resources.map((res, i) => (
                    <li key={i}>
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-accent hover:underline font-medium inline-flex items-center gap-1"
                      >
                        <span>{res.title}</span>
                        <span className="text-[10px]">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted italic">No study links added yet.</p>
              )}
            </div>

            {/* Practice Problems */}
            <div>
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-muted mb-2">
                Practice Problems
              </h4>
              {Object.keys(problemsByPlatform).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(problemsByPlatform).map(([platform, problems]) => (
                    <div key={platform}>
                      <span className="text-[10px] font-mono text-secondary font-semibold uppercase block mb-1">
                        {platform}
                      </span>
                      <ul className="space-y-1.5">
                        {problems.map((prob, i) => (
                          <li key={i} className="flex items-center justify-between gap-2">
                            <a
                              href={prob.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:text-accent hover:underline font-medium truncate inline-flex items-center gap-1"
                            >
                              <span>{prob.title}</span>
                              <span className="text-[10px] text-muted">↗</span>
                            </a>
                            {getDifficultyBadge(prob.difficulty)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted italic">No practice problems added yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
