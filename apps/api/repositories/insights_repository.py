from repositories.base import BaseRepository


class InsightsRepository(BaseRepository):
    """
    Aggregate, anonymized diagnostic statistics across all users. Never
    selects evidence_quote, session_id, or any user-identifying column —
    only concept-level counts. This is the one place in the codebase
    that intentionally reads across all users' session_concept_evidence
    rows at once; every other query in this repo is careful to keep it
    that way.
    """

    async def get_misconception_leaderboard(
        self, conn, limit: int = 20, min_evaluations: int = 5
    ) -> list[dict]:
        return await self.fetch_all(conn, """
            SELECT
              sce.concept_id,
              c.name AS concept_name,
              c.topic_id,
              t.name AS topic_name,
              COUNT(*) AS total_evaluations,
              COUNT(*) FILTER (WHERE sce.status = 'misconception')
                AS misconception_count,
              ROUND(
                100.0 * COUNT(*) FILTER (WHERE sce.status = 'misconception')
                / COUNT(*), 1
              ) AS misconception_rate
            FROM session_concept_evidence sce
            JOIN concepts c ON c.id = sce.concept_id
            JOIN topics t ON t.id = c.topic_id
            GROUP BY sce.concept_id, c.name, c.topic_id, t.name
            HAVING COUNT(*) >= $2
            ORDER BY misconception_rate DESC, total_evaluations DESC
            LIMIT $1
        """, limit, min_evaluations)

    async def get_concept_misconception_stats(
        self, conn, concept_id: str, min_evaluations: int = 5
    ) -> dict | None:
        """Single-concept version, for showing 'X% of people get this
        wrong' inline on a concept's own page rather than only on a
        standalone leaderboard."""
        return await self.fetch_one(conn, """
            SELECT
              sce.concept_id,
              c.name AS concept_name,
              COUNT(*) AS total_evaluations,
              COUNT(*) FILTER (WHERE sce.status = 'misconception')
                AS misconception_count,
              ROUND(
                100.0 * COUNT(*) FILTER (WHERE sce.status = 'misconception')
                / COUNT(*), 1
              ) AS misconception_rate
            FROM session_concept_evidence sce
            JOIN concepts c ON c.id = sce.concept_id
            WHERE sce.concept_id = $1
            GROUP BY sce.concept_id, c.name
            HAVING COUNT(*) >= $2
        """, concept_id, min_evaluations)


insights_repo = InsightsRepository()
