from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    database_url: str = ""
    xai_api_key: str = ""
    gemini_api_key: str = ""
    supabase_jwt_secret: str = ""
    supabase_url: str = ""
    allowed_origins: str = "http://localhost:3000"
    environment: str = "development"

    @property
    def origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    class Config:
        env_file = ".env"
        case_sensitive = False

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
