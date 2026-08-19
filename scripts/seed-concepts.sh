#!/bin/bash
echo "Seeding CIP concept graph database..."
psql "$DATABASE_URL" < database/migrations/002_seed_topics.sql
psql "$DATABASE_URL" < database/migrations/003_seed_arrays_hashing.sql
psql "$DATABASE_URL" < database/migrations/004_seed_linked_lists.sql
psql "$DATABASE_URL" < database/migrations/005_seed_binary_trees.sql
psql "$DATABASE_URL" < database/migrations/006_seed_graphs.sql
psql "$DATABASE_URL" < database/migrations/007_seed_fallback_probes.sql
psql "$DATABASE_URL" < database/migrations/010_seed_concept_resources_arrays_hashing.sql
echo "✓ Concept database seeded successfully."
