def check_trigger_phrases(
    user_text: str,
    trigger_phrases: list[str]
) -> bool:
    user_lower = user_text.lower()
    return any(
        phrase.lower() in user_lower
        for phrase in trigger_phrases
    )
