from repositories.base import BaseRepository

class LearnerStateRepository(BaseRepository):
    async def upsert_states(
        self, conn, user_id: str,
        topic_id: str, session_id: str,
        concept_statuses: list[dict]
    ) -> None:
        for item in concept_statuses:
            status = item['status']
            await self.execute(conn, """
                INSERT INTO learner_concept_states (
                  user_id, concept_id, topic_id,
                  current_status, last_session_id,
                  times_assessed, times_known,
                  times_weak, times_missing
                )
                VALUES (
                  $1::uuid, $2, $3,
                  $4, $5::uuid,
                  1,
                  CASE WHEN $4='known' THEN 1 ELSE 0 END,
                  CASE WHEN $4='weak'  THEN 1 ELSE 0 END,
                  CASE WHEN $4='missing' THEN 1 ELSE 0 END
                )
                ON CONFLICT (user_id, concept_id)
                DO UPDATE SET
                  current_status   = EXCLUDED.current_status,
                  last_session_id  = EXCLUDED.last_session_id,
                  times_assessed   =
                    learner_concept_states.times_assessed + 1,
                  times_known      =
                    learner_concept_states.times_known +
                    CASE WHEN EXCLUDED.current_status='known'
                         THEN 1 ELSE 0 END,
                  times_weak       =
                    learner_concept_states.times_weak +
                    CASE WHEN EXCLUDED.current_status='weak'
                         THEN 1 ELSE 0 END,
                  times_missing    =
                    learner_concept_states.times_missing +
                    CASE WHEN EXCLUDED.current_status='missing'
                         THEN 1 ELSE 0 END,
                  last_assessed_at = NOW()
            """, user_id,
                 item['concept_id'],
                 topic_id, status,
                 session_id)

    async def get_top_weaknesses(
        self, conn, user_id: str, limit: int = 5
    ) -> list[dict]:
        return await self.fetch_all(conn, """
            SELECT
              lcs.concept_id,
              c.name AS concept_name,
              c.topic_id,
              t.name AS topic_name,
              lcs.current_status,
              lcs.times_assessed,
              (lcs.times_missing * 2 + lcs.times_weak)
                AS weakness_score
            FROM learner_concept_states lcs
            JOIN concepts c ON c.id = lcs.concept_id
            JOIN topics t ON t.id = c.topic_id
            WHERE lcs.user_id = $1::uuid
              AND lcs.current_status IN (
                'missing','weak','misconception'
              )
            ORDER BY weakness_score DESC
            LIMIT $2
        """, user_id, limit)

    async def get_states_by_topic(self, conn, user_id: str, topic_id: str) -> list[dict]:
        return await self.fetch_all(conn, """
            SELECT concept_id, current_status
            FROM learner_concept_states
            WHERE user_id = $1::uuid AND topic_id = $2
        """, user_id, topic_id)

learner_repo = LearnerStateRepository()
