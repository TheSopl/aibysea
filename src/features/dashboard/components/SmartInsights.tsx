'use client';

import { motion } from 'framer-motion';

interface InsightItem {
  icon: string;
  text: string;
  type: 'warning' | 'trend' | 'info';
}

export default function SmartInsights() {
  const insights: InsightItem[] = [
    {
      icon: '⚠️',
      text: '2 risky conversations detected',
      type: 'warning',
    },
    {
      icon: '🔥',
      text: 'Peak hour 14:00-15:00 incoming',
      type: 'info',
    },
    {
      icon: '📈',
      text: 'Returns ↑ (trending)',
      type: 'trend',
    },
    {
      icon: '⭐',
      text: 'Quality ↑↑ (strong improvement)',
      type: 'trend',
    },
  ];

  const typeColors = {
    warning: 'text-amber border-amber/20 bg-amber/10',
    trend: 'text-teal border-teal/20 bg-teal/10',
    info: 'text-purple border-purple/20 bg-purple/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-dark-surface border border-accent-surface rounded-design p-5"
      style={{
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-6 bg-teal rounded-full" />
        <h3 className="text-lg font-semibold text-teal uppercase tracking-wide">
          Smart Insights
        </h3>
      </div>

      {/* Insights list */}
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`flex items-start gap-3 p-3 rounded-lg border ${typeColors[insight.type]}`}
          >
            <span className="text-xl">{insight.icon}</span>
            <span className="text-sm text-text-primary flex-1">{insight.text}</span>
          </motion.div>
        ))}
      </div>

      {/* Summary stats */}
      <div className="mt-5 pt-4 border-t border-accent-surface">
        <div className="text-xs uppercase tracking-wide text-text-secondary mb-2">
          Today&apos;s Overview
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-dark-surface/60 rounded-lg p-2">
            <div className="text-xs text-text-secondary">Anger Cases</div>
            <div className="text-lg font-bold font-mono text-green">0</div>
          </div>
          <div className="bg-dark-surface/60 rounded-lg p-2">
            <div className="text-xs text-text-secondary">Risk Cases</div>
            <div className="text-lg font-bold font-mono text-amber">2</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
