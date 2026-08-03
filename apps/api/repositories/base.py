import logging
import asyncpg

logger = logging.getLogger(__name__)

class BaseRepository:
    async def fetch_all(
        self, conn, query: str, *args
    ) -> list[dict]:
        try:
            rows = await conn.fetch(query, *args)
            return [dict(r) for r in rows]
        except asyncpg.PostgresError as e:
            logger.error(f"DB fetch_all error: {e}")
            raise

    async def fetch_one(
        self, conn, query: str, *args
    ) -> dict | None:
        try:
            row = await conn.fetchrow(query, *args)
            return dict(row) if row else None
        except asyncpg.PostgresError as e:
            logger.error(f"DB fetch_one error: {e}")
            raise

    async def execute(
        self, conn, query: str, *args
    ) -> str:
        try:
            return await conn.execute(query, *args)
        except asyncpg.PostgresError as e:
            logger.error(f"DB execute error: {e}")
            raise
