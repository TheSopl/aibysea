'use client';

import { useMemo } from 'react';
import MetricsCard from './MetricsCard';
import HealthScore from './HealthScore';
import AIAgentCard from './AIAgentCard';
import NumericMetrics from './NumericMetrics';
import LatencyChartContainer from './LatencyChart';
import ConfidenceScoresContainer from './ConfidenceScores';
import { useMetricsStore } from '@/stores/metricsStore';
import { useMetricsSubscription } from '@/hooks/useMetricsSubscription';
import { useMockMetricsStream } from '@/hooks/useMockMetricsStream';

export default function AIMetricsDashboard() {
  // Subscribe to real-time metrics (production) or mock stream (development)
  useMetricsSubscription();
  useMockMetricsStream();

  // Get current metrics from store
  const latency = useMetricsStore((state) => state.latency);
  const quality = useMetricsStore((state) => state.quality);
  const sentiment = useMetricsStore((state) => state.sentiment);
  const healthScore = useMetricsStore((state) => state.healthScore);
  const activeConversations = useMetricsStore((state) => state.activeConversations);
  const metricsHistory = useMetricsStore((state) => state.metrics);

  // Prepare metrics cards data
  const metrics = useMemo(() => {
    // Get sparkline data from last 15 points
    const latencySparkline = metricsHistory.slice(-15).map((m) => m.latency);
    const qualitySparkline = metricsHistory.slice(-15).map((m) => m.quality);
    const sentimentSparkline = metricsHistory.slice(-15).map((m) => (m.sentiment + 1) * 50); // Map -1,1 to 0,100

    // Calculate trends (compare current to 15 points ago)
    const latencyTrend = metricsHistory.length >= 15
      ? latency - metricsHistory[metricsHistory.length - 15].latency
      : 0;
    const qualityTrend = metricsHistory.length >= 15
      ? quality - metricsHistory[metricsHistory.length - 15].quality
      : 0;
    const sentimentTrend = metricsHistory.length >= 15
      ? sentiment - metricsHistory[metricsHistory.length - 15].sentiment
      : 0;

    return [
      {
        label: 'Response Time',
        value: Math.round(latency).toString(),
        unit: 'ms',
        trend: {
          direction: (latencyTrend < -5 ? 'down' : latencyTrend > 5 ? 'up' : 'stable') as 'up' | 'down' | 'stable',
          value: `${Math.abs(Math.round(latencyTrend))}ms`,
        },
        sparklineData: latencySparkline.length > 0 ? latencySparkline : undefined,
      },
      {
        label: 'Quality',
        value: Math.round(quality).toString(),
        unit: '%',
        trend: {
          direction: (qualityTrend > 1 ? 'up' : qualityTrend < -1 ? 'down' : 'stable') as 'up' | 'down' | 'stable',
          value: `${Math.abs(Math.round(qualityTrend))}%`,
        },
        sparklineData: qualitySparkline.length > 0 ? qualitySparkline : undefined,
      },
      {
        label: 'Customer Sentiment',
        value: Math.round((sentiment + 1) * 50).toString(), // Map -1,1 to 0,100
        unit: '% Positive',
        trend: {
          direction: (sentimentTrend > 0.1 ? 'up' : sentimentTrend < -0.1 ? 'down' : 'stable') as 'up' | 'down' | 'stable',
          value: `${Math.abs(Math.round(sentimentTrend * 50))}%`,
        },
        sparklineData: sentimentSparkline.length > 0 ? sentimentSparkline : undefined,
      },
    ];
  }, [latency, quality, sentiment, metricsHistory]);

  return (
    <div className="space-y-8 md:space-y-10">
      {/* Top section: Health Score + AI Agent Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Health Score Card */}
        <div className="bg-white border border-gray-200 rounded-design-lg p-8 shadow-card">
          <div className="text-sm uppercase tracking-wider text-text-secondary mb-6 font-semibold">
            Overall Health
          </div>
          <div className="flex items-center justify-center">
            <HealthScore score={Math.round(healthScore || 94)} maxScore={100} />
          </div>
          <div className="mt-6 flex justify-center gap-6 text-sm font-medium">
            <span className="text-green">Quality ↑</span>
            <span className="text-green">Speed ↑</span>
            <span className="text-green">Escalations ↓</span>
          </div>
        </div>

        {/* AI Agent Card */}
        <AIAgentCard
          name="Rashed"
          avatarUrl="/images/rashed.jpeg"
          healthScore={Math.round(healthScore || 94)}
          learnedToday={15}
          isOnline={true}
        />
      </div>

      {/* Numeric Metrics Row */}
      <NumericMetrics />

      {/* Charts Grid - Responsive: Stack on mobile, side-by-side on desktop */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        <LatencyChartContainer />
        <ConfidenceScoresContainer />
      </div>

      {/* Metrics Grid */}
      <div>
        <h2 className="text-2xl font-extrabold text-dark mb-6">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {metrics.map((metric, index) => (
            <MetricsCard key={metric.label} {...metric} index={index} />
          ))}
        </div>
      </div>

      {/* Active Conversations Counter */}
      {activeConversations > 0 && (
        <div className="text-sm text-text-secondary text-center font-medium pb-8">
          {activeConversations} active conversation{activeConversations !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
