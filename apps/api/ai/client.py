from google import genai
from core.config import settings
import logging

logger = logging.getLogger(__name__)

_client = None

def get_gemini_client():
    global _client
    if _client is None:
        _client = genai.Client(
            api_key=settings.gemini_api_key
        )
        logger.info("[AI] Gemini client initialized")
    return _client
