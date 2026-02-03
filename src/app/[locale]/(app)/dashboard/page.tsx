'use client';

import { useEffect } from 'react';
import TopBar from '@/components/layout/TopBar';
import Image from 'next/image';
import { MessageSquare, Phone, FileText, Activity, Zap } from 'lucide-react';
import { FaWhatsapp, FaTelegramPlane, FaFacebook, FaTiktok } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import FadeIn from '@/components/ui/FadeIn';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/animations/variants';

export default function DashboardPage() {
  const t = useTranslations('Dashboard');

  useEffect(() => {
    document.title = `${t('title')} - AIBYSEA`;
  }, [t]);

  const serviceCards = [
    {
      name: t('conversationalAI'),
      value: '847',
      label: 'Active Conversations',
      icon: MessageSquare,
      gradient: 'from-blue-500 to-purple-500',
    },
    {
      name: t('voiceAgents'),
      value: '234',
      label: 'Calls Handled',
      icon: Phone,
      gradient: 'from-emerald-500 to-cyan-500',
    },
    {
      name: t('documentIntelligence'),
      value: '89',
      label: 'Documents Processed',
      icon: FileText,
      gradient: 'from-amber-500 to-red-500',
    },
  ];

  const kpiStats = [
    { label: t('totalAIInteractions'), value: '12,847' },
    { label: t('activeServices'), value: '3 of 3' },
    { label: t('costSavingsThisMonth'), value: '$23,400' },
    { label: t('automationRate'), value: '87%' },
  ];

  const activityFeed = [
    { icon: Phone, service: t('voiceAgent'), action: t('handledCallFrom') + ' +1-555-0123', time: '5m ago', color: 'text-emerald-500' },
    { icon: MessageSquare, service: t('chat'), action: t('conversationResolvedWith') + ' John Doe', time: '12m ago', color: 'text-blue-500' },
    { icon: FileText, service: t('document'), action: t('invoiceProcessed') + ': INV-2024-001', time: '23m ago', color: 'text-amber-500' },
    { icon: Phone, service: t('voiceAgent'), action: t('callTranscriptionCompleted'), time: '1h ago', color: 'text-emerald-500' },
    { icon: MessageSquare, service: t('chat'), action: t('customerInquiryEscalated'), time: '1h 15m ago', color: 'text-blue-500' },
    { icon: FileText, service: t('document'), action: t('contractExtractionCompleted'), time: '2h ago', color: 'text-amber-500' },
  ];

  const chartData = [
    { date: t('mon'), value: 120 },
    { date: t('tue'), value: 180 },
    { date: t('wed'), value: 150 },
    { date: t('thu'), value: 220 },
    { date: t('fri'), value: 190 },
    { date: t('sat'), value: 160 },
    { date: t('sun'), value: 140 },
  ];

  const activeAgents = [
    { name: 'Rashed', channel: 'WhatsApp', chatCount: 12, photo: '/rashed.jpeg' },
  ];

  const topChannels = [
    { name: 'WhatsApp', count: 1250, Icon: FaWhatsapp, color: 'text-green-500' },
    { name: 'Telegram', count: 890, Icon: FaTelegramPlane, color: 'text-blue-400' },
    { name: 'Facebook', count: 560, Icon: FaFacebook, color: 'text-blue-600' },
    { name: 'TikTok', count: 420, Icon: FaTiktok, color: 'text-gray-900 dark:text-white' },
  ];

  const lifecycles = [
    { name: t('customer'), count: 450, icon: '🎯' },
    { name: t('lead'), count: 380, icon: '📈' },
    { name: t('qualifiedLead'), count: 210, icon: '⭐' },
    { name: t('prospect'), count: 180, icon: '🔍' },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-slate-900">
      <TopBar title={t('title')} />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1600px] 2xl:max-w-[1680px] mx-auto p-4 lg:p-6 space-y-6">

          <FadeIn>
            <div className="space-y-4">
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
                      className="bg-white dark:bg-slate-800 rounded-xl p-5 lg:p-6 shadow-sm border border-gray-200 dark:border-slate-700 flex flex-col items-center text-center"
                    >
                      <div className="mb-4">
                        <div className={`bg-gradient-to-br ${card.gradient} rounded-lg p-3 shadow-sm`}>
                          <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                        </div>
                      </div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-3">
                        {card.name}
                      </p>
                      <p className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2">{card.value}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{card.label}</p>
                    </motion.div>
                  );
                })}
              </motion.div>

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

          <FadeIn delay={0.1}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">

              <Card variant="default" className="lg:col-span-5">
                <Card.Header>
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-gray-900 dark:text-white" />
                    <Card.Title>{t('recentActivity')}</Card.Title>
                  </div>
                </Card.Header>
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
              </Card>

              <Card variant="default" className="lg:col-span-7">
                <Card.Header>
                  <Card.Title>{t('aiAgentPerformance')}</Card.Title>
                  <Button variant="ghost" size="sm">
                    {t('viewDetails')}
                  </Button>
                </Card.Header>
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
              </Card>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-start">

              <Card variant="default">
                <Card.Header>
                  <Card.Title className="h-7">{t('topChannels')}</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-3">
                    {topChannels.map((channel, index) => {
                      const BrandIcon = channel.Icon;
                      return (
                        <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors h-[52px]">
                          <div className={`w-9 h-9 flex items-center justify-center flex-shrink-0 ${channel.color}`}>
                            <BrandIcon size={24} />
                          </div>
                          <span className="flex-1 text-sm font-semibold text-gray-900 dark:text-white">{channel.name}</span>
                          <span className="text-base lg:text-lg font-bold text-gray-900 dark:text-white">{channel.count}</span>
                        </div>
                      );
                    })}
                  </div>
                </Card.Content>
              </Card>

              <Card variant="default">
                <Card.Header>
                  <Card.Title className="h-7">{t('lifecycleDistribution')}</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-3">
                    {lifecycles.map((lifecycle, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors h-[52px]">
                        <div className="w-9 h-9 flex items-center justify-center text-2xl flex-shrink-0">{lifecycle.icon}</div>
                        <span className="flex-1 text-sm font-semibold text-gray-900 dark:text-white">{lifecycle.name}</span>
                        <span className="text-base lg:text-lg font-bold text-gray-900 dark:text-white">{lifecycle.count}</span>
                      </div>
                    ))}
                  </div>
                </Card.Content>
              </Card>

              <Card variant="default">
                <Card.Header>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-500" />
                    <Card.Title>{t('activeAgents')}</Card.Title>
                  </div>
                </Card.Header>
                <Card.Content>
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
                </Card.Content>
              </Card>
            </div>
          </FadeIn>

        </div>
      </div>
    </div>
  );
}
