import React, { useState, useCallback } from 'react';
import type { Exercise } from '../types';
import useStyle from '../style';

interface WordBankProps {
  exercise: Exercise;
  onAnswer: (correct: boolean, answer: string[]) => void;
  disabled?: boolean;
}

/**
 * Word-bank exercise: arrange jumbled words into a correct sentence.
 * User taps words in order to build the answer.
 */
function WordBank({ exercise, onAnswer, disabled }: WordBankProps) {
  const classes = useStyle();
  const [bank, setBank] = useState<string[]>(exercise.words?.slice().sort(() => Math.random() - 0.5) || []);
  const [answer, setAnswer] = useState<string[]>([]);

  const addWord = useCallback((word: string, idx: number) => {
    if (disabled) return;
    setAnswer((prev) => [...prev, word]);
    setBank((prev) => prev.filter((_, i) => i !== idx));
  }, [disabled]);

  const removeWord = useCallback((word: string, idx: number) => {
    if (disabled) return;
    setBank((prev) => [...prev, word]);
    setAnswer((prev) => prev.filter((_, i) => i !== idx));
  }, [disabled]);

  const handleSubmit = () => {
    if (disabled || answer.length === 0) return;
    const correct = answer.join(' ') === exercise.correctAnswer;
    onAnswer(correct, answer);
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.prompt}>{exercise.prompt}</div>

      {/* Answer area */}
      <div className={classes.answerStrip}>
        {answer.length === 0 ? (
          <span className={classes.placeholder}>Tap words below to build your answer</span>
        ) : (
          answer.map((word, i) => (
            <button
              key={`ans-${word}-${i}`}
              className={classes.chip}
              onClick={() => removeWord(word, i)}
            >
              {word}
            </button>
          ))
        )}
      </div>

      {/* Word bank */}
      <div className={classes.bank}>
        {bank.map((word, i) => (
          <button
            key={`bank-${word}-${i}`}
            className={classes.chipBank}
            onClick={() => addWord(word, i)}
          >
            {word}
          </button>
        ))}
      </div>

      {/* Submit */}
      <button
        className={classes.submitBtn}
        onClick={handleSubmit}
        disabled={disabled || answer.length === 0}
      >
        Kiểm tra
      </button>
    </div>
  );
}

export default WordBank;
