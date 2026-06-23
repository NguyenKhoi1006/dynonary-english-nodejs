import React from 'react';
import useStyle from './style';

interface StreakFlameProps {
  streak: number;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Animated flame icon that pulses faster when streak is higher.
 * Minimal — just the SVG + CSS pulse.
 */
function StreakFlame({ streak, size = 'medium' }: StreakFlameProps) {
  const classes = useStyle({ streak, size });

  return (
    <span className={classes.root}>
      <svg
        className={classes.flame}
        viewBox="0 0 24 24"
        fill="currentColor"
        width={size === 'small' ? 16 : size === 'large' ? 32 : 24}
        height={size === 'small' ? 16 : size === 'large' ? 32 : 24}
      >
        <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm0 12c-1.93 0-3.5-1.57-3.5-3.5S10.07 7 12 7s3.5 1.57 3.5 3.5S13.93 14 12 14z" />
        <path d="M12 6c-1.93 0-3.5 1.57-3.5 3.5S10.07 13 12 13s3.5-1.57 3.5-3.5S13.93 6 12 6z" opacity="0.3" />
      </svg>
      {streak > 0 && (
        <span className={classes.badge}>{streak}</span>
      )}
    </span>
  );
}

export default StreakFlame;
