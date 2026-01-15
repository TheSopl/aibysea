'use client';

import TopBar from '@/components/layout/TopBar';
import { MessageSquare, Users, CheckCircle, TrendingUp, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Mock data
const statsData = [
  {
    label: "Today's Conversations",
    value: '2,300',
    change: '+5%',
    trend: 'up',
    icon: MessageSquare,
    bgColor: 'bg-accent',
  },
  {
    label: 'New Contacts',
    value: '+3,020',
    change: '+14%',
    trend: 'up',
    icon: Users,
    bgColor: 'bg-primary',
  },
  {
    label: 'Resolved Today',
    value: '1,820',
    change: '+8%',
    trend: 'up',
    icon: CheckCircle,
    bgColor: 'bg-green',
  },
  {
    label: 'Response Rate',
    value: '94%',
    change: '+2%',
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
  { name: 'Sarah Johnson', channel: 'WhatsApp', waiting: '5m' },
  { name: 'Mike Chen', channel: 'Telegram', waiting: '12m' },
  { name: 'Emma Wilson', channel: 'WhatsApp', waiting: '8m' },
];

const topChannels = [
  { name: 'WhatsApp', count: 1250, color: 'bg-green' },
  { name: 'Telegram', count: 890, color: 'bg-primary' },
  { name: 'Facebook', count: 560, color: 'bg-accent' },
];

const topTags = [
  { name: 'Support', count: 450, color: 'bg-primary' },
  { name: 'Sales', count: 380, color: 'bg-accent' },
  { name: 'Billing', count: 210, color: 'bg-amber' },
];

export default function DashboardPage() {
  return (
    <>
      <TopBar title="Dashboard" />

      <div className="p-8 space-y-8">
        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.bgColor} rounded-xl p-4 shadow-md`}>
                    <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm font-bold text-green">{stat.change}</span>
                </div>
                <p className="text-xs uppercase tracking-wider text-text-secondary font-bold mb-2">
                  {stat.label}
                </p>
                <p className="text-3xl font-extrabold text-dark">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Main Chart + Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-extrabold text-dark">Conversations This Week</h3>
              <button className="text-sm text-primary font-semibold hover:underline">View All</button>
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

          {/* Today's Queue */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-extrabold text-dark">Today's Queue</h3>
            </div>
            <div className="space-y-4">
              {queueData.map((item, index) => (
                <div key={index} className="p-4 bg-light-bg rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold text-sm">
                      {item.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-dark">{item.name}</p>
                      <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent rounded font-medium">
                        {item.channel}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary">Waiting: {item.waiting}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Channels */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-extrabold text-dark mb-6">Top Channels</h3>
            <div className="space-y-4">
              {topChannels.map((channel, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`w-3 h-3 ${channel.color} rounded-full`}></div>
                  <span className="flex-1 text-sm font-semibold text-dark">{channel.name}</span>
                  <span className="text-lg font-extrabold text-dark">{channel.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Tags */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-extrabold text-dark mb-6">Top Tags</h3>
            <div className="space-y-4">
              {topTags.map((tag, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`w-3 h-3 ${tag.color} rounded-full`}></div>
                  <span className="flex-1 text-sm font-semibold text-dark">{tag.name}</span>
                  <span className="text-lg font-extrabold text-dark">{tag.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
