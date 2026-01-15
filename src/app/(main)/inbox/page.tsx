'use client';

import TopBar from '@/components/layout/TopBar';
import { useState } from 'react';
import { Search, Filter, MoreVertical, Paperclip, Send, Phone, Video, Info } from 'lucide-react';

// Mock data
const conversations = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: '/images/avatar1.jpg',
    channel: 'WhatsApp',
    lastMessage: 'Thank you for your help! The issue is resolved.',
    status: 'resolved',
    unread: 0,
    timestamp: '2m ago',
  },
  {
    id: 2,
    name: 'Mike Chen',
    avatar: '/images/avatar2.jpg',
    channel: 'Telegram',
    lastMessage: 'When will my order arrive?',
    status: 'open',
    unread: 3,
    timestamp: '5m ago',
  },
  {
    id: 3,
    name: 'Emma Wilson',
    avatar: '/images/avatar3.jpg',
    channel: 'WhatsApp',
    lastMessage: 'I need assistance with my account',
    status: 'pending',
    unread: 1,
    timestamp: '12m ago',
  },
];

const messages = [
  {
    id: 1,
    sender: 'customer',
    text: 'Hi, I need help with my order',
    timestamp: '10:30 AM',
  },
  {
    id: 2,
    sender: 'ai',
    text: 'Hello! I\'d be happy to help you with your order. Could you please provide your order number?',
    timestamp: '10:31 AM',
  },
  {
    id: 3,
    sender: 'customer',
    text: 'Sure, it\'s #12345',
    timestamp: '10:32 AM',
  },
  {
    id: 4,
    sender: 'ai',
    text: 'Thank you! I\'m looking up your order now. One moment please.',
    timestamp: '10:32 AM',
  },
];

export default function InboxPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [activeTab, setActiveTab] = useState<'all' | 'assigned' | 'unassigned'>('all');
  const [contextTab, setContextTab] = useState<'profile' | 'timeline' | 'notes' | 'files'>('profile');

  return (
    <>
      <TopBar title="Inbox" />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Column 1: Conversation List */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Filter Tabs */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-light-bg text-text-secondary hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('assigned')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'assigned'
                    ? 'bg-primary text-white'
                    : 'bg-light-bg text-text-secondary hover:bg-gray-200'
                }`}
              >
                Assigned to me
              </button>
              <button
                onClick={() => setActiveTab('unassigned')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'unassigned'
                    ? 'bg-primary text-white'
                    : 'bg-light-bg text-text-secondary hover:bg-gray-200'
                }`}
              >
                Unassigned
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 bg-light-bg border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                  selectedConversation.id === conv.id ? 'bg-primary/5' : 'hover:bg-light-bg'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold flex-shrink-0">
                    {conv.name[0]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-dark text-sm">{conv.name}</span>
                      <span className="text-xs text-text-secondary">{conv.timestamp}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent rounded font-medium">
                        {conv.channel}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                        conv.status === 'resolved' ? 'bg-green/20 text-green' :
                        conv.status === 'open' ? 'bg-primary/20 text-primary' :
                        'bg-amber/20 text-amber'
                      }`}>
                        {conv.status}
                      </span>
                    </div>

                    <p className="text-sm text-text-secondary truncate">{conv.lastMessage}</p>

                    {conv.unread > 0 && (
                      <div className="mt-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-primary text-white text-xs font-bold rounded-full">
                          {conv.unread}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Chat Thread */}
        <div className="flex-1 bg-white flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold">
                {selectedConversation.name[0]}
              </div>
              <div>
                <h3 className="font-semibold text-dark">{selectedConversation.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent rounded font-medium">
                    {selectedConversation.channel}
                  </span>
                  <span className="text-xs text-text-secondary">Assigned: Rashed</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-light-bg rounded-lg transition-colors">
                <Phone size={20} className="text-text-secondary" />
              </button>
              <button className="p-2 hover:bg-light-bg rounded-lg transition-colors">
                <Video size={20} className="text-text-secondary" />
              </button>
              <button className="p-2 hover:bg-light-bg rounded-lg transition-colors">
                <MoreVertical size={20} className="text-text-secondary" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-md ${msg.sender === 'customer' ? 'order-2' : 'order-1'}`}>
                  <div className={`px-4 py-3 rounded-2xl ${
                    msg.sender === 'customer'
                      ? 'bg-light-bg text-dark'
                      : msg.sender === 'ai'
                      ? 'bg-primary/10 text-dark border border-primary/20'
                      : 'bg-primary text-white'
                  }`}>
                    {msg.sender === 'ai' && (
                      <div className="text-xs font-semibold text-primary mb-1">🤖 AI Assistant</div>
                    )}
                    <p className="text-sm">{msg.text}</p>
                  </div>
                  <span className="text-xs text-text-secondary mt-1 block">{msg.timestamp}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-end gap-3">
              <button className="p-2 hover:bg-light-bg rounded-lg transition-colors">
                <Paperclip size={20} className="text-text-secondary" />
              </button>

              <div className="flex-1">
                <textarea
                  placeholder="Type your message..."
                  rows={2}
                  className="w-full px-4 py-2 bg-light-bg border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <button className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2">
                <Send size={18} />
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Column 3: Context Panel */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          {/* Tabs */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex gap-1">
              {['profile', 'timeline', 'notes', 'files'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setContextTab(tab as any)}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                    contextTab === tab
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:bg-light-bg'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {contextTab === 'profile' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Name</label>
                  <p className="text-sm text-dark mt-1">{selectedConversation.name}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Channel</label>
                  <p className="text-sm text-dark mt-1">{selectedConversation.channel}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Status</label>
                  <p className="text-sm text-dark mt-1 capitalize">{selectedConversation.status}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Tags</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded font-medium">VIP</span>
                    <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded font-medium">Support</span>
                  </div>
                </div>
              </div>
            )}

            {contextTab === 'timeline' && (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-dark">Conversation started</p>
                    <p className="text-xs text-text-secondary">2 hours ago</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-dark">Assigned to Rashed</p>
                    <p className="text-xs text-text-secondary">1 hour ago</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
