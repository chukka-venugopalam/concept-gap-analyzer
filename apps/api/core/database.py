import asyncpg
from core.config import settings

_pool = None

async def get_pool():
    global _pool
    if _pool is None:
        print(f"[DB DEBUG] Connecting to database...")
        print(f"[DB DEBUG] URL scheme: {settings.database_url[:20] if settings.database_url else 'EMPTY'}")
        try:
            _pool = await asyncpg.create_pool(
                settings.database_url,
                min_size=2,
                max_size=10
            )
            print(f"[DB DEBUG] Pool created successfully")
        except Exception as e:
            print(f"[DB DEBUG] Pool creation failed: {str(e)}")
            raise
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
