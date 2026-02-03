'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  height?: string;
}

/**
 * AnimatedProgressBar - A progress bar that animates from 0 to value on mount.
 */
export default function AnimatedProgressBar({
  value,
  max = 100,
  className,
  barClassName = 'bg-gradient-to-r from-blue-400 to-blue-600',
  height = 'h-2',
}: AnimatedProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={cn('w-full bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden', height, className)}>
      <motion.div
        className={cn('rounded-full', height, barClassName)}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
      />
    </div>
  );
}
