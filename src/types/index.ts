export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  emotional_state?: string;
}

export interface EmotionalTest {
  id: string;
  user_id: string;
  test_date: string;
  mood_score: number;
  anxiety_level: number;
  stress_level: number;
  energy_level: number;
  sleep_quality: number;
  notes?: string;
  recommendations?: string[];
}

export interface BiblicalVerse {
  id: string;
  reference: string;
  text_rv60: string;
  text_ntv: string;
  emotion_tags: string[];
  category: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  response: string;
  timestamp: string;
  emotion_context?: string;
  biblical_references?: string[];
}

export interface UserProgress {
  user_id: string;
  test_count: number;
  average_mood: number;
  improvement_trend: 'positive' | 'negative' | 'stable';
  last_test_date: string;
  favorite_verses: string[];
}

export type Emotion = 
  | 'alegría'
  | 'tristeza' 
  | 'ansiedad'
  | 'miedo'
  | 'ira'
  | 'paz'
  | 'esperanza'
  | 'amor'
  | 'perdón'
  | 'gratitud'
  | 'confusión'
  | 'soledad';