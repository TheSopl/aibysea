'use client';

import TopBar from '@/components/layout/TopBar';
import { useState, useEffect } from 'react';
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
import AgentFormModal from '@/components/agents/AgentFormModal';
import DeleteConfirmModal from '@/components/agents/DeleteConfirmModal';

export default function AgentsPage() {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AIAgent | null>(null);
  const [deleteAgent, setDeleteAgent] = useState<AIAgent | null>(null);

  // Fetch agents from API
  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/ai-agents');
      if (!response.ok) {
        throw new Error('Failed to fetch agents');
      }
      const data = await response.json();
      setAgents(data);
      // Update selectedAgent if it exists in the new data
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

  // Handle create/edit save
  const handleSave = (savedAgent: AIAgent) => {
    if (editingAgent) {
      // Update existing agent in list
      setAgents(prev => prev.map(a => a.id === savedAgent.id ? savedAgent : a));
      if (selectedAgent?.id === savedAgent.id) {
        setSelectedAgent(savedAgent);
      }
    } else {
      // Add new agent to list
      setAgents(prev => [savedAgent, ...prev]);
      setSelectedAgent(savedAgent);
    }
    setEditingAgent(null);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteAgent) return;

    try {
      const response = await fetch(`/api/ai-agents/${deleteAgent.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete agent');
      }

      // Remove from list
      setAgents(prev => prev.filter(a => a.id !== deleteAgent.id));

      // Clear selection if deleted agent was selected
      if (selectedAgent?.id === deleteAgent.id) {
        setSelectedAgent(agents.find(a => a.id !== deleteAgent.id) || null);
      }

      setDeleteAgent(null);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // Handle status toggle (optimistic update)
  const handleStatusToggle = async (agent: AIAgent, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click

    const newStatus = agent.status === 'active' ? 'inactive' : 'active';

    // Optimistic update
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
      // Rollback on error
      setAgents(prev => prev.map(a => a.id === agent.id ? agent : a));
      if (selectedAgent?.id === agent.id) {
        setSelectedAgent(agent);
      }
      console.error('Status toggle failed:', err);
    }
  };

  // Handle edit button click
  const handleEditClick = (agent: AIAgent, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAgent(agent);
    setIsFormOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (agent: AIAgent, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteAgent(agent);
  };

  // Handle create button click
  const handleCreateClick = () => {
    setEditingAgent(null);
    setIsFormOpen(true);
  };

  return (
    <>
      <TopBar title="AI Agents" />

      <div className="p-8 bg-light-bg dark:bg-slate-900">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red/10 border border-red/20 rounded-xl p-6 mb-8 flex items-center gap-4">
            <AlertCircle className="text-red" size={24} />
            <div>
              <h3 className="font-bold text-red">Error loading agents</h3>
              <p className="text-sm text-red/80">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div
                className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 border-2 border-primary/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
                style={{
                  animation: 'scaleIn 0.5s ease-out 0s both'
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center shadow-lg">
                    <Bot size={24} className="text-primary dark:text-white" strokeWidth={2.5} />
                  </div>
                  <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                    <TrendingUp size={20} className="text-primary dark:text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold text-dark dark:text-white mb-1">
                  {agents.filter(a => a.status === 'active').length}
                </h3>
                <p className="text-sm text-text-secondary dark:text-slate-400 font-bold">
                  {agents.filter(a => a.status === 'active').length === 1 ? 'Active Agent' : 'Active Agents'}
                </p>
              </div>

              <div
                className="bg-gradient-to-br from-green/10 to-emerald/10 rounded-2xl p-6 border-2 border-green/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
                style={{
                  animation: 'scaleIn 0.5s ease-out 0.1s both'
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-green/10 dark:bg-green/20 rounded-xl flex items-center justify-center shadow-lg">
                    <MessageSquare size={24} className="text-green dark:text-white" strokeWidth={2.5} />
                  </div>
                  <div className="p-2 bg-green/10 dark:bg-green/20 rounded-lg">
                    <Activity size={20} className="text-green dark:text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold text-dark dark:text-white mb-1">{agents.length}</h3>
                <p className="text-sm text-text-secondary dark:text-slate-400 font-bold">Total Agents</p>
              </div>

              <div
                className="bg-gradient-to-br from-blue/10 to-cyan/10 rounded-2xl p-6 border-2 border-blue/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
                style={{
                  animation: 'scaleIn 0.5s ease-out 0.2s both'
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-blue/10 dark:bg-blue/20 rounded-xl flex items-center justify-center shadow-lg">
                    <Clock size={24} className="text-blue dark:text-white" strokeWidth={2.5} />
                  </div>
                  <div className="p-2 bg-blue/10 dark:bg-blue/20 rounded-lg">
                    <Zap size={20} className="text-blue dark:text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold text-dark dark:text-white mb-1">—</h3>
                <p className="text-sm text-text-secondary dark:text-slate-400 font-bold">Avg Response Time</p>
              </div>

              <div
                className="bg-gradient-to-br from-purple/10 to-pink/10 rounded-2xl p-6 border-2 border-purple/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
                style={{
                  animation: 'scaleIn 0.5s ease-out 0.3s both'
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-purple/10 dark:bg-purple/20 rounded-xl flex items-center justify-center shadow-lg">
                    <CheckCircle size={24} className="text-purple dark:text-white" strokeWidth={2.5} />
                  </div>
                  <div className="p-2 bg-purple/10 dark:bg-purple/20 rounded-lg">
                    <BarChart3 size={20} className="text-purple dark:text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold text-dark dark:text-white mb-1">—</h3>
                <p className="text-sm text-text-secondary dark:text-slate-400 font-bold">Avg Success Rate</p>
              </div>
            </div>

            <div className="flex gap-6">
              {/* Agents List */}
              <div className="flex-1">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-extrabold text-dark dark:text-white">Your AI Agents</h2>
                      <p className="text-sm text-text-secondary dark:text-slate-400 mt-1">Manage and monitor your AI workforce</p>
                    </div>
                    <button
                      onClick={handleCreateClick}
                      className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5"
                    >
                      <Plus size={18} />
                      Create Agent
                    </button>
                  </div>

                  {/* Empty State */}
                  {agents.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Bot size={40} className="text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-dark dark:text-white mb-2">No agents yet</h3>
                      <p className="text-sm text-text-secondary dark:text-slate-400 mb-6">
                        Create your first AI agent to start automating conversations
                      </p>
                      <button
                        onClick={handleCreateClick}
                        className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto"
                      >
                        <Plus size={18} />
                        Create Your First Agent
                      </button>
                    </div>
                  )}

                  {/* Agents List */}
                  <div className="space-y-4">
                    {agents.map((agent, index) => (
                      <div
                        key={agent.id}
                        onClick={() => setSelectedAgent(agent)}
                        className={`p-5 rounded-xl cursor-pointer transition-all duration-500 border-2 hover:scale-[1.02] ${
                          selectedAgent?.id === agent.id
                            ? 'bg-gradient-to-r from-primary/5 to-accent/5 border-primary/30 shadow-xl'
                            : 'bg-light-bg dark:bg-slate-700 border-transparent hover:border-gray-200 dark:hover:border-slate-600 hover:shadow-lg'
                        }`}
                        style={{
                          animation: `fadeIn 0.5s ease-out ${0.6 + index * 0.1}s both`
                        }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-accent/20 dark:from-primary/30 dark:to-accent/30 rounded-xl flex items-center justify-center shadow-lg">
                              <Bot size={28} className="text-primary dark:text-white" />
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-lg font-extrabold text-dark dark:text-white">{agent.name}</h3>
                                <div className={`w-3 h-3 rounded-full ${
                                  agent.status === 'active' ? 'bg-green animate-pulse shadow-lg' : 'bg-gray-400 dark:bg-slate-500'
                                }`}></div>
                              </div>
                              <p className="text-sm text-text-secondary dark:text-slate-300">{agent.model}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {agent.status === 'active' ? (
                              <button
                                onClick={(e) => handleStatusToggle(agent, e)}
                                className="p-2 hover:bg-amber/10 rounded-lg transition-colors group"
                                title="Pause agent"
                              >
                                <Pause size={18} className="text-amber group-hover:scale-110 transition-transform" />
                              </button>
                            ) : (
                              <button
                                onClick={(e) => handleStatusToggle(agent, e)}
                                className="p-2 hover:bg-green/10 rounded-lg transition-colors group"
                                title="Activate agent"
                              >
                                <Play size={18} className="text-green group-hover:scale-110 transition-transform" />
                              </button>
                            )}
                            <button
                              onClick={(e) => handleEditClick(agent, e)}
                              className="p-2 hover:bg-light-bg rounded-lg transition-colors group"
                              title="Edit agent"
                            >
                              <Edit size={18} className="text-text-secondary group-hover:text-primary group-hover:scale-110 transition-all" />
                            </button>
                            <button
                              onClick={(e) => handleDeleteClick(agent, e)}
                              className="p-2 hover:bg-red/10 rounded-lg transition-colors group"
                              title="Delete agent"
                            >
                              <Trash size={18} className="text-red group-hover:scale-110 transition-transform" />
                            </button>
                          </div>
                        </div>

                        {agent.system_prompt && (
                          <p className="text-sm text-text-secondary dark:text-slate-400 mb-4 line-clamp-2">
                            {agent.system_prompt}
                          </p>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-text-secondary dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Status</p>
                            <p className={`text-lg font-extrabold ${agent.status === 'active' ? 'text-green' : 'text-gray-500'}`}>
                              {agent.status === 'active' ? 'Active' : 'Inactive'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-text-secondary dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Created</p>
                            <p className="text-lg font-extrabold text-dark dark:text-white">
                              {new Date(agent.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Agent Details Panel */}
              <div className="w-96">
                {selectedAgent ? (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sticky top-8">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-slate-700">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 dark:from-primary/30 dark:to-accent/30 rounded-xl flex items-center justify-center shadow-lg">
                        <Bot size={32} className="text-primary dark:text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-extrabold text-dark dark:text-white">{selectedAgent.name}</h3>
                        <p className="text-sm text-text-secondary dark:text-slate-300">{selectedAgent.model}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">Status</label>
                        <div className="mt-2">
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold border-2 ${
                            selectedAgent.status === 'active'
                              ? 'bg-green/20 text-green border-green/30'
                              : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 border-gray-300 dark:border-slate-600'
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${
                              selectedAgent.status === 'active' ? 'bg-green animate-pulse shadow-lg' : 'bg-gray-400 dark:bg-slate-500'
                            }`}></div>
                            {selectedAgent.status === 'active' ? 'Active & Learning' : 'Standby'}
                          </span>
                        </div>
                      </div>

                      {selectedAgent.system_prompt && (
                        <div>
                          <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">System Prompt</label>
                          <p className="text-sm text-dark dark:text-white mt-2 bg-light-bg dark:bg-slate-700 p-3 rounded-lg max-h-32 overflow-y-auto">
                            {selectedAgent.system_prompt}
                          </p>
                        </div>
                      )}

                      {selectedAgent.greeting_message && (
                        <div>
                          <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">Greeting Message</label>
                          <p className="text-sm text-dark dark:text-white mt-2 bg-light-bg dark:bg-slate-700 p-3 rounded-lg">
                            {selectedAgent.greeting_message}
                          </p>
                        </div>
                      )}

                      <div>
                        <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider mb-2 block">Details</label>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-light-bg dark:bg-slate-700 rounded-lg p-3">
                            <p className="text-xs text-text-secondary dark:text-slate-400 font-bold mb-1">Created</p>
                            <p className="text-sm font-extrabold text-dark dark:text-white">
                              {new Date(selectedAgent.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="bg-light-bg dark:bg-slate-700 rounded-lg p-3">
                            <p className="text-xs text-text-secondary dark:text-slate-400 font-bold mb-1">Updated</p>
                            <p className="text-sm font-extrabold text-dark dark:text-white">
                              {new Date(selectedAgent.updated_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700 space-y-3">
                      <button
                        onClick={() => {
                          setEditingAgent(selectedAgent);
                          setIsFormOpen(true);
                        }}
                        className="w-full px-4 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <SettingsIcon size={18} />
                        Configure Agent
                      </button>
                      <button className="w-full px-4 py-3 bg-light-bg dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-dark dark:text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                        <BarChart3 size={18} />
                        View Analytics
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sticky top-8">
                    <div className="text-center py-8">
                      <Bot size={48} className="text-gray-300 dark:text-slate-600 mx-auto mb-4" />
                      <p className="text-text-secondary dark:text-slate-400">Select an agent to view details</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <AgentFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingAgent(null);
        }}
        onSave={handleSave}
        agent={editingAgent}
      />

      <DeleteConfirmModal
        isOpen={!!deleteAgent}
        onClose={() => setDeleteAgent(null)}
        onConfirm={handleDelete}
        agentName={deleteAgent?.name || ''}
      />
    </>
  );
}
