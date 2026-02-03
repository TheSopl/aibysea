'use client';

import TopBar from '@/components/layout/TopBar';
import React, { useState } from 'react';
import { Phone, PhoneOff, Clock, User, Calendar, MoreVertical, Download, MessageSquare, Play, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';

const callLogs = [
  {
    id: 1,
    callerId: '+1-555-0123',
    callerName: 'John Smith',
    agent: 'Sales Voice Agent',
    duration: 4.2,
    status: 'completed' as const,
    direction: 'inbound' as const,
    time: '2026-01-16 14:30',
    sentiment: 'positive' as const,
    transcription: [
      { speaker: 'Agent', text: 'Thank you for calling AI BY SEA. How can I help you today?' },
      { speaker: 'Caller', text: 'Hi, I\'m interested in learning more about your voice agent capabilities.' },
      { speaker: 'Agent', text: 'Excellent question! Our voice agents can handle customer service, sales inquiries, and support tickets with natural language processing.' },
      { speaker: 'Caller', text: 'That sounds perfect for our needs. What\'s the pricing model?' },
      { speaker: 'Agent', text: 'We offer flexible pricing based on call volume and features. Let me send you a quote.' },
      { speaker: 'Caller', text: 'Great, thanks for your help!' },
      { speaker: 'Agent', text: 'You\'re welcome! I\'ve sent the information to your email.' },
    ],
    events: [
      { time: '14:30:00', action: 'Call received' },
      { time: '14:30:02', action: 'Connected to agent' },
      { time: '14:34:15', action: 'Call ended' }
    ]
  },
  {
    id: 2,
    callerId: '+1-555-0124',
    callerName: 'Emma Wilson',
    agent: 'Support Voice Agent',
    duration: 2.8,
    status: 'completed' as const,
    direction: 'inbound' as const,
    time: '2026-01-16 14:15',
    sentiment: 'neutral' as const,
    transcription: [
      { speaker: 'Agent', text: 'Hello, you\'ve reached support. What\'s the issue?' },
      { speaker: 'Caller', text: 'I\'m having trouble accessing my account.' },
      { speaker: 'Agent', text: 'I can help with that. Let me verify your information.' },
      { speaker: 'Caller', text: 'Sure, my email is emma@example.com.' },
      { speaker: 'Agent', text: 'Got it. Let me check the system.' },
      { speaker: 'Caller', text: 'Okay, thank you.' },
      { speaker: 'Agent', text: 'Your account is now accessible. Is there anything else?' },
      { speaker: 'Caller', text: 'No, that\'s all. Thanks!' },
    ],
    events: [
      { time: '14:15:00', action: 'Call received' },
      { time: '14:15:02', action: 'Connected to agent' },
      { time: '14:17:45', action: 'Call ended' }
    ]
  },
  {
    id: 3,
    callerId: '+1-555-0125',
    callerName: 'Michael Johnson',
    agent: 'Sales Voice Agent',
    duration: 0.5,
    status: 'missed' as const,
    direction: 'inbound' as const,
    time: '2026-01-16 14:00',
    sentiment: 'neutral' as const,
    transcription: [
      { speaker: 'Agent', text: 'Call was not answered.' }
    ],
    events: [
      { time: '14:00:00', action: 'Call received' },
      { time: '14:00:30', action: 'Call unanswered' }
    ]
  },
  {
    id: 4,
    callerId: '+1-555-0126',
    callerName: 'Sarah Davis',
    agent: 'Support Voice Agent',
    duration: 5.1,
    status: 'transferred' as const,
    direction: 'inbound' as const,
    time: '2026-01-16 13:45',
    sentiment: 'positive' as const,
    transcription: [
      { speaker: 'Agent', text: 'Hello, how can we assist you?' },
      { speaker: 'Caller', text: 'I need to speak to someone about enterprise solutions.' },
      { speaker: 'Agent', text: 'I\'ll transfer you to our enterprise team.' },
      { speaker: 'Caller', text: 'Thank you!' },
      { speaker: 'Agent', text: 'Hold please while I connect you.' },
    ],
    events: [
      { time: '13:45:00', action: 'Call received' },
      { time: '13:45:02', action: 'Connected to agent' },
      { time: '13:49:55', action: 'Transferred to enterprise team' },
      { time: '13:50:05', action: 'Call ended' }
    ]
  },
  {
    id: 5,
    callerId: '+1-555-0127',
    callerName: 'Robert Brown',
    agent: 'Sales Voice Agent',
    duration: 3.5,
    status: 'completed' as const,
    direction: 'outbound' as const,
    time: '2026-01-16 13:30',
    sentiment: 'positive' as const,
    transcription: [
      { speaker: 'Agent', text: 'Hi Robert, this is the sales team from AI BY SEA.' },
      { speaker: 'Caller', text: 'Oh hi, what\'s this about?' },
      { speaker: 'Agent', text: 'We noticed you viewed our voice agents demo. Do you have a few minutes to discuss how we could help?' },
      { speaker: 'Caller', text: 'Sure, I\'m interested.' },
      { speaker: 'Agent', text: 'Great! Let me share some options that would fit your use case.' },
    ],
    events: [
      { time: '13:30:00', action: 'Call initiated' },
      { time: '13:30:05', action: 'Connected to customer' },
      { time: '13:33:30', action: 'Call ended' }
    ]
  },
  {
    id: 6,
    callerId: '+1-555-0128',
    callerName: 'Lisa Anderson',
    agent: 'Support Voice Agent',
    duration: 1.2,
    status: 'abandoned' as const,
    direction: 'inbound' as const,
    time: '2026-01-16 13:15',
    sentiment: 'neutral' as const,
    transcription: [
      { speaker: 'Agent', text: 'Thank you for calling. How can we help?' },
      { speaker: 'Caller', text: 'I\'ll call back later.' }
    ],
    events: [
      { time: '13:15:00', action: 'Call received' },
      { time: '13:15:02', action: 'Connected to agent' },
      { time: '13:16:12', action: 'Call abandoned' }
    ]
  },
  {
    id: 7,
    callerId: '+1-555-0129',
    callerName: 'David Miller',
    agent: 'Sales Voice Agent',
    duration: 6.3,
    status: 'completed' as const,
    direction: 'inbound' as const,
    time: '2026-01-16 12:45',
    sentiment: 'positive' as const,
    transcription: [
      { speaker: 'Agent', text: 'Hello and welcome! Thanks for calling.' },
      { speaker: 'Caller', text: 'Hi, I\'d like to know about your enterprise package.' },
      { speaker: 'Agent', text: 'Perfect! Our enterprise package includes unlimited calls, priority support, and custom integrations.' },
      { speaker: 'Caller', text: 'That sounds good. What about SLA guarantees?' },
      { speaker: 'Agent', text: 'We offer 99.9% uptime SLA with dedicated support team.' },
      { speaker: 'Caller', text: 'Excellent. How do we get started?' },
      { speaker: 'Agent', text: 'I\'ll schedule a call with our enterprise team. Check your email soon!' },
    ],
    events: [
      { time: '12:45:00', action: 'Call received' },
      { time: '12:45:02', action: 'Connected to agent' },
      { time: '12:51:20', action: 'Call ended' }
    ]
  },
  {
    id: 8,
    callerId: '+1-555-0130',
    callerName: 'Jennifer Martinez',
    agent: 'Support Voice Agent',
    duration: 3.9,
    status: 'completed' as const,
    direction: 'inbound' as const,
    time: '2026-01-16 12:20',
    sentiment: 'positive' as const,
    transcription: [
      { speaker: 'Agent', text: 'Welcome to support. How can I help you?' },
      { speaker: 'Caller', text: 'I need help setting up the API integration.' },
      { speaker: 'Agent', text: 'I can guide you through that. Let\'s start with authentication.' },
      { speaker: 'Caller', text: 'Okay, I\'m ready.' },
      { speaker: 'Agent', text: 'First, generate your API key from the dashboard settings.' },
      { speaker: 'Caller', text: 'Got it! Now what?' },
      { speaker: 'Agent', text: 'Use that key in your request headers. I\'ll send you documentation.' },
    ],
    events: [
      { time: '12:20:00', action: 'Call received' },
      { time: '12:20:02', action: 'Connected to agent' },
      { time: '12:23:50', action: 'Call ended' }
    ]
  },
];

const agents = ['All Agents', 'Sales Voice Agent', 'Support Voice Agent'];

export default function CallLogsPage() {
  const t = useTranslations('CallLogs');
  usePageTitle(t('title'));

  const statuses = [t('all'), t('completed'), t('missed'), t('transferred'), t('abandoned')];
  const directions = [t('all'), t('inbound'), t('outbound')];
  const [selectedCall, setSelectedCall] = useState<typeof callLogs[0] | null>(callLogs[0]);
  const [agentFilter, setAgentFilter] = useState('All Agents');
  const [statusFilter, setStatusFilter] = useState('All');
  const [directionFilter, setDirectionFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredCalls = callLogs.filter(call => {
    const agentMatch = agentFilter === 'All Agents' || call.agent === agentFilter;
    const statusMatch = statusFilter === 'All' || call.status === statusFilter.toLowerCase();
    const directionMatch = directionFilter === 'All' || call.direction === directionFilter.toLowerCase();
    return agentMatch && statusMatch && directionMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'missed':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'transferred':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'abandoned':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-700';
      case 'negative':
        return 'bg-red-100 text-red-700';
      case 'neutral':
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getKeywords = (call: typeof callLogs[0]) => {
    const words = call.transcription
      .flatMap(t => t.text.toLowerCase().split(/\s+/))
      .filter(w => w.length > 4 && !['thank', 'hello', 'about', 'would', 'could', 'their'].includes(w))
      .slice(0, 5);
    return [...new Set(words)];
  };

  return (
    <>
      <TopBar title={t('title')} />

      <div className="flex h-[calc(100vh-4rem)] max-w-[1600px] mx-auto bg-gray-100 dark:bg-slate-900">
        <div className={cn(
          "flex-1 min-w-0 bg-white dark:bg-slate-800 border-r border-gray-100 dark:border-slate-700 flex flex-col overflow-hidden",
          selectedCall && "hidden lg:flex lg:flex-col"
        )}>
          <div className="p-3 border-b border-gray-100 dark:border-slate-700 space-y-2 bg-white dark:bg-slate-800">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-gray-600 dark:text-slate-400 whitespace-nowrap uppercase">{t('agent')}:</label>
              <select
                value={agentFilter}
                onChange={(e) => setAgentFilter(e.target.value)}
                className="flex-1 px-2 py-1.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-md text-xs text-dark dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                {agents.map(agent => (
                  <option key={agent} value={agent}>{agent}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <label className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase">{t('status')}:</label>
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                    statusFilter === status
                      ? 'bg-service-voice-500 text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <label className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase">{t('direction')}:</label>
              {directions.map(direction => (
                <button
                  key={direction}
                  onClick={() => setDirectionFilter(direction)}
                  className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                    directionFilter === direction
                      ? 'bg-service-voice-500 text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {direction}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-gray-600 dark:text-slate-400 whitespace-nowrap uppercase">{t('dateRange')}:</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="flex-1 px-2 py-1.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-md text-xs text-dark dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <span className="text-gray-400 dark:text-slate-500 text-xs">-</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="flex-1 px-2 py-1.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-md text-xs text-dark dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredCalls.map((call, index) => (
              <div
                key={call.id}
                onClick={() => setSelectedCall(call)}
                className={`p-2 border-b border-gray-50 dark:border-slate-700 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-slate-700 ${
                  selectedCall?.id === call.id ? 'bg-service-voice-50 dark:bg-slate-700 border-l-2 border-l-teal-500' : ''
                }`}
                style={{
                  animation: `slideInFromLeft 0.3s ease-out ${index * 0.05}s both`
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {call.direction === 'inbound' ? (
                      <Phone size={14} className="text-service-voice-600" />
                    ) : (
                      <Phone size={14} className="text-service-voice-600 rotate-180" />
                    )}
                    <span className="font-medium text-dark dark:text-white text-base">{call.callerName}</span>
                    <span className="text-xs text-gray-500">{call.callerId}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-md border font-medium ${getStatusColor(call.status)}`}>
                    {getStatusLabel(call.status)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-400">
                  <span className="font-medium">{call.agent}</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <Clock size={12} />
                    {call.duration.toFixed(1)} min
                  </span>
                  <span>•</span>
                  <span>{call.time}</span>
                  <span>•</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-xs font-medium ${getSentimentColor(call.sentiment)}`}>
                    {call.sentiment}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedCall ? (
          <div className={cn(
            "fixed inset-0 z-40 bg-white dark:bg-slate-900 flex flex-col",
            "lg:relative lg:w-80 lg:flex-shrink-0",
            "lg:border-l lg:border-gray-100 lg:dark:border-slate-700",
            "lg:z-auto"
          )}>
            <div className="p-3 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r from-white dark:from-slate-800 to-teal-50 dark:to-slate-700">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    icon={<ChevronLeft size={20} className="text-gray-600 dark:text-slate-400" />}
                    onClick={() => setSelectedCall(null)}
                    className="lg:hidden -ms-1.5"
                  />
                  <div>
                    <h3 className="font-bold text-dark dark:text-white text-lg">{selectedCall.callerName}</h3>
                    <p className="text-sm text-gray-600 dark:text-slate-400">{selectedCall.callerId}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" iconOnly icon={<MoreVertical size={16} className="text-gray-600 dark:text-slate-400" />} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-gray-600 dark:text-slate-400 font-medium uppercase tracking-wider text-xs">{t('agent')}</label>
                  <p className="text-dark dark:text-white font-medium mt-0.5">{selectedCall.agent}</p>
                </div>
                <div>
                  <label className="text-gray-600 dark:text-slate-400 font-medium uppercase tracking-wider text-xs">{t('duration')}</label>
                  <p className="text-dark dark:text-white font-medium mt-0.5">{selectedCall.duration.toFixed(1)} min</p>
                </div>
                <div>
                  <label className="text-gray-600 dark:text-slate-400 font-medium uppercase tracking-wider text-xs">{t('time')}</label>
                  <p className="text-dark dark:text-white font-medium mt-0.5">{selectedCall.time}</p>
                </div>
                <div>
                  <label className="text-gray-600 font-medium uppercase tracking-wider text-xs">{t('status')}</label>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-md border font-medium mt-0.5 ${getStatusColor(selectedCall.status)}`}>
                    {getStatusLabel(selectedCall.status)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-3 border-b border-gray-100 dark:border-slate-700">
                <h4 className="font-bold text-dark dark:text-white text-xs mb-2 uppercase">{t('transcription')}</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedCall.transcription.map((line, idx) => (
                    <div key={idx} className={`p-2 rounded-md text-xs ${
                      line.speaker === 'Agent'
                        ? 'bg-service-voice-100 text-service-voice-900 border-l-2 border-service-voice-500'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-100'
                    }`}>
                      <span className="font-bold text-xs uppercase block mb-1">
                        {line.speaker === 'Agent' ? t('agentLabel') : t('callerLabel')}
                      </span>
                      <p className="leading-relaxed">{line.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 border-b border-gray-100 dark:border-slate-700">
                <h4 className="font-bold text-dark dark:text-white text-xs mb-2 uppercase">{t('callTimeline')}</h4>
                <div className="space-y-2 relative ps-4">
                  <div className="absolute start-1.5 top-0 bottom-0 w-px bg-service-voice-300"></div>
                  {selectedCall.events.map((event, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -start-2.5 top-1 w-2 h-2 bg-service-voice-500 rounded-full border border-white dark:border-slate-800"></div>
                      <div>
                        <p className="text-xs font-medium text-dark dark:text-white">{event.action}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 border-b border-gray-100 dark:border-slate-700">
                <h4 className="font-bold text-dark dark:text-white text-xs mb-2 uppercase">{t('callAnalysis')}</h4>

                <div className="mb-2">
                  <label className="text-xs font-medium text-gray-600 dark:text-slate-400 uppercase">{t('sentiment')}</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md font-medium text-xs ${getSentimentColor(selectedCall.sentiment)}`}>
                      {selectedCall.sentiment === 'positive' ? '😊' : '😐'}
                      {getStatusLabel(selectedCall.sentiment)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-slate-400 uppercase">{t('keywords')}</label>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {getKeywords(selectedCall).map((keyword, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-service-voice-100 text-service-voice-700 rounded-md text-xs font-medium">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3 border-b border-gray-100 dark:border-slate-700">
                <label className="text-xs font-medium text-gray-600 dark:text-slate-400 uppercase block mb-1.5">{t('notes')}</label>
                <textarea
                  placeholder={t('addNotes')}
                  rows={3}
                  className="w-full px-2 py-1.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-md resize-none text-dark dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs"
                />
              </div>
            </div>

            <div className="p-3 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 space-y-1.5">
              <Button variant="primary" size="sm" icon={<Download size={14} />} className="w-full justify-center">
                {t('downloadRecording')}
              </Button>
              <Button variant="secondary" size="sm" icon={<MessageSquare size={14} />} className="w-full justify-center">
                {t('addNote')}
              </Button>
              <Button variant="secondary" size="sm" icon={<Play size={14} />} className="w-full justify-center">
                {t('replayCall')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-gradient-to-br from-gray-50 dark:from-slate-900 to-white dark:to-slate-900 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-service-voice-100 dark:bg-service-voice-900/30 rounded-full flex items-center justify-center">
                <Phone size={48} className="text-service-voice-600 dark:text-service-voice-400" />
              </div>
              <h3 className="text-heading-2 font-extrabold text-dark dark:text-white mb-2">{t('selectCall')}</h3>
              <p className="text-gray-600 dark:text-slate-400">{t('selectCallHint')}</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
