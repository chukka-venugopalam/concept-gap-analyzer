# ConceptGap - Concept Gap Analyzer

A modern SaaS application that helps students identify knowledge gaps by evaluating their explanations with AI-powered feedback.

**Stack:** Next.js 16 + TypeScript + Supabase + Google Gemini API + Tailwind CSS

## 🎯 Features

- **AI-Powered Evaluation**: Write explanations and get instant feedback on accuracy and completeness
- **Verdict System**: Get labeled verdicts (Correct, Near, Wrong) with detailed feedback
- **Weak Topic Detection**: Automatically identify topics where you need more practice
- **Progress Tracking**: Monitor your learning progress with accuracy metrics
- **Clean Dashboard**: Sidebar navigation with responsive layout
- **Auth System**: Secure signup/login with Supabase authentication
- **Modern UI**: SaaS-grade design with Tailwind CSS and smooth interactions

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <repo-url>
cd concept-gap-analyzer
npm install
```

### 2. Setup Environment
Copy `.env.example` to `.env.local` and fill in your credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
GEMINI_API_KEY=your-gemini-api-key
```

### 3. Setup Supabase Database
Run the SQL setup from `.env.example` to create tables and RLS policies.

### 4. Run Development Server
```bash
npm run dev
```
Visit http://localhost:3000

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx                 # Root layout with Navbar
│   ├── page.tsx                   # Landing page
│   ├── api/ai/route.ts           # Gemini API integration
│   ├── (auth)/                    # Auth routes (grouped)
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── forgot-password/page.tsx
│   └── (dashboard)/               # Protected dashboard routes (grouped)
│       ├── layout.tsx             # Sidebar + auth check
│       ├── dashboard/page.tsx
│       ├── insights/page.tsx
│       ├── weak/page.tsx
│       ├── revision/page.tsx
│       ├── profile/page.tsx
│       └── components/            # Dashboard components
│           ├── AddAttempt.tsx     # Explanation input & AI evaluation
│           ├── AttemptsList.tsx   # History of attempts
│           ├── WeakTopics.tsx     # Weak topics display
│           └── [other components]
├── components/
│   ├── Navbar.tsx                 # Top navigation
│   └── ui/                        # Reusable UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       └── Loader.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Supabase client for browser
│   │   └── server.ts             # Supabase client for server
│   ├── ai/
│   │   └── gemini.ts             # Gemini API utilities
│   └── validators/
│       └── auth.ts               # Zod schemas for auth
├── hooks/
│   └── useUser.ts                # Auth state hook
├── types/
│   └── index.ts                  # TypeScript types
└── styles/
    └── globals.css               # Global styles
```

## 🔑 Key Workflows

### 1. User Signs Up
- Email + password + optional education info
- Account created in Supabase Auth
- Redirects to dashboard

### 2. User Creates Explanation
- Enters topic + explanation + confidence level
- **AddAttempt** sends to `/api/ai` endpoint
- AI evaluates via Gemini (returns JSON with verdict + feedback)
- Results stored in `attempts` table
- Dashboard updates with new data

### 3. AI Evaluation Pipeline
```
User Explanation → /api/ai (POST)
                    ↓
                 Gemini API
                    ↓
              Parse JSON response
                    ↓
         {verdict: "correct|near|wrong", feedback: "..."}
                    ↓
              Save to Supabase
                    ↓
         Display on dashboard
```

### 4. Weak Topics Auto-Detection
- **WeakTopics** component queries all user attempts
- Calculates accuracy per topic (< 70% = weak)
- Shows topics in red with progress bars
- Users can click to focus on revision

## 🔐 Authentication & Authorization

### Flow
1. Signup → Supabase Auth creates user
2. Login → Session stored in cookie
3. Protected routes check auth before rendering
4. `onAuthStateChange` keeps UI in sync

### RLS Policies
- Users can only see their own attempts
- Users can only insert/update their own data
- Admin can manage policies in Supabase console

## 🤖 AI System

### How It Works
1. **Prompt**: Structured evaluation prompt sent to Gemini
2. **Response**: AI returns JSON with verdict + feedback
3. **Parsing**: Extract JSON from response (handles formatting)
4. **Storage**: Verdict + feedback saved to database
5. **Display**: Show badges (✓ Correct, ◐ Near, ✗ Wrong)

### Error Handling
- API timeout: 30 seconds
- No response: Fallback to "near" with raw text
- Invalid JSON: Parse gracefully
- Network errors: User-friendly error message

## 📊 Database Schema

### profiles
```sql
id (UUID, PK)
email (TEXT)
username (TEXT)
education (TEXT)
created_at (TIMESTAMP)
```

### attempts
```sql
id (UUID, PK)
user_id (UUID, FK to auth.users)
topic (TEXT)
explanation (TEXT)
confidence (TEXT: 'high'|'medium'|'low')
verdict (TEXT: 'correct'|'near'|'wrong')
ai_feedback (TEXT)
created_at (TIMESTAMP)
```

## 🎨 UI System

### Components
- **Button**: Gradient style with hover effects
- **Card**: White box with shadow and border
- **Input**: Focus ring, placeholder styling
- **Loader**: Spinner with loading text

### Colors
- Primary: Indigo → Purple gradient
- Success: Green
- Warning: Yellow
- Error: Red
- Neutral: Gray

### Responsive
- Mobile-first design
- Sidebar collapses on small screens
- Grid layouts adjust (1→2→3 cols)

## ✅ Testing Checklist

- [ ] Signup creates user
- [ ] Login works and redirects to dashboard
- [ ] Logout clears session
- [ ] Create explanation → AI returns verdict
- [ ] Weak topics appear when accuracy < 70%
- [ ] Navbar updates instantly after login/logout
- [ ] All routes work: /dashboard, /insights, /weak, /revision, /profile
- [ ] 404s fixed (no conflicting routes)
- [ ] Mobile responsive

## 🐛 Troubleshooting

**"No response" from AI**
- Check GEMINI_API_KEY in .env.local
- Verify API key has Generative Language API enabled
- Check rate limits

**Database errors / "Permission denied"**
- Verify RLS policies are enabled
- Check user is logged in
- Ensure user ID matches in database queries

**Navbar doesn't update after login**
- Clear browser cache
- Restart dev server
- Check onAuthStateChange listener

**Routes return 404**
- Verify file structure matches (dashboard inside (dashboard) folder)
- Check route grouping parentheses

## 📦 Dependencies

```json
{
  "next": "16.2.4",
  "react": "19.2.4",
  "@supabase/supabase-js": "^2.105.1",
  "tailwindcss": "^3.4.1",
  "zod": "^4.3.6",
  "react-hook-form": "^7.74.0"
}
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Environment Variables on Vercel
Add to project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GEMINI_API_KEY`

## 📝 License

Open source - use freely!

## 💡 Future Improvements

- [ ] Chart.js integration for progress visualization
- [ ] Revision queue with spaced repetition
- [ ] Email notifications for weak topics
- [ ] AI-generated study plans
- [ ] Social learning (share explanations)
- [ ] Mobile app with offline mode

