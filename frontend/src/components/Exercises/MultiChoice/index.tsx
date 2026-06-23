import React, { useState } from 'react';
import type { Exercise } from '../types';
import useStyle from '../style';

interface MultiChoiceProps {
  exercise: Exercise;
  onAnswer: (correct: boolean, answer: string) => void;
  disabled?: boolean;
}

/**
 * Duolingo-style multiple choice: 4 options, one correct.
 * Selected option turns green (correct) or red (wrong).
 */
function MultiChoice({ exercise, onAnswer, disabled }: MultiChoiceProps) {
  const classes = useStyle();
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (option: string) => {
    if (disabled || selected) return;
    setSelected(option);
    setRevealed(true);
    const correct = option === exercise.correctAnswer;
    setTimeout(() => {
      onAnswer(correct, option);
      setSelected(null);
      setRevealed(false);
    }, 800);
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.prompt}>{exercise.prompt}</div>
      {exercise.imageUrl && (
        <img src={exercise.imageUrl} alt="" className={classes.image} />
      )}
      <div className={classes.optionsGrid}>
        {exercise.options?.map((opt) => {
          let btnClass = classes.optionBtn;
          if (revealed && selected === opt) {
            btnClass += ` ${opt === exercise.correctAnswer ? classes.correct : classes.wrong}`;
          } else if (revealed && opt === exercise.correctAnswer) {
            btnClass += ` ${classes.correct}`;
          }
          return (
            <button
              key={opt}
              className={btnClass}
              onClick={() => handleSelect(opt)}
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

export default MultiChoice;
