#!/bin/bash
echo "Running CIP migrations..."
for file in database/migrations/*.sql; do
  echo "Running: $file"
  psql "$DATABASE_URL" < "$file"
  echo "✓ Done: $file"
done
echo "All migrations complete."
