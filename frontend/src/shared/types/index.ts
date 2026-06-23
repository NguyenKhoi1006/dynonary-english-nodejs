// ==================== User / Auth ====================
export interface UserInfo {
  _id?: string;
  username?: string;
  email?: string;
  avt?: string;
  coin?: number;
  isAuth: boolean;
  loading?: boolean;
  message?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  avt: string;
  coin: number;
  createdAt: string;
  favoriteVocab: string[];
}

// ==================== Word ====================
export interface Word {
  _id: string;
  word: string;
  type: string;
  phonetic: string;
  meaning: string;
  mean_en?: string;
  example: string;
  example_mean?: string;
  synonyms?: string;
  note?: string;
  img?: string;
  level?: string;
  specialty?: string;
  isFavorite?: boolean;
}

// ==================== Message / UI ====================
export type MessageType = 'success' | 'error' | 'warning' | 'info';

export interface MessageState {
  open: boolean;
  message: string;
  type: MessageType;
  variant?: 'filled' | 'outlined' | 'standard';
  duration?: number;
}

// ==================== Voice ====================
export interface VoiceState {
  voiceUri: string;
  voiceSpeed: number;
  voiceVolume: number;
}

// ==================== Game ====================
export interface GameQuestion {
  word: string;
  meaning: string;
  phonetic?: string;
  options?: string[];
  correctAnswer?: string;
}

export interface HighScore {
  username: string;
  score: number;
  avt?: string;
}

// ==================== Flashcard ====================
export interface Flashcard {
  _id: string;
  word: string;
  meaning: string;
  phonetic?: string;
  example?: string;
  image?: string;
}

// ==================== Sentence / Communication ====================
export interface Sentence {
  _id: string;
  sentence: string;
  meaning: string;
  note?: string;
  topic?: string;
}

// ==================== Grammar ====================
export interface Grammar {
  _id: string;
  title: string;
  content: string;
  examples: { sentence: string; meaning: string }[];
}

// ==================== API ====================
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

// ==================== Theme ====================
export type ThemeMode = 'light' | 'dark' | 'custom';

export interface ThemeState {
  mode: ThemeMode;
  palette?: Record<string, string>;
}
