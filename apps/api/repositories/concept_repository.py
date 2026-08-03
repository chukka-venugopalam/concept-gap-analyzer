from repositories.base import BaseRepository

class ConceptRepository(BaseRepository):
    async def get_by_topic(
        self, conn, topic_id: str
    ) -> list[dict]:
        return await self.fetch_all(conn, """
            SELECT id, topic_id, name, definition,
                   importance_weight,
                   canonical_keywords, display_order
            FROM concepts
            WHERE topic_id = $1
            ORDER BY display_order
        """, topic_id)

    async def get_prerequisites(
        self, conn, topic_id: str
    ) -> list[dict]:
        return await self.fetch_all(conn, """
            SELECT cp.concept_id, cp.prerequisite_id
            FROM concept_prerequisites cp
            JOIN concepts c
              ON c.id = cp.concept_id
            WHERE c.topic_id = $1
        """, topic_id)

    async def get_misconceptions(
        self, conn, topic_id: str
    ) -> list[dict]:
        return await self.fetch_all(conn, """
            SELECT
              cm.id::text,
              cm.concept_id,
              c.name AS concept_name,
              c.definition AS concept_definition,
              cm.misconception,
              cm.correction,
              cm.trigger_phrases
            FROM concept_misconceptions cm
            JOIN concepts c
              ON c.id = cm.concept_id
            WHERE c.topic_id = $1
        """, topic_id)

concept_repo = ConceptRepository()
