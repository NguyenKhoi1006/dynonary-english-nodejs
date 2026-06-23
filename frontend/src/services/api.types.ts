// Shared response types for Python backend API

export interface ApiResponse<T = unknown> {
  status: number;
  data?: T;
  message?: string;
}

export interface WordEntry {
  id: string;
  word: string;
  mean: string;
  type: string;
  level: string;
  phonetic?: string;
  examples?: string[];
  picture?: string;
  specialty?: string;
  topics?: string[];
  synonyms?: string[];
  antonyms?: string[];
  note?: string;
  isChecked?: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  username: string;
  avt: string;
  coin: number;
  favoriteList: string[];
  createdDate?: string;
  provider: string;
}

export interface FlashcardEntry {
  id: string;
  userId: string;
  word: string;
  meaning: string;
  createdAt?: string;
}

export interface GameResult {
  id: string;
  userId: string;
  gameType: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  playedAt?: string;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  displayName: string;
  photoURL: string;
  score: number;
  gameType: string;
  updatedAt?: string;
}

export interface SentenceEntry {
  id: string;
  sentence: string;
  meaning: string;
  topic?: string;
  note?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}
