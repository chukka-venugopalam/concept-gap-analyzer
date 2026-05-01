// Database Types

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          username?: string
          education?: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          username?: string
          education?: string
        }
        Update: {
          username?: string
          education?: string
        }
      }
      attempts: {
        Row: {
          id: string
          user_id: string
          topic: string
          explanation: string
          confidence: 'high' | 'medium' | 'low'
          verdict: 'correct' | 'near' | 'wrong'
          ai_feedback: string
          created_at: string
        }
        Insert: {
          user_id: string
          topic: string
          explanation: string
          confidence: 'high' | 'medium' | 'low'
          verdict: 'correct' | 'near' | 'wrong'
          ai_feedback: string
        }
        Update: {
          verdict?: 'correct' | 'near' | 'wrong'
          ai_feedback?: string
        }
      }
    }
  }
}

// API Types

export interface AIResponse {
  verdict: 'correct' | 'near' | 'wrong'
  feedback: string
}

export interface AttemptInsert {
  user_id: string
  topic: string
  explanation: string
  confidence: 'high' | 'medium' | 'low'
  verdict: 'correct' | 'near' | 'wrong'
  ai_feedback: string
}

export interface UserProfile {
  id: string
  email: string
  username?: string
  education?: string
}
