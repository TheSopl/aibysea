'use client';

import TopBar from '@/components/layout/TopBar';
import { useState } from 'react';
import { cn } from '@/lib/utils';
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
  Share2,
  ChevronLeft
} from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useTranslations } from 'next-intl';

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

type VoiceAgent = typeof voiceAgents[0];

export default function VoiceAgentsPage() {
  const t = useTranslations('VoiceAgents');
  usePageTitle(t('title'));
  const [selectedAgent, setSelectedAgent] = useState<VoiceAgent | null>(null);

  const activeAgentsCount = voiceAgents.filter(a => a.status === 'active').length;
  const totalCallsHandled = voiceAgents.reduce((sum, a) => sum + a.totalCalls, 0);
  const avgCallDuration = (voiceAgents.reduce((sum, a) => sum + a.avgDuration, 0) / voiceAgents.length).toFixed(1);
  const avgSuccessRate = Math.round(voiceAgents.reduce((sum, a) => sum + a.successRate, 0) / voiceAgents.length);

  return (
    <>
      <TopBar title={t('title')} />

      <div className="p-4 sm:p-6 lg:p-8 bg-light-bg dark:bg-slate-900">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div
            className="bg-gradient-to-br from-teal-400/10 to-teal-600/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border-2 border-service-voice-400/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{
              animation: 'scaleIn 0.5s ease-out 0s both'
            }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-service-voice-500" />
            </div>
            <h3 className="text-xl sm:text-heading-2 lg:text-heading-1 font-extrabold text-dark dark:text-white mb-0.5 sm:mb-1">{activeAgentsCount}</h3>
            <p className="text-[10px] sm:text-xs lg:text-sm text-text-secondary font-bold">{t('activeVoiceAgents')}</p>
          </div>

          <div
            className="bg-gradient-to-br from-teal-400/10 to-teal-600/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border-2 border-service-voice-400/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{
              animation: 'scaleIn 0.5s ease-out 0.1s both'
            }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-service-voice-500" />
            </div>
            <h3 className="text-xl sm:text-heading-2 lg:text-heading-1 font-extrabold text-dark dark:text-white mb-0.5 sm:mb-1">
              {totalCallsHandled.toLocaleString()}
            </h3>
            <p className="text-[10px] sm:text-xs lg:text-sm text-text-secondary font-bold">{t('totalCalls')}</p>
          </div>

          <div
            className="bg-gradient-to-br from-teal-400/10 to-teal-600/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border-2 border-service-voice-400/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{
              animation: 'scaleIn 0.5s ease-out 0.2s both'
            }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-service-voice-500" />
            </div>
            <h3 className="text-xl sm:text-heading-2 lg:text-heading-1 font-extrabold text-dark dark:text-white mb-0.5 sm:mb-1">
              {avgCallDuration}m
            </h3>
            <p className="text-[10px] sm:text-xs lg:text-sm text-text-secondary font-bold">{t('avgDuration')}</p>
          </div>

          <div
            className="bg-gradient-to-br from-teal-400/10 to-teal-600/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border-2 border-service-voice-400/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{
              animation: 'scaleIn 0.5s ease-out 0.3s both'
            }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-service-voice-500" />
            </div>
            <h3 className="text-xl sm:text-heading-2 lg:text-heading-1 font-extrabold text-dark dark:text-white mb-0.5 sm:mb-1">
              {avgSuccessRate}%
            </h3>
            <p className="text-[10px] sm:text-xs lg:text-sm text-text-secondary font-bold">{t('successRate')}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Agents List */}
          <div className={cn("flex-1 min-w-0", selectedAgent && "hidden lg:block")}>
            <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                <div>
                  <h2 className="text-lg sm:text-heading-3 font-extrabold text-dark dark:text-white">{t('yourVoiceAgents')}</h2>
                  <p className="text-xs sm:text-sm text-text-secondary mt-1">{t('manageAndMonitor')}</p>
                </div>
                <button className="px-4 py-2.5 min-h-[44px] bg-gradient-to-r from-teal-400 to-teal-600 text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5 w-full sm:w-auto justify-center">
                  <Plus size={18} />
                  <span className="sm:hidden">{t('createAgentShort')}</span>
                  <span className="hidden sm:inline">{t('createAgent')}</span>
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {voiceAgents.map((agent, index) => (
                  <div
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className={`p-3 sm:p-4 lg:p-5 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-500 border-2 hover:scale-[1.01] sm:hover:scale-[1.02] min-h-[72px] ${
                      selectedAgent?.id === agent.id
                        ? 'bg-gradient-to-r from-teal-400/5 to-teal-600/5 border-service-voice-400/30 shadow-xl'
                        : 'bg-light-bg dark:bg-slate-700/50 border-transparent hover:border-gray-200 dark:hover:border-slate-600 hover:shadow-lg'
                    }`}
                    style={{
                      animation: `fadeIn 0.5s ease-out ${0.6 + index * 0.1}s both`
                    }}
                  >
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ${
                          agent.status === 'active'
                            ? 'bg-gradient-to-br from-teal-400 to-teal-600'
                            : 'bg-gray-400'
                        }`}>
                          <Phone className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 sm:gap-3 mb-0.5 sm:mb-1">
                            <h3 className="text-sm sm:text-base lg:text-lg font-extrabold text-dark dark:text-white truncate">{agent.name}</h3>
                            <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${
                              agent.status === 'active' ? 'bg-green animate-pulse' : 'bg-gray-400'
                            }`}></div>
                          </div>
                          <p className="text-xs sm:text-sm text-text-secondary dark:text-slate-300">{agent.model}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-end">
                        {agent.status === 'active' ? (
                          <button className="p-2.5 min-h-[44px] min-w-[44px] hover:bg-amber/10 rounded-lg transition-colors group flex items-center justify-center">
                            <Pause size={18} className="text-amber group-hover:scale-110 transition-transform" />
                          </button>
                        ) : (
                          <button className="p-2.5 min-h-[44px] min-w-[44px] hover:bg-green/10 rounded-lg transition-colors group flex items-center justify-center">
                            <Play size={18} className="text-green group-hover:scale-110 transition-transform" />
                          </button>
                        )}
                        <button className="p-2.5 min-h-[44px] min-w-[44px] hover:bg-light-bg rounded-lg transition-colors group flex items-center justify-center">
                          <Edit size={18} className="text-text-secondary group-hover:text-service-voice-500 group-hover:scale-110 transition-all" />
                        </button>
                        <button className="p-2.5 min-h-[44px] min-w-[44px] hover:bg-red/10 rounded-lg transition-colors group flex items-center justify-center">
                          <Trash size={18} className="text-red group-hover:scale-110 transition-transform" />
                        </button>
                        <button className="hidden sm:flex p-2.5 min-h-[44px] min-w-[44px] hover:bg-blue/10 rounded-lg transition-colors group items-center justify-center">
                          <Share2 size={18} className="text-blue group-hover:scale-110 transition-transform" />
                        </button>
                        <button className="hidden sm:flex p-2.5 min-h-[44px] min-w-[44px] hover:bg-purple/10 rounded-lg transition-colors group items-center justify-center">
                          <PhoneOff size={18} className="text-purple group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-text-secondary dark:text-slate-400 mb-3 sm:mb-4 line-clamp-2">{agent.description}</p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                      <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-2 sm:p-0 sm:bg-transparent">
                        <p className="text-[10px] sm:text-xs text-text-secondary font-bold uppercase tracking-wider mb-0.5 sm:mb-1">{t('calls')}</p>
                        <p className="text-sm sm:text-base lg:text-lg font-extrabold text-dark dark:text-white">{agent.totalCalls.toLocaleString()}</p>
                      </div>
                      <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-2 sm:p-0 sm:bg-transparent">
                        <p className="text-[10px] sm:text-xs text-text-secondary font-bold uppercase tracking-wider mb-0.5 sm:mb-1">{t('duration')}</p>
                        <p className="text-sm sm:text-base lg:text-lg font-extrabold text-dark dark:text-white">{agent.avgDuration}m</p>
                      </div>
                      <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-2 sm:p-0 sm:bg-transparent">
                        <p className="text-[10px] sm:text-xs text-text-secondary font-bold uppercase tracking-wider mb-0.5 sm:mb-1">{t('success')}</p>
                        <p className="text-sm sm:text-base lg:text-lg font-extrabold text-service-voice-500">{agent.successRate}%</p>
                      </div>
                      <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-2 sm:p-0 sm:bg-transparent">
                        <p className="text-[10px] sm:text-xs text-text-secondary font-bold uppercase tracking-wider mb-0.5 sm:mb-1">{t('active')}</p>
                        <p className="text-sm sm:text-base lg:text-lg font-extrabold text-service-voice-600">{agent.activeCalls}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Agent Details Panel */}
          {selectedAgent && (
            <div className="fixed inset-0 z-40 bg-white dark:bg-slate-800 lg:relative lg:w-96 lg:z-auto lg:bg-transparent dark:lg:bg-transparent overflow-y-auto">
              <div className="bg-white dark:bg-slate-800 lg:rounded-2xl lg:shadow-lg p-4 sm:p-6 lg:sticky lg:top-8 min-h-full lg:min-h-0">
                {/* Mobile Back Button */}
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="lg:hidden flex items-center gap-2 text-text-secondary hover:text-dark dark:hover:text-white mb-4 min-h-[44px] -ms-1"
                >
                  <ChevronLeft size={24} />
                  <span className="font-semibold">{t('backToAgents')}</span>
                </button>

                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-slate-700">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <Phone size={28} className="sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-heading-3 font-extrabold text-dark dark:text-white truncate">{selectedAgent.name}</h3>
                    <p className="text-sm text-text-secondary dark:text-slate-300">{selectedAgent.model}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('active')}</label>
                    <div className="mt-2">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold border-2 ${
                        selectedAgent.status === 'active'
                          ? 'bg-green/20 text-green border-green/30'
                          : 'bg-gray-200 text-gray-700 border-gray-300'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          selectedAgent.status === 'active' ? 'bg-green animate-pulse' : 'bg-gray-400'
                        }`}></div>
                        {selectedAgent.status === 'active' ? t('active') : t('offline')}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('specialization')}</label>
                    <p className="text-sm text-dark dark:text-white mt-2 font-semibold">{selectedAgent.specialization}</p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('description')}</label>
                    <p className="text-sm text-dark dark:text-slate-300 mt-2">{selectedAgent.description}</p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">{t('performance')}</label>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-dark dark:text-white">{t('successRate')}</span>
                          <span className="text-xs font-bold text-service-voice-500">{selectedAgent.successRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
                          <div
                            className="bg-gradient-to-r from-teal-400 to-teal-600 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${selectedAgent.successRate}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-light-bg dark:bg-slate-700/50 rounded-lg p-3">
                          <p className="text-xs text-text-secondary font-bold mb-1">{t('totalCallsLabel')}</p>
                          <p className="text-heading-3 font-extrabold text-dark dark:text-white">{selectedAgent.totalCalls}</p>
                        </div>
                        <div className="bg-light-bg dark:bg-slate-700/50 rounded-lg p-3">
                          <p className="text-xs text-text-secondary font-bold mb-1">{t('activeNow')}</p>
                          <p className="text-heading-3 font-extrabold text-service-voice-600">{selectedAgent.activeCalls}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700 space-y-3">
                  <button className="w-full px-4 py-3 min-h-[44px] bg-gradient-to-r from-teal-400 to-teal-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                    <SettingsIcon size={18} />
                    {t('configureAgent')}
                  </button>
                  <button className="w-full px-4 py-3 min-h-[44px] bg-light-bg dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-dark dark:text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                    <BarChart3 size={18} />
                    {t('viewCallLogs')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
