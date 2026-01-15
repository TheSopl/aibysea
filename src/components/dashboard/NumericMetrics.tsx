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
    idle: 'bg-gray-100 text-gray-600 border-gray-300',
    thinking: 'bg-purple-100 text-purple-600 border-purple-300',
    responding: 'bg-primary/10 text-primary border-primary/30',
    waiting: 'bg-amber-100 text-amber-600 border-amber-300',
  };

  const style = stateStyles[state as keyof typeof stateStyles] || stateStyles.idle;

  return (
    <span className={`px-3 py-1.5 rounded-design text-xs font-semibold border transition-all duration-200 ${style} capitalize`}>
      {state}
    </span>
  );
};

// Connection status indicator
const ConnectionStatus = ({ status }: { status: string }) => {
  const statusStyles = {
    connected: 'bg-green text-green',
    connecting: 'bg-amber text-amber',
    disconnected: 'bg-red text-red',
  };

  const style = statusStyles[status as keyof typeof statusStyles] || statusStyles.disconnected;

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2.5 h-2.5 rounded-full ${style.split(' ')[0]} animate-pulse`} />
      <span className={`text-sm font-semibold ${style.split(' ')[1]} capitalize`}>
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
    <div className="bg-white border border-gray-200 rounded-design-lg p-8 shadow-card">
      <h3 className="text-lg font-bold text-dark mb-6">Current Metrics</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {/* AI State */}
        <div className="flex flex-col gap-2">
          <div className="text-xs text-text-secondary uppercase tracking-wider font-semibold">AI State</div>
          <AIStateBadge state={aiState} />
        </div>

        {/* Active Conversations */}
        <div className="flex flex-col gap-2">
          <div className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Conversations</div>
          <div className="text-2xl font-extrabold text-primary">
            {formatNumber(activeConversations, '0,0')}
          </div>
        </div>

        {/* Average Latency */}
        <div className="flex flex-col gap-2">
          <div className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Avg Latency</div>
          <div className="text-2xl font-extrabold text-primary">
            {formatNumber(avgLatency, '0,0')}
            <span className="text-sm text-text-secondary ml-1 font-medium">ms</span>
          </div>
        </div>

        {/* Current Confidence */}
        <div className="flex flex-col gap-2">
          <div className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Confidence</div>
          <div className="text-2xl font-extrabold text-primary">
            {formatNumber(currentConfidence * 100, '0.0')}
            <span className="text-sm text-text-secondary ml-1 font-medium">%</span>
          </div>
        </div>

        {/* Context Size */}
        <div className="flex flex-col gap-2">
          <div className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Context Size</div>
          <div className="text-2xl font-extrabold text-primary">
            {formatNumber(contextSize, '0.0a')}
            <span className="text-sm text-text-secondary ml-1 font-medium">tokens</span>
          </div>
        </div>

        {/* Connection Status */}
        <div className="flex flex-col gap-2">
          <div className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Connection</div>
          <ConnectionStatus status={connectionStatus} />
        </div>
      </div>
    </div>
  );
}
