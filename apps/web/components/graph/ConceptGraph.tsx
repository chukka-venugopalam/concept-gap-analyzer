'use client'

import React, { useEffect, useState } from 'react'
import * as d3 from 'd3'

interface NodeItem {
  id: string
  name: string
  importance_weight: number
  status: string
}

interface EdgeItem {
  source: string
  target: string
}

interface ConceptGraphProps {
  nodes: NodeItem[]
  edges: EdgeItem[]
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

export function ConceptGraph({ nodes, edges }: ConceptGraphProps) {
  const [simNodes, setSimNodes] = useState<any[]>([])
  const [simLinks, setSimLinks] = useState<any[]>([])
  const [hoveredNode, setHoveredNode] = useState<NodeItem | null>(null)

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

  return (
    <div className="bg-surface rounded-xl p-4 border border-border flex flex-col items-center">
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
              const color = STATUS_COLORS[node.status] || STATUS_COLORS.not_assessed
              const isHovered = hoveredNode?.id === node.id

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x},${node.y})`}
                  className="cursor-pointer transition-transform"
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => setHoveredNode(node)}
                >
                  <circle
                    r={radius}
                    fill={color}
                    stroke={isHovered ? '#FFFFFF' : 'rgba(0,0,0,0.3)'}
                    strokeWidth={isHovered ? 3 : 1.5}
                  />
                  <text
                    y={radius + 14}
                    textAnchor="middle"
                    fill="#F1F1F5"
                    fontSize="10 font-mono"
                    className="pointer-events-none drop-shadow"
                  >
                    {node.name}
                  </text>
                </g>
              )
            })}
          </g>
        </svg>
      </div>

      {/* Hover Info Label */}
      <div className="mt-4 min-h-[32px] flex items-center justify-center">
        {hoveredNode ? (
          <div className="flex items-center gap-2 text-xs font-mono bg-surface-2 px-3 py-1.5 rounded-md border border-border">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{
                backgroundColor:
                  STATUS_COLORS[hoveredNode.status] || STATUS_COLORS.not_assessed,
              }}
            />
            <span className="font-bold text-primary">{hoveredNode.name}</span>
            <span className="text-secondary">•</span>
            <span className="text-secondary">
              {STATUS_LABELS[hoveredNode.status] || 'Not Assessed'}
            </span>
          </div>
        ) : (
          <span className="text-xs text-muted font-mono italic">
            Hover or tap a concept node to view status
          </span>
        )}
      </div>
    </div>
  )
}
