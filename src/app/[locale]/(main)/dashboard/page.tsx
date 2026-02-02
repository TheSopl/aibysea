'use client';

import { useEffect } from 'react';
import TopBar from '@/components/layout/TopBar';
import Image from 'next/image';
import { MessageSquare, Phone, FileText, Activity, Zap } from 'lucide-react';
import { FaWhatsapp, FaTelegramPlane, FaFacebook, FaTiktok } from 'react-icons/fa';
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

  // KPI stats
  const kpiStats = [
    { label: t('totalAIInteractions'), value: '12,847' },
    { label: t('activeServices'), value: '3 of 3' },
    { label: t('costSavingsThisMonth'), value: '$23,400' },
    { label: t('automationRate'), value: '87%' },
  ];

  // Activity feed - limit to 6 items, no nested scroll
  const activityFeed = [
    { icon: Phone, service: t('voiceAgent'), action: t('handledCallFrom') + ' +1-555-0123', time: '5m ago', color: 'text-emerald-500' },
    { icon: MessageSquare, service: t('chat'), action: t('conversationResolvedWith') + ' John Doe', time: '12m ago', color: 'text-blue-500' },
    { icon: FileText, service: t('document'), action: t('invoiceProcessed') + ': INV-2024-001', time: '23m ago', color: 'text-amber-500' },
    { icon: Phone, service: t('voiceAgent'), action: t('callTranscriptionCompleted'), time: '1h ago', color: 'text-emerald-500' },
    { icon: MessageSquare, service: t('chat'), action: t('customerInquiryEscalated'), time: '1h 15m ago', color: 'text-blue-500' },
    { icon: FileText, service: t('document'), action: t('contractExtractionCompleted'), time: '2h ago', color: 'text-amber-500' },
  ];

  // Chart data - fuller dataset
  const chartData = [
    { date: t('mon'), value: 120 },
    { date: t('tue'), value: 180 },
    { date: t('wed'), value: 150 },
    { date: t('thu'), value: 220 },
    { date: t('fri'), value: 190 },
    { date: t('sat'), value: 160 },
    { date: t('sun'), value: 140 },
  ];

  // Active agents - show multiple for density
  const activeAgents = [
    { name: 'Rashed', channel: 'WhatsApp', chatCount: 12, photo: '/rashed.jpeg' },
    { name: 'Sarah', channel: 'Telegram', chatCount: 8, photo: '/rashed.jpeg' },
    { name: 'Ahmad', channel: 'Facebook', chatCount: 5, photo: '/rashed.jpeg' },
  ];

  // Top channels with real brand icons
  const topChannels = [
    { name: 'WhatsApp', count: 1250, Icon: FaWhatsapp, color: 'text-green-500' },
    { name: 'Telegram', count: 890, Icon: FaTelegramPlane, color: 'text-blue-400' },
    { name: 'Facebook', count: 560, Icon: FaFacebook, color: 'text-blue-600' },
    { name: 'TikTok', count: 420, Icon: FaTiktok, color: 'text-gray-900 dark:text-white' },
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

      {/* Full-width scrollable content - no nested scrollbars */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1600px] 2xl:max-w-[1680px] mx-auto p-4 lg:p-6 space-y-6">

          {/* Section 1: Hero Dashboard Header - Service cards + KPI band */}
          <FadeIn>
            <div className="space-y-4">
              {/* Service Cards - 3 columns */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6"
              >
                {serviceCards.map((card, index) => {
                  const Icon = card.icon;
                  return (
                    <motion.div
                      key={index}
                      variants={staggerItem}
                      className="bg-white dark:bg-slate-800 rounded-xl p-5 lg:p-6 shadow-sm border border-gray-200 dark:border-slate-700 flex flex-col"
                    >
                      <div className="flex justify-end mb-3">
                        <div className={`bg-gradient-to-br ${card.gradient} rounded-lg p-2.5 shadow-sm`}>
                          <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                        </div>
                      </div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-2">
                        {card.name}
                      </p>
                      <p className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1">{card.value}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{card.label}</p>
                      <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-300 mb-4 flex-1">{card.subtitle}</p>
                      <Button variant="primary" size="sm" className="w-full">
                        {card.buttonText}
                      </Button>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* KPI Stats Band - compact, same section */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6"
              >
                {kpiStats.map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={staggerItem}
                    className="bg-white dark:bg-slate-800 rounded-lg p-4 lg:p-5 shadow-sm border border-gray-200 dark:border-slate-700"
                  >
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-2">
                      {stat.label}
                    </p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </FadeIn>

          {/* Section 2: Activity Feed + Performance Chart - 12-col deliberate spans */}
          <FadeIn delay={0.1}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">

              {/* Activity Feed - span 5 columns, NO nested scroll */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-xl p-5 lg:p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-5">
                  <Activity className="w-5 h-5 text-gray-900 dark:text-white" />
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 dark:text-white">{t('recentActivity')}</h3>
                </div>
                {/* No max-h, no overflow - just render items */}
                <div className="space-y-2.5">
                  {activityFeed.map((item, index) => {
                    const ActivityIcon = item.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <div className={`${item.color} flex-shrink-0`}>
                          <ActivityIcon className="w-4 h-4" strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs lg:text-sm font-medium text-gray-900 dark:text-white">
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

              {/* Performance Chart - span 7 columns, larger and denser */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-xl p-5 lg:p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 dark:text-white">{t('aiAgentPerformance')}</h3>
                  <Button variant="ghost" size="sm">
                    {t('viewDetails')}
                  </Button>
                </div>
                <div className="h-72 lg:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-slate-700" />
                      <XAxis
                        dataKey="date"
                        stroke="#6B7280"
                        style={{ fontSize: '13px', fontWeight: 500 }}
                      />
                      <YAxis
                        stroke="#6B7280"
                        style={{ fontSize: '13px', fontWeight: 500 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          fontSize: '13px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        fill="url(#gradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Section 3: Channels + Lifecycles + Active Agents - equal 4-col spans */}
          <FadeIn delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">

              {/* Top Channels with real brand icons */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 lg:p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                <h3 className="text-base lg:text-lg font-bold text-gray-900 dark:text-white mb-5">{t('topChannels')}</h3>
                <div className="space-y-3">
                  {topChannels.map((channel, index) => {
                    const BrandIcon = channel.Icon;
                    return (
                      <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <div className={`w-9 h-9 flex items-center justify-center flex-shrink-0 ${channel.color}`}>
                          <BrandIcon size={24} />
                        </div>
                        <span className="flex-1 text-sm font-semibold text-gray-900 dark:text-white">{channel.name}</span>
                        <span className="text-base lg:text-lg font-bold text-gray-900 dark:text-white">{channel.count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Lifecycle Distribution */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 lg:p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                <h3 className="text-base lg:text-lg font-bold text-gray-900 dark:text-white mb-5">{t('lifecycleDistribution')}</h3>
                <div className="space-y-3">
                  {lifecycles.map((lifecycle, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                      <div className="text-2xl">{lifecycle.icon}</div>
                      <span className="flex-1 text-sm font-semibold text-gray-900 dark:text-white">{lifecycle.name}</span>
                      <span className="text-base lg:text-lg font-bold text-gray-900 dark:text-white">{lifecycle.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Agents - show multiple agents for density */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 lg:p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-5">
                  <Zap className="w-5 h-5 text-blue-500" />
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 dark:text-white">{t('activeAgents')}</h3>
                </div>
                <div className="space-y-3">
                  {activeAgents.map((agent, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                          <Image src={agent.photo} alt={agent.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{agent.name}</p>
                          <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded font-medium">
                            {agent.channel}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
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
