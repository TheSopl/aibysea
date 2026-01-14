'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useMetricsStore } from '@/stores/metricsStore';

type TrendDirection = 'up' | 'down' | 'stable';

interface MetricsCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: {
    direction: TrendDirection;
    value: string;
  };
  sparklineData?: number[];
  index?: number;
}

export default function MetricsCard({
  label,
  value,
  unit = '',
  trend,
  sparklineData,
  index = 0,
}: MetricsCardProps) {
  const shouldAnimate = useMetricsStore((state) => state.shouldAnimate);
  const [showGlow, setShowGlow] = useState(false);

  // Trigger glow animation when metrics update
  useEffect(() => {
    if (shouldAnimate) {
      setShowGlow(true);
      const timeout = setTimeout(() => setShowGlow(false), 200); // 200ms glow duration
      return () => clearTimeout(timeout);
    }
  }, [shouldAnimate]);

  const trendColors = {
    up: 'text-green',
    down: 'text-red',
    stable: 'text-text-secondary',
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    stable: '→',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="relative bg-dark-surface border-0 rounded-design p-5 cursor-pointer group transition-all duration-200"
      style={{
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Label */}
      <div className="text-xs uppercase tracking-wide text-text-secondary mb-3">
        {label}
      </div>

      {/* Main metric value */}
      <div className="flex items-baseline gap-2 mb-2">
        <motion.span
          key={value}
          initial={{ opacity: 0.5, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="text-3xl font-bold font-mono text-teal"
        >
          {value}
        </motion.span>
        {unit && (
          <span className="text-lg text-text-secondary font-mono">{unit}</span>
        )}
      </div>

      {/* Trend indicator */}
      {trend && (
        <div className="flex items-center gap-1.5 mb-3">
          <span className={`text-sm font-medium ${trendColors[trend.direction]}`}>
            {trendIcons[trend.direction]} {trend.value}
          </span>
          <span className="text-xs text-text-tertiary">vs 15 updates ago</span>
        </div>
      )}

      {/* Sparkline */}
      {sparklineData && sparklineData.length > 0 && (
        <div className="h-8 flex items-end gap-0.5">
          {sparklineData.map((value, idx) => {
            const height = Math.max(10, (value / Math.max(...sparklineData)) * 100);
            return (
              <motion.div
                key={idx}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 + idx * 0.02 }}
                className="flex-1 bg-teal/30 rounded-sm"
              />
            );
          })}
        </div>
      )}

      {/* Hover glow effect */}
      <div
        className="absolute inset-0 rounded-design opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{
          boxShadow: '0 0 24px rgba(0, 217, 255, 0.3)',
        }}
      />

      {/* Update glow animation (flashes when metrics update) */}
      <AnimatePresence>
        {showGlow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 rounded-design pointer-events-none"
            style={{
              boxShadow: '0 0 24px rgba(0, 217, 255, 0.4), 0 0 12px rgba(0, 217, 255, 0.2)',
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
