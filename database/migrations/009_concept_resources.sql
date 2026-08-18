CREATE TABLE concept_resources (
  id SERIAL PRIMARY KEY,
  concept_id TEXT NOT NULL REFERENCES concepts(id),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  display_order INT DEFAULT 0
);
