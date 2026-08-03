class CIPException(Exception):
    def __init__(self, message: str, code: str):
        self.message = message
        self.code = code
        super().__init__(message)

class SessionNotFound(CIPException):
    def __init__(self):
        super().__init__(
            "Session not found", "session_not_found"
        )

class SessionNotReady(CIPException):
    def __init__(self):
        super().__init__(
            "Complete all stages first",
            "session_not_ready"
        )

class TopicNotFound(CIPException):
    def __init__(self, topic_id: str):
        super().__init__(
            f"Topic '{topic_id}' not found",
            "topic_not_found"
        )

class EvaluationFailed(CIPException):
    def __init__(self):
        super().__init__(
            "Evaluation failed. Please try again.",
            "evaluation_failed"
        )
