'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Hash, Link2, GitBranch, Waypoints, Repeat, Layers, ListTree,
  ArrowUpDown, Braces, Sigma, Grid3x3, MessageSquareText,
  Building2, Palette, CheckCircle2, CircleDashed, XCircle, HelpCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Real per-topic concept counts, verified directly against the live
// database. Not placeholder numbers.
const TOPICS = [
  { id: 'arrays_hashing', name: 'Arrays & Hashing', count: 11, icon: Hash },
  { id: 'linked_lists', name: 'Linked Lists', count: 10, icon: Link2 },
  { id: 'binary_trees', name: 'Binary Trees', count: 11, icon: GitBranch },
  { id: 'graphs', name: 'Graphs', count: 17, icon: Waypoints },
  { id: 'dynamic_programming', name: 'Dynamic Programming', count: 10, icon: Repeat },
  { id: 'heaps', name: 'Heaps', count: 6, icon: Layers },
  { id: 'tries', name: 'Tries', count: 5, icon: ListTree },
  { id: 'stacks_queues', name: 'Stacks & Queues', count: 7, icon: Braces },
  { id: 'bit_string_manipulation', name: 'Bit & String Manipulation', count: 11, icon: Grid3x3 },
  { id: 'patterns', name: 'Patterns', count: 8, icon: Waypoints },
  { id: 'sorting_fundamentals', name: 'Sorting Fundamentals', count: 6, icon: ArrowUpDown },
  { id: 'math_number_theory', name: 'Math & Number Theory', count: 5, icon: Sigma },
  { id: 'advanced_trees', name: 'Advanced Trees', count: 3, icon: GitBranch },
]

const TOTAL_CONCEPTS = TOPICS.reduce((sum, t) => sum + t.count, 0)

const DIAGNOSTIC_STATES = [
  { label: 'Known', desc: 'You demonstrated this clearly, unprompted.', color: 'known', Icon: CheckCircle2 },
  { label: 'Weak', desc: 'You got there, but needed a follow-up probe.', color: 'weak', Icon: CircleDashed },
  { label: 'Missing', desc: "You didn't mention it at all.", color: 'missing', Icon: XCircle },
  { label: 'Misconception', desc: 'You said something actively incorrect.', color: 'misconception', Icon: HelpCircle },
] as const

const STAGES = [
  {
    n: '01',
    title: 'Explain it your way',
    body: "Pick a concept and explain it in your own words — no multiple choice, no fill-in-the-blank. However you'd actually explain it to an interviewer.",
  },
  {
    n: '02',
    title: 'Answer follow-up probes',
    body: 'CIP asks about whatever you left out or glossed over, the same way a real interviewer presses on a thin answer.',
  },
  {
    n: '03',
    title: 'Solve a challenge task',
    body: 'A short problem that only works if you actually understood the concept, not just recognized its name.',
  },
]

const FEATURES = [
  {
    Icon: MessageSquareText,
    title: 'Mock Interview Mode',
    body: '63 questions across 13 topics, each with an opening prompt, a hint ladder, and a scoring rubric — run end to end like a real coding interview.',
  },
  {
    Icon: Building2,
    title: 'Company-tagged questions',
    body: 'Amazon, Google, Meta, Netflix, Microsoft, Apple, Uber, Bloomberg, Stripe, plus an Indian placement tier: TCS, Infosys, Wipro, Flipkart, Swiggy, Paytm.',
  },
  {
    Icon: GitBranch,
    title: 'Prerequisite graphs',
    body: 'Every topic renders as a real dependency graph, so you can see what to learn first instead of jumping in at random.',
  },
  {
    Icon: Palette,
    title: 'Built for long study sessions',
    body: "Dark by default, with a light theme when you want it. Command palette (⌘K) to jump anywhere without reaching for the mouse.",
  },
]

function StatePill({ color, label }: { color: string; label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium font-mono"
      style={{
        color: `var(--${color})`,
        backgroundColor: `var(--${color}-dim)`,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `var(--${color})` }} />
      {label}
    </span>
  )
}

export default function LandingPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-bg">
      {/* Hero */}
      <section className="px-6 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap justify-center gap-2 mb-8"
          >
            {DIAGNOSTIC_STATES.map((s) => (
              <StatePill key={s.label} color={s.color} label={s.label} />
            ))}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display font-bold text-4xl md:text-6xl text-primary leading-[1.1] mb-6"
          >
            You think you know it.
            <br />
            CIP checks.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-body text-lg text-secondary max-w-lg mb-10"
          >
            Explain a DSA concept in your own words. CIP figures out exactly which
            parts you actually understand, which are shaky, and which you're
            quietly misunderstanding — then tells you precisely what to fix.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button
              onClick={() => router.push('/auth')}
              className="bg-accent text-white font-display font-semibold text-base px-8 py-4 rounded-full hover:opacity-90 hover:scale-[1.02] transition-all shadow-accent cursor-pointer"
            >
              Start your first diagnostic
            </button>
            <p className="mt-4 text-xs text-muted font-mono">
              No credit card. No course to buy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-12 border-y border-border-subtle bg-surface">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: TOTAL_CONCEPTS, label: 'concepts' },
            { value: TOPICS.length, label: 'topics' },
            { value: 63, label: 'interview questions' },
            { value: 15, label: 'companies covered' },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-mono font-semibold text-3xl md:text-4xl text-primary">{s.value}</div>
              <div className="text-sm text-secondary mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-primary mb-2">
            Three stages, one concept at a time
          </h2>
          <p className="text-secondary mb-14 max-w-lg">
            Every concept goes through the same diagnostic — deterministic code
            does the scoring, not a vibe check.
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            {STAGES.map((s) => (
              <div key={s.n}>
                <div className="font-mono text-sm text-muted mb-3">{s.n}</div>
                <h3 className="font-display font-semibold text-lg text-primary mb-2">{s.title}</h3>
                <p className="text-secondary text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diagnostic states */}
      <section className="px-6 py-24 bg-surface border-y border-border-subtle">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-primary mb-2">
            Four outcomes, not a percentage score
          </h2>
          <p className="text-secondary mb-14 max-w-lg">
            A single number can't tell you what to study next. This can.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {DIAGNOSTIC_STATES.map((s) => (
              <div
                key={s.label}
                className="flex items-start gap-4 p-5 rounded-2xl border border-border-subtle bg-bg"
              >
                <s.Icon className="w-5 h-5 mt-0.5 shrink-0" style={{ color: `var(--${s.color})` }} />
                <div>
                  <div className="font-display font-semibold text-primary mb-1">{s.label}</div>
                  <div className="text-sm text-secondary">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-primary mb-2">
            13 topics, fundamentals to pro
          </h2>
          <p className="text-secondary mb-14 max-w-lg">
            From array indexing to bitmask DP and segment trees — {TOTAL_CONCEPTS} concepts total,
            each with its own prerequisites, common misconceptions, and practice problems.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TOPICS.map((t) => (
              <div
                key={t.id}
                className={cn(
                  'flex items-center gap-3 p-4 rounded-xl border border-border-subtle bg-surface',
                  'hover:border-border transition-colors'
                )}
              >
                <t.icon className="w-4 h-4 text-accent shrink-0" />
                <span className="text-sm text-primary flex-1">{t.name}</span>
                <span className="font-mono text-xs text-muted">{t.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24 bg-surface border-y border-border-subtle">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-primary mb-14">
            What's actually in here
          </h2>

          <div className="grid sm:grid-cols-2 gap-10">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex gap-4">
                <f.Icon className="w-5 h-5 mt-0.5 text-accent shrink-0" />
                <div>
                  <h3 className="font-display font-semibold text-primary mb-1.5">{f.title}</h3>
                  <p className="text-sm text-secondary leading-relaxed">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-6 py-28">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-primary mb-6">
            Find out what you'd actually say in the room.
          </h2>
          <button
            onClick={() => router.push('/auth')}
            className="bg-accent text-white font-display font-semibold text-base px-8 py-4 rounded-full hover:opacity-90 hover:scale-[1.02] transition-all shadow-accent cursor-pointer"
          >
            Start your first diagnostic
          </button>
        </div>
      </section>
    </main>
  )
}
