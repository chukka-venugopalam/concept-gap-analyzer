'use client'

import React, { useEffect, useState } from 'react'
import * as d3 from 'd3'
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
  definition?: string
  real_world_example?: string | null
  resources?: ResourceLink[]
  practice_problems?: PracticeProblem[]
}

export interface EdgeItem {
  source: string
  target: string
}

export interface ConceptGraphProps {
  nodes: NodeItem[]
  edges: EdgeItem[]
  mode?: 'diagnostic' | 'library'
}

export const STATUS_COLORS: Record<string, string> = {
  known: '#1DB887',
  weak: '#E8A838',
  missing: '#E85555',
  misconception: '#C44FD4',
  not_assessed: '#4A4A6A',
}

export const STATUS_LABELS: Record<string, string> = {
  known: 'Understood',
  weak: 'Needs Depth',
  missing: 'Not Covered',
  misconception: 'Misconception',
  not_assessed: 'Not Assessed',
}

export const LIBRARY_COLORS: Record<number, string> = {
  3: '#6366F1', // Core / High importance
  2: '#818CF8', // Medium importance
  1: '#A5B4FC', // Foundational
}

export function ConceptGraph({ nodes, edges, mode = 'diagnostic' }: ConceptGraphProps) {
  const [simNodes, setSimNodes] = useState<any[]>([])
  const [simLinks, setSimLinks] = useState<any[]>([])
  const [hoveredNode, setHoveredNode] = useState<NodeItem | null>(null)
  const [selectedNode, setSelectedNode] = useState<NodeItem | null>(null)

  const width = 800
  const height = 500

  useEffect(() => {
    if (!nodes || nodes.length === 0) return

    const nodesCopy = nodes.map((n) => ({ ...n }))
    const linksCopy = edges.map((e) => ({ source: e.source, target: e.target }))

    const simulation = d3
      .forceSimulation(nodesCopy as any)
      .force(
        'link',
        d3
          .forceLink(linksCopy as any)
          .id((d: any) => d.id)
          .distance(100)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force(
        'collision',
        d3.forceCollide().radius((d: any) => 12 + (d.importance_weight || 2) * 4)
      )

    simulation.on('tick', () => {
      nodesCopy.forEach((n: any) => {
        const r = 8 + (n.importance_weight || 2) * 4
        n.x = Math.max(r + 15, Math.min(width - r - 15, n.x))
        n.y = Math.max(r + 15, Math.min(height - r - 15, n.y))
      })

      setSimNodes([...nodesCopy])
      setSimLinks(
        linksCopy
          .filter((l: any) => l.source && l.target && l.source.x !== undefined)
          .map((l: any) => ({
            source: { id: l.source.id, x: l.source.x, y: l.source.y },
            target: { id: l.target.id, x: l.target.x, y: l.target.y },
          }))
      )
    })

    return () => {
      simulation.stop()
    }
  }, [nodes, edges])

  const getNodeColor = (node: NodeItem) => {
    if (mode === 'library') {
      const weight = node.importance_weight || 2
      return LIBRARY_COLORS[weight] || '#818CF8'
    }
    return STATUS_COLORS[node.status || ''] || STATUS_COLORS.not_assessed
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
          className="w-full h-[500px] select-none"
        >
          <defs>
            <marker
              id="arrowhead"
              viewBox="0 -5 10 10"
              refX="20"
              refY="0"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M0,-5L10,0L0,5" fill="#4A4A6A" />
            </marker>
          </defs>

          {/* Edges */}
          <g>
            {simLinks.map((link, idx) => (
              <line
                key={idx}
                x1={link.source.x}
                y1={link.source.y}
                x2={link.target.x}
                y2={link.target.y}
                stroke="#4A4A6A"
                strokeWidth="1.5"
                strokeOpacity="0.6"
                markerEnd="url(#arrowhead)"
              />
            ))}
          </g>

          {/* Nodes */}
          <g>
            {simNodes.map((node) => {
              const radius = 8 + (node.importance_weight || 2) * 4
              const color = getNodeColor(node)
              const isHovered = hoveredNode?.id === node.id
              const isSelected = selectedNode?.id === node.id

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
                  <circle
                    r={radius}
                    fill={color}
                    stroke={isSelected ? '#FFFFFF' : isHovered ? '#E2E8F0' : 'rgba(0,0,0,0.3)'}
                    strokeWidth={isSelected ? 3.5 : isHovered ? 2.5 : 1.5}
                  />
                  <text
                    y={radius + 14}
                    textAnchor="middle"
                    fill="#F1F1F5"
                    fontSize="10 font-mono"
                    className="pointer-events-none drop-shadow font-medium"
                  >
                    {node.name}
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
                    STATUS_COLORS[hoveredNode.status || ''] || STATUS_COLORS.not_assessed,
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
