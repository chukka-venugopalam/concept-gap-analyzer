# Architecture Overview

CIP follows a monorepo design containing a Next.js frontend, FastAPI backend, and shared TypeScript models.

## Components

1. **Frontend (`apps/web`)**: Next.js 14 App Router, Tailwind CSS, Supabase Auth Helpers.
2. **Backend (`apps/api`)**: FastAPI async backend using AsyncPG to communicate directly with PostgreSQL and xAI Grok SDK for NLP concept extraction & evaluation.
3. **Database (`database/`)**: PostgreSQL schema with tables for users, topics, concepts, prerequisites, misconceptions, sessions, and learner states.
