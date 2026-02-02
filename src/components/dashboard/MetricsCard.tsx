'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useMetricsStore } from '@/stores/metricsStore';
import { Clock, BarChart3, Heart } from 'lucide-react';

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

// Icon mapping based on label
const getIcon = (label: string) => {
  if (label.toLowerCase().includes('response') || label.toLowerCase().includes('time')) {
    return <Clock className="w-10 h-10" strokeWidth={2.5} />;
  }
  if (label.toLowerCase().includes('quality')) {
    return <BarChart3 className="w-10 h-10" strokeWidth={2.5} />;
  }
  if (label.toLowerCase().includes('sentiment')) {
    return <Heart className="w-10 h-10" strokeWidth={2.5} />;
  }
  return <BarChart3 className="w-10 h-10" strokeWidth={2.5} />;
};

// Icon background color based on index
const getIconBgColor = (index: number) => {
  const colors = ['bg-accent', 'bg-primary', 'bg-accent'];
  return colors[index % colors.length];
};

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
      const timeout = setTimeout(() => setShowGlow(false), 200);
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

  const icon = getIcon(label);
  const iconBgColor = getIconBgColor(index);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative bg-white border border-gray-200 rounded-design-lg p-card-lg md:p-10 cursor-pointer group transition-all duration-300 shadow-lg hover:shadow-xl"
    >
      {/* Large colored icon circle at top */}
      <div className="flex items-start justify-between mb-6">
        <div className={`${iconBgColor} rounded-full p-5 flex items-center justify-center shadow-md`}>
          <div className="text-white">
            {icon}
          </div>
        </div>

        {/* Trend indicator (top right) */}
        {trend && (
          <div className="flex items-center gap-1.5">
            <span className={`text-sm font-bold ${trendColors[trend.direction]}`}>
              {trendIcons[trend.direction]} {trend.value}
            </span>
          </div>
        )}
      </div>

      {/* Label */}
      <div className="text-xs uppercase tracking-widest text-text-secondary mb-3 font-bold">
        {label}
      </div>

      {/* Main metric value */}
      <div className="flex items-baseline gap-2 mb-4">
        <motion.span
          key={value}
          initial={{ opacity: 0.5, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="text-5xl md:text-6xl font-extrabold font-mono text-dark leading-none"
        >
          {value}
        </motion.span>
        {unit && (
          <span className="text-xl text-text-secondary font-mono font-bold">{unit}</span>
        )}
      </div>

      {/* Sparkline */}
      {sparklineData && sparklineData.length > 0 && (
        <div className="h-12 flex items-end gap-1 mt-4">
          {sparklineData.map((value, idx) => {
            const height = Math.max(10, (value / Math.max(...sparklineData)) * 100);
            return (
              <motion.div
                key={idx}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 + idx * 0.02 }}
                className="flex-1 bg-gradient-to-t from-accent to-primary rounded-sm opacity-60 group-hover:opacity-100 transition-opacity"
              />
            );
          })}
        </div>
      )}

      {/* Update glow animation */}
      <AnimatePresence>
        {showGlow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 rounded-design-lg pointer-events-none border-2 border-primary"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
