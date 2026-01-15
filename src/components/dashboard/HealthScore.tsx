'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';

interface HealthScoreProps {
  score: number;
  maxScore?: number;
}

export default function HealthScore({ score, maxScore = 100 }: HealthScoreProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const percentage = (score / maxScore) * 100;

  // Determine color based on score (design system thresholds)
  // Low (<50%): red, Medium (50-80%): amber, High (>80%): primary blue
  const { color, glowColor } = useMemo(() => {
    if (percentage < 50) {
      return {
        color: '#EF4444', // red
        glowColor: 'rgba(239, 68, 68, 0.4)',
      };
    } else if (percentage < 80) {
      return {
        color: '#F59E0B', // amber
        glowColor: 'rgba(245, 158, 11, 0.4)',
      };
    } else {
      return {
        color: '#003EF3', // primary blue
        glowColor: 'rgba(0, 62, 243, 0.3)',
      };
    }
  }, [percentage]);

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
            className="text-gray-200"
          />
          {/* Progress circle with animated color */}
          <motion.circle
            cx="64"
            cy="64"
            r="56"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: '0 352' }}
            animate={{
              strokeDasharray: `${(percentage / 100) * 352} 352`,
              stroke: color,
            }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            style={{
              filter: `drop-shadow(0 0 12px ${glowColor})`,
            }}
          />
        </svg>

        {/* Center text with animated color */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-bold font-mono"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              color: color,
            }}
            transition={{ duration: 0.2 }}
          >
            {displayScore}
          </motion.span>
          <span className="text-sm text-text-secondary">/ {maxScore}</span>
        </div>
      </motion.div>

      {/* Animated glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full blur-xl opacity-30 pointer-events-none"
        animate={{
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
        }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
}
