# Database Schema

Database migrations are located in `database/migrations/`.

- `users`: Registered users and onboarding settings.
- `topics`: Primary DSA topic domains (Arrays & Hashing, Linked Lists, Binary Trees, Graphs).
- `concepts`: Individual atomic concepts within topics with importance weights and canonical keywords.
- `concept_prerequisites`: Directed dependencies between concepts.
- `concept_misconceptions`: Common misconceptions with trigger phrases and corrections.
- `sessions`: Assessment attempts with stage responses, scores, and status lists.
- `session_concept_evidence`: Detailed evidence quotes per concept per session.
- `learner_concept_states`: Longitudinal tracking of learner mastery per concept.
