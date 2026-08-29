from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import traceback
from core.config import settings
from core.database import get_pool, close_pool
from core.exceptions import CIPException
from api.v1.router import router

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[STARTUP] Starting CIP API...")
    print(f"[STARTUP] JWT Secret set: {bool(settings.supabase_jwt_secret)}")
    print(f"[STARTUP] DB URL set: {bool(settings.database_url)}")
    print(f"[STARTUP] XAI key set: {bool(settings.xai_api_key)}")
    try:
        pool = await get_pool()
        async with pool.acquire() as conn:
            await conn.execute("ALTER TABLE sessions ADD COLUMN IF NOT EXISTS extraction_degraded BOOLEAN DEFAULT FALSE;")
            await conn.execute("ALTER TABLE concepts ADD COLUMN IF NOT EXISTS real_world_example TEXT;")
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS concept_practice_problems (
                  id SERIAL PRIMARY KEY,
                  concept_id TEXT NOT NULL REFERENCES concepts(id),
                  platform TEXT NOT NULL,
                  title TEXT NOT NULL,
                  url TEXT NOT NULL,
                  difficulty TEXT NOT NULL,
                  display_order INT DEFAULT 0
                );
            """)
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS concept_resources (
                  id SERIAL PRIMARY KEY,
                  concept_id TEXT NOT NULL REFERENCES concepts(id),
                  title TEXT NOT NULL,
                  url TEXT NOT NULL,
                  display_order INT DEFAULT 0
                );
            """)
            await conn.execute("""
                INSERT INTO concept_resources (concept_id, title, url, display_order)
                SELECT v.concept_id, v.title, v.url, v.display_order
                FROM (VALUES
                  ('arr_indexing', 'Why does Array Indexing take O(1) Time? - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/why-does-accessing-an-array-element-take-o1-time/', 1),
                  ('arr_indexing', 'Why Array Indexing is Instantly Fast (O(1) Explained) - FullStackPrep', 'https://www.fullstackprep.dev/articles/dsa/array/array-access-complexity', 2),
                  ('arr_dynamic', 'Introduction to Amortized Analysis - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/introduction-to-amortized-analysis/', 1),
                  ('arr_dynamic', 'Dynamic Array Amortized Analysis - Interview Cake', 'https://www.interviewcake.com/concept/java/dynamic-array-amortized-analysis', 2),
                  ('arr_two_pointer', 'Two Pointers Technique - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/two-pointers-technique/', 1),
                  ('arr_two_pointer', 'Short Notes on Two Pointer and Sliding Window - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/short-notes-on-two-pointer-and-sliding-window-1/', 2),
                  ('arr_sliding_window', 'Sliding Window Technique - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/window-sliding-technique/', 1),
                  ('arr_sliding_window', 'Sliding Window Algorithm Explained - Built In', 'https://builtin.com/data-science/sliding-window-algorithm', 2),
                  ('arr_prefix_sum', 'Prefix Sum Technique - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/understanding-prefix-sums/', 1),
                  ('arr_prefix_sum', 'Introduction to Prefix Sums - USACO Guide', 'https://usaco.guide/silver/prefix-sums', 2),
                  ('hash_map_basics', 'Introduction to Hashing - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/introduction-to-hashing-2/', 1),
                  ('hash_map_basics', 'Hash Table (Hash Map) Data Structure Explained - Interview Cake', 'https://www.interviewcake.com/concept/java/hash-map', 2),
                  ('hash_collision', 'Collision Resolution Techniques - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/collision-resolution-techniques/', 1),
                  ('hash_collision', 'Hash Table Visualization (Chaining, Linear/Quadratic Probing) - VisuAlgo', 'https://visualgo.net/en/hashtable', 2),
                  ('hash_set', 'Introduction to Set Data Structure - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/introduction-to-set-data-structure/', 1),
                  ('hash_set', 'DSA Hash Sets - W3Schools', 'https://www.w3schools.com/dsa/dsa_data_hashsets.php', 2),
                  ('arr_sorting', 'Sorting Algorithms - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/sorting-algorithms/', 1),
                  ('arr_sorting', 'Sorting Algorithms: Slowest to Fastest - Built In', 'https://builtin.com/machine-learning/fastest-sorting-algorithm', 2),
                  ('arr_kadane', 'Maximum Subarray Sum - Kadane''s Algorithm - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/largest-sum-contiguous-subarray/', 1),
                  ('arr_kadane', 'Kadane''s Algorithm - takeUforward', 'https://takeuforward.org/data-structure/kadanes-algorithm-maximum-subarray-sum-in-an-array', 2)
                ) AS v(concept_id, title, url, display_order)
                WHERE NOT EXISTS (
                  SELECT 1 FROM concept_resources cr WHERE cr.concept_id = v.concept_id AND cr.url = v.url
                );
            """)
        print("[STARTUP] Database connected successfully and schema updated")
    except Exception as e:
        print(f"[STARTUP] Database connection failed: {e}")
    yield
    await close_pool()

app = FastAPI(
    title="CIP API",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["GET","POST","PATCH","DELETE"],
    allow_headers=["Authorization","Content-Type"],
)

print(f"[CORS DEBUG] Allowed origins: {settings.origins_list}")

@app.exception_handler(CIPException)
async def cip_exception_handler(
    request: Request, exc: CIPException
):
    return JSONResponse(
        status_code=400,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message
            }
        }
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"[GLOBAL ERROR] {type(exc).__name__}: {exc}")
    print(traceback.format_exc())
    origin = request.headers.get("origin", "*")
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "internal_error",
                "message": str(exc)
            }
        },
        headers={
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Credentials": "true"
        }
    )

@app.get("/api/v1/health")
async def health():
    return {"data": {"status": "ok", "version": "1.0.1-step1"}}

@app.get("/api/v1/debug/cors")
async def debug_cors():
    return {
        "allowed_origins": settings.allowed_origins,
        "origins_list": settings.origins_list,
        "environment": settings.environment
    }

@app.get("/api/v1/debug/dburl")
async def debug_dburl():
    url = settings.database_url
    import re
    masked = re.sub(r':([^:@]+)@', ':***@', url)
    return {"database_url_masked": masked}

app.include_router(router)
