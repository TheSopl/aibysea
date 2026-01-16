'use client';

import TopBar from '@/components/layout/TopBar';
import { useState } from 'react';
import {
  Phone,
  Plus,
  TrendingUp,
  Smartphone,
  Clock,
  CheckCircle,
  Activity,
  Edit,
  Trash,
  Play,
  Pause,
  Settings as SettingsIcon,
  BarChart3,
  PhoneOff,
  Share2
} from 'lucide-react';

const voiceAgents = [
  {
    id: 1,
    name: 'Sales Voice Agent',
    model: 'Voice.ai Pro',
    status: 'active',
    specialization: 'Sales & Qualification',
    totalCalls: 2847,
    avgDuration: 3.5,
    successRate: 92,
    activeCalls: 5,
    description: 'Handles outbound sales calls and lead qualification.'
  },
  {
    id: 2,
    name: 'Support Voice Agent',
    model: 'Voice.ai Standard',
    status: 'active',
    specialization: 'Customer Support',
    totalCalls: 1956,
    avgDuration: 4.2,
    successRate: 88,
    activeCalls: 3,
    description: 'Manages inbound support calls and issue resolution.'
  },
  {
    id: 3,
    name: 'Appointment Voice Agent',
    model: 'Voice.ai Pro',
    status: 'offline',
    specialization: 'Appointment Scheduling',
    totalCalls: 1342,
    avgDuration: 2.8,
    successRate: 95,
    activeCalls: 0,
    description: 'Books appointments and manages scheduling requests.'
  },
];

export default function VoiceAgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState(voiceAgents[0]);

  const activeAgentsCount = voiceAgents.filter(a => a.status === 'active').length;
  const totalCallsHandled = voiceAgents.reduce((sum, a) => sum + a.totalCalls, 0);
  const avgCallDuration = (voiceAgents.reduce((sum, a) => sum + a.avgDuration, 0) / voiceAgents.length).toFixed(1);
  const avgSuccessRate = Math.round(voiceAgents.reduce((sum, a) => sum + a.successRate, 0) / voiceAgents.length);

  return (
    <>
      <TopBar title="Voice Agents" />

      <div className="p-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div
            className="bg-gradient-to-br from-teal-400/10 to-teal-600/10 rounded-2xl p-6 border-2 border-teal-400/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{
              animation: 'scaleIn 0.5s ease-out 0s both'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Phone size={24} className="text-white" />
              </div>
              <TrendingUp size={20} className="text-teal-500" />
            </div>
            <h3 className="text-3xl font-extrabold text-dark mb-1">{activeAgentsCount}</h3>
            <p className="text-sm text-text-secondary font-bold">Active Voice Agents</p>
          </div>

          <div
            className="bg-gradient-to-br from-teal-400/10 to-teal-600/10 rounded-2xl p-6 border-2 border-teal-400/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{
              animation: 'scaleIn 0.5s ease-out 0.1s both'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Smartphone size={24} className="text-white" />
              </div>
              <Activity size={20} className="text-teal-500" />
            </div>
            <h3 className="text-3xl font-extrabold text-dark mb-1">
              {totalCallsHandled.toLocaleString()}
            </h3>
            <p className="text-sm text-text-secondary font-bold">Total Calls Handled</p>
          </div>

          <div
            className="bg-gradient-to-br from-teal-400/10 to-teal-600/10 rounded-2xl p-6 border-2 border-teal-400/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{
              animation: 'scaleIn 0.5s ease-out 0.2s both'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Clock size={24} className="text-white" />
              </div>
              <TrendingUp size={20} className="text-teal-500" />
            </div>
            <h3 className="text-3xl font-extrabold text-dark mb-1">
              {avgCallDuration}m
            </h3>
            <p className="text-sm text-text-secondary font-bold">Avg Call Duration</p>
          </div>

          <div
            className="bg-gradient-to-br from-teal-400/10 to-teal-600/10 rounded-2xl p-6 border-2 border-teal-400/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{
              animation: 'scaleIn 0.5s ease-out 0.3s both'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle size={24} className="text-white" />
              </div>
              <BarChart3 size={20} className="text-teal-500" />
            </div>
            <h3 className="text-3xl font-extrabold text-dark mb-1">
              {avgSuccessRate}%
            </h3>
            <p className="text-sm text-text-secondary font-bold">Call Success Rate</p>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Agents List */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-extrabold text-dark">Your Voice Agents</h2>
                  <p className="text-sm text-text-secondary mt-1">Manage and monitor your voice agents</p>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-teal-400 to-teal-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5">
                  <Plus size={18} />
                  Create Voice Agent
                </button>
              </div>

              <div className="space-y-4">
                {voiceAgents.map((agent, index) => (
                  <div
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className={`p-5 rounded-xl cursor-pointer transition-all duration-500 border-2 hover:scale-[1.02] ${
                      selectedAgent.id === agent.id
                        ? 'bg-gradient-to-r from-teal-400/5 to-teal-600/5 border-teal-400/30 shadow-xl'
                        : 'bg-light-bg border-transparent hover:border-gray-200 hover:shadow-lg'
                    }`}
                    style={{
                      animation: `fadeIn 0.5s ease-out ${0.6 + index * 0.1}s both`
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg ${
                          agent.status === 'active'
                            ? 'bg-gradient-to-br from-teal-400 to-teal-600'
                            : 'bg-gray-400'
                        }`}>
                          <Phone size={28} className="text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-extrabold text-dark">{agent.name}</h3>
                            <div className={`w-3 h-3 rounded-full ${
                              agent.status === 'active' ? 'bg-green animate-pulse' : 'bg-gray-400'
                            }`}></div>
                          </div>
                          <p className="text-sm text-text-secondary">{agent.model}</p>
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
                          <Edit size={18} className="text-text-secondary group-hover:text-teal-500 group-hover:scale-110 transition-all" />
                        </button>
                        <button className="p-2 hover:bg-red/10 rounded-lg transition-colors group">
                          <Trash size={18} className="text-red group-hover:scale-110 transition-transform" />
                        </button>
                        <button className="p-2 hover:bg-blue/10 rounded-lg transition-colors group">
                          <Share2 size={18} className="text-blue group-hover:scale-110 transition-transform" />
                        </button>
                        <button className="p-2 hover:bg-purple/10 rounded-lg transition-colors group">
                          <PhoneOff size={18} className="text-purple group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-text-secondary mb-4">{agent.description}</p>

                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-1">Calls Handled</p>
                        <p className="text-lg font-extrabold text-dark">{agent.totalCalls.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-1">Avg Duration</p>
                        <p className="text-lg font-extrabold text-dark">{agent.avgDuration}m</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-1">Success Rate</p>
                        <p className="text-lg font-extrabold text-teal-500">{agent.successRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-1">Active Now</p>
                        <p className="text-lg font-extrabold text-teal-600">{agent.activeCalls}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Agent Details Panel */}
          <div className="w-96">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Phone size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-dark">{selectedAgent.name}</h3>
                  <p className="text-sm text-text-secondary">{selectedAgent.model}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Status</label>
                  <div className="mt-2">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold border-2 ${
                      selectedAgent.status === 'active'
                        ? 'bg-green/20 text-green border-green/30'
                        : 'bg-gray-200 text-gray-700 border-gray-300'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        selectedAgent.status === 'active' ? 'bg-green animate-pulse' : 'bg-gray-400'
                      }`}></div>
                      {selectedAgent.status === 'active' ? 'Active' : 'Offline'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Specialization</label>
                  <p className="text-sm text-dark mt-2 font-semibold">{selectedAgent.specialization}</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Description</label>
                  <p className="text-sm text-dark mt-2">{selectedAgent.description}</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">Performance</label>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-dark">Success Rate</span>
                        <span className="text-xs font-bold text-teal-500">{selectedAgent.successRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-gradient-to-r from-teal-400 to-teal-600 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${selectedAgent.successRate}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-light-bg rounded-lg p-3">
                        <p className="text-xs text-text-secondary font-bold mb-1">Total Calls</p>
                        <p className="text-xl font-extrabold text-dark">{selectedAgent.totalCalls}</p>
                      </div>
                      <div className="bg-light-bg rounded-lg p-3">
                        <p className="text-xs text-text-secondary font-bold mb-1">Active Now</p>
                        <p className="text-xl font-extrabold text-teal-600">{selectedAgent.activeCalls}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <button className="w-full px-4 py-3 bg-gradient-to-r from-teal-400 to-teal-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                  <SettingsIcon size={18} />
                  Configure Agent
                </button>
                <button className="w-full px-4 py-3 bg-light-bg hover:bg-gray-200 text-dark rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                  <BarChart3 size={18} />
                  View Call Logs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
