import React, { useState } from 'react';
import type { Exercise } from '../types';
import useStyle from '../style';

interface TapTranslateProps {
  exercise: Exercise;
  onAnswer: (correct: boolean, answer: string) => void;
  disabled?: boolean;
}

/**
 * Tap-translate exercise: user sees a word/phrase and must tap the
 * correct translation from a grid of options.
 */
function TapTranslate({ exercise, onAnswer, disabled }: TapTranslateProps) {
  const classes = useStyle();
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleTap = (option: string) => {
    if (disabled || selected) return;
    setSelected(option);
    setRevealed(true);
    const correct = option === exercise.correctAnswer;
    setTimeout(() => {
      onAnswer(correct, option);
      setSelected(null);
      setRevealed(false);
    }, 700);
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.prompt}>{exercise.prompt}</div>
      {exercise.translation && (
        <div className={classes.hint}>{exercise.translation}</div>
      )}
      <div className={classes.optionsGrid}>
        {exercise.options?.map((opt) => {
          let btnClass = classes.tapBtn;
          if (revealed && selected === opt) {
            btnClass += ` ${opt === exercise.correctAnswer ? classes.correct : classes.wrong}`;
          } else if (revealed && opt === exercise.correctAnswer) {
            btnClass += ` ${classes.correct}`;
          }
          return (
            <button
              key={opt}
              className={btnClass}
              onClick={() => handleTap(opt)}
              disabled={!!(disabled || selected)}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TapTranslate;
