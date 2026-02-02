'use client';

import { useEffect, useRef } from 'react';
import { useSpring, useTransform, motion, MotionValue } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
}

/**
 * AnimatedCounter Component
 *
 * Smoothly animates a number from 0 to the target value using framer-motion's spring physics.
 * Used for dashboard metrics to add visual polish.
 *
 * @example
 * ```tsx
 * <AnimatedCounter value={1234} duration={1000} />
 * <AnimatedCounter value={42} />
 * ```
 *
 * @param value - The target number to count to
 * @param duration - Animation duration in milliseconds (default: 1000)
 * @param className - Optional additional CSS classes
 */
export default function AnimatedCounter({
  value,
  duration = 1000,
  className = '',
}: AnimatedCounterProps) {
  const spring = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.01,
  });

  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  );

  const prevValueRef = useRef(value);

  useEffect(() => {
    // Animate from previous value to new value
    spring.set(value);
    prevValueRef.current = value;
  }, [value, spring]);

  return <motion.span className={className}>{display}</motion.span>;
}
