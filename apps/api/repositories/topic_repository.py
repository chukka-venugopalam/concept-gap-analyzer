from repositories.base import BaseRepository

class TopicRepository(BaseRepository):
    async def get_all_active(self, conn) -> list[dict]:
        return await self.fetch_all(conn, """
            SELECT id, name, description,
                   concept_count, display_order
            FROM topics
            WHERE is_active = TRUE
            ORDER BY display_order
        """)

    async def get_by_id(
        self, conn, topic_id: str
    ) -> dict | None:
        return await self.fetch_one(conn, """
            SELECT id, name, description,
                   concept_count
            FROM topics WHERE id = $1
        """, topic_id)

    async def get_user_topic_status(
        self, conn, user_id: str
    ) -> list[dict]:
        return await self.fetch_all(conn, """
            SELECT
              t.id AS topic_id,
              t.name AS topic_name,
              t.concept_count,
              s.score_overall AS last_score,
              s.completed_at AS last_session_at,
              COALESCE(cnt.session_count, 0)
                AS session_count
            FROM topics t
            LEFT JOIN sessions s ON
              s.user_id = $1::uuid AND
              s.topic_id = t.id AND
              s.status = 'complete' AND
              s.completed_at = (
                SELECT MAX(completed_at)
                FROM sessions
                WHERE user_id = $1::uuid
                  AND topic_id = t.id
                  AND status = 'complete'
              )
            LEFT JOIN (
              SELECT topic_id,
                     COUNT(*) AS session_count
              FROM sessions
              WHERE user_id = $1::uuid
                AND status = 'complete'
              GROUP BY topic_id
            ) cnt ON cnt.topic_id = t.id
            WHERE t.is_active = TRUE
            ORDER BY t.display_order
        """, user_id)

topic_repo = TopicRepository()
