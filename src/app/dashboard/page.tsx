import AIMetricsDashboard from '@/components/dashboard/AIMetricsDashboard';
import SmartInsights from '@/components/dashboard/SmartInsights';
import SmartActions from '@/components/dashboard/SmartActions';

export default function AIMetricsPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          AI Metrics Dashboard
        </h1>
        <p className="text-text-secondary">
          Real-time intelligence and performance insights for your AI agent
        </p>
      </div>

      {/* Main Dashboard */}
      <AIMetricsDashboard />

      {/* Insights and Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SmartInsights />
        <SmartActions />
      </div>
    </div>
  );
}
