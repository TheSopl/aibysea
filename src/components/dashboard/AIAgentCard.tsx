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
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative bg-white border border-gray-200 rounded-design-lg p-6 md:p-8 transition-all duration-300 shadow-card hover:shadow-card-hover"
    >
      {/* Card content */}
      <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
        {/* Avatar */}
        <div className="relative">
          <div className="relative">
            <Image
              src={avatarUrl}
              alt={name}
              width={56}
              height={56}
              className="rounded-design border-2 border-accent/30"
            />
            {/* Online indicator */}
            {isOnline && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -end-1 w-3 h-3 bg-green rounded-full border-2 border-white shadow-sm"
              />
            )}
          </div>
        </div>

        {/* Agent info */}
        <div className="flex-1 text-center sm:text-start">
          <h3 className="text-heading-3 font-extrabold text-dark">{name}</h3>
          <div className="flex items-center justify-center sm:justify-start gap-3 mt-2">
            {/* Health badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-accent/20 rounded-design border border-accent/30">
              <span className="text-sm font-bold font-mono text-primary">{healthScore}/100</span>
              <span className="text-sm text-accent">⭐</span>
            </div>

            {/* Status */}
            {isOnline && (
              <span className="text-sm text-green font-semibold">Ready</span>
            )}
          </div>
        </div>

        {/* Learned counter */}
        <div className="text-end">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-heading-1 font-extrabold font-mono text-accent"
          >
            +{learnedToday}
          </motion.div>
          <div className="text-xs text-text-secondary uppercase tracking-wider font-semibold mt-1">
            Learned Today
          </div>
        </div>
      </div>
    </motion.div>
  );
}
