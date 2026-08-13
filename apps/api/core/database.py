import asyncpg
import urllib.parse
import re
import socket
from core.config import settings

_pool = None

def get_ipv4_db_url(original_url: str) -> str:
    if not original_url:
        return original_url

    url = original_url
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)

    match = re.search(r'@db\.([a-z0-9]+)\.supabase\.co(?::\d+)?', url)
    if match:
        project_ref = match.group(1)
        try:
            socket.getaddrinfo(f"db.{project_ref}.supabase.co", 5432, socket.AF_INET)
        except socket.gaierror:
            pooler_host = "aws-0-us-east-1.pooler.supabase.com:6543"
            url = re.sub(r'@db\.[a-z0-9]+\.supabase\.co(?::\d+)?', f'@{pooler_host}', url)
            if f"postgres.{project_ref}" not in url and "postgresql://postgres:" in url:
                url = url.replace("postgresql://postgres:", f"postgresql://postgres.{project_ref}:", 1)
            print(f"[DB DEBUG] Auto-converted IPv6 direct host to IPv4 Pooler host for project ref: {project_ref}")

    return url

async def get_pool():
    global _pool
    if _pool is None:
        print("[DB DEBUG] Connecting to database...")
        raw_url = settings.database_url
        db_url = get_ipv4_db_url(raw_url)

        print(f"[DB DEBUG] Target URL scheme: {db_url[:30] if db_url else 'EMPTY'}")

        ssl_option = "require" if ("supabase" in db_url or "pooler" in db_url or "sslmode=require" in db_url) else None

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
