import json
from repositories.base import BaseRepository


class MockInterviewRepository(BaseRepository):
    async def get_interview_question(
        self, conn, interview_question_id: int
    ) -> dict | None:
        return await self.fetch_one(conn, """
            SELECT id, prompt, opening_prompt, hint_ladder,
                   expected_follow_ups, optimal_complexity,
                   rubric_dimensions
            FROM interview_questions
            WHERE id = $1
        """, interview_question_id)

    async def create(
        self, conn, user_id: str, interview_question_id: int
    ) -> dict:
        return await self.fetch_one(conn, """
            INSERT INTO mock_interview_sessions
              (user_id, interview_question_id)
            VALUES ($1::uuid, $2)
            RETURNING id::text, interview_question_id,
                      status, conversation_log, hints_used,
                      created_at
        """, user_id, interview_question_id)

    async def get(
        self, conn, session_id: str, user_id: str
    ) -> dict | None:
        return await self.fetch_one(conn, """
            SELECT id::text, user_id::text, interview_question_id,
                   status, conversation_log, final_code,
                   hints_used, duration_seconds, rubric_scores,
                   score_overall, created_at
            FROM mock_interview_sessions
            WHERE id = $1::uuid AND user_id = $2::uuid
        """, session_id, user_id)

    async def append_turn(
        self, conn, session_id: str,
        conversation_log: list, hints_used: int
    ) -> None:
        await self.execute(conn, """
            UPDATE mock_interview_sessions
            SET conversation_log = $2::jsonb, hints_used = $3
            WHERE id = $1::uuid
        """, session_id, json.dumps(conversation_log), hints_used)

    async def finish(
        self, conn, session_id: str, final_code: str | None,
        duration_seconds: int | None, rubric_scores: dict,
        score_overall: int
    ) -> dict:
        return await self.fetch_one(conn, """
            UPDATE mock_interview_sessions
            SET status = 'complete', final_code = $2,
                duration_seconds = $3, rubric_scores = $4::jsonb,
                score_overall = $5
            WHERE id = $1::uuid
            RETURNING id::text, status, rubric_scores,
                      score_overall, duration_seconds
        """, session_id, final_code, duration_seconds,
             json.dumps(rubric_scores), score_overall)


mock_interview_repo = MockInterviewRepository()
