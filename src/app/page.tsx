import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function Home() {
  return (
    <div className="space-y-24">

      {/* HERO */}
      <section className="text-center py-20 space-y-6">
        <h1 className="text-5xl font-bold leading-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Track What You Think vs What You Know
        </h1>

        <p className="text-gray-600 max-w-xl mx-auto">
          Identify weak concepts, analyze mistakes, and improve faster with AI insights.
        </p>

        <div className="flex justify-center gap-4">
          <Link href="/signup">
            <Button>Get Started</Button>
          </Link>
          <Link href="/dashboard">
            <Button className="bg-gray-200 text-black hover:bg-gray-300">
              View Dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="grid md:grid-cols-3 gap-6">
        {[
          { title: 'Track Attempts', desc: 'Log and analyze performance' },
          { title: 'Find Weak Topics', desc: 'Auto detect weak areas' },
          { title: 'AI Feedback', desc: 'Improve explanations' },
        ].map((f, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-white/70 backdrop-blur border hover:shadow-lg transition"
          >
            <h3 className="font-semibold mb-2">{f.title}</h3>
            <p className="text-sm text-gray-600">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="text-center py-16">
        <h2 className="text-2xl font-semibold mb-4">
          Start improving today
        </h2>
        <Link href="/signup">
          <Button>Join Now</Button>
        </Link>
      </section>

    </div>
  )
}