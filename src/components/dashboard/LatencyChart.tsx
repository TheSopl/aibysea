'use client';

import { memo, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { useMetricsStore } from '@/stores/metricsStore';

interface LatencyPoint {
  timestamp: number;
  ttft: number; // Time to first token
  tpot: number; // Time per output token
}

// Memoized chart component
const LatencyChartComponent = ({ data }: { data: LatencyPoint[] }) => (
  <div className="bg-dark-surface/60 backdrop-blur-lg border-0 rounded-design p-6">
    <h3 className="text-lg font-semibold text-text-primary mb-4">Latency Metrics</h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
          label={{ value: 'ms', angle: -90, position: 'insideLeft', style: { fill: '#9CA3AF' } }}
          stroke="#9CA3AF"
          style={{ fontSize: '12px' }}
        />
        <Tooltip
          formatter={(value: number) => `${value.toFixed(2)}ms`}
          labelFormatter={(value) => new Date(value).toLocaleTimeString()}
          contentStyle={{
            backgroundColor: '#1F2937',
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#F9FAFB',
          }}
        />
        <Legend
          wrapperStyle={{ color: '#9CA3AF', fontSize: '12px' }}
        />
        <Line
          type="monotone"
          dataKey="ttft"
          stroke="#3B82F6"
          dot={false}
          isAnimationActive={false}
          strokeWidth={2}
          name="Time to First Token"
        />
        <Line
          type="monotone"
          dataKey="tpot"
          stroke="#EF4444"
          dot={false}
          isAnimationActive={false}
          strokeWidth={2}
          name="Time Per Output Token"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

// Memo with custom comparator: only re-render if last data point changed
export const LatencyChart = memo(
  LatencyChartComponent,
  (prev, next) => {
    if (prev.data.length === 0 || next.data.length === 0) {
      return prev.data.length === next.data.length;
    }

    const prevLast = prev.data[prev.data.length - 1];
    const nextLast = next.data[next.data.length - 1];

    return (
      prevLast.timestamp === nextLast.timestamp &&
      prevLast.ttft === nextLast.ttft &&
      prevLast.tpot === nextLast.tpot
    );
  }
);

LatencyChart.displayName = 'LatencyChart';

// Main component that connects to the store
export default function LatencyChartContainer() {
  const metricsHistory = useMetricsStore((state) => state.metrics);

  // Transform store metrics into chart data (windowed to last 100 points)
  // Use useMemo to avoid creating new objects on every render
  const chartData = useMemo(() => {
    return metricsHistory.slice(-100).map((m) => ({
      timestamp: m.timestamp,
      // Derive TTFT and TPOT from latency (mock for now until we have real data)
      // TTFT is typically 30-50% of total latency, TPOT is the remainder
      ttft: m.latency * 0.4,
      tpot: m.latency * 0.6,
    }));
  }, [metricsHistory]);

  return <LatencyChart data={chartData} />;
}
