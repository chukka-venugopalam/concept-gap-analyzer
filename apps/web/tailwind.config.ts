import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:          '#0A0A0F',
        surface:     '#13131A',
        'surface-2': '#1C1C27',
        border:      '#2A2A3D',
        'border-subtle': '#1E1E2E',
        primary:     '#F0F0F5',
        secondary:   '#7A7A9A',
        muted:       '#4A4A6A',
        accent:      '#6B6BF0',
        'accent-dim':'rgba(107,107,240,0.09)',
        known:       '#1DB887',
        'known-dim': 'rgba(29,184,135,0.08)',
        weak:        '#E8A838',
        'weak-dim':  'rgba(232,168,56,0.08)',
        missing:     '#E85555',
        'missing-dim':'rgba(232,85,85,0.08)',
        misconception:'#C44FD4',
        'misconception-dim':'rgba(196,79,212,0.08)',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        accent: '0 0 24px rgba(107,107,240,0.15)',
      },
    },
  },
  plugins: [],
}

export default config
