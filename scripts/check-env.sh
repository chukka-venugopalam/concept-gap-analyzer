#!/bin/bash
REQUIRED=(
  "DATABASE_URL"
  "XAI_API_KEY"
  "SUPABASE_JWT_SECRET"
  "NEXT_PUBLIC_SUPABASE_URL"
  "NEXT_PUBLIC_SUPABASE_ANON_KEY"
)
MISSING=0
for var in "${REQUIRED[@]}"; do
  if [ -z "${!var}" ]; then
    echo "✗ Missing: $var"
    MISSING=1
  else
    echo "✓ Found: $var"
  fi
done
if [ $MISSING -eq 1 ]; then
  echo "Some env vars missing."
  exit 1
fi
echo "All required env vars present."
