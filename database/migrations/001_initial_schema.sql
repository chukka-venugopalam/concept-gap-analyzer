CREATE TABLE users (
  id              UUID PRIMARY KEY
                  DEFAULT gen_random_uuid(),
  email           TEXT UNIQUE NOT NULL,
  display_name    TEXT,
  goal            TEXT CHECK (goal IN (
                    'interview_prep',
                    'college_placement',
                    'general_understanding'
                  )),
  onboarding_done BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  last_active_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE UNIQUE INDEX idx_users_email
  ON users(email);

CREATE TABLE topics (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  description   TEXT,
  concept_count INT DEFAULT 0,
  is_active     BOOLEAN DEFAULT TRUE,
  display_order INT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE concepts (
  id                 TEXT PRIMARY KEY,
  topic_id           TEXT NOT NULL
                     REFERENCES topics(id),
  name               TEXT NOT NULL,
  definition         TEXT NOT NULL,
  proficiency_level  TEXT DEFAULT 'interview'
                     CHECK (proficiency_level IN (
                       'beginner','interview','advanced'
                     )),
  importance_weight  INT DEFAULT 2
                     CHECK (importance_weight
                     BETWEEN 1 AND 3),
  canonical_keywords TEXT[] DEFAULT '{}',
  display_order      INT DEFAULT 0,
  created_at         TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_concepts_topic_id
  ON concepts(topic_id);
CREATE INDEX idx_concepts_keywords
  ON concepts USING GIN(canonical_keywords);

CREATE TABLE concept_prerequisites (
  concept_id      TEXT NOT NULL
                  REFERENCES concepts(id),
  prerequisite_id TEXT NOT NULL
                  REFERENCES concepts(id),
  PRIMARY KEY (concept_id, prerequisite_id),
  CONSTRAINT no_self_reference
    CHECK (concept_id != prerequisite_id)
);

CREATE TABLE concept_misconceptions (
  id              UUID PRIMARY KEY
                  DEFAULT gen_random_uuid(),
  concept_id      TEXT NOT NULL
                  REFERENCES concepts(id),
  misconception   TEXT NOT NULL,
  correction      TEXT NOT NULL,
  trigger_phrases TEXT[] DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_misconceptions_concept
  ON concept_misconceptions(concept_id);
CREATE INDEX idx_misconceptions_triggers
  ON concept_misconceptions
  USING GIN(trigger_phrases);

CREATE TABLE sessions (
  id                   UUID PRIMARY KEY
                       DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL
                       REFERENCES users(id)
                       ON DELETE CASCADE,
  topic_id             TEXT NOT NULL
                       REFERENCES topics(id),
  session_number       INT NOT NULL,
  status               TEXT DEFAULT 'draft'
                       CHECK (status IN (
                         'draft','complete','abandoned'
                       )),
  stage1_response      TEXT,
  stage2_responses     JSONB DEFAULT '[]',
  stage3_response      TEXT,
  probes_generated     JSONB DEFAULT '[]',
  challenge_task       JSONB DEFAULT '{}',
  score_overall        INT,
  score_coverage       INT,
  score_depth          INT,
  score_accuracy       INT,
  score_connectivity   INT,
  concepts_known       TEXT[] DEFAULT '{}',
  concepts_weak        TEXT[] DEFAULT '{}',
  concepts_missing     TEXT[] DEFAULT '{}',
  misconceptions       JSONB DEFAULT '[]',
  next_concepts        TEXT[] DEFAULT '{}',
  started_at           TIMESTAMPTZ DEFAULT NOW(),
  completed_at         TIMESTAMPTZ,
  duration_seconds     INT
);
CREATE INDEX idx_sessions_user_topic_status
  ON sessions(user_id, topic_id, status);
CREATE INDEX idx_sessions_user_created
  ON sessions(user_id, started_at DESC);
CREATE INDEX idx_sessions_user_topic
  ON sessions(user_id, topic_id);
CREATE INDEX idx_sessions_topic_completed
  ON sessions(user_id, topic_id, completed_at DESC)
  WHERE status = 'complete';

CREATE TABLE session_concept_evidence (
  id             UUID PRIMARY KEY
                 DEFAULT gen_random_uuid(),
  session_id     UUID NOT NULL
                 REFERENCES sessions(id)
                 ON DELETE CASCADE,
  concept_id     TEXT NOT NULL
                 REFERENCES concepts(id),
  status         TEXT NOT NULL
                 CHECK (status IN (
                   'known','weak',
                   'missing','misconception'
                 )),
  confidence     NUMERIC(4,3)
                 CHECK (confidence BETWEEN 0 AND 1),
  evidence_quote TEXT,
  stage_source   INT
                 CHECK (stage_source IN (1,2,3)),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_sce_session_id
  ON session_concept_evidence(session_id);

CREATE TABLE learner_concept_states (
  id               UUID PRIMARY KEY
                   DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL
                   REFERENCES users(id)
                   ON DELETE CASCADE,
  concept_id       TEXT NOT NULL
                   REFERENCES concepts(id),
  topic_id         TEXT NOT NULL
                   REFERENCES topics(id),
  current_status   TEXT NOT NULL
                   CHECK (current_status IN (
                     'not_assessed','missing',
                     'weak','known','misconception'
                   )),
  last_session_id  UUID REFERENCES sessions(id),
  times_assessed   INT DEFAULT 1,
  times_known      INT DEFAULT 0,
  times_weak       INT DEFAULT 0,
  times_missing    INT DEFAULT 0,
  last_assessed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, concept_id)
);
CREATE INDEX idx_lcs_user_status
  ON learner_concept_states(user_id, current_status);
CREATE INDEX idx_lcs_user_concept
  ON learner_concept_states(user_id, concept_id);
CREATE INDEX idx_lcs_user_topic
  ON learner_concept_states(user_id, topic_id);
