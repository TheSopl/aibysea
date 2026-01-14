'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface AIAgentCardProps {
  name: string;
  avatarUrl: string;
  healthScore: number;
  learnedToday: number;
  isOnline?: boolean;
}

export default function AIAgentCard({
  name,
  avatarUrl,
  healthScore,
  learnedToday,
  isOnline = true,
}: AIAgentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative bg-dark-surface/60 backdrop-blur-lg border-0 rounded-design p-6 hover:scale-[1.02] transition-all duration-200"
      style={{
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Card content */}
      <div className="flex items-center gap-4">
        {/* Avatar with glow */}
        <div className="relative">
          <div
            className="absolute inset-0 rounded-lg blur-md"
            style={{
              background: 'rgba(0, 217, 255, 0.3)',
            }}
          />
          <div className="relative">
            <Image
              src={avatarUrl}
              alt={name}
              width={48}
              height={48}
              className="rounded-lg border-0"
              style={{
                boxShadow: '0 4px 12px rgba(0, 217, 255, 0.3)',
              }}
            />
            {/* Online indicator */}
            {isOnline && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-green rounded-full border-2 border-dark-surface"
                style={{
                  boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
                }}
              />
            )}
          </div>
        </div>

        {/* Agent info */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text-primary">{name}</h3>
          <div className="flex items-center gap-3 mt-1">
            {/* Health badge */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-teal/20 rounded-md border-0">
              <span className="text-xs font-mono text-teal">{healthScore}/100</span>
              <span className="text-xs text-teal">⭐</span>
            </div>

            {/* Status */}
            {isOnline && (
              <span className="text-xs text-green font-medium">Ready</span>
            )}
          </div>
        </div>

        {/* Learned counter */}
        <div className="text-right">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-2xl font-bold font-mono text-purple"
          >
            +{learnedToday}
          </motion.div>
          <div className="text-xs text-text-secondary uppercase tracking-wide">
            Learned Today
          </div>
        </div>
      </div>

      {/* Hover glow effect */}
      <div
        className="absolute inset-0 rounded-design opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{
          boxShadow: '0 0 24px rgba(0, 217, 255, 0.3)',
        }}
      />
    </motion.div>
  );
}
