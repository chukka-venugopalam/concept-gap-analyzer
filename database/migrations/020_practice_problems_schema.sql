-- Migration 020: Practice Problems and Real World Example schema
ALTER TABLE concepts ADD COLUMN IF NOT EXISTS real_world_example TEXT;

CREATE TABLE IF NOT EXISTS concept_practice_problems (
  id SERIAL PRIMARY KEY,
  concept_id TEXT NOT NULL REFERENCES concepts(id),
  platform TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  display_order INT DEFAULT 0
);
