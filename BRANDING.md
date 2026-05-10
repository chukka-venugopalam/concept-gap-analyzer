# ConceptGap Branding System

## 📋 Overview

This document outlines the complete branding and design system for ConceptGap, an AI-powered Concept Gap Analyzer SaaS platform. The system is designed to support professional branding with gradients, modern UI patterns, and is ready for logo integration.

## 🎨 Brand Identity

### Colors

**Primary Gradient:** Indigo → Purple
- Indigo: `#6366f1`
- Purple: `#a855f7`
- Violet: `#7c3aed`

**Palette Structure:**
- Light backgrounds: Soft indigo/purple blends
- Dark mode: Deep slate with gradient accents
- Neutral: Gray for text and secondary elements
- Semantic: Green (success), Red (error), Blue (info)

### Logo System

**Logo Placeholder:** `public/logo.svg`
- Current: SVG placeholder with "C" gradient
- Ready for: PNG, SVG, or any format at any size
- Navbar size: 32-40px (responsive)
- Sidebar size: 40-48px
- Hero size: 60px

**Favicon:** `public/favicon.svg`
- Current: SVG placeholder
- Ready for: `favicon.ico` (32x32 or 64x64)

### Typography

- **Hero:** Gradient text with `gradient-text` utility
- **Headings:** Semi-bold sans-serif
- **Body:** Regular weight for readability

### Spacing

- Navbar height: 64px
- Sidebar width: 256px
- Container max-width: 7xl
- Consistent padding: 4/6/8 units

## 🔧 Architecture

### Configuration Files

**`src/config/branding.ts`**
Centralized branding configuration including:
- App name, tagline, description
- Logo and favicon paths
- Brand colors and gradients
- Typography and spacing scales
- Social media links
- Helper functions for accessing brand values

Usage:
```typescript
import { branding } from '@/config/branding'

// Access branding values
const appName = branding.appName
const primaryGradient = branding.gradients.hero
const colors = branding.colors.accent
```

### Tailwind Configuration

**`tailwind.config.js`** Extended with:
- Custom color palette (indigo, purple, violet)
- Gradient presets
- Glow shadow effects
- Animation keyframes
- Utility classes for common patterns

### Global Styles

**`src/styles/globals.css`** Includes:
- CSS custom properties for theme colors
- Dark mode support
- Utility classes:
  - `.glass` - Glassmorphism effect
  - `.gradient-text` - Gradient text styling
  - `.card-base` / `.card-hover` - Card patterns
  - `.btn-primary` / `.btn-secondary` - Button styles
  - `.input-base` / `.input-focus` - Input styling
- Animations: fadeIn, slideUp, float, blob
- Smooth scrollbar styling

## 📦 Components

### Enhanced UI Components

#### Button (`src/components/ui/Button.tsx`)
**Props:**
- `variant`: 'primary' | 'secondary' | 'ghost' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- Supports all standard button attributes

**Example:**
```tsx
<Button variant="primary" size="md">
  Get Started
</Button>
```

#### Card (`src/components/ui/Card.tsx`)
**Props:**
- `hover`: Enable hover shadow effect (default: true)
- `gradient`: Apply subtle gradient background

**Example:**
```tsx
<Card gradient hover>
  <h3>Feature Title</h3>
  <p>Feature description</p>
</Card>
```

#### Input (`src/components/ui/Input.tsx`)
**Props:**
- `label`: Optional label text
- `error`: Error state styling
- Dark mode support

**Example:**
```tsx
<Input 
  label="Email" 
  placeholder="your@email.com"
  error={hasError}
/>
```

### Navbar (`src/components/Navbar.tsx`)

**Features:**
- Logo placeholder system (will auto-switch to image)
- Responsive mobile menu
- User authentication display
- Sticky positioning with blur effect
- Dark mode support

**Logo Integration:**
1. Replace `public/logo.svg` with your actual logo (PNG/SVG)
2. Uncomment the Image import section in Navbar.tsx
3. Logo will automatically display at correct sizes

### Sidebar (`src/app/(dashboard)/layout.tsx`)

**Features:**
- Brand logo and tagline at top
- Lucide React icons for navigation
- Active route highlighting with gradient
- User info section
- Logout button
- Dark mode support
- Smooth hover transitions

**Navigation Items:**
- New Attempt (Plus icon)
- Insights (BarChart3 icon)
- Weak Topics (AlertCircle icon)
- Revision (RotateCcw icon)
- Profile (User icon)

## 🌐 Pages

### Landing Page (`src/app/page.tsx`)

**Sections:**
1. **Hero** - Gradient heading, CTA buttons, feature badges
2. **How It Works** - 3-step process with icons and cards
3. **Benefits** - 6 key features with icons
4. **CTA** - Call-to-action section
5. **Footer** - Links, contact, copyright

**Dark Mode Support:** Full dark theme integration

### Dashboard Layout (`src/app/(dashboard)/layout.tsx`)

**Features:**
- Professional sidebar branding
- Icon-based navigation
- Gradient backgrounds
- Authentication checks
- Responsive design

### Root Layout (`src/app/layout.tsx`)

**Features:**
- Favicon configuration
- Metadata setup (SEO)
- Global gradient background
- Dark mode support

## 🎯 How to Add Your Logo

### Step 1: Prepare Your Logo

1. Create your logo (minimum 256x256px for clarity)
2. Supported formats: PNG, SVG, JPG
3. Ensure transparent background (PNG/SVG recommended)

### Step 2: Add Logo Files

```bash
# Replace placeholder with actual logo
cp your-logo.png public/logo.png
cp your-favicon.ico public/favicon.ico
```

### Step 3: Update Configuration (if needed)

In `src/config/branding.ts`:
```typescript
logo: {
  path: '/logo.png',  // Update if different name
  fallback: 'ConceptGap',
  sizes: {
    navbar: 32,
    sidebar: 40,
    hero: 60,
  },
}
```

### Step 4: Enable Logo in Navbar

In `src/components/Navbar.tsx`, uncomment the Image import section:
```typescript
// Uncomment these lines:
<Image
  src={branding.logo.path}
  alt={branding.appName}
  width={branding.logo.sizes.navbar}
  height={branding.logo.sizes.navbar}
  priority
  className="rounded-lg"
/>
```

### Step 5: Restart Development Server

```bash
npm run dev
```

## 🎨 Customization Guide

### Change Primary Colors

**`src/config/branding.ts`:**
```typescript
colors: {
  primary: {
    start: '#YOUR_COLOR_1',
    end: '#YOUR_COLOR_2',
  },
}
```

### Change Gradients

**`tailwind.config.js`:**
```javascript
backgroundImage: {
  'gradient-primary': 'linear-gradient(to right, #new1, #new2)',
}
```

### Add New Gradient Utility

**`src/styles/globals.css`:**
```css
.my-gradient {
  @apply bg-gradient-to-r from-indigo-500 to-purple-500;
}
```

### Adjust Spacing

**`src/config/branding.ts`:**
```typescript
spacing: {
  navHeight: '64px',
  sidebarWidth: '256px',
}
```

## 📱 Responsive Design

- **Mobile:** Full responsive layout with hamburger menu
- **Tablet:** Optimized spacing and typography
- **Desktop:** Full sidebar, optimized layouts
- **Breakpoints:** Tailwind defaults (sm, md, lg, xl, 2xl)

## 🌙 Dark Mode

Dark mode is fully supported throughout:
- Toggle with `html.dark` class
- All components include dark variants
- CSS custom properties for theme colors
- Tailwind dark: prefix support

## 🚀 Performance

- Optimized component re-renders
- Smooth transitions (150-500ms)
- Shadow and glow effects are GPU-accelerated
- Images optimized with Next.js Image component

## ✅ Validation Checklist

- [x] Branding config centralized
- [x] UI components enhanced
- [x] Navbar with logo support
- [x] Professional sidebar
- [x] Landing page redesigned
- [x] Footer with social links
- [x] Dark mode support
- [x] Responsive design
- [x] Logo placeholder system
- [x] Favicon support
- [x] Global design system
- [x] TypeScript types added

## 📚 File Structure

```
src/
├── config/
│   └── branding.ts          # Centralized branding config
├── components/
│   ├── Navbar.tsx           # Enhanced navbar with logo support
│   └── ui/
│       ├── Button.tsx       # Enhanced with variants
│       ├── Card.tsx         # Enhanced with gradients
│       └── Input.tsx        # Enhanced with labels & error states
├── styles/
│   └── globals.css          # Extended with utilities & animations
└── app/
    ├── layout.tsx           # Root layout with favicon & metadata
    ├── page.tsx             # Landing page with footer
    └── (dashboard)/
        └── layout.tsx       # Dashboard with professional sidebar

public/
├── logo.svg                 # Logo placeholder (replace with actual)
└── favicon.svg              # Favicon placeholder (replace with actual)
```

## 🔗 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Next.js Image Component](https://nextjs.org/docs/api-reference/next/image)
- [Lucide Icons](https://lucide.dev)
- [Color Inspiration](https://color.adobe.com)

## 📞 Support

For questions about the branding system:
1. Check `src/config/branding.ts` for configuration
2. Review component implementations in `src/components/`
3. Refer to Tailwind utilities in `src/styles/globals.css`

---

**Version:** 1.0  
**Last Updated:** 2024  
**Status:** Ready for Production
