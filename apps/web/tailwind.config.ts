import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:          'var(--bg)',
        surface:     'var(--surface)',
        'surface-2': 'var(--surface-2)',
        border:      'var(--border)',
        'border-subtle': 'var(--border-subtle)',
        primary:     'var(--primary)',
        secondary:   'var(--secondary)',
        muted:       'var(--muted)',
        accent:      'var(--accent)',
        'accent-dim':'var(--accent-dim)',
        known:       'var(--known)',
        'known-dim': 'var(--known-dim)',
        weak:        'var(--weak)',
        'weak-dim':  'var(--weak-dim)',
        missing:     'var(--missing)',
        'missing-dim':'var(--missing-dim)',
        misconception:'var(--misconception)',
        'misconception-dim':'var(--misconception-dim)',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        accent: 'var(--shadow-accent)',
      },
    },
  },
  plugins: [],
}

export default config
