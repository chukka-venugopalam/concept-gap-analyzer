# Deployment Guide

## API (Render / Docker)
- Deploy `apps/api` using `render.yaml` or standard Docker container.
- Required Env Vars: `DATABASE_URL`, `XAI_API_KEY`, `SUPABASE_JWT_SECRET`, `ALLOWED_ORIGINS`, `ENVIRONMENT`.

## Frontend (Vercel)
- Deploy `apps/web` to Vercel.
- Required Env Vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_URL`.
