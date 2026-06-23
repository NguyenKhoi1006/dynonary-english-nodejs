/* ── Exercise type constants shared across components ── */

export type ExerciseType = 'multi_choice' | 'tap_translate' | 'word_bank';

export interface Exercise {
  id: string;
  type: ExerciseType;
  prompt: string;
  promptAudio?: string;
  options?: string[];
  correctAnswer: string | string[];
  words?: string[];       // for word_bank: jumbled words
  translation?: string;
  imageUrl?: string;
}

export interface ExerciseResult {
  exerciseId: string;
  correct: boolean;
  answer: string | string[];
  timeMs: number;
}
