import google.generativeai as genai
from core.config import settings
import logging

logger = logging.getLogger(__name__)

_model = None

def get_gemini_client():
    global _model
    if _model is None:
        genai.configure(
            api_key=settings.gemini_api_key
        )
        _model = genai.GenerativeModel(
            model_name='gemini-flash-latest',
            generation_config=genai.GenerationConfig(
                temperature=0.1,
                max_output_tokens=2000,
                response_mime_type='application/json'
            )
        )
        logger.info("[AI] Gemini Flash client initialized")
    return _model
