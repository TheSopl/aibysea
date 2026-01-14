'use client';

import { memo, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useMetricsStore } from '@/stores/metricsStore';

interface ConfidencePoint {
  timestamp: number;
  confidence: number; // 0-100%
}

// Memoized chart component
const ConfidenceScoresComponent = ({ data }: { data: ConfidencePoint[] }) => (
  <div className="bg-dark-surface/60 backdrop-blur-lg border border-teal/10 rounded-design p-6">
    <h3 className="text-lg font-semibold text-text-primary mb-4">Decision Confidence</h3>
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <defs>
          {/* Gradient fill that transitions from red at bottom to green at top */}
          <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#EF4444" stopOpacity={0.4} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="timestamp"
          type="number"
          domain={['dataMin', 'dataMax']}
          tickFormatter={(value) => new Date(value).toLocaleTimeString()}
          stroke="#9CA3AF"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          label={{ value: 'Confidence %', angle: -90, position: 'insideLeft', style: { fill: '#9CA3AF' } }}
          domain={[0, 100]}
          stroke="#9CA3AF"
          style={{ fontSize: '12px' }}
        />
        <Tooltip
          formatter={(value: number) => `${value.toFixed(1)}%`}
          labelFormatter={(value) => new Date(value).toLocaleTimeString()}
          contentStyle={{
            backgroundColor: '#1F2937',
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#F9FAFB',
          }}
        />
        {/* Threshold line at 50% (warning level) */}
        <ReferenceLine
          y={50}
          stroke="#F59E0B"
          strokeDasharray="3 3"
          strokeWidth={1}
          label={{ value: '50%', position: 'right', fill: '#F59E0B', fontSize: 12 }}
        />
        {/* Threshold line at 80% (good level) */}
        <ReferenceLine
          y={80}
          stroke="#10B981"
          strokeDasharray="3 3"
          strokeWidth={1}
          label={{ value: '80%', position: 'right', fill: '#10B981', fontSize: 12 }}
        />
        <Area
          type="monotone"
          dataKey="confidence"
          stroke="#3B82F6"
          fill="url(#confidenceGradient)"
          strokeWidth={2}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>

    {/* Legend with threshold explanation */}
    <div className="mt-4 flex justify-center gap-6 text-xs text-text-secondary">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-green" />
        <span>&gt;80% High Confidence</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-yellow" />
        <span>50-80% Medium</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red" />
        <span>&lt;50% Low</span>
      </div>
    </div>
  </div>
);

// Memo with custom comparator: only re-render if last data point changed
export const ConfidenceScores = memo(
  ConfidenceScoresComponent,
  (prev, next) => {
    if (prev.data.length === 0 || next.data.length === 0) {
      return prev.data.length === next.data.length;
    }

    const prevLast = prev.data[prev.data.length - 1];
    const nextLast = next.data[next.data.length - 1];

    return (
      prevLast.timestamp === nextLast.timestamp &&
      prevLast.confidence === nextLast.confidence
    );
  }
);

ConfidenceScores.displayName = 'ConfidenceScores';

// Main component that connects to the store
export default function ConfidenceScoresContainer() {
  const metricsHistory = useMetricsStore((state) => state.metrics);

  // Transform store metrics into chart data (windowed to last 100 points)
  // Use useMemo to avoid creating new objects on every render
  const chartData = useMemo(() => {
    return metricsHistory.slice(-100).map((m) => ({
      timestamp: m.timestamp,
      // Convert confidence from 0-1 to 0-100 for percentage display
      confidence: m.confidence * 100,
    }));
  }, [metricsHistory]);

  return <ConfidenceScores data={chartData} />;
}
