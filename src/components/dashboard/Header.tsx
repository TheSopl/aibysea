'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { useMetricsStore } from '@/stores/metricsStore';

export default function Header() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const connectionStatus = useMetricsStore((state) => state.connectionStatus);

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
      className="bg-white border-b border-gray-200 px-8 py-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-design flex items-center justify-center shadow-md">
            <span className="text-white font-extrabold text-base">AI</span>
          </div>
          <h1 className="text-xl font-extrabold text-primary">AIBYSEA</h1>
        </div>

        {/* Center: Date & Time */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-sm text-dark font-semibold">
              {formatDate(currentTime)}
            </div>
            <div className="text-xs text-text-secondary">
              {formatTime(currentTime)} | Istanbul (GMT+3:00)
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Connection Status (animated based on real status from store) */}
          <motion.div
            className={`flex items-center gap-2 px-3 py-2 ${statusConfig.bgColor} rounded-design border ${statusConfig.borderColor}`}
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
            <span className={`text-xs font-semibold ${statusConfig.textColor}`}>
              {statusConfig.label}
            </span>
          </motion.div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-primary hover:bg-primary-600 text-white rounded-design transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            🔄 Refresh
          </button>
        </div>
      </div>
    </motion.header>
  );
}
