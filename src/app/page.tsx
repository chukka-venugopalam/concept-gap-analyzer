import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { branding } from '@/config/branding'
import { ArrowRight, Sparkles, Zap, Target, TrendingUp, Users, Shield } from 'lucide-react'

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 min-h-screen">
      
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 md:py-32 text-center space-y-8">
        {/* Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100/50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
              AI-Powered Learning Platform
            </span>
          </div>
        </div>

        {/* Main Heading */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="gradient-text">
              Know What You Know
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Write explanations, get instant AI feedback, and automatically discover your knowledge gaps.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
          <Link href="/signup">
            <Button className="px-8 py-4 text-lg flex items-center justify-center gap-2 group w-full sm:w-auto">
              Start Learning Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/login">
            <Button 
              variant="secondary"
              className="px-8 py-4 text-lg flex items-center justify-center w-full sm:w-auto"
            >
              Sign In
            </Button>
          </Link>
        </div>

        {/* Floating Badges */}
        <div className="pt-8 flex flex-wrap justify-center gap-3 text-sm">
          {['No Credit Card', 'Instant Feedback', '100% Private'].map((badge) => (
            <div key={badge} className="px-3 py-1 rounded-full bg-white/50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300">
              ✓ {badge}
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">How It Works</h2>
          <p className="text-lg text-gray-600 dark:text-slate-400">
            A simple yet powerful process to master any concept
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Zap className="w-8 h-8" />,
              title: 'Explain',
              desc: 'Write your understanding of any concept in your own words',
              color: 'from-indigo-500 to-indigo-600',
            },
            {
              icon: <Sparkles className="w-8 h-8" />,
              title: 'Get AI Feedback',
              desc: 'Receive instant evaluation and personalized feedback from AI',
              color: 'from-purple-500 to-purple-600',
            },
            {
              icon: <TrendingUp className="w-8 h-8" />,
              title: 'Improve',
              desc: 'See your weak topics and track your progress over time',
              color: 'from-violet-500 to-violet-600',
            },
          ].map((feature, i) => (
            <Card key={i} gradient hover>
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} text-white flex items-center justify-center mb-4 shadow-lg`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-slate-400">
                {feature.desc}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Why ConceptGap?</h2>
          <p className="text-lg text-gray-600 dark:text-slate-400">
            The features that make learning smarter
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              icon: <Zap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
              title: 'Instant AI Evaluation',
              desc: 'Get immediate, detailed feedback on your explanations in seconds',
            },
            {
              icon: <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
              title: 'Identify Knowledge Gaps',
              desc: 'Automatically discover areas where your understanding needs improvement',
            },
            {
              icon: <TrendingUp className="w-6 h-6 text-violet-600 dark:text-violet-400" />,
              title: 'Track Progress',
              desc: 'View detailed analytics and watch your learning journey unfold',
            },
            {
              icon: <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
              title: 'Smart Recommendations',
              desc: 'Get personalized revision suggestions based on your learning patterns',
            },
            {
              icon: <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
              title: 'Private & Secure',
              desc: 'Your learning data is always yours. We respect your privacy.',
            },
            {
              icon: <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
              title: 'Universal Learning',
              desc: 'Works for any subject, concept, or field of study',
            },
          ].map((benefit, i) => (
            <Card key={i} hover className="flex gap-4">
              <div className="flex-shrink-0">
                {benefit.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  {benefit.desc}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            Ready to transform your learning?
          </h2>
          <p className="text-lg text-gray-600 dark:text-slate-400">
            Join thousands of students who are discovering their knowledge gaps and improving faster.
          </p>
        </div>
        <Link href="/signup">
          <Button className="px-8 py-4 text-lg flex items-center justify-center gap-2 group mx-auto">
            Get Started Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm mt-20">
        <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
          {/* Footer Content */}
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand Column */}
            <div className="space-y-3">
              <h3 className="gradient-text font-bold text-lg">{branding.appName}</h3>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                {branding.description}
              </p>
            </div>

            {/* Product */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-white">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
                <li><Link href="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Dashboard</Link></li>
                <li><Link href="/insights" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Insights</Link></li>
                <li><Link href="/weak" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Weak Topics</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-white">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
                <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Documentation</Link></li>
                <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Blog</Link></li>
                <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">FAQ</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-white">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href={`mailto:${branding.social.email}`} className="text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Email</Link></li>
                <li><Link href={branding.social.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">GitHub</Link></li>
                <li><Link href={branding.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">LinkedIn</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-gray-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 dark:text-slate-400">
            <p>&copy; {new Date().getFullYear()} {branding.appName}. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Privacy</Link>
              <Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Terms</Link>
              <Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
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