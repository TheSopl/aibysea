'use client';

import { useMetricsStore } from '@/stores/metricsStore';
import numeral from 'numeral';
import { Activity, MessageSquare, Zap, Gauge, Brain, Wifi } from 'lucide-react';

// Helper function to format numbers
const formatNumber = (value: number, format: string): string => {
  return numeral(value).format(format);
};

// Metric Card with large colored icon circle (Purity UI style)
interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconBgColor: string;
  iconColor: string;
}

const MetricCard = ({ icon, label, value, iconBgColor, iconColor }: MetricCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-design-lg p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1">
      <div className="flex items-start gap-4">
        {/* Large colored icon circle */}
        <div className={`${iconBgColor} rounded-full p-4 flex items-center justify-center flex-shrink-0`}>
          <div className={iconColor}>
            {icon}
          </div>
        </div>

        {/* Value and label */}
        <div className="flex flex-col">
          <div className="text-xs uppercase tracking-widest text-text-secondary font-bold mb-2">
            {label}
          </div>
          <div className="text-3xl md:text-4xl font-extrabold text-dark leading-none">
            {value}
          </div>
        </div>
      </div>
    </div>
  );
};

// Badge component for AI State
const AIStateBadge = ({ state }: { state: string }) => {
  const stateStyles = {
    idle: 'bg-gray-100 text-gray-700 border-gray-300',
    thinking: 'bg-purple-100 text-purple-700 border-purple-300',
    responding: 'bg-primary/10 text-primary border-primary/30',
    waiting: 'bg-amber-100 text-amber-700 border-amber-300',
  };

  const style = stateStyles[state as keyof typeof stateStyles] || stateStyles.idle;

  return (
    <div className="bg-white border border-gray-200 rounded-design-lg p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="text-xs uppercase tracking-widest text-text-secondary font-bold mb-3">
        AI State
      </div>
      <span className={`inline-flex px-4 py-2.5 rounded-design text-sm font-bold border transition-all duration-200 ${style} capitalize`}>
        {state}
      </span>
    </div>
  );
};

// Connection status with icon
const ConnectionStatus = ({ status }: { status: string }) => {
  const statusStyles = {
    connected: { bg: 'bg-green/20', dot: 'bg-green', text: 'text-green' },
    connecting: { bg: 'bg-amber/20', dot: 'bg-amber', text: 'text-amber' },
    disconnected: { bg: 'bg-red/20', dot: 'bg-red', text: 'text-red' },
  };

  const style = statusStyles[status as keyof typeof statusStyles] || statusStyles.disconnected;

  return (
    <div className="bg-white border border-gray-200 rounded-design-lg p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="text-xs uppercase tracking-widest text-text-secondary font-bold mb-3">
        Connection
      </div>
      <div className="flex items-center gap-3">
        <Wifi className={`w-8 h-8 ${style.text}`} />
        <div className="flex flex-col">
          <div className={`w-3 h-3 rounded-full ${style.dot} animate-pulse mb-1`} />
          <span className={`text-sm font-bold ${style.text} capitalize`}>
            {status}
          </span>
        </div>
      </div>
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

  // Calculate average latency
  const avgLatency = metricsHistory.length > 0
    ? metricsHistory.slice(-600).reduce((sum, m) => sum + m.latency, 0) / Math.min(metricsHistory.length, 600)
    : 0;

  // Calculate context size
  const contextSize = metricsHistory.length > 0
    ? Math.floor(avgLatency * 10)
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 md:gap-8">
      {/* AI State Badge */}
      <AIStateBadge state={aiState} />

      {/* Active Conversations */}
      <MetricCard
        icon={<MessageSquare className="w-8 h-8" strokeWidth={2.5} />}
        label="Conversations"
        value={formatNumber(activeConversations, '0,0')}
        iconBgColor="bg-accent"
        iconColor="text-white"
      />

      {/* Average Latency */}
      <MetricCard
        icon={<Zap className="w-8 h-8" strokeWidth={2.5} />}
        label="Avg Latency"
        value={`${formatNumber(avgLatency, '0,0')}ms`}
        iconBgColor="bg-primary"
        iconColor="text-white"
      />

      {/* Current Confidence */}
      <MetricCard
        icon={<Gauge className="w-8 h-8" strokeWidth={2.5} />}
        label="Confidence"
        value={`${formatNumber(currentConfidence * 100, '0.0')}%`}
        iconBgColor="bg-accent"
        iconColor="text-white"
      />

      {/* Context Size */}
      <MetricCard
        icon={<Brain className="w-8 h-8" strokeWidth={2.5} />}
        label="Context Size"
        value={`${formatNumber(contextSize, '0.0a')}`}
        iconBgColor="bg-primary"
        iconColor="text-white"
      />

      {/* Connection Status */}
      <ConnectionStatus status={connectionStatus} />
    </div>
  );
}
