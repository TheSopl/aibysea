'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Header() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-dark-surface/80 backdrop-blur-lg border-b border-accent-surface px-6 py-4"
      style={{
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      }}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-teal to-purple rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <h1 className="text-xl font-bold text-text-primary">AIBYSEA</h1>
        </div>

        {/* Center: Date & Time */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-sm text-text-primary font-medium">
              {formatDate(currentTime)}
            </div>
            <div className="text-xs text-text-secondary">
              {formatTime(currentTime)} | Istanbul (GMT+3:00)
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Connection Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green/20 rounded-lg border border-green/30">
            <motion.div
              className="w-2 h-2 bg-green rounded-full"
              animate={{
                boxShadow: [
                  '0 0 4px rgba(16, 185, 129, 0.6)',
                  '0 0 8px rgba(16, 185, 129, 0.8)',
                  '0 0 4px rgba(16, 185, 129, 0.6)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs font-medium text-green">Connected</span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-accent-surface hover:bg-teal/20 text-text-primary hover:text-teal rounded-lg border border-accent-surface hover:border-teal/30 transition-all duration-200 text-sm font-medium"
          >
            🔄 Refresh
          </button>
        </div>
      </div>
    </motion.header>
  );
}
