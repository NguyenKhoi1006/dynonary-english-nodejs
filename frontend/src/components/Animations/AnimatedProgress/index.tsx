import React, { useEffect, useRef, useState } from 'react';
import useStyle from './style';

interface AnimatedProgressProps {
  value: number;
  /** 0–100 */
  height?: number;
  color?: string;
  bgColor?: string;
  duration?: number;
  className?: string;
}

/**
 * A progress bar that animates from its current value to the new one
 * using CSS transition rather than native MUI animation.
 */
function AnimatedProgress({
  value,
  height = 12,
  color,
  bgColor,
  duration = 400,
  className,
}: AnimatedProgressProps) {
  const classes = useStyle({ height, color, bgColor, duration });
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* trigger in next frame so the transition kicks in */
    requestAnimationFrame(() => setDisplayValue(Math.min(value, 100)));
  }, [value]);

  return (
    <div className={`${classes.root} ${className || ''}`} ref={ref}>
      <div
        className={classes.fill}
        style={{ width: `${displayValue}%` }}
      />
    </div>
  );
}

export default AnimatedProgress;
