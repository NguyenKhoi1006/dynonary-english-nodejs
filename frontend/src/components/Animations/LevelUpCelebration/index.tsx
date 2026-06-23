import React, { useEffect, useMemo, useState } from 'react';
import useStyle from './style';

interface LevelUpCelebrationProps {
  level: number;
  onClose: () => void;
}

/**
 * Full-screen level-up celebration overlay.
 * Shows the new level with particle burst animation,
 * auto-dismisses after 3 seconds or on click.
 */
function LevelUpCelebration({ level, onClose }: LevelUpCelebrationProps) {
  const classes = useStyle();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 400);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  /* 20 random particles for confetti effect */
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 0.8 + Math.random() * 0.8,
      color: ['#58cc02', '#1cb0f6', '#ff9600', '#ff4b4b', '#ce82ff', '#ffc800'][i % 6],
      size: 6 + Math.random() * 10,
    })),
  []);

  return (
    <div className={classes.overlay} style={{ opacity: visible ? 1 : 0 }} onClick={onClose}>
      {/* Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className={classes.particle}
          style={{
            left: `${p.x}%`,
            bottom: '-10px',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
          }}
        />
      ))}

      <div className={classes.content}>
        <div className={classes.levelLabel}>Level Up!</div>
        <div className={classes.levelValue}>{level}</div>
      </div>
    </div>
  );
}

export default LevelUpCelebration;
