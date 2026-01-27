'use client';

import { motion } from 'framer-motion';

interface ActionItem {
  text: string;
  priority: 'normal' | 'high' | 'urgent';
  icon: string;
}

export default function SmartActions() {
  const actions: ActionItem[] = [
    {
      text: 'Reach out to Marcus (3 days silent)',
      priority: 'normal',
      icon: '👋',
    },
    {
      text: 'John wants spec sheets',
      priority: 'normal',
      icon: '📄',
    },
    {
      text: 'Sarah likely to upgrade (90%)',
      priority: 'high',
      icon: '⬆️',
    },
    {
      text: 'Ahmed angry! (escalate ⚡)',
      priority: 'urgent',
      icon: '🚨',
    },
  ];

  const priorityStyles = {
    normal: 'hover:bg-accent-surface border-accent-surface',
    high: 'hover:bg-purple/10 border-purple/20 text-purple',
    urgent: 'hover:bg-red/10 border-red/30 text-red font-semibold',
  };

  const priorityBadges = {
    normal: null,
    high: <span className="text-xs px-2 py-0.5 bg-purple/20 text-purple rounded">High</span>,
    urgent: <span className="text-xs px-2 py-0.5 bg-red/20 text-red rounded animate-pulse">Urgent</span>,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-dark-surface border border-accent-surface rounded-design p-5"
      style={{
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🎯</span>
        <h3 className="text-lg font-semibold text-teal uppercase tracking-wide">
          Smart Actions
        </h3>
      </div>

      {/* Actions list */}
      <div className="space-y-2">
        {actions.map((action, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`w-full text-start flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${priorityStyles[action.priority]}`}
          >
            <span className="text-lg">{action.icon}</span>
            <span className="text-sm text-text-primary flex-1">{action.text}</span>
            {priorityBadges[action.priority]}
          </motion.button>
        ))}
      </div>

      {/* Footer tip */}
      <div className="mt-5 pt-4 border-t border-accent-surface">
        <div className="flex items-start gap-2 text-xs text-text-secondary">
          <span>💡</span>
          <span>
            AI recommendations based on conversation patterns, sentiment analysis, and customer behavior.
          </span>
        </div>
      </div>
    </motion.div>
  );
}
