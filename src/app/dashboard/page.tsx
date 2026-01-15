import AIMetricsDashboard from '@/components/dashboard/AIMetricsDashboard';
import SmartInsights from '@/components/dashboard/SmartInsights';
import SmartActions from '@/components/dashboard/SmartActions';

export default function AIMetricsPage() {
  return (
    <div className="space-y-10 md:space-y-12">
      {/* Page Header */}
      <div className="mb-8 md:mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-dark mb-3">
          AI Metrics Dashboard
        </h1>
        <p className="text-lg text-text-secondary font-medium">
          Real-time intelligence and performance insights for your AI agent
        </p>
      </div>

      {/* Main Dashboard */}
      <AIMetricsDashboard />

      {/* Insights and Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SmartInsights />
        <SmartActions />
      </div>
    </div>
  );
}
