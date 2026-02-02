'use client';

import TopBar from '@/components/layout/TopBar';
import React, { useState } from 'react';
import { Phone, PhoneOff, Clock, User, Calendar, MoreVertical, Download, MessageSquare, Play, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useTranslations } from 'next-intl';

// Mock call logs data
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

  // Filter logic
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

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Panel: Call List */}
        <div className={cn(
          "flex-1 min-w-0 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col overflow-hidden",
          selectedCall && "hidden lg:flex lg:flex-col"
        )}>
          {/* Filters */}
          <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-slate-700 space-y-3 bg-white dark:bg-slate-800">
            {/* Agent Filter */}
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-gray-600 dark:text-slate-400 whitespace-nowrap">{t('agent')}:</label>
              <select
                value={agentFilter}
                onChange={(e) => setAgentFilter(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {agents.map(agent => (
                  <option key={agent} value={agent}>{agent}</option>
                ))}
              </select>
            </div>

            {/* Status Filter Chips */}
            <div className="flex items-center gap-2 flex-wrap">
              <label className="text-xs font-bold text-gray-600 dark:text-slate-400">{t('status')}:</label>
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 min-h-[36px] text-xs font-bold rounded-lg transition-all ${
                    statusFilter === status
                      ? 'bg-teal-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Direction Filter Chips */}
            <div className="flex items-center gap-2 flex-wrap">
              <label className="text-xs font-bold text-gray-600 dark:text-slate-400">{t('direction')}:</label>
              {directions.map(direction => (
                <button
                  key={direction}
                  onClick={() => setDirectionFilter(direction)}
                  className={`px-3 py-1.5 min-h-[36px] text-xs font-bold rounded-lg transition-all ${
                    directionFilter === direction
                      ? 'bg-teal-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {direction}
                </button>
              ))}
            </div>

            {/* Date Range */}
            <div className="space-y-2 sm:space-y-0">
              <label className="text-xs font-bold text-gray-600 dark:text-slate-400 block sm:hidden mb-1">{t('dateRange')}:</label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <label className="text-xs font-bold text-gray-600 dark:text-slate-400 whitespace-nowrap hidden sm:block">{t('dateRange')}:</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full sm:flex-1 px-3 py-2 min-h-[44px] bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-gray-400 dark:text-slate-500 hidden sm:block">-</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full sm:flex-1 px-3 py-2 min-h-[44px] bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Call List */}
          <div className="flex-1 overflow-y-auto">
            {filteredCalls.map((call, index) => (
              <div
                key={call.id}
                onClick={() => setSelectedCall(call)}
                className={`p-3 sm:p-4 min-h-[72px] border-b border-gray-100 dark:border-slate-700 cursor-pointer transition-all duration-300 hover:bg-gray-50 dark:hover:bg-slate-700 ${
                  selectedCall?.id === call.id ? 'bg-teal-50 dark:bg-slate-700 border-s-4 border-s-teal-500 shadow-md' : ''
                }`}
                style={{
                  animation: `slideInFromLeft 0.3s ease-out ${index * 0.05}s both`
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {call.direction === 'inbound' ? (
                          <Phone size={16} className="text-teal-600" />
                        ) : (
                          <Phone size={16} className="text-teal-600 rotate-180" />
                        )}
                        <span className="font-bold text-dark dark:text-white text-sm">{call.callerName}</span>
                        <span className="text-xs text-gray-500">{call.callerId}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full border font-bold ${getStatusColor(call.status)}`}>
                        {getStatusLabel(call.status)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-slate-400 mb-2">
                      <span className="font-semibold">{call.agent}</span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {call.duration.toFixed(1)} min
                      </span>
                      <span>{call.time}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${getSentimentColor(call.sentiment)}`}>
                        {call.sentiment === 'positive' ? '😊' : '😐'} {call.sentiment}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Call Detail */}
        {selectedCall ? (
          <div className={cn(
            "fixed inset-0 z-40 bg-white dark:bg-slate-900 flex flex-col",
            "lg:relative lg:w-96 lg:flex-shrink-0",
            "lg:border-l lg:border-gray-200 lg:dark:border-slate-700",
            "lg:z-auto lg:shadow-lg"
          )}>
            {/* Detail Header */}
            <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-white dark:from-slate-800 to-teal-50 dark:to-slate-700">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCall(null)}
                    className="lg:hidden p-2 -ms-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <ChevronLeft size={24} className="text-gray-600 dark:text-slate-400" />
                  </button>
                  <div>
                    <h3 className="font-bold text-dark dark:text-white text-lg">{selectedCall.callerName}</h3>
                    <p className="text-sm text-gray-600 dark:text-slate-400">{selectedCall.callerId}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <MoreVertical size={18} className="text-gray-600 dark:text-slate-400" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-gray-600 dark:text-slate-400 font-bold uppercase tracking-wider">{t('agent')}</label>
                  <p className="text-dark dark:text-white font-semibold mt-1">{selectedCall.agent}</p>
                </div>
                <div>
                  <label className="text-gray-600 dark:text-slate-400 font-bold uppercase tracking-wider">{t('duration')}</label>
                  <p className="text-dark dark:text-white font-semibold mt-1">{selectedCall.duration.toFixed(1)} min</p>
                </div>
                <div>
                  <label className="text-gray-600 dark:text-slate-400 font-bold uppercase tracking-wider">{t('time')}</label>
                  <p className="text-dark dark:text-white font-semibold mt-1">{selectedCall.time}</p>
                </div>
                <div>
                  <label className="text-gray-600 font-bold uppercase tracking-wider">{t('status')}</label>
                  <span className={`inline-block text-xs px-2 py-1 rounded-full border font-bold mt-1 ${getStatusColor(selectedCall.status)}`}>
                    {getStatusLabel(selectedCall.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Detail Content */}
            <div className="flex-1 overflow-y-auto pb-safe">
              {/* Transcription */}
              <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                <h4 className="font-bold text-dark dark:text-white text-sm mb-3">{t('transcription')}</h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {selectedCall.transcription.map((line, idx) => (
                    <div key={idx} className={`p-3 rounded-lg text-sm ${
                      line.speaker === 'Agent'
                        ? 'bg-teal-100 text-teal-900 border-s-4 border-teal-500'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <span className="font-bold text-xs uppercase block mb-1">
                        {line.speaker === 'Agent' ? t('agentLabel') : t('callerLabel')}
                      </span>
                      <p className="leading-relaxed">{line.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                <h4 className="font-bold text-dark dark:text-white text-sm mb-3">{t('callTimeline')}</h4>
                <div className="space-y-3 relative ps-6">
                  <div className="absolute start-2 top-0 bottom-0 w-0.5 bg-teal-300"></div>
                  {selectedCall.events.map((event, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -start-3.5 top-0.5 w-3 h-3 bg-teal-500 rounded-full border-2 border-white dark:border-slate-800 shadow-md"></div>
                      <div>
                        <p className="text-sm font-bold text-dark dark:text-white">{event.action}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sentiment & Keywords */}
              <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                <h4 className="font-bold text-dark dark:text-white text-sm mb-3">{t('callAnalysis')}</h4>

                <div className="mb-4">
                  <label className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wider">{t('sentiment')}</label>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-sm ${getSentimentColor(selectedCall.sentiment)}`}>
                      {selectedCall.sentiment === 'positive' ? '😊' : '😐'}
                      {getStatusLabel(selectedCall.sentiment)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wider">{t('keywords')}</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {getKeywords(selectedCall).map((keyword, idx) => (
                      <span key={idx} className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-bold">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                <label className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wider block mb-2">{t('notes')}</label>
                <textarea
                  placeholder={t('addNotes')}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg resize-none text-dark dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 pb-safe border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 space-y-2 sticky bottom-0">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-500 text-white rounded-lg font-bold text-sm hover:bg-teal-600 transition-all hover:shadow-lg">
                <Download size={18} />
                {t('downloadRecording')}
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-dark dark:text-white rounded-lg font-bold text-sm hover:bg-gray-50 dark:hover:bg-slate-600 transition-all">
                <MessageSquare size={18} />
                {t('addNote')}
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-dark dark:text-white rounded-lg font-bold text-sm hover:bg-gray-50 dark:hover:bg-slate-600 transition-all">
                <Play size={18} />
                {t('replayCall')}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-gradient-to-br from-gray-50 dark:from-slate-900 to-white dark:to-slate-900 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
                <Phone size={48} className="text-teal-600 dark:text-teal-400" />
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
