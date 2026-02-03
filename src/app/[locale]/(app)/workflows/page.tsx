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

      <div className="p-4 bg-light-bg dark:bg-slate-900">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-3 border border-primary/20 transition-all duration-500">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <Workflow size={18} className="text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-dark dark:text-white mb-1">{workflows.filter(w => w.status === 'active').length}</h3>
            <p className="text-sm text-text-secondary font-bold">Active Workflows</p>
          </div>

          <div className="bg-gradient-to-br from-green/10 to-emerald/10 rounded-lg p-3 border border-green/20 transition-all duration-500">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green to-emerald-500 rounded-xl flex items-center justify-center">
                <CheckCircle size={18} className="text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-dark dark:text-white mb-1">
              {workflows.reduce((sum, w) => sum + w.totalRuns, 0).toLocaleString()}
            </h3>
            <p className="text-sm text-text-secondary font-bold">Total Executions</p>
          </div>

          <div className="bg-gradient-to-br from-blue/10 to-cyan/10 rounded-lg p-3 border border-blue/20 transition-all duration-500">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue to-cyan-500 rounded-xl flex items-center justify-center">
                <Zap size={18} className="text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-dark dark:text-white mb-1">
              {Math.round(workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length)}%
            </h3>
            <p className="text-sm text-text-secondary font-bold">Avg Success Rate</p>
          </div>

          <div className="bg-gradient-to-br from-purple/10 to-pink/10 rounded-lg p-3 border border-purple/20 transition-all duration-500">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple to-pink-500 rounded-xl flex items-center justify-center">
                <GitBranch size={18} className="text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-dark dark:text-white mb-1">
              {workflows.reduce((sum, w) => sum + w.actions, 0)}
            </h3>
            <p className="text-sm text-text-secondary font-bold">Total Actions</p>
          </div>
        </div>

        <Card variant="default">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-heading-3 font-extrabold text-dark">Your Workflows</h2>
              <p className="text-sm text-text-secondary mt-1">Automate your messaging workflows</p>
            </div>
            <Button variant="primary" icon={<Plus size={18} />} className="rounded-xl">
              Create Workflow
            </Button>
          </div>

          <div className="space-y-2">
            {workflows.map((workflow, index) => (
              <div
                key={workflow.id}
                className="p-3 rounded-lg bg-light-bg hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 transition-all duration-500 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      workflow.status === 'active'
                        ? 'bg-gradient-to-br from-primary to-accent'
                        : 'bg-gray-400'
                    }`}>
                      <Workflow size={18} className="text-white" />
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
                        <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent rounded-lg font-bold">
                          📡 {workflow.trigger}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-blue/20 text-blue rounded-lg font-bold">
                          ⚡ {workflow.actions} actions
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-purple/20 text-purple rounded-lg font-bold">
                          📊 {workflow.totalRuns} runs
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-green/20 text-green rounded-lg font-bold">
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
        <div className="mt-4 bg-gradient-to-r from-primary/10 via-accent/10 to-purple/10 rounded-lg p-4 border border-primary/20">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap size={16} className="text-white" />
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
