'use client';

import { useEffect } from 'react';
import TopBar from '@/components/layout/TopBar';
import Image from 'next/image';
import { MessageSquare, Phone, FileText, Activity, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';
import FadeIn from '@/components/ui/FadeIn';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/animations/variants';

export default function DashboardPage() {
  const t = useTranslations('Dashboard');

  // Set page title
  useEffect(() => {
    document.title = `${t('title')} - AIBYSEA`;
  }, [t]);

  // Service cards data
  const serviceCards = [
    {
      name: t('conversationalAI'),
      value: '847',
      label: t('conversationsToday'),
      subtitle: t('multiChannelSubtitle'),
      icon: MessageSquare,
      gradient: 'from-blue-500 to-purple-500',
      buttonText: t('viewInbox'),
    },
    {
      name: t('voiceAgents'),
      value: '234',
      label: t('callsToday'),
      subtitle: t('phoneAnsweringSubtitle'),
      icon: Phone,
      gradient: 'from-emerald-500 to-cyan-500',
      buttonText: t('manageVoice'),
    },
    {
      name: t('documentIntelligence'),
      value: '89',
      label: t('documentsProcessedToday'),
      subtitle: t('invoiceContractSubtitle'),
      icon: FileText,
      gradient: 'from-amber-500 to-red-500',
      buttonText: t('processDocuments'),
    },
  ];

  // KPI stats - all in cards
  const kpiStats = [
    { label: t('totalAIInteractions'), value: '12,847' },
    { label: t('activeServices'), value: '3 of 3' },
    { label: t('costSavingsThisMonth'), value: '$23,400' },
    { label: t('automationRate'), value: '87%' },
  ];

  // Activity feed
  const activityFeed = [
    { icon: Phone, service: t('voiceAgent'), action: t('handledCallFrom') + ' +1-555-0123', time: '5m ago', color: 'text-emerald-500' },
    { icon: MessageSquare, service: t('chat'), action: t('conversationResolvedWith') + ' John Doe', time: '12m ago', color: 'text-blue-500' },
    { icon: FileText, service: t('document'), action: t('invoiceProcessed') + ': INV-2024-001', time: '23m ago', color: 'text-amber-500' },
    { icon: Phone, service: t('voiceAgent'), action: t('callTranscriptionCompleted'), time: '1h ago', color: 'text-emerald-500' },
    { icon: MessageSquare, service: t('chat'), action: t('customerInquiryEscalated'), time: '1h 15m ago', color: 'text-blue-500' },
    { icon: FileText, service: t('document'), action: t('contractExtractionCompleted'), time: '2h ago', color: 'text-amber-500' },
  ];

  // Chart data
  const chartData = [
    { date: t('mon'), value: 120 },
    { date: t('tue'), value: 180 },
    { date: t('wed'), value: 150 },
    { date: t('thu'), value: 220 },
    { date: t('fri'), value: 190 },
    { date: t('sat'), value: 160 },
    { date: t('sun'), value: 140 },
  ];

  // Active agents
  const activeAgents = [
    { name: 'Rashed', channel: 'WhatsApp', chatCount: 12, photo: '/rashed.jpeg' },
  ];

  // Top channels
  const topChannels = [
    { name: 'WhatsApp', count: 1250, logo: '/whatsapp.svg' },
    { name: 'Telegram', count: 890, logo: '/telegram.svg' },
    { name: 'Facebook', count: 560, logo: '/facebook.svg' },
    { name: 'TikTok', count: 420, logo: '/tiktok.svg' },
  ];

  // Lifecycles
  const lifecycles = [
    { name: t('customer'), count: 450, icon: '🎯' },
    { name: t('lead'), count: 380, icon: '📈' },
    { name: t('qualifiedLead'), count: 210, icon: '⭐' },
    { name: t('prospect'), count: 180, icon: '🔍' },
  ];

  return (
    <div className="flex flex-col h-full bg-light-bg dark:bg-slate-900">
      <TopBar title={t('title')} />

      {/* Scrollable content - strict grid system */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto p-6 space-y-6">

          {/* Section 1: Service Cards - 3 columns, equal height */}
          <FadeIn>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {serviceCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={index}
                    variants={staggerItem}
                    className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700 flex flex-col"
                  >
                    {/* Icon */}
                    <div className="flex justify-end mb-4">
                      <div className={`bg-gradient-to-br ${card.gradient} rounded-lg p-3 shadow-sm`}>
                        <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                      </div>
                    </div>

                    {/* Service name */}
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-2">
                      {card.name}
                    </p>

                    {/* Value */}
                    <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{card.value}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{card.label}</p>

                    {/* Subtitle */}
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 flex-1">{card.subtitle}</p>

                    {/* CTA - always at bottom */}
                    <Button variant="primary" size="sm" className="w-full">
                      {card.buttonText}
                    </Button>
                  </motion.div>
                );
              })}
            </motion.div>
          </FadeIn>

          {/* Section 2: KPI Stats - 4 columns, all in cards */}
          <FadeIn delay={0.1}>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {kpiStats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700"
                >
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-3">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </motion.div>
              ))}
            </motion.div>
          </FadeIn>

          {/* Section 3: Activity Feed (left) + Performance Chart (right) */}
          <FadeIn delay={0.2}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Activity Feed */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-6">
                  <Activity className="w-5 h-5 text-gray-900 dark:text-white" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('recentActivity')}</h3>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {activityFeed.map((item, index) => {
                    const ActivityIcon = item.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <div className={`${item.color} flex-shrink-0`}>
                          <ActivityIcon className="w-5 h-5" strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {item.service}{' '}
                            <span className="font-normal text-gray-600 dark:text-gray-300">{item.action}</span>
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{item.time}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Performance Chart */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('aiAgentPerformance')}</h3>
                  <Button variant="ghost" size="sm">
                    {t('viewDetails')}
                  </Button>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-slate-700" />
                      <XAxis dataKey="date" stroke="#6B7280" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        fill="url(#gradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Section 4: Top Channels + Lifecycles + Active Agents */}
          <FadeIn delay={0.3}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Top Channels */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">{t('topChannels')}</h3>
                <div className="space-y-4">
                  {topChannels.map((channel, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                      <div className="relative w-8 h-8 flex-shrink-0">
                        <Image src={channel.logo} alt={channel.name} fill className="object-contain" />
                      </div>
                      <span className="flex-1 text-sm font-semibold text-gray-900 dark:text-white">{channel.name}</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">{channel.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lifecycle Distribution */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">{t('lifecycleDistribution')}</h3>
                <div className="space-y-4">
                  {lifecycles.map((lifecycle, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                      <div className="text-2xl">{lifecycle.icon}</div>
                      <span className="flex-1 text-sm font-semibold text-gray-900 dark:text-white">{lifecycle.name}</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">{lifecycle.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Agents */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-6">
                  <Zap className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('activeAgents')}</h3>
                </div>
                <div className="space-y-4">
                  {activeAgents.map((agent, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden">
                          <Image src={agent.photo} alt={agent.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{agent.name}</p>
                          <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded font-medium">
                            {agent.channel}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-xs text-green-600 dark:text-green-400 font-semibold">
                          {t('handlingChats', { count: agent.chatCount })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>

        </div>
      </div>
    </div>
  );
}
