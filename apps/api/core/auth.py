from fastapi import Depends, HTTPException, status
from fastapi.security import (
    HTTPBearer, HTTPAuthorizationCredentials
)
from dataclasses import dataclass
import jwt as pyjwt
import httpx
from core.config import settings

security = HTTPBearer()

_jwks_cache = None

async def get_jwks():
    global _jwks_cache
    if _jwks_cache is not None:
        return _jwks_cache

    try:
        project_ref = settings.supabase_url.split(
            "https://"
        )[1].split(".supabase.co")[0]

        jwks_url = (
            f"https://{project_ref}.supabase.co"
            f"/auth/v1/.well-known/jwks.json"
        )

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(jwks_url)
            response.raise_for_status()
            _jwks_cache = response.json()
            print(f"[AUTH] JWKS loaded: "
                  f"{len(_jwks_cache.get('keys', []))} keys")
            return _jwks_cache
    except Exception as e:
        print(f"[JWKS ERROR] {type(e).__name__}: {e}")
        raise

@dataclass
class CurrentUser:
    id: str
    email: str

async def get_current_user(
    credentials: HTTPAuthorizationCredentials
        = Depends(security)
) -> CurrentUser:
    token = credentials.credentials

    if settings.environment == "development" and (token == "demo_token_dev" or token.startswith("demo_")):
        return CurrentUser(id="a0000000-0000-0000-0000-000000000001", email="demo@example.com")

    print(f"[AUTH DEBUG] Token: {token[:30]}...")

    try:
        header = pyjwt.get_unverified_header(token)
        print(f"[AUTH DEBUG] Token alg: {header.get('alg')}")
        print(f"[AUTH DEBUG] Token kid: {header.get('kid')}")

        alg = header.get("alg", "ES256")

        if alg == "ES256":
            from jwt import PyJWKClient
            project_ref = settings.supabase_url.split("https://")[1].split(".supabase.co")[0]
            jwks_url = f"https://{project_ref}.supabase.co/auth/v1/.well-known/jwks.json"
            jwks_client = PyJWKClient(jwks_url, timeout=10)
            signing_key = jwks_client.get_signing_key_from_jwt(token)

            payload = pyjwt.decode(
                token,
                signing_key.key,
                algorithms=["ES256"],
                options={"verify_aud": False}
            )
        else:
            payload = pyjwt.decode(
                token,
                settings.supabase_jwt_secret,
                algorithms=["HS256"],
                options={"verify_aud": False}
            )

        print(f"[AUTH DEBUG] Decode success: {payload.get('sub')}")

        user_id = payload.get("sub")
        email = payload.get("email", "")

        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: no user ID"
            )

        return CurrentUser(id=user_id, email=email)

    except pyjwt.ExpiredSignatureError:
        print("[AUTH DEBUG] Token expired")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired"
        )
    except Exception as e:
        print(f"[AUTH DEBUG] Auth error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed"
        )
