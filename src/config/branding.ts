/**
 * ConceptGap Branding System
 * Centralized configuration for colors, gradients, and visual identity
 */

export const branding = {
  // App Identity
  appName: 'ConceptGap',
  tagline: 'Learn what you know',
  description: 'AI-powered Concept Gap Analyzer for intelligent learning',
  
  // Logo Configuration
  logo: {
    path: '/logo.png',
    fallback: 'ConceptGap', // Text fallback if image missing
    sizes: {
      navbar: 32,
      sidebar: 40,
      hero: 60,
    },
  },

  // Favicon Configuration
  favicon: {
    path: '/favicon.ico',
  },

  // Brand Colors
  colors: {
    // Primary gradient
    primary: {
      start: '#6366f1',    // indigo-500
      end: '#a855f7',      // purple-500
      dark: {
        start: '#8b5cf6',  // purple-500
        end: '#d946ef',    // fuchsia-500
      },
    },

    // Accent colors
    accent: {
      indigo: '#6366f1',
      purple: '#a855f7',
      violet: '#7c3aed',
      blue: '#3b82f6',
    },

    // Neutral palette
    neutral: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },

    // Semantic colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',

    // Backgrounds
    background: {
      light: '#ffffff',
      lightAlt: '#f8fafc',
      dark: '#020617',
      darkAlt: '#0f172a',
    },
  },

  // Gradient Presets
  gradients: {
    // Hero gradient
    hero: 'from-indigo-600 via-purple-600 to-violet-600',
    
    // Subtle background
    subtleBg: 'from-indigo-50 via-white to-purple-50',
    
    // Dark background
    darkBg: 'from-indigo-950 via-slate-900 to-purple-950',
    
    // Button primary
    buttonPrimary: 'from-indigo-600 to-purple-600',
    buttonHover: 'from-indigo-700 to-purple-700',
    
    // Card hover
    cardHover: 'from-indigo-50 to-purple-50',
    
    // Accent glow
    accentGlow: 'from-indigo-500/20 to-purple-500/20',
  },

  // Typography
  typography: {
    heroSize: 'text-5xl md:text-6xl lg:text-7xl',
    headingSize: 'text-3xl md:text-4xl',
    subheadingSize: 'text-xl md:text-2xl',
  },

  // Spacing
  spacing: {
    navHeight: '64px',
    sidebarWidth: '256px',
    containerMaxW: '7xl',
  },

  // Border Radius
  radius: {
    sm: '0.5rem',
    md: '0.875rem',
    lg: '1.25rem',
    xl: '1.5rem',
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    glow: '0 0 30px rgba(99, 102, 241, 0.3)',
    glowPurple: '0 0 30px rgba(168, 85, 247, 0.3)',
  },

  // Animation Timings
  animation: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },

  // Social Links (for footer)
  social: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    email: 'hello@conceptgap.ai',
  },
}

// Helper function to get gradient class
export const getGradient = (key: keyof typeof branding.gradients) => {
  return `bg-gradient-to-r ${branding.gradients[key]}`
}

// Helper function to get color
export const getColor = (section: string, key: string) => {
  return (branding.colors as any)[section]?.[key]
}

export default branding
