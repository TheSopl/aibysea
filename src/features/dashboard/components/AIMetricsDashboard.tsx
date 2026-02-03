'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import MetricsCard from './MetricsCard';
import HealthScore from './HealthScore';
import AIAgentCard from './AIAgentCard';
import NumericMetrics from './NumericMetrics';
import LatencyChartContainer from './LatencyChart';
import ConfidenceScoresContainer from './ConfidenceScores';
import { useMetricsStore } from '@/features/dashboard/store/metricsStore';
import { useMetricsSubscription } from '@/features/dashboard/hooks/useMetricsSubscription';
import { useMockMetricsStream } from '@/features/dashboard/hooks/useMockMetricsStream';

export default function AIMetricsDashboard() {
  useMetricsSubscription();
  useMockMetricsStream();

  const latency = useMetricsStore((state) => state.latency);
  const quality = useMetricsStore((state) => state.quality);
  const sentiment = useMetricsStore((state) => state.sentiment);
  const healthScore = useMetricsStore((state) => state.healthScore);
  const activeConversations = useMetricsStore((state) => state.activeConversations);
  const metricsHistory = useMetricsStore((state) => state.metrics);

  const metrics = useMemo(() => {
    const latencySparkline = metricsHistory.slice(-15).map((m) => m.latency);
    const qualitySparkline = metricsHistory.slice(-15).map((m) => m.quality);
    const sentimentSparkline = metricsHistory.slice(-15).map((m) => (m.sentiment + 1) * 50); // Map -1,1 to 0,100

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-10 md:space-y-12"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10"
      >
        <Card variant="default" className="md:p-10">
          <div className="text-xs uppercase tracking-widest text-text-secondary mb-6 md:mb-8 font-bold">
            Overall Health
          </div>
          <div className="flex items-center justify-center">
            <HealthScore score={Math.round(healthScore || 94)} maxScore={100} />
          </div>
          <div className="mt-4 md:mt-6 flex justify-center gap-4 md:gap-6 text-sm font-medium">
            <span className="text-green">Quality ↑</span>
            <span className="text-green">Speed ↑</span>
            <span className="text-green">Escalations ↓</span>
          </div>
        </Card>

        <AIAgentCard
          name="Rashed"
          avatarUrl="/images/rashed.jpeg"
          healthScore={Math.round(healthScore || 94)}
          learnedToday={15}
          isOnline={true}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <NumericMetrics />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-10"
      >
        <LatencyChartContainer />
        <ConfidenceScoresContainer />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-heading-2 font-extrabold text-dark mb-6">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {metrics.map((metric, index) => (
            <MetricsCard key={metric.label} {...metric} index={index} />
          ))}
        </div>
      </motion.div>

      {activeConversations > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-sm text-text-secondary text-center font-medium pb-8"
        >
          {activeConversations} active conversation{activeConversations !== 1 ? 's' : ''}
        </motion.div>
      )}
    </motion.div>
  );
}
