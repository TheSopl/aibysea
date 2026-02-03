'use client';

import TopBar from '@/components/layout/TopBar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Zap,
  Bot,
  Plus,
  TrendingUp,
  Clock,
  MessageSquare,
  CheckCircle,
  Activity,
  Edit,
  Trash,
  Play,
  Pause,
  Settings as SettingsIcon,
  BarChart3,
  AlertCircle
} from 'lucide-react';
import { AIAgent } from '@/types/database';
import DeleteConfirmModal from '@/features/ai-agents/components/DeleteConfirmModal';
import { usePageTitle } from '@/hooks/usePageTitle';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/animations/variants';
import FadeIn from '@/components/ui/FadeIn';

export default function AgentsPage() {
  usePageTitle('Agents');
  const t = useTranslations('Agents');
  const router = useRouter();
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deleteAgent, setDeleteAgent] = useState<AIAgent | null>(null);

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/ai-agents');
      if (!response.ok) {
        throw new Error('Failed to fetch agents');
      }
      const data = await response.json();
      setAgents(data);
      if (selectedAgent) {
        const updated = data.find((a: AIAgent) => a.id === selectedAgent.id);
        setSelectedAgent(updated || data[0] || null);
      } else if (data.length > 0) {
        setSelectedAgent(data[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleDelete = async () => {
    if (!deleteAgent) return;

    try {
      const response = await fetch(`/api/ai-agents/${deleteAgent.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete agent');
      }

      setAgents(prev => prev.filter(a => a.id !== deleteAgent.id));

      if (selectedAgent?.id === deleteAgent.id) {
        setSelectedAgent(agents.find(a => a.id !== deleteAgent.id) || null);
      }

      setDeleteAgent(null);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleStatusToggle = async (agent: AIAgent, e: React.MouseEvent) => {
    e.stopPropagation();

    const newStatus = agent.status === 'active' ? 'inactive' : 'active';

    const updatedAgent = { ...agent, status: newStatus };
    setAgents(prev => prev.map(a => a.id === agent.id ? updatedAgent : a));
    if (selectedAgent?.id === agent.id) {
      setSelectedAgent(updatedAgent);
    }

    try {
      const response = await fetch(`/api/ai-agents/${agent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const saved = await response.json();
      setAgents(prev => prev.map(a => a.id === saved.id ? saved : a));
      if (selectedAgent?.id === saved.id) {
        setSelectedAgent(saved);
      }
    } catch (err) {
      setAgents(prev => prev.map(a => a.id === agent.id ? agent : a));
      if (selectedAgent?.id === agent.id) {
        setSelectedAgent(agent);
      }
      console.error('Status toggle failed:', err);
    }
  };

  const handleEditClick = (agent: AIAgent, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/agents/${agent.id}/edit`);
  };

  const handleDeleteClick = (agent: AIAgent, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteAgent(agent);
  };

  const handleCreateClick = () => {
    router.push('/agents/new/edit');
  };

  return (
    <>
      <TopBar title={t('title')} showBackButton backHref="/dashboard" />

      <div className="p-4 tablet:p-6 bg-gray-100 dark:bg-slate-900 min-h-screen overflow-y-auto max-w-[1600px] mx-auto">
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <div className="bg-red/10 border border-red/20 rounded-xl p-3 mb-6 flex items-center gap-3">
            <AlertCircle className="text-red" size={20} />
            <div>
              <h3 className="font-bold text-red text-sm">Error loading agents</h3>
              <p className="text-xs text-red/80">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 gap-3 mb-6">
              <motion.div
                variants={staggerItem}
                className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-3 border border-white/10 shadow-sm transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                    <Bot size={20} className="text-primary dark:text-white" />
                  </div>
                  <TrendingUp size={16} className="text-primary dark:text-white" />
                </div>
                <h3 className="text-xl font-extrabold text-dark dark:text-white mb-0.5">
                  {agents.filter(a => a.status === 'active').length}
                </h3>
                <p className="text-sm text-text-secondary dark:text-slate-400 font-medium">
                  {agents.filter(a => a.status === 'active').length === 1 ? 'Active Agent' : 'Active Agents'}
                </p>
              </motion.div>

              <motion.div
                variants={staggerItem}
                className="bg-gradient-to-br from-green/10 to-emerald/10 rounded-xl p-3 border border-white/10 shadow-sm transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-green/10 dark:bg-green/20 rounded-lg flex items-center justify-center">
                    <MessageSquare size={20} className="text-green dark:text-white" />
                  </div>
                  <Activity size={16} className="text-green dark:text-white" />
                </div>
                <h3 className="text-xl font-extrabold text-dark dark:text-white mb-0.5">{agents.length}</h3>
                <p className="text-sm text-text-secondary dark:text-slate-400 font-medium">Total Agents</p>
              </motion.div>
            </motion.div>

              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 min-w-0">
                <Card variant="default" className="mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-extrabold text-dark dark:text-white">Your AI Agents</h2>
                      <p className="text-sm text-text-secondary dark:text-slate-400 mt-0.5">Manage and monitor your AI workforce</p>
                    </div>
                    <Button
                      onClick={handleCreateClick}
                      variant="primary"
                      size="md"
                      icon={<Plus size={18} />}
                    >
                      {t('createAgent')}
                    </Button>
                  </div>

                  {agents.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Bot size={40} className="text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-dark dark:text-white mb-2">No agents yet</h3>
                      <p className="text-sm text-text-secondary dark:text-slate-400 mb-6">
                        Create your first AI agent to start automating conversations
                      </p>
                      <Button
                        onClick={handleCreateClick}
                        variant="primary"
                        size="lg"
                        icon={<Plus size={18} />}
                        className="mx-auto"
                      >
                        Create Your First Agent
                      </Button>
                    </div>
                  )}

                  <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-2">
                    {agents.map((agent, index) => (
                      <motion.div
                        key={agent.id}
                        variants={staggerItem}
                        onClick={() => setSelectedAgent(agent)}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                          selectedAgent?.id === agent.id
                            ? 'bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 shadow-sm'
                            : 'bg-light-bg dark:bg-slate-700 border-white/5 hover:border-gray-200 dark:hover:border-slate-600 hover:shadow-sm'
                        }`}
                      >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 dark:from-primary/30 dark:to-accent/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Bot size={20} className="text-primary dark:text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-dark dark:text-white truncate">{agent.name}</h3>
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                              agent.status === 'active' ? 'bg-green animate-pulse' : 'bg-gray-400 dark:bg-slate-500'
                            }`}></div>
                          </div>
                          <p className="text-sm text-text-secondary dark:text-slate-300">{agent.model}</p>
                        </div>

                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        {agent.status === 'active' ? (
                          <Button
                            onClick={(e) => handleStatusToggle(agent, e)}
                            variant="ghost"
                            size="sm"
                            iconOnly
                            icon={<Pause size={16} className="text-amber" />}
                            aria-label="Pause agent"
                            title="Pause agent"
                          />
                        ) : (
                          <Button
                            onClick={(e) => handleStatusToggle(agent, e)}
                            variant="ghost"
                            size="sm"
                            iconOnly
                            icon={<Play size={16} className="text-green" />}
                            aria-label="Activate agent"
                            title="Activate agent"
                          />
                        )}
                        <Button
                          onClick={(e) => handleEditClick(agent, e)}
                          variant="ghost"
                          size="sm"
                          iconOnly
                          icon={<Edit size={16} />}
                          aria-label="Edit agent"
                          title="Edit agent"
                        />
                        <Button
                          onClick={(e) => handleDeleteClick(agent, e)}
                          variant="ghost"
                          size="sm"
                          iconOnly
                          icon={<Trash size={16} className="text-red" />}
                          aria-label="Delete agent"
                          title="Delete agent"
                        />
                      </div>
                      </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </Card>
              </div>

              <div className="w-full lg:w-72 flex-shrink-0">
                {selectedAgent ? (
                  <FadeIn delay={0.1}>
                  <Card variant="default" className="sticky top-8">
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-slate-700">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 dark:from-primary/30 dark:to-accent/30 rounded-lg flex items-center justify-center">
                        <Bot size={24} className="text-primary dark:text-white" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-dark dark:text-white">{selectedAgent.name}</h3>
                        <p className="text-xs text-text-secondary dark:text-slate-300">{selectedAgent.model}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">{t('status')}</label>
                        <div className="mt-1.5">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-sm font-medium border ${
                            selectedAgent.status === 'active'
                              ? 'bg-green/10 text-green border-green/20'
                              : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-600'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              selectedAgent.status === 'active' ? 'bg-green animate-pulse' : 'bg-gray-400 dark:bg-slate-500'
                            }`}></div>
                            {selectedAgent.status === 'active' ? 'Active' : 'Standby'}
                          </span>
                        </div>
                      </div>

                      {selectedAgent.system_prompt && (
                        <div>
                          <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">{t('systemPrompt')}</label>
                          <p className="text-sm text-dark dark:text-white mt-1.5 bg-light-bg dark:bg-slate-700 p-2 rounded-md max-h-24 overflow-y-auto">
                            {selectedAgent.system_prompt}
                          </p>
                        </div>
                      )}

                      {selectedAgent.greeting_message && (
                        <div>
                          <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">{t('greetingMessage')}</label>
                          <p className="text-sm text-dark dark:text-white mt-1.5 bg-light-bg dark:bg-slate-700 p-2 rounded-md">
                            {selectedAgent.greeting_message}
                          </p>
                        </div>
                      )}

                      <div>
                        <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Details</label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-light-bg dark:bg-slate-700 rounded-md p-2">
                            <p className="text-xs text-text-secondary dark:text-slate-400 font-medium mb-0.5">Created</p>
                            <p className="text-sm font-bold text-dark dark:text-white">
                              {new Date(selectedAgent.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="bg-light-bg dark:bg-slate-700 rounded-md p-2">
                            <p className="text-xs text-text-secondary dark:text-slate-400 font-medium mb-0.5">Updated</p>
                            <p className="text-sm font-bold text-dark dark:text-white">
                              {new Date(selectedAgent.updated_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700 space-y-2">
                      <Button
                        onClick={() => router.push(`/agents/${selectedAgent.id}/edit`)}
                        variant="primary"
                        size="md"
                        icon={<SettingsIcon size={16} />}
                        className="w-full"
                      >
                        Configure Agent
                      </Button>
                      <Button
                        variant="secondary"
                        size="md"
                        icon={<BarChart3 size={16} />}
                        className="w-full"
                      >
                        View Analytics
                      </Button>
                    </div>
                  </Card>
                  </FadeIn>
                ) : (
                  <Card variant="default" className="sticky top-8">
                    <div className="text-center py-6">
                      <Bot size={40} className="text-gray-300 dark:text-slate-600 mx-auto mb-3" />
                      <p className="text-sm text-text-secondary dark:text-slate-400">Select an agent to view details</p>
                    </div>
                  </Card>
                )}
              </div>
              </div>
          </>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={!!deleteAgent}
        onClose={() => setDeleteAgent(null)}
        onConfirm={handleDelete}
        agentName={deleteAgent?.name || ''}
      />
    </>
  );
}
