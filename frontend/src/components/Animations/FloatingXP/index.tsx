import React, { useEffect, useState } from 'react';
import useStyle from './style';

interface FloatingXPProps {
  xp: number;
  x: number;
  y: number;
  onComplete: () => void;
}

/**
 * Floating "+X XP" badge that rises upward and fades out.
 * Mount at the position where XP was earned, then self-destructs.
 */
function FloatingXP({ xp, x, y, onComplete }: FloatingXPProps) {
  const [phase, setPhase] = useState<'enter' | 'float' | 'exit'>('enter');
  const classes = useStyle({ x, y, phase });

  useEffect(() => {
    const enter = setTimeout(() => setPhase('float'), 50);
    const exit = setTimeout(() => setPhase('exit'), 800);
    const done = setTimeout(() => onComplete(), 1200);
    return () => {
      clearTimeout(enter);
      clearTimeout(exit);
      clearTimeout(done);
    };
  }, [onComplete]);

  return (
    <div className={classes.root}>
      <span className={classes.badge}>+{xp} XP</span>
    </div>
  );
}

export default FloatingXP;
