import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-4 py-20 md:py-32 text-center space-y-6">
        <div className="space-y-3">
          <h1 className="text-5xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Know What You Know
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Write explanations, get instant AI feedback, and automatically discover your knowledge gaps.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
          <Link href="/signup">
            <Button className="px-8 py-3 text-lg">
              Start Learning Free
            </Button>
          </Link>
          <Link href="/login">
            <Button className="px-8 py-3 text-lg bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-4 py-20 space-y-8">
        <h2 className="text-3xl font-bold text-center text-gray-900">How It Works</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              num: '1',
              title: 'Explain',
              desc: 'Write your understanding of any concept in your own words',
              icon: '📝'
            },
            {
              num: '2',
              title: 'Get AI Feedback',
              desc: 'Receive instant evaluation and personalized feedback from AI',
              icon: '🤖'
            },
            {
              num: '3',
              title: 'Improve',
              desc: 'See your weak topics and track your progress over time',
              icon: '📈'
            },
          ].map((f, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center">
                  {f.num}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
              </div>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="max-w-6xl mx-auto px-4 py-20 space-y-8">
        <h2 className="text-3xl font-bold text-center text-gray-900">Why ConceptGap?</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            '✓ Instant AI-powered evaluation',
            '✓ Identify knowledge gaps automatically',
            '✓ Track learning progress with detailed analytics',
            '✓ Personalized revision recommendations',
            '✓ Works for any subject or concept',
            '✓ Simple, distraction-free interface',
          ].map((benefit, i) => (
            <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200">
              <span className="text-xl">{benefit.split('✓')[0]}✓</span>
              <span className="text-gray-700">{benefit.split('✓')[1].trim()}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Ready to improve your learning?</h2>
        <p className="text-gray-600">Start explaining concepts and get instant feedback from AI.</p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/signup">
            <Button className="px-8 py-3 text-lg">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-gray-600">
          <p>Built with ❤️ to help you learn better</p>
          <p className="mt-2 text-xs">
            Questions? Email us at <a href="mailto:support@conceptgap.com" className="text-indigo-600 hover:underline">support@conceptgap.com</a>
          </p>
        </div>
      </footer>
    </div>
  )
}