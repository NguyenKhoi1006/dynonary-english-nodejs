import React, { useState, useCallback, useMemo } from 'react';
import type { Exercise, ExerciseResult } from 'components/Exercises/types';
import MultiChoice from 'components/Exercises/MultiChoice';
import TapTranslate from 'components/Exercises/TapTranslate';
import WordBank from 'components/Exercises/WordBank';
import { FloatingXP } from 'components/Animations';
import useStyle from './style';

interface LessonPlayerProps {
  title: string;
  exercises: Exercise[];
  onComplete: (results: ExerciseResult[]) => void;
  onExit: () => void;
}

/**
 * Duolingo-style lesson player.
 * Shows one exercise at a time in full-screen layout.
 * Tracks hearts, progress bar, and XP earned.
 */
function LessonPlayer({ title, exercises, onComplete, onExit }: LessonPlayerProps) {
  const classes = useStyle();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<ExerciseResult[]>([]);
  const [streak, setStreak] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [floatingXp, setFloatingXp] = useState<{ id: number; xp: number; x: number; y: number } | null>(null);
  const [completed, setCompleted] = useState(false);

  const currentExercise = exercises[currentIndex];
  const progress = ((currentIndex) / exercises.length) * 100;
  const isLastExercise = currentIndex >= exercises.length - 1;
  const xpIdCounter = useMemo(() => ({ current: 0 }), []);

  const handleAnswer = useCallback(
    (correct: boolean, answer: string | string[]) => {
      const elapsed = 0; // simplified - could track timer
      const newResult: ExerciseResult = {
        exerciseId: currentExercise.id,
        correct,
        answer,
        timeMs: elapsed,
      };

      setResults((prev) => [...prev, newResult]);

      if (correct) {
        const earned = streak >= 2 ? 15 : 10; // streak bonus
        setXpEarned((prev) => prev + earned);
        setStreak((prev) => prev + 1);

        /* Show floating XP badge */
        const id = ++xpIdCounter.current;
        setFloatingXp({ id, xp: earned, x: 50, y: 40 });
        setTimeout(() => setFloatingXp(null), 1200);
      } else {
        setStreak(0);
      }

      /* Advance or complete */
      if (isLastExercise) {
        setTimeout(() => setCompleted(true), 400);
      } else {
        setTimeout(() => setCurrentIndex((prev) => prev + 1), 600);
      }
    },
    [currentExercise, isLastExercise, streak, xpIdCounter],
  );

  const handleFinish = () => {
    onComplete(results);
  };

  if (completed) {
    const correct = results.filter((r) => r.correct).length;
    const total = results.length;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

    return (
      <div className={classes.overlay}>
        <div className={classes.resultCard}>
          <div className={classes.resultEmoji}>
            {pct >= 80 ? '★' : pct >= 50 ? '◆' : '▲'}
          </div>
          <div className={classes.resultTitle}>
            {pct >= 80 ? 'Tuyệt vời!' : pct >= 50 ? 'Cố gắng thêm!' : 'Đừng bỏ cuộc!'}
          </div>
          <div className={classes.resultScore}>
            {correct}/{total}
          </div>
          <div className={classes.resultXp}>+{xpEarned} XP</div>
          <button className={classes.continueBtn} onClick={handleFinish}>
            Tiếp tục
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.overlay}>
      {/* Header */}
      <div className={classes.header}>
        <button className={classes.exitBtn} onClick={onExit}>
          ✕
        </button>
        <div className={classes.progressTrack}>
          <div className={classes.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <div className={classes.xpDisplay}>
          <span className={classes.xpIcon}>✦</span>
          <span className={classes.xpCount}>{xpEarned}</span>
        </div>
      </div>

      {/* Exercise */}
      <div className={classes.body}>
        {currentExercise?.type === 'multi_choice' && (
          <MultiChoice
            exercise={currentExercise}
            onAnswer={handleAnswer}
          />
        )}
        {currentExercise?.type === 'tap_translate' && (
          <TapTranslate
            exercise={currentExercise}
            onAnswer={handleAnswer}
          />
        )}
        {currentExercise?.type === 'word_bank' && (
          <WordBank
            exercise={currentExercise}
            onAnswer={handleAnswer}
          />
        )}
      </div>

      {/* Floating XP */}
      {floatingXp && (
        <FloatingXP
          xp={floatingXp.xp}
          x={floatingXp.x}
          y={floatingXp.y}
          onComplete={() => {}}
        />
      )}

      {/* Streak indicator */}
      {streak >= 2 && (
        <div className={classes.streakBadge}>
          STREAK {streak}x
        </div>
      )}
    </div>
  );
}

export default LessonPlayer;
