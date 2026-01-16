'use client';

import TopBar from '@/components/layout/TopBar';
import { MessageSquare, Users, CheckCircle, TrendingUp, Calendar, Zap, Phone, FileText, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Service health cards data
const serviceCards = [
  {
    name: 'Conversational AI',
    status: 'Active',
    value: '847',
    label: 'conversations today',
    subtitle: 'Multi-channel (WhatsApp, Telegram, Facebook)',
    icon: MessageSquare,
    gradient: 'from-blue-500 to-purple-500',
    borderColor: 'border-blue-500',
    buttonText: 'View Inbox',
  },
  {
    name: 'Voice Agents',
    status: 'Active',
    value: '234',
    label: 'calls today',
    subtitle: 'Phone answering & outbound',
    icon: Phone,
    gradient: 'from-teal-500 to-cyan-500',
    borderColor: 'border-teal-500',
    buttonText: 'Manage Voice',
  },
  {
    name: 'Document Intelligence',
    status: 'Active',
    value: '89',
    label: 'documents processed today',
    subtitle: 'Invoice, contract, and data extraction',
    icon: FileText,
    gradient: 'from-amber-500 to-red-500',
    borderColor: 'border-amber-500',
    buttonText: 'Process Documents',
  },
];

// Quick stats data
const quickStatsData = [
  {
    label: 'Total AI Interactions',
    value: '12,847',
  },
  {
    label: 'Active Services',
    value: '3 of 3',
  },
  {
    label: 'Cost Savings This Month',
    value: '$23,400',
  },
  {
    label: 'Automation Rate',
    value: '87%',
  },
];

// Activity feed data with service-specific colors
const activityFeedData = [
  {
    icon: Phone,
    service: 'Voice Agent',
    action: 'handled call from +1-555-0123',
    time: '5m ago',
    color: 'text-service-voice-500',
  },
  {
    icon: MessageSquare,
    service: 'Chat',
    action: 'conversation resolved with John Doe',
    time: '12m ago',
    color: 'text-primary',
  },
  {
    icon: FileText,
    service: 'Document',
    action: 'Invoice processed: INV-2024-001',
    time: '23m ago',
    color: 'text-service-documents-500',
  },
  {
    icon: Phone,
    service: 'Voice Agent',
    action: 'Call transcription completed',
    time: '1h ago',
    color: 'text-service-voice-500',
  },
  {
    icon: MessageSquare,
    service: 'Chat',
    action: 'Customer inquiry escalated to queue',
    time: '1h 15m ago',
    color: 'text-primary',
  },
  {
    icon: FileText,
    service: 'Document',
    action: 'Contract extraction completed',
    time: '2h ago',
    color: 'text-service-documents-500',
  },
];

// Mock data
const statsData = [
  {
    label: 'Active AI Agents',
    value: '12',
    change: '+2 this week',
    trend: 'up',
    icon: Zap,
    bgColor: 'bg-accent',
  },
  {
    label: 'Conversations Handled',
    value: '2,847',
    change: '+18% from yesterday',
    trend: 'up',
    icon: MessageSquare,
    bgColor: 'bg-primary',
  },
  {
    label: 'AI Resolution Rate',
    value: '74%',
    change: '+3% this week',
    trend: 'up',
    icon: CheckCircle,
    bgColor: 'bg-green',
  },
  {
    label: 'Avg Response Time',
    value: '1.2s',
    change: '-0.3s faster',
    trend: 'up',
    icon: TrendingUp,
    bgColor: 'bg-accent',
  },
];

const conversationsData = [
  { date: 'Mon', conversations: 120 },
  { date: 'Tue', conversations: 180 },
  { date: 'Wed', conversations: 150 },
  { date: 'Thu', conversations: 220 },
  { date: 'Fri', conversations: 190 },
  { date: 'Sat', conversations: 160 },
  { date: 'Sun', conversations: 140 },
];

const queueData = [
  { name: 'Rashed AI', channel: 'WhatsApp', status: 'Handling 12 chats', color: 'from-accent to-primary' },
  { name: 'Ahmed AI', channel: 'Telegram', status: 'Handling 8 chats', color: 'from-primary to-accent' },
  { name: 'Sales Pro AI', channel: 'Multi-Channel', status: 'Handling 6 chats', color: 'from-green to-emerald-500' },
];

const topChannels = [
  { name: 'WhatsApp', count: 1250, color: 'bg-green' },
  { name: 'Telegram', count: 890, color: 'bg-primary' },
  { name: 'Facebook', count: 560, color: 'bg-accent' },
];

const topLifecycles = [
  { name: 'Customer', count: 450, color: 'bg-green' },
  { name: 'Lead', count: 380, color: 'bg-blue' },
  { name: 'Qualified Lead', count: 210, color: 'bg-primary' },
  { name: 'Prospect', count: 180, color: 'bg-amber' },
];

export default function DashboardPage() {
  return (
    <>
      <TopBar title="Dashboard" />

      <div className="p-8 space-y-8">
        {/* Service Health Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {serviceCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className={`bg-white rounded-2xl p-6 border-l-4 ${card.borderColor} shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-1`}
                style={{
                  animation: `scaleIn 0.5s ease-out ${index * 0.1}s both`
                }}
              >
                {/* Header with status badge and icon */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✅ {card.status}
                    </span>
                  </div>
                  <div className={`bg-gradient-to-br ${card.gradient} rounded-lg p-3 shadow-md`}>
                    <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                </div>

                {/* Service name */}
                <p className="text-xs uppercase tracking-wider text-text-secondary font-bold mb-2">
                  {card.name}
                </p>

                {/* Main metric value */}
                <p className="text-4xl font-extrabold text-dark mb-1">{card.value}</p>
                <p className="text-xs text-text-secondary mb-4">{card.label}</p>

                {/* Subtitle */}
                <p className="text-sm text-text-secondary mb-6">{card.subtitle}</p>

                {/* Action button */}
                <button className={`w-full py-2 px-4 bg-gradient-to-r ${card.gradient} text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity duration-300`}>
                  {card.buttonText}
                </button>
              </div>
            );
          })}
        </div>

        {/* Quick Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {quickStatsData.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              style={{
                animation: `fadeIn 0.4s ease-out ${0.3 + index * 0.05}s both`
              }}
            >
              <p className="text-xs uppercase tracking-wider text-text-secondary font-bold mb-3">
                {stat.label}
              </p>
              <p className="text-3xl font-extrabold text-dark">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-extrabold text-dark">Recent Activity</h3>
            </div>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {activityFeedData.map((item, index) => {
              const ActivityIcon = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 hover:bg-light-bg rounded-lg transition-all duration-200 cursor-pointer"
                  style={{
                    animation: `fadeIn 0.3s ease-out ${0.6 + index * 0.05}s both`
                  }}
                >
                  <div className={`${item.color} flex-shrink-0`}>
                    <ActivityIcon className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-dark">
                      {item.service} <span className="font-normal text-text-secondary">{item.action}</span>
                    </p>
                  </div>
                  <p className="text-xs text-text-secondary whitespace-nowrap flex-shrink-0">{item.time}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Chart + Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations Chart */}
          <div
            className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500"
            style={{
              animation: 'slideInFromLeft 0.6s ease-out 0.4s both'
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-extrabold text-dark">AI Agent Performance - This Week</h3>
              <button className="text-sm text-primary font-semibold hover:underline transition-all duration-300 hover:scale-110">View Details</button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={conversationsData}>
                <defs>
                  <linearGradient id="conversationsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4EB6C9" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#003EF3" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="conversations"
                  stroke="#003EF3"
                  strokeWidth={3}
                  fill="url(#conversationsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Active AI Agents */}
          <div
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500"
            style={{
              animation: 'slideInFromRight 0.6s ease-out 0.4s both'
            }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-primary animate-pulse" />
              <h3 className="text-lg font-extrabold text-dark">Active Agents</h3>
            </div>
            <div className="space-y-4">
              {queueData.map((item, index) => (
                <div
                  key={index}
                  className="p-4 bg-light-bg rounded-xl hover:bg-gray-100 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-md"
                  style={{
                    animation: `fadeIn 0.4s ease-out ${0.6 + index * 0.1}s both`
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                      {item.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-dark">{item.name}</p>
                      <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent rounded font-medium">
                        {item.channel}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green rounded-full animate-pulse"></div>
                    <p className="text-xs text-green font-semibold">{item.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Channels */}
          <div
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500"
            style={{
              animation: 'slideInFromLeft 0.6s ease-out 0.8s both'
            }}
          >
            <h3 className="text-xl font-extrabold text-dark mb-6">Top Channels</h3>
            <div className="space-y-4">
              {topChannels.map((channel, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 transition-all duration-300 hover:scale-105 hover:bg-light-bg p-3 rounded-lg cursor-pointer"
                  style={{
                    animation: `fadeIn 0.3s ease-out ${1 + index * 0.1}s both`
                  }}
                >
                  <div className={`w-3 h-3 ${channel.color} rounded-full`}></div>
                  <span className="flex-1 text-sm font-semibold text-dark">{channel.name}</span>
                  <span className="text-lg font-extrabold text-dark">{channel.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Lifecycles */}
          <div
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500"
            style={{
              animation: 'slideInFromRight 0.6s ease-out 0.8s both'
            }}
          >
            <h3 className="text-xl font-extrabold text-dark mb-6">Lifecycle Distribution</h3>
            <div className="space-y-4">
              {topLifecycles.map((lifecycle, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 transition-all duration-300 hover:scale-105 hover:bg-light-bg p-3 rounded-lg cursor-pointer"
                  style={{
                    animation: `fadeIn 0.3s ease-out ${1 + index * 0.1}s both`
                  }}
                >
                  <div className={`w-3 h-3 ${lifecycle.color} rounded-full shadow-sm`}></div>
                  <span className="flex-1 text-sm font-semibold text-dark">{lifecycle.name}</span>
                  <span className="text-lg font-extrabold text-dark">{lifecycle.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
