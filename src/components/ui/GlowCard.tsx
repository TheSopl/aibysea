'use client';

import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

/**
 * GlowCard - A card with a subtle glow effect on hover.
 * Used for hero/featured metrics to add visual impact.
 */
export default function GlowCard({ children, className, glowColor = 'rgba(0, 62, 243, 0.15)' }: GlowCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={cn(
        'relative rounded-xl p-3 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -3, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 opacity-0 pointer-events-none"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}, transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
