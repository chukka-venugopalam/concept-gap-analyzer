# API Documentation

Base URL: `/api/v1`

## Endpoints

- `POST /auth/sync-user`: Sync user from Supabase auth JWT.
- `GET /user/profile`: Get current user profile.
- `PATCH /user/profile`: Update user profile settings & onboarding state.
- `GET /user/topic-status`: List overall topic status for current user.
- `GET /user/sessions`: Get user sessions.
- `GET /user/top-weaknesses`: List top target concept weaknesses.
- `GET /topics`: List active topics.
- `GET /topics/{id}/sessions`: Get user sessions for a specific topic.
- `GET /session/active?topic_id=X`: Get draft session if active.
- `POST /session/start`: Create a new diagnostic session.
- `POST /session/analyze/stage1`: Process Stage 1 open explanation and generate probes.
- `POST /session/analyze/stage2`: Process Stage 2 probe responses and generate challenge task.
- `POST /session/analyze/stage3`: Process Stage 3 challenge task response.
- `POST /session/evaluate`: Run complete graph diff & scoring evaluation.
- `GET /session/{id}/results`: Retrieve completed Understanding Profile results.
