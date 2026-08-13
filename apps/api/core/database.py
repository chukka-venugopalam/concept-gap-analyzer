import asyncpg
import urllib.parse
from core.config import settings

_pool = None

async def get_pool():
    global _pool
    if _pool is None:
        print("[DB DEBUG] Connecting to database...")
        db_url = settings.database_url
        if db_url.startswith("postgres://"):
            db_url = db_url.replace("postgres://", "postgresql://", 1)
        print(f"[DB DEBUG] URL scheme: {db_url[:25] if db_url else 'EMPTY'}")

        ssl_option = "require" if ("supabase" in db_url or "sslmode=require" in db_url) else None

        parsed = urllib.parse.urlparse(db_url)
        query_params = urllib.parse.parse_qs(parsed.query)
        if "sslmode" in query_params:
            query_params.pop("sslmode", None)
            new_query = urllib.parse.urlencode(query_params, doseq=True)
            db_url = urllib.parse.urlunparse(parsed._replace(query=new_query))

        try:
            kwargs = {"min_size": 1, "max_size": 10}
            if ssl_option:
                kwargs["ssl"] = ssl_option

            _pool = await asyncpg.create_pool(db_url, **kwargs)
            print("[DB DEBUG] Pool created successfully")
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
