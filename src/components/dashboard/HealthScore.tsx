'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface HealthScoreProps {
  score: number;
  maxScore?: number;
}

export default function HealthScore({ score, maxScore = 100 }: HealthScoreProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const percentage = (score / maxScore) * 100;

  useEffect(() => {
    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(score, current + increment);
      setDisplayScore(Math.round(current));

      if (step >= steps || current >= score) {
        clearInterval(timer);
        setDisplayScore(score);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  return (
    <div className="relative">
      {/* Circular progress */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-32 h-32"
      >
        {/* Background circle */}
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-accent-surface"
          />
          {/* Progress circle */}
          <motion.circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            className="text-teal drop-shadow-[0_0_8px_rgba(0,217,255,0.6)]"
            initial={{ strokeDasharray: '0 352' }}
            animate={{ strokeDasharray: `${(percentage / 100) * 352} 352` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{
              filter: 'drop-shadow(0 0 12px rgba(0, 217, 255, 0.4))',
            }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-bold text-teal font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {displayScore}
          </motion.span>
          <span className="text-sm text-text-secondary">/ {maxScore}</span>
        </div>
      </motion.div>

      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0, 217, 255, 0.4) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
