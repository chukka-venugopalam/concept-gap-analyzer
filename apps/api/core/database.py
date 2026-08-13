import asyncpg
from core.config import settings

_pool = None

async def get_pool():
    global _pool
    if _pool is None:
        print("[DB] Connecting...")
        _pool = await asyncpg.create_pool(
            settings.database_url,
            min_size=1,
            max_size=5,
            timeout=15,
            command_timeout=15,
            statement_cache_size=0
        )
        print("[DB] Pool created")
    return _pool

async def close_pool():
    global _pool
    if _pool:
        await _pool.close()
        _pool = None

async def get_db():
    pool = await get_pool()
    async with pool.acquire() as conn:
        yield conn
