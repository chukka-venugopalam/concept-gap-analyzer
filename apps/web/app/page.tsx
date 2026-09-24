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

const STAGES = [
  {
    n: '01',
    title: 'Explain it your way',
    body: "Pick a concept and explain it in your own words — no multiple choice, no fill-in-the-blank.",
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

const OTHER_STATES = [
  { label: 'Known', desc: 'You demonstrated this clearly, unprompted.', color: 'known', Icon: CheckCircle2 },
  { label: 'Weak', desc: 'You got there, but needed a follow-up probe.', color: 'weak', Icon: CircleDashed },
  { label: 'Missing', desc: "You didn't mention it at all.", color: 'missing', Icon: XCircle },
]

const FEATURES = [
  {
    Icon: MessageSquareText,
    title: 'Mock Interview Mode',
    body: '69 questions across every topic in the platform, each with an opening prompt, a hint ladder, and a scoring rubric — run end to end like a real coding interview.',
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

// Real question, real company tag, real concept — pulled directly from
// the interview_questions table, not invented for the landing page.
const SAMPLE_QUESTIONS = [
  { company: 'Amazon', concept: '0/1 Knapsack', prompt: 'Partition Equal Subset Sum — determine if an array can be split into two subsets with equal sum.', difficulty: 'Medium' },
  { company: 'Google', concept: 'Tries', prompt: 'Implement Trie (Prefix Tree) — design a trie with insert, search, and startsWith operations.', difficulty: 'Medium' },
  { company: 'Netflix', concept: 'Bellman-Ford', prompt: 'Cheapest Flights Within K Stops — find the cheapest price using at most k stops.', difficulty: 'Medium' },
]

const FAQS = [
  {
    q: 'How is this different from just doing LeetCode?',
    a: "LeetCode tells you pass or fail on a test case. It can't tell you that you explained the recurrence wrong even though your code happened to work, or that you're one edge case away from a misconception you don't know you have. CIP is built specifically to catch that gap.",
  },
  {
    q: "What if I don't know an answer at all?",
    a: "That's the Missing state, and it's treated completely differently from a misconception. Missing means you haven't covered it — nothing to unlearn, just something to learn. Misconception means you actively believe something incorrect, which is a different (and more dangerous) problem to fix.",
  },
  {
    q: 'Does Mock Interview Mode cover behavioral rounds too?',
    a: "Not yet — it's coding-questions-only right now. Behavioral question support is on the roadmap but not built.",
  },
  {
    q: 'Do I need to already be good at DSA to use this?',
    a: "No — that's the point. The diagnostic works the same way whether you're starting from zero on a topic or think you've already mastered it. The Prerequisite graphs also show you what to learn first if you're starting fresh.",
  },
  {
    q: 'Is it free?',
    a: 'Free to use right now, no credit card required to start.',
  },
]

function MisconceptionExample() {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: 'var(--misconception)' }}
        />
        <span className="font-mono text-xs text-muted uppercase tracking-wide">
          Recursion Fundamentals — real example from CIP
        </span>
      </div>

      <div className="mb-5">
        <div className="text-xs font-mono text-muted mb-2">What a lot of people believe:</div>
        <p className="text-primary text-base leading-relaxed">
          "A missing or incorrectly-placed base case just causes a slightly wrong answer."
        </p>
      </div>

      <div>
        <div className="text-xs font-mono mb-2" style={{ color: 'var(--misconception)' }}>
          What actually happens:
        </div>
        <p className="text-secondary text-sm leading-relaxed">
          A base case that's missing, unreachable, or checked after the recursive call causes
          infinite recursion and a stack overflow crash — not a "slightly wrong" answer. The
          base case must be checked before any recursive call, and the recursive case must
          shrink the input toward it on every call.
        </p>
      </div>
    </div>
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
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
            style={{ color: 'var(--misconception)', backgroundColor: 'var(--misconception-dim)' }}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="text-xs font-mono font-medium">Built to catch confident wrongness</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display font-bold text-4xl md:text-6xl text-primary leading-[1.1] mb-6"
          >
            It's not what you don't know.
            <br />
            It's what you're{' '}
            <span style={{ color: 'var(--misconception)' }}>sure</span> you know
            <br />
            and don't.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-body text-lg text-secondary max-w-lg mb-10"
          >
            Explain a DSA concept out loud. CIP doesn't just check if you got it
            right — it catches the specific things you're confidently wrong about,
            before an interviewer does.
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
              Find out what you're wrong about
            </button>
            <p className="mt-4 text-xs text-muted font-mono">
              Free to start. No credit card.
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
            { value: 69, label: 'interview questions' },
            { value: 15, label: 'companies covered' },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-mono font-semibold text-3xl md:text-4xl text-primary">{s.value}</div>
              <div className="text-sm text-secondary mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Misconception spotlight */}
      <section className="px-6 py-24">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6"
            style={{ backgroundColor: 'var(--misconception-dim)' }}
          >
            <HelpCircle className="w-7 h-7" style={{ color: 'var(--misconception)' }} />
          </div>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-primary mb-4">
            Every other DSA tracker asks: right or wrong?
          </h2>
          <p className="text-secondary leading-relaxed max-w-xl mx-auto">
            That misses the scariest failure mode — walking into an interview certain
            you understand something, and being wrong in a way that only surfaces
            under real pressure.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <MisconceptionExample />
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-24 bg-surface border-y border-border-subtle">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-primary mb-2">
            Three stages, one concept at a time
          </h2>
          <p className="text-secondary mb-14 max-w-lg">
            Deterministic code does the scoring, not a vibe check.
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

      {/* The other three states */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-primary mb-2">
            Misconception is the headline. It's not the only signal.
          </h2>
          <p className="text-secondary mb-14 max-w-lg">
            Every session also tells you what's solid, what's shaky, and what
            you haven't covered at all.
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            {OTHER_STATES.map((s) => (
              <div
                key={s.label}
                className="flex items-start gap-4 p-5 rounded-2xl border border-border-subtle bg-surface"
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
      <section className="px-6 py-24 bg-surface border-y border-border-subtle">
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
                  'flex items-center gap-3 p-4 rounded-xl border border-border-subtle bg-bg',
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

      {/* Sample interview questions */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-primary mb-2">
            Real questions, tagged by company
          </h2>
          <p className="text-secondary mb-14 max-w-lg">
            Every question comes with a hint ladder and a scoring rubric — these three are a sample of 69.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {SAMPLE_QUESTIONS.map((q) => (
              <div key={q.company} className="p-5 rounded-2xl border border-border-subtle bg-surface">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                    {q.company}
                  </span>
                  <span className="text-xs text-muted">{q.difficulty}</span>
                </div>
                <div className="text-xs text-muted mb-2">{q.concept}</div>
                <p className="text-sm text-secondary leading-relaxed">{q.prompt}</p>
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

      {/* FAQ */}
      <section className="px-6 py-24">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-primary mb-14">
            Questions
          </h2>
          <div className="space-y-8">
            {FAQS.map((f) => (
              <div key={f.q}>
                <h3 className="font-display font-semibold text-primary mb-2">{f.q}</h3>
                <p className="text-secondary text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-6 py-28 bg-surface border-t border-border-subtle">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-primary mb-6">
            What are you confidently wrong about?
          </h2>
          <button
            onClick={() => router.push('/auth')}
            className="bg-accent text-white font-display font-semibold text-base px-8 py-4 rounded-full hover:opacity-90 hover:scale-[1.02] transition-all shadow-accent cursor-pointer"
          >
            Find out
          </button>
        </div>
      </section>
    </main>
  )
}
