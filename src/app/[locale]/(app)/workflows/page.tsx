'use client';

import TopBar from '@/components/layout/TopBar';
import { useState } from 'react';
import {
  Workflow,
  Plus,
  Play,
  Pause,
  Edit,
  Trash,
  CheckCircle,
  Clock,
  Zap,
  GitBranch,
  MoreVertical
} from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const workflows = [
  {
    id: 1,
    name: 'Welcome New Customers',
    description: 'Automated onboarding sequence for new customers',
    status: 'active',
    trigger: 'New contact created',
    actions: 5,
    totalRuns: 342,
    lastRun: '5 minutes ago',
    successRate: 98,
  },
  {
    id: 2,
    name: 'Lead Qualification',
    description: 'Automatically qualify and score incoming leads',
    status: 'active',
    trigger: 'Message received',
    actions: 8,
    totalRuns: 1247,
    lastRun: '2 minutes ago',
    successRate: 94,
  },
  {
    id: 3,
    name: 'Follow-up Reminder',
    description: 'Send follow-up messages to inactive conversations',
    status: 'paused',
    trigger: 'No response for 24h',
    actions: 3,
    totalRuns: 856,
    lastRun: '3 hours ago',
    successRate: 87,
  },
  {
    id: 4,
    name: 'Escalation to Human',
    description: 'Escalate complex queries to human agents',
    status: 'active',
    trigger: 'AI confidence low',
    actions: 4,
    totalRuns: 234,
    lastRun: '15 minutes ago',
    successRate: 100,
  },
];

export default function WorkflowsPage() {
  usePageTitle('Workflows');
  const [selectedWorkflow, setSelectedWorkflow] = useState(workflows[0]);

  return (
    <>
      <TopBar title="Workflows" />

      <div className="p-8 bg-light-bg dark:bg-slate-900">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div
            className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-card-md border-2 border-primary/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{
              animation: 'scaleIn 0.5s ease-out 0s both'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                <Workflow size={24} className="text-white" />
              </div>
            </div>
            <h3 className="text-heading-1 font-extrabold text-dark dark:text-white mb-1">{workflows.filter(w => w.status === 'active').length}</h3>
            <p className="text-sm text-text-secondary font-bold">Active Workflows</p>
          </div>

          <div
            className="bg-gradient-to-br from-green/10 to-emerald/10 rounded-2xl p-card-md border-2 border-green/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{
              animation: 'scaleIn 0.5s ease-out 0.1s both'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle size={24} className="text-white" />
              </div>
            </div>
            <h3 className="text-heading-1 font-extrabold text-dark dark:text-white mb-1">
              {workflows.reduce((sum, w) => sum + w.totalRuns, 0).toLocaleString()}
            </h3>
            <p className="text-sm text-text-secondary font-bold">Total Executions</p>
          </div>

          <div
            className="bg-gradient-to-br from-blue/10 to-cyan/10 rounded-2xl p-card-md border-2 border-blue/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{
              animation: 'scaleIn 0.5s ease-out 0.2s both'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Zap size={24} className="text-white" />
              </div>
            </div>
            <h3 className="text-heading-1 font-extrabold text-dark dark:text-white mb-1">
              {Math.round(workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length)}%
            </h3>
            <p className="text-sm text-text-secondary font-bold">Avg Success Rate</p>
          </div>

          <div
            className="bg-gradient-to-br from-purple/10 to-pink/10 rounded-2xl p-card-md border-2 border-purple/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{
              animation: 'scaleIn 0.5s ease-out 0.3s both'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <GitBranch size={24} className="text-white" />
              </div>
            </div>
            <h3 className="text-heading-1 font-extrabold text-dark dark:text-white mb-1">
              {workflows.reduce((sum, w) => sum + w.actions, 0)}
            </h3>
            <p className="text-sm text-text-secondary font-bold">Total Actions</p>
          </div>
        </div>

        <Card variant="default" className="rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-heading-3 font-extrabold text-dark">Your Workflows</h2>
              <p className="text-sm text-text-secondary mt-1">Automate your messaging workflows</p>
            </div>
            <Button variant="primary" icon={<Plus size={18} />} className="rounded-xl">
              Create Workflow
            </Button>
          </div>

          <div className="space-y-4">
            {workflows.map((workflow, index) => (
              <div
                key={workflow.id}
                className="p-5 rounded-xl bg-light-bg hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 transition-all duration-500 border-2 border-transparent hover:border-primary/20 hover:shadow-xl hover:scale-[1.01] cursor-pointer"
                style={{
                  animation: `fadeIn 0.5s ease-out ${0.6 + index * 0.1}s both`
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                      workflow.status === 'active'
                        ? 'bg-gradient-to-br from-primary to-accent'
                        : 'bg-gray-400'
                    }`}>
                      <Workflow size={24} className="text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-extrabold text-dark">{workflow.name}</h3>
                        <div className={`w-3 h-3 rounded-full ${
                          workflow.status === 'active' ? 'bg-green animate-pulse' : 'bg-amber'
                        }`}></div>
                      </div>
                      <p className="text-sm text-text-secondary mb-3">{workflow.description}</p>

                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-xs px-3 py-1.5 bg-accent/20 text-accent rounded-lg font-bold border border-accent/30">
                          📡 {workflow.trigger}
                        </span>
                        <span className="text-xs px-3 py-1.5 bg-blue/20 text-blue rounded-lg font-bold border border-blue/30">
                          ⚡ {workflow.actions} actions
                        </span>
                        <span className="text-xs px-3 py-1.5 bg-purple/20 text-purple rounded-lg font-bold border border-purple/30">
                          📊 {workflow.totalRuns} runs
                        </span>
                        <span className="text-xs px-3 py-1.5 bg-green/20 text-green rounded-lg font-bold border border-green/30">
                          ✓ {workflow.successRate}% success
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {workflow.status === 'active' ? (
                      <Button variant="ghost" size="sm" iconOnly icon={<Pause size={18} className="text-amber" />} />
                    ) : (
                      <Button variant="ghost" size="sm" iconOnly icon={<Play size={18} className="text-green" />} />
                    )}
                    <Button variant="ghost" size="sm" iconOnly icon={<Edit size={18} className="text-text-secondary" />} />
                    <Button variant="ghost" size="sm" iconOnly icon={<Trash size={18} className="text-red" />} className="hover:bg-red/10" />
                    <Button variant="ghost" size="sm" iconOnly icon={<MoreVertical size={18} className="text-text-secondary dark:text-slate-300" />} />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-xs text-text-secondary dark:text-slate-300">
                    <Clock size={14} />
                    <span>Last run: {workflow.lastRun}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs font-bold text-primary hover:text-accent">
                    View Details →
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* N8N Integration Notice */}
        <div className="mt-8 bg-gradient-to-r from-primary/10 via-accent/10 to-purple/10 rounded-2xl p-card-md border-2 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Zap size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-extrabold text-dark dark:text-white mb-2">Powered by n8n Integration</h3>
              <p className="text-sm text-text-secondary mb-4">
                All workflows are synchronized with n8n. Changes made here will automatically update your n8n instance,
                and vice versa. Enjoy seamless automation across platforms.
              </p>
              <Button variant="secondary" size="sm" className="bg-dark text-white hover:bg-dark/90">
                Open n8n Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
