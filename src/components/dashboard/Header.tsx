'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { useMetricsStore } from '@/stores/metricsStore';
import { useTheme } from '@/contexts/ThemeContext';

export default function Header() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const connectionStatus = useMetricsStore((state) => state.connectionStatus);
  const { theme, toggleTheme } = useTheme();

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

  // Connection status styling (green/yellow/red based on state)
  const statusConfig = useMemo(() => {
    switch (connectionStatus) {
      case 'connected':
        return {
          bgColor: 'bg-green/20',
          borderColor: 'border-green/30',
          dotColor: 'bg-green',
          textColor: 'text-green',
          label: 'Connected',
          pulse: true,
        };
      case 'connecting':
        return {
          bgColor: 'bg-amber/20',
          borderColor: 'border-amber/30',
          dotColor: 'bg-amber',
          textColor: 'text-amber',
          label: 'Connecting...',
          pulse: true,
        };
      case 'disconnected':
        return {
          bgColor: 'bg-red/20',
          borderColor: 'border-red/30',
          dotColor: 'bg-red',
          textColor: 'text-red',
          label: 'Disconnected',
          pulse: false,
        };
      default:
        return {
          bgColor: 'bg-gray/20',
          borderColor: 'border-gray/30',
          dotColor: 'bg-gray',
          textColor: 'text-gray',
          label: 'Unknown',
          pulse: false,
        };
    }
  }, [connectionStatus]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-lg border-b border-light-border dark:border-accent-surface px-6 py-4 transition-colors duration-200"
      style={{
        boxShadow: theme === 'dark' ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-teal to-purple rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <h1 className="text-xl font-bold text-light-text-primary dark:text-text-primary">AIBYSEA</h1>
        </div>

        {/* Center: Date & Time */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-sm text-light-text-primary dark:text-text-primary font-medium">
              {formatDate(currentTime)}
            </div>
            <div className="text-xs text-light-text-secondary dark:text-text-secondary">
              {formatTime(currentTime)} | Istanbul (GMT+3:00)
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Connection Status (animated based on real status from store) */}
          <motion.div
            className={`flex items-center gap-2 px-3 py-1.5 ${statusConfig.bgColor} rounded-lg border ${statusConfig.borderColor}`}
            animate={{
              backgroundColor: statusConfig.bgColor,
            }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className={`w-2 h-2 ${statusConfig.dotColor} rounded-full`}
              animate={
                statusConfig.pulse
                  ? {
                      boxShadow: [
                        '0 0 4px rgba(16, 185, 129, 0.6)',
                        '0 0 8px rgba(16, 185, 129, 0.8)',
                        '0 0 4px rgba(16, 185, 129, 0.6)',
                      ],
                    }
                  : {}
              }
              transition={statusConfig.pulse ? { duration: 2, repeat: Infinity } : {}}
            />
            <span className={`text-xs font-medium ${statusConfig.textColor}`}>
              {statusConfig.label}
            </span>
          </motion.div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-light-border dark:bg-accent-surface hover:bg-teal/20 text-light-text-primary dark:text-text-primary hover:text-teal rounded-lg border border-light-border dark:border-accent-surface hover:border-teal/30 transition-all duration-200 text-sm font-medium"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'} {theme === 'dark' ? 'Light' : 'Dark'}
          </button>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-light-border dark:bg-accent-surface hover:bg-teal/20 text-light-text-primary dark:text-text-primary hover:text-teal rounded-lg border border-light-border dark:border-accent-surface hover:border-teal/30 transition-all duration-200 text-sm font-medium"
          >
            🔄 Refresh
          </button>
        </div>
      </div>
    </motion.header>
  );
}
