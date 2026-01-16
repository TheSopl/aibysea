'use client';

import TopBar from '@/components/layout/TopBar';
import { useState } from 'react';
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
  BarChart3
} from 'lucide-react';

const agents = [
  {
    id: 1,
    name: 'Rashed AI',
    model: 'GPT-4 Turbo',
    status: 'active',
    specialization: 'Customer Support & Sales',
    totalConversations: 1247,
    avgResponseTime: 2.1,
    successRate: 94,
    activeConversations: 23,
    description: 'Primary agent handling customer support and sales inquiries with high accuracy.',
  },
  {
    id: 2,
    name: 'Ahmed AI',
    model: 'GPT-4',
    status: 'standby',
    specialization: 'Technical Support',
    totalConversations: 856,
    avgResponseTime: 3.2,
    successRate: 89,
    activeConversations: 0,
    description: 'Specialized in handling technical queries and troubleshooting.',
  },
  {
    id: 3,
    name: 'Sales Pro AI',
    model: 'Claude 3.5 Sonnet',
    status: 'active',
    specialization: 'Sales & Lead Qualification',
    totalConversations: 543,
    avgResponseTime: 1.8,
    successRate: 96,
    activeConversations: 15,
    description: 'Advanced sales agent focused on lead qualification and conversion.',
  },
];

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);

  return (
    <>
      <TopBar title="AI Agents" />

      <div className="p-8 bg-light-bg dark:bg-slate-900">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div
            className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 border-2 border-primary/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{
              animation: 'scaleIn 0.5s ease-out 0s both'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                <Bot size={24} className="text-white" strokeWidth={2.5} />
              </div>
              <TrendingUp size={20} className="text-primary dark:text-primary" />
            </div>
            <h3 className="text-3xl font-extrabold text-dark dark:text-white mb-1">{agents.filter(a => a.status === 'active').length}</h3>
            <p className="text-sm text-text-secondary dark:text-slate-400 font-bold">Active Agents</p>
          </div>

          <div
            className="bg-gradient-to-br from-green/10 to-emerald/10 rounded-2xl p-6 border-2 border-green/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{
              animation: 'scaleIn 0.5s ease-out 0.1s both'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquare size={24} className="text-white" strokeWidth={2.5} />
              </div>
              <Activity size={20} className="text-green dark:text-green" />
            </div>
            <h3 className="text-3xl font-extrabold text-dark dark:text-white mb-1">
              {agents.reduce((sum, a) => sum + a.totalConversations, 0).toLocaleString()}
            </h3>
            <p className="text-sm text-text-secondary dark:text-slate-400 font-bold">Total Conversations</p>
          </div>

          <div
            className="bg-gradient-to-br from-blue/10 to-cyan/10 rounded-2xl p-6 border-2 border-blue/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{
              animation: 'scaleIn 0.5s ease-out 0.2s both'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Clock size={24} className="text-white" strokeWidth={2.5} />
              </div>
              <Zap size={20} className="text-blue dark:text-blue" />
            </div>
            <h3 className="text-3xl font-extrabold text-dark dark:text-white mb-1">
              {(agents.reduce((sum, a) => sum + a.avgResponseTime, 0) / agents.length).toFixed(1)}s
            </h3>
            <p className="text-sm text-text-secondary dark:text-slate-400 font-bold">Avg Response Time</p>
          </div>

          <div
            className="bg-gradient-to-br from-purple/10 to-pink/10 rounded-2xl p-6 border-2 border-purple/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{
              animation: 'scaleIn 0.5s ease-out 0.3s both'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle size={24} className="text-white" strokeWidth={2.5} />
              </div>
              <BarChart3 size={20} className="text-purple dark:text-purple" />
            </div>
            <h3 className="text-3xl font-extrabold text-dark dark:text-white mb-1">
              {Math.round(agents.reduce((sum, a) => sum + a.successRate, 0) / agents.length)}%
            </h3>
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
                <button className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5">
                  <Plus size={18} />
                  Create Agent
                </button>
              </div>

              <div className="space-y-4">
                {agents.map((agent, index) => (
                  <div
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className={`p-5 rounded-xl cursor-pointer transition-all duration-500 border-2 hover:scale-[1.02] ${
                      selectedAgent.id === agent.id
                        ? 'bg-gradient-to-r from-primary/5 to-accent/5 border-primary/30 shadow-xl'
                        : 'bg-light-bg dark:bg-slate-700 border-transparent hover:border-gray-200 dark:hover:border-slate-600 hover:shadow-lg'
                    }`}
                    style={{
                      animation: `fadeIn 0.5s ease-out ${0.6 + index * 0.1}s both`
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg ${
                          agent.status === 'active'
                            ? 'bg-gradient-to-br from-primary to-accent'
                            : 'bg-gray-400'
                        }`}>
                          <Zap size={28} className="text-white" />
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
                          <button className="p-2 hover:bg-amber/10 rounded-lg transition-colors group">
                            <Pause size={18} className="text-amber group-hover:scale-110 transition-transform" />
                          </button>
                        ) : (
                          <button className="p-2 hover:bg-green/10 rounded-lg transition-colors group">
                            <Play size={18} className="text-green group-hover:scale-110 transition-transform" />
                          </button>
                        )}
                        <button className="p-2 hover:bg-light-bg rounded-lg transition-colors group">
                          <Edit size={18} className="text-text-secondary group-hover:text-primary group-hover:scale-110 transition-all" />
                        </button>
                        <button className="p-2 hover:bg-red/10 rounded-lg transition-colors group">
                          <Trash size={18} className="text-red group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-text-secondary dark:text-slate-400 mb-4">{agent.description}</p>

                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-text-secondary dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Conversations</p>
                        <p className="text-lg font-extrabold text-dark dark:text-white">{agent.totalConversations.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-secondary dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Response</p>
                        <p className="text-lg font-extrabold text-dark dark:text-white">{agent.avgResponseTime}s</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-secondary dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Success</p>
                        <p className="text-lg font-extrabold text-green">{agent.successRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-secondary dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Active</p>
                        <p className="text-lg font-extrabold text-primary">{agent.activeConversations}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Agent Details Panel */}
          <div className="w-96">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sticky top-8">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-slate-700">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                  <Zap size={32} className="text-white" />
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

                <div>
                  <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">Specialization</label>
                  <p className="text-sm text-dark dark:text-white mt-2 font-semibold">{selectedAgent.specialization}</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">Description</label>
                  <p className="text-sm text-dark dark:text-white mt-2">{selectedAgent.description}</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider mb-2 block">Performance</label>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-dark dark:text-white">Success Rate</span>
                        <span className="text-xs font-bold text-green">{selectedAgent.successRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
                        <div
                          className="bg-gradient-to-r from-green to-emerald-500 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${selectedAgent.successRate}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-light-bg dark:bg-slate-700 rounded-lg p-3">
                        <p className="text-xs text-text-secondary dark:text-slate-400 font-bold mb-1">Total Chats</p>
                        <p className="text-xl font-extrabold text-dark dark:text-white">{selectedAgent.totalConversations}</p>
                      </div>
                      <div className="bg-light-bg dark:bg-slate-700 rounded-lg p-3">
                        <p className="text-xs text-text-secondary dark:text-slate-400 font-bold mb-1">Active Now</p>
                        <p className="text-xl font-extrabold text-primary">{selectedAgent.activeConversations}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700 space-y-3">
                <button className="w-full px-4 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                  <SettingsIcon size={18} />
                  Configure Agent
                </button>
                <button className="w-full px-4 py-3 bg-light-bg dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-dark dark:text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                  <BarChart3 size={18} />
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
