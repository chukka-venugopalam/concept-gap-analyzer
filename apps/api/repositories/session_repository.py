import json
from repositories.base import BaseRepository

class SessionRepository(BaseRepository):
    async def get_active(
        self, conn, user_id: str, topic_id: str
    ) -> dict | None:
        return await self.fetch_one(conn, """
            SELECT id::text, user_id::text,
                   topic_id, session_number,
                   status, stage1_response,
                   stage2_responses, probes_generated
            FROM sessions
            WHERE user_id = $1::uuid
              AND topic_id = $2
              AND status = 'draft'
            ORDER BY started_at DESC
            LIMIT 1
        """, user_id, topic_id)

    async def create(
        self, conn, user_id: str,
        topic_id: str, session_number: int
    ) -> dict:
        await self.execute(conn, """
            UPDATE sessions SET status = 'abandoned'
            WHERE user_id = $1::uuid
              AND topic_id = $2
              AND status = 'draft'
        """, user_id, topic_id)

        return await self.fetch_one(conn, """
            INSERT INTO sessions
              (user_id, topic_id, session_number)
            VALUES ($1::uuid, $2, $3)
            RETURNING id::text, topic_id,
                      session_number, status,
                      started_at
        """, user_id, topic_id, session_number)

    async def get_session_count(
        self, conn, user_id: str, topic_id: str
    ) -> int:
        row = await self.fetch_one(conn, """
            SELECT COUNT(*) as cnt
            FROM sessions
            WHERE user_id = $1::uuid
              AND topic_id = $2
              AND status != 'abandoned'
        """, user_id, topic_id)
        return row['cnt'] if row else 0

    async def update_stage1(
        self, conn, session_id: str,
        response: str, probes: list,
        probes_raw: list
    ) -> None:
        result = await self.execute(conn, """
            UPDATE sessions
            SET stage1_response = $1,
                probes_generated = $2::jsonb
            WHERE id = $3::uuid
        """, response,
             json.dumps(probes_raw),
             session_id)
        print(f"[DIAG-WRITE] update_stage1 session_id={session_id} result={result}")

    async def update_stage2(
        self, conn, session_id: str,
        responses: list, challenge: dict
    ) -> None:
        result = await self.execute(conn, """
            UPDATE sessions
            SET stage2_responses = $1::jsonb,
                challenge_task = $2::jsonb
            WHERE id = $3::uuid
        """, json.dumps(responses),
             json.dumps(challenge),
             session_id)
        print(f"[DIAG-WRITE] update_stage2 session_id={session_id} result={result}")

    async def update_stage3(
        self, conn, session_id: str,
        response: str
    ) -> None:
        await self.execute(conn, """
            UPDATE sessions
            SET stage3_response = $1
            WHERE id = $2::uuid
        """, response, session_id)

    async def mark_complete(
        self, conn, session_id: str,
        evaluation: dict
    ) -> None:
        score = evaluation['score']
        await self.execute(conn, """
            UPDATE sessions SET
              status = 'complete',
              score_overall = $1,
              score_coverage = $2,
              score_depth = $3,
              score_accuracy = $4,
              score_connectivity = $5,
              concepts_known = $6,
              concepts_weak = $7,
              concepts_missing = $8,
              misconceptions = $9::jsonb,
              next_concepts = $10,
              completed_at = NOW(),
              duration_seconds = $11,
              extraction_degraded = $12
            WHERE id = $13::uuid
        """,
            score['overall'],
            score['coverage'],
            score['depth'],
            score['accuracy'],
            score['connectivity'],
            evaluation['concepts_known'],
            evaluation['concepts_weak'],
            evaluation['concepts_missing'],
            json.dumps(evaluation['misconceptions']),
            evaluation['next_concepts'],
            evaluation['duration_seconds'],
            evaluation.get('extraction_degraded', False),
            session_id
        )

    async def get_by_id(
        self, conn, session_id: str,
        user_id: str
    ) -> dict | None:
        return await self.fetch_one(conn, """
            SELECT
              s.id::text AS session_id,
              s.topic_id,
              t.name AS topic_name,
              s.session_number,
              s.status,
              s.stage1_response,
              s.stage2_responses,
              s.stage3_response,
              s.score_overall,
              s.score_coverage,
              s.score_depth,
              s.score_accuracy,
              s.score_connectivity,
              s.concepts_known,
              s.concepts_weak,
              s.concepts_missing,
              s.misconceptions,
              s.next_concepts,
              s.completed_at,
              s.duration_seconds,
              s.extraction_degraded
            FROM sessions s
            JOIN topics t ON t.id = s.topic_id
            WHERE s.id = $1::uuid
              AND s.user_id = $2::uuid
        """, session_id, user_id)

    async def get_by_id_public(self, conn, session_id: str) -> dict | None:
        return await self.fetch_one(conn, """
            SELECT
              s.id::text AS session_id,
              s.topic_id,
              t.name AS topic_name,
              s.session_number,
              s.status,
              s.score_overall, s.score_coverage, s.score_depth,
              s.score_accuracy, s.score_connectivity,
              s.concepts_known, s.concepts_weak, s.concepts_missing,
              s.misconceptions, s.next_concepts,
              s.completed_at, s.duration_seconds,
              s.extraction_degraded
            FROM sessions s
            JOIN topics t ON t.id = s.topic_id
            WHERE s.id = $1::uuid AND s.status = 'complete'
        """, session_id)

    async def get_user_sessions(
        self, conn, user_id: str,
        limit: int = 5,
        topic_id: str | None = None
    ) -> list[dict]:
        if topic_id:
            return await self.fetch_all(conn, """
                SELECT s.id::text AS session_id,
                       s.topic_id,
                       t.name AS topic_name,
                       s.session_number,
                       s.score_overall,
                       s.completed_at,
                       s.duration_seconds
                FROM sessions s
                JOIN topics t ON t.id = s.topic_id
                WHERE s.user_id = $1::uuid
                  AND s.topic_id = $2
                  AND s.status = 'complete'
                ORDER BY s.completed_at DESC
                LIMIT $3
            """, user_id, topic_id, limit)
        return await self.fetch_all(conn, """
            SELECT s.id::text AS session_id,
                   s.topic_id,
                   t.name AS topic_name,
                   s.session_number,
                   s.score_overall,
                   s.completed_at,
                   s.duration_seconds
            FROM sessions s
            JOIN topics t ON t.id = s.topic_id
            WHERE s.user_id = $1::uuid
              AND s.status = 'complete'
            ORDER BY s.completed_at DESC
            LIMIT $2
        """, user_id, limit)

    async def get_previous_score(
        self, conn, user_id: str,
        topic_id: str,
        exclude_session_id: str
    ) -> int | None:
        row = await self.fetch_one(conn, """
            SELECT score_overall
            FROM sessions
            WHERE user_id = $1::uuid
              AND topic_id = $2
              AND status = 'complete'
              AND id != $3::uuid
            ORDER BY completed_at DESC
            LIMIT 1
        """, user_id, topic_id, exclude_session_id)
        return row['score_overall'] if row else None

session_repo = SessionRepository()
