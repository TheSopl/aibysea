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
  <div className="bg-white border border-gray-200 rounded-design-lg p-8 md:p-10 shadow-lg hover:shadow-xl transition-all duration-300">
    <h3 className="text-2xl font-extrabold text-dark mb-6 md:mb-8">Latency Metrics</h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="ttftGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#003EF3" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#003EF3" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="tpotGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4EB6C9" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#4EB6C9" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis
          dataKey="timestamp"
          type="number"
          domain={['dataMin', 'dataMax']}
          tickFormatter={(value) => new Date(value).toLocaleTimeString()}
          stroke="#6B7280"
          style={{ fontSize: '12px', fontWeight: 500 }}
        />
        <YAxis
          label={{ value: 'ms', angle: -90, position: 'insideLeft', style: { fill: '#6B7280', fontWeight: 600 } }}
          stroke="#6B7280"
          style={{ fontSize: '12px', fontWeight: 500 }}
        />
        <Tooltip
          formatter={(value: number) => `${value.toFixed(2)}ms`}
          labelFormatter={(value) => new Date(value).toLocaleTimeString()}
          contentStyle={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            color: '#1a1a1a',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        />
        <Legend
          wrapperStyle={{ color: '#6B7280', fontSize: '12px', fontWeight: 500 }}
        />
        <Line
          type="monotone"
          dataKey="ttft"
          stroke="#003EF3"
          fill="url(#ttftGradient)"
          dot={false}
          isAnimationActive={false}
          strokeWidth={3}
          name="Time to First Token"
        />
        <Line
          type="monotone"
          dataKey="tpot"
          stroke="#4EB6C9"
          fill="url(#tpotGradient)"
          dot={false}
          isAnimationActive={false}
          strokeWidth={3}
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
