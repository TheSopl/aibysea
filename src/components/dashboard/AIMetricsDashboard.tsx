'use client';

import MetricsCard from './MetricsCard';
import HealthScore from './HealthScore';
import AIAgentCard from './AIAgentCard';

export default function AIMetricsDashboard() {
  // Sample data - will be replaced with real data in Phase 07-02
  const metrics = [
    {
      label: 'Response Time',
      value: '245',
      unit: 'ms',
      trend: { direction: 'down' as const, value: '12ms' },
      sparklineData: [180, 200, 220, 190, 210, 245, 230, 220, 210, 200, 190, 185, 200, 215, 245],
    },
    {
      label: 'Quality',
      value: '96',
      unit: '%',
      trend: { direction: 'up' as const, value: '3%' },
      sparklineData: [88, 90, 89, 92, 91, 93, 94, 95, 94, 95, 96, 95, 96, 96, 96],
    },
    {
      label: 'Customer Sentiment',
      value: '73',
      unit: '% Positive',
      trend: { direction: 'up' as const, value: '8%' },
      sparklineData: [60, 62, 65, 63, 67, 68, 70, 69, 71, 72, 71, 73, 72, 73, 73],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top section: Health Score + AI Agent Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Score Card */}
        <div className="bg-dark-surface/60 backdrop-blur-lg border border-teal/10 rounded-design p-6">
          <div className="text-sm uppercase tracking-wide text-text-secondary mb-4">
            Overall Health
          </div>
          <div className="flex items-center justify-center">
            <HealthScore score={94} maxScore={100} />
          </div>
          <div className="mt-4 flex justify-center gap-4 text-xs">
            <span className="text-green">Quality ↑</span>
            <span className="text-green">Speed ↑</span>
            <span className="text-green">Escalations ↓</span>
          </div>
        </div>

        {/* AI Agent Card */}
        <AIAgentCard
          name="Rashed"
          avatarUrl="/images/rashed.jpeg"
          healthScore={94}
          learnedToday={15}
          isOnline={true}
        />
      </div>

      {/* Metrics Grid */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-4">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <MetricsCard key={metric.label} {...metric} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
