'use client'

import React, { useEffect, useState, useMemo } from 'react'
import * as d3 from 'd3'
import { useTheme } from 'next-themes'

export interface ClusterTopic {
  id: string
  name: string
  concept_count?: number
  description?: string
}

export interface TopicClusterMapProps {
  topics: ClusterTopic[]
  onSelectTopic: (topicId: string) => void
  width?: number
  height?: number
}

interface SimulatedTopicNode extends ClusterTopic {
  radius: number
  x: number
  y: number
  vx?: number
  vy?: number
}

export const TOPIC_CLUSTER_LINKS = [
  // 7 core cross-topic concept relationships
  { source: 'arrays_hashing', target: 'linked_lists', label: 'Two Pointers ↔ Fast/Slow' },
  { source: 'binary_trees', target: 'graphs', label: 'BFS Traversal' },
  { source: 'binary_trees', target: 'dynamic_programming', label: 'Recursion & Subproblems' },
  { source: 'heaps', target: 'graphs', label: 'Priority BFS / Dijkstra' },
  { source: 'arrays_hashing', target: 'graphs', label: 'Visited Tracking' },
  { source: 'binary_trees', target: 'tries', label: 'Prefix Hierarchies' },
  { source: 'arrays_hashing', target: 'heaps', label: 'Array Representation' },

  // Pattern references connections
  { source: 'patterns', target: 'arrays_hashing', label: 'Sliding Window & Two Pointers' },
  { source: 'patterns', target: 'linked_lists', label: 'Fast & Slow / Reversal' },
  { source: 'patterns', target: 'binary_trees', label: 'Tree BFS & DFS' },
  { source: 'patterns', target: 'bit_string_manipulation', label: 'Bitwise XOR' },
  { source: 'patterns', target: 'heaps', label: 'Top K & Two Heaps' },
  { source: 'patterns', target: 'dynamic_programming', label: '0/1 Knapsack & Subsets' },
  { source: 'patterns', target: 'graphs', label: 'Topological Sort' },

  // Structural & Algorithm connections
  { source: 'stacks_queues', target: 'arrays_hashing', label: 'Monotonic Stack / Window' },
  { source: 'stacks_queues', target: 'binary_trees', label: 'Iterative Traversal Stack' },
  { source: 'sorting_fundamentals', target: 'arrays_hashing', label: 'Partition & Indexing' },
  { source: 'sorting_fundamentals', target: 'heaps', label: 'Heap Sort' },
]

function splitTopicName(name: string): [string, string?] {
  const words = name.split(' ')
  if (words.length <= 2) {
    return [name]
  }
  const mid = Math.ceil(words.length / 2)
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
}

export function TopicClusterMap({
  topics,
  onSelectTopic,
  width = 960,
  height = 620,
}: TopicClusterMapProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [nodes, setNodes] = useState<SimulatedTopicNode[]>([])
  const [hoveredTopicId, setHoveredTopicId] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isLight = mounted && theme === 'light'
  const accentColor = isLight ? '#C4183D' : '#6B6BF0'
  const mutedColor = isLight ? '#9A9AAA' : '#64748B'

  useEffect(() => {
    if (!topics || topics.length === 0) {
      setNodes([])
      return
    }

    const topicIds = new Set(topics.map((t) => t.id))

    // Position nodes radially initially to avoid overlap explosions
    const simNodes: SimulatedTopicNode[] = topics.map((t, i) => {
      const count = t.concept_count && t.concept_count > 0 ? t.concept_count : 8
      // Sized by concept count: 5 concepts -> ~38px radius, 11 concepts -> ~62px radius
      const radius = 38 + (count - 5) * 4
      const angle = (i / topics.length) * 2 * Math.PI
      const rx = width * 0.35
      const ry = height * 0.32
      return {
        ...t,
        concept_count: count,
        radius,
        x: width / 2 + rx * Math.cos(angle),
        y: height / 2 + ry * Math.sin(angle),
      }
    })

    const validLinks = TOPIC_CLUSTER_LINKS.filter(
      (l) => topicIds.has(l.source) && topicIds.has(l.target)
    ).map((l) => ({ ...l }))

    const simulation = d3
      .forceSimulation(simNodes as any)
      .force(
        'link',
        d3
          .forceLink(validLinks as any)
          .id((d: any) => d.id)
          .distance(175)
          .strength(0.4)
      )
      .force('charge', d3.forceManyBody().strength(-380))
      .force('center', d3.forceCenter(width / 2, height / 2).strength(0.2))
      .force(
        'collision',
        d3.forceCollide().radius((d: any) => d.radius + 18)
      )

    simulation.on('tick', () => {
      simNodes.forEach((n) => {
        const pad = n.radius + 25
        n.x = Math.max(pad, Math.min(width - pad, n.x))
        n.y = Math.max(pad, Math.min(height - pad, n.y))
      })
      setNodes([...simNodes])
    })

    return () => {
      simulation.stop()
    }
  }, [topics, width, height])

  // Map of node positions
  const nodeMap = useMemo(() => {
    return new Map(nodes.map((n) => [n.id, n]))
  }, [nodes])

  // Active connected topic IDs for hover highlighting
  const connectedTopicIds = useMemo(() => {
    if (!hoveredTopicId) return new Set<string>()
    const set = new Set<string>([hoveredTopicId])
    TOPIC_CLUSTER_LINKS.forEach((link) => {
      if (link.source === hoveredTopicId) set.add(link.target)
      if (link.target === hoveredTopicId) set.add(link.source)
    })
    return set
  }, [hoveredTopicId])

  const hoveredNode = hoveredTopicId ? nodeMap.get(hoveredTopicId) : null

  return (
    <div className="bg-surface rounded-xl p-4 border border-border flex flex-col items-center relative">
      <div className="w-full relative overflow-hidden rounded-lg bg-bg/50">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-[620px] select-none"
        >
          {/* Connecting Cross-Topic Lines */}
          <g>
            {TOPIC_CLUSTER_LINKS.map((link, i) => {
              const srcNode = nodeMap.get(link.source)
              const tgtNode = nodeMap.get(link.target)
              if (!srcNode || !tgtNode) return null

              const isHighlighted =
                hoveredTopicId &&
                (link.source === hoveredTopicId || link.target === hoveredTopicId)

              return (
                <line
                  key={`${link.source}-${link.target}-${i}`}
                  x1={srcNode.x}
                  y1={srcNode.y}
                  x2={tgtNode.x}
                  y2={tgtNode.y}
                  stroke={isHighlighted ? accentColor : mutedColor}
                  strokeWidth={isHighlighted ? 2 : 1.2}
                  strokeOpacity={
                    isHighlighted
                      ? 0.9
                      : hoveredTopicId
                      ? 0.15
                      : isLight
                      ? 0.35
                      : 0.25
                  }
                  strokeDasharray={isHighlighted ? undefined : '4,3'}
                  className="transition-all duration-200"
                />
              )
            })}
          </g>

          {/* Topic Bubbles */}
          <g>
            {nodes.map((node) => {
              const isHovered = hoveredTopicId === node.id
              const isConnected = connectedTopicIds.has(node.id)
              const [line1, line2] = splitTopicName(node.name)

              let opacity = 1
              if (hoveredTopicId && !isConnected) {
                opacity = 0.35
              }

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x},${node.y})`}
                  className="cursor-pointer transition-transform duration-150"
                  onClick={() => onSelectTopic(node.id)}
                  onMouseEnter={() => setHoveredTopicId(node.id)}
                  onMouseLeave={() => setHoveredTopicId(null)}
                  style={{ opacity }}
                >
                  {/* Outer glow/aura ring on hover */}
                  {isHovered && (
                    <circle
                      r={node.radius + 8}
                      fill={isLight ? 'rgba(196,24,61,0.12)' : 'rgba(107,107,240,0.18)'}
                      className="animate-pulse"
                    />
                  )}

                  {/* Main Bubble */}
                  <circle
                    r={node.radius}
                    className="transition-all duration-200"
                    fill={isHovered ? 'var(--surface-2)' : 'var(--surface)'}
                    stroke={isHovered ? accentColor : 'var(--border)'}
                    strokeWidth={isHovered ? 2.5 : 1.5}
                  />

                  {/* Bubble Title and Concept Count */}
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="pointer-events-none select-none"
                  >
                    {line2 ? (
                      <>
                        <tspan
                          x="0"
                          y={-9}
                          className="font-display font-semibold text-xs fill-primary"
                        >
                          {line1}
                        </tspan>
                        <tspan
                          x="0"
                          y={8}
                          className="font-display font-semibold text-xs fill-primary"
                        >
                          {line2}
                        </tspan>
                      </>
                    ) : (
                      <tspan
                        x="0"
                        y={-2}
                        className="font-display font-semibold text-xs fill-primary"
                      >
                        {line1}
                      </tspan>
                    )}
                    <tspan
                      x="0"
                      y={line2 ? 24 : 14}
                      className="font-mono text-[10px] fill-secondary"
                    >
                      {node.concept_count} concepts
                    </tspan>
                  </text>
                </g>
              )
            })}
          </g>
        </svg>

        {/* Floating In-Map Comprehension Panel */}
        <div className="absolute bottom-3 left-3 z-10 bg-surface/95 backdrop-blur-md p-3 rounded-lg border border-border shadow-lg text-[11px] font-mono max-w-[280px] sm:max-w-xs space-y-2 pointer-events-auto select-none">
          <div className="flex items-center justify-between pb-1 border-b border-border/60">
            <span className="font-semibold text-primary uppercase tracking-wider text-[10px]">
              Curriculum Cluster Map
            </span>
            <span className="text-[10px] text-accent font-semibold">11 Domains</span>
          </div>
          <p className="text-secondary text-[11px] leading-relaxed">
            Bubbles represent complete diagnostic domains, sized by concept density.
            Connecting dashed lines indicate verified cross-domain bridges.
          </p>
          <div className="flex items-center gap-1.5 text-accent text-[10px] font-semibold pt-1 border-t border-border/40">
            <span>Click any bubble to view its hierarchical graph →</span>
          </div>
        </div>

        {/* Hovered Topic Detail Callout (top-right corner) */}
        {hoveredNode && (
          <div className="absolute top-3 right-3 z-10 bg-surface/95 backdrop-blur-md p-3.5 rounded-lg border border-border shadow-lg text-xs max-w-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-display font-bold text-primary text-sm">
                {hoveredNode.name}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-accent-dim text-accent font-mono text-[10px] font-semibold">
                {hoveredNode.concept_count} concepts
              </span>
            </div>
            {hoveredNode.description && (
              <p className="text-secondary text-[11px] leading-relaxed mb-2">
                {hoveredNode.description}
              </p>
            )}
            <div className="text-[11px] text-accent font-medium flex items-center gap-1">
              <span>Click to open full hierarchical graph</span>
              <span>↗</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
