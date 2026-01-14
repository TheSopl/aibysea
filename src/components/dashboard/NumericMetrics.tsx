'use client';

import { useMetricsStore } from '@/stores/metricsStore';
import numeral from 'numeral';

// Helper function to format numbers
const formatNumber = (value: number, format: string): string => {
  return numeral(value).format(format);
};

// Badge component for AI State
const AIStateBadge = ({ state }: { state: string }) => {
  const stateStyles = {
    idle: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    thinking: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    responding: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    waiting: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  };

  const style = stateStyles[state as keyof typeof stateStyles] || stateStyles.idle;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${style} capitalize`}>
      {state}
    </span>
  );
};

// Connection status indicator
const ConnectionStatus = ({ status }: { status: string }) => {
  const statusStyles = {
    connected: 'bg-green text-green',
    connecting: 'bg-yellow text-yellow',
    disconnected: 'bg-red text-red',
  };

  const style = statusStyles[status as keyof typeof statusStyles] || statusStyles.disconnected;

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${style.split(' ')[0]} animate-pulse`} />
      <span className={`text-xs font-medium ${style.split(' ')[1]} capitalize`}>
        {status}
      </span>
    </div>
  );
};

export default function NumericMetrics() {
  // Get current values from store
  const aiState = useMetricsStore((state) => state.aiState);
  const activeConversations = useMetricsStore((state) => state.activeConversations);
  const connectionStatus = useMetricsStore((state) => state.connectionStatus);
  const metricsHistory = useMetricsStore((state) => state.metrics);
  const currentConfidence = useMetricsStore((state) => state.confidence);

  // Calculate average latency for last minute (last 600 points at 100ms intervals)
  const avgLatency = metricsHistory.length > 0
    ? metricsHistory.slice(-600).reduce((sum, m) => sum + m.latency, 0) / Math.min(metricsHistory.length, 600)
    : 0;

  // Calculate total context size (mock for now - in production this would come from actual context tracking)
  const contextSize = metricsHistory.length > 0
    ? Math.floor(avgLatency * 10) // Mock: derive from latency
    : 0;

  return (
    <div className="bg-dark-surface/60 backdrop-blur-lg border border-teal/10 rounded-design p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-6">Current Metrics</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {/* AI State */}
        <div className="flex flex-col gap-2">
          <div className="text-xs text-text-secondary uppercase tracking-wide">AI State</div>
          <AIStateBadge state={aiState} />
        </div>

        {/* Active Conversations */}
        <div className="flex flex-col gap-2">
          <div className="text-xs text-text-secondary uppercase tracking-wide">Conversations</div>
          <div className="text-2xl font-bold text-text-primary">
            {formatNumber(activeConversations, '0,0')}
          </div>
        </div>

        {/* Average Latency */}
        <div className="flex flex-col gap-2">
          <div className="text-xs text-text-secondary uppercase tracking-wide">Avg Latency</div>
          <div className="text-2xl font-bold text-text-primary">
            {formatNumber(avgLatency, '0,0')}
            <span className="text-sm text-text-secondary ml-1">ms</span>
          </div>
        </div>

        {/* Current Confidence */}
        <div className="flex flex-col gap-2">
          <div className="text-xs text-text-secondary uppercase tracking-wide">Confidence</div>
          <div className="text-2xl font-bold text-text-primary">
            {formatNumber(currentConfidence * 100, '0.0')}
            <span className="text-sm text-text-secondary ml-1">%</span>
          </div>
        </div>

        {/* Context Size */}
        <div className="flex flex-col gap-2">
          <div className="text-xs text-text-secondary uppercase tracking-wide">Context Size</div>
          <div className="text-2xl font-bold text-text-primary">
            {formatNumber(contextSize, '0.0a')}
            <span className="text-sm text-text-secondary ml-1">tokens</span>
          </div>
        </div>

        {/* Connection Status */}
        <div className="flex flex-col gap-2">
          <div className="text-xs text-text-secondary uppercase tracking-wide">Connection</div>
          <ConnectionStatus status={connectionStatus} />
        </div>
      </div>
    </div>
  );
}
