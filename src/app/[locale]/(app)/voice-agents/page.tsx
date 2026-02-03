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
import Button from '@/components/ui/Button';

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

      <div className="p-4 sm:p-6 bg-gray-100 dark:bg-slate-900 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div
            className="bg-gradient-to-br from-teal-400/10 to-teal-600/10 rounded-xl p-4 border border-white/10 shadow-sm hover:shadow-md transition-all duration-300"
            style={{
              animation: 'scaleIn 0.5s ease-out 0s both'
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-service-voice-500" />
            </div>
            <h3 className="text-3xl font-extrabold text-dark dark:text-white mb-0.5">{activeAgentsCount}</h3>
            <p className="text-sm text-text-secondary font-medium">{t('activeVoiceAgents')}</p>
          </div>

          <div
            className="bg-gradient-to-br from-teal-400/10 to-teal-600/10 rounded-xl p-4 border border-white/10 shadow-sm hover:shadow-md transition-all duration-300"
            style={{
              animation: 'scaleIn 0.5s ease-out 0.1s both'
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <Activity className="w-4 h-4 text-service-voice-500" />
            </div>
            <h3 className="text-3xl font-extrabold text-dark dark:text-white mb-0.5">
              {totalCallsHandled.toLocaleString()}
            </h3>
            <p className="text-sm text-text-secondary font-medium">{t('totalCalls')}</p>
          </div>

          <div
            className="bg-gradient-to-br from-teal-400/10 to-teal-600/10 rounded-xl p-4 border border-white/10 shadow-sm hover:shadow-md transition-all duration-300"
            style={{
              animation: 'scaleIn 0.5s ease-out 0.2s both'
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-service-voice-500" />
            </div>
            <h3 className="text-3xl font-extrabold text-dark dark:text-white mb-0.5">
              {avgCallDuration}m
            </h3>
            <p className="text-sm text-text-secondary font-medium">{t('avgDuration')}</p>
          </div>

          <div
            className="bg-gradient-to-br from-teal-400/10 to-teal-600/10 rounded-xl p-4 border border-white/10 shadow-sm hover:shadow-md transition-all duration-300"
            style={{
              animation: 'scaleIn 0.5s ease-out 0.3s both'
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <BarChart3 className="w-4 h-4 text-service-voice-500" />
            </div>
            <h3 className="text-3xl font-extrabold text-dark dark:text-white mb-0.5">
              {avgSuccessRate}%
            </h3>
            <p className="text-sm text-text-secondary font-medium">{t('successRate')}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className={cn("flex-1 min-w-0", selectedAgent && "hidden lg:block")}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-white/10 p-4 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-dark dark:text-white">{t('yourVoiceAgents')}</h2>
                  <p className="text-sm text-text-secondary mt-0.5">{t('manageAndMonitor')}</p>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  icon={<Plus size={18} />}
                  className="w-full sm:w-auto justify-center"
                >
                  <span className="sm:hidden">{t('createAgentShort')}</span>
                  <span className="hidden sm:inline">{t('createAgent')}</span>
                </Button>
              </div>

              <div className="space-y-2">
                {voiceAgents.map((agent, index) => (
                  <div
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border hover:scale-[1.01] ${
                      selectedAgent?.id === agent.id
                        ? 'bg-gradient-to-r from-teal-400/5 to-teal-600/5 border-service-voice-400/20 shadow-sm'
                        : 'bg-light-bg dark:bg-slate-700/50 border-white/5 hover:border-gray-200 dark:hover:border-slate-600 hover:shadow-sm'
                    }`}
                    style={{
                      animation: `fadeIn 0.5s ease-out ${0.6 + index * 0.1}s both`
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          agent.status === 'active'
                            ? 'bg-gradient-to-br from-teal-400 to-teal-600'
                            : 'bg-gray-400'
                        }`}>
                          <Phone className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-lg font-bold text-dark dark:text-white truncate">{agent.name}</h3>
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                              agent.status === 'active' ? 'bg-green animate-pulse' : 'bg-gray-400'
                            }`}></div>
                          </div>
                          <p className="text-sm text-text-secondary dark:text-slate-300">{agent.model}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        {agent.status === 'active' ? (
                          <Button variant="ghost" size="sm" iconOnly icon={<Pause size={16} className="text-amber" />} className="hover:bg-amber/10" />
                        ) : (
                          <Button variant="ghost" size="sm" iconOnly icon={<Play size={16} className="text-green" />} className="hover:bg-green/10" />
                        )}
                        <Button variant="ghost" size="sm" iconOnly icon={<Edit size={16} className="text-text-secondary hover:text-service-voice-500" />} />
                        <Button variant="ghost" size="sm" iconOnly icon={<Trash size={16} className="text-red" />} className="hover:bg-red/10" />
                      </div>
                    </div>

                    <p className="text-sm text-text-secondary dark:text-slate-400 mb-2 line-clamp-1">{agent.description}</p>

                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <p className="text-xs text-text-secondary font-medium uppercase mb-0.5">{t('calls')}</p>
                        <p className="text-base font-bold text-dark dark:text-white">{agent.totalCalls.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-secondary font-medium uppercase mb-0.5">{t('duration')}</p>
                        <p className="text-base font-bold text-dark dark:text-white">{agent.avgDuration}m</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-secondary font-medium uppercase mb-0.5">{t('success')}</p>
                        <p className="text-base font-bold text-service-voice-500">{agent.successRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-secondary font-medium uppercase mb-0.5">{t('active')}</p>
                        <p className="text-base font-bold text-service-voice-600">{agent.activeCalls}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {selectedAgent && (
            <div className="fixed inset-0 z-40 bg-white dark:bg-slate-800 lg:relative lg:w-80 lg:z-auto lg:bg-transparent dark:lg:bg-transparent overflow-y-auto">
              <div className="bg-white dark:bg-slate-800 lg:rounded-xl lg:shadow-sm lg:border lg:border-white/10 p-4 lg:sticky lg:top-8 min-h-full lg:min-h-0">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<ChevronLeft size={20} />}
                  onClick={() => setSelectedAgent(null)}
                  className="lg:hidden mb-4 -ms-1 text-text-secondary hover:text-dark dark:hover:text-white"
                >
                  <span className="text-sm font-medium">{t('backToAgents')}</span>
                </Button>

                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-slate-700">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone size={24} className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-dark dark:text-white truncate">{selectedAgent.name}</h3>
                    <p className="text-xs text-text-secondary dark:text-slate-300">{selectedAgent.model}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('status')}</label>
                    <div className="mt-1.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
                        selectedAgent.status === 'active'
                          ? 'bg-green/10 text-green border-green/20'
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          selectedAgent.status === 'active' ? 'bg-green animate-pulse' : 'bg-gray-400'
                        }`}></div>
                        {selectedAgent.status === 'active' ? t('active') : t('offline')}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('specialization')}</label>
                    <p className="text-xs text-dark dark:text-white mt-1.5 font-medium">{selectedAgent.specialization}</p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('description')}</label>
                    <p className="text-xs text-dark dark:text-slate-300 mt-1.5">{selectedAgent.description}</p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5 block">{t('performance')}</label>
                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-dark dark:text-white">{t('successRate')}</span>
                          <span className="text-xs font-bold text-service-voice-500">{selectedAgent.successRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-teal-400 to-teal-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${selectedAgent.successRate}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-light-bg dark:bg-slate-700/50 rounded-md p-2">
                          <p className="text-xs text-text-secondary font-medium mb-0.5">{t('totalCallsLabel')}</p>
                          <p className="text-base font-bold text-dark dark:text-white">{selectedAgent.totalCalls}</p>
                        </div>
                        <div className="bg-light-bg dark:bg-slate-700/50 rounded-md p-2">
                          <p className="text-xs text-text-secondary font-medium mb-0.5">{t('activeNow')}</p>
                          <p className="text-base font-bold text-service-voice-600">{selectedAgent.activeCalls}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700 space-y-2">
                  <Button
                    variant="primary"
                    icon={<SettingsIcon size={16} />}
                    className="w-full justify-center"
                  >
                    {t('configureAgent')}
                  </Button>
                  <Button
                    variant="secondary"
                    icon={<BarChart3 size={16} />}
                    className="w-full justify-center"
                  >
                    {t('viewCallLogs')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
