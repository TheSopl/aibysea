'use client';

import TopBar from '@/components/layout/TopBar';
import { useState } from 'react';
import { Search, MoreVertical, Paperclip, Send, Phone, Video, UserCheck, Bot, Smile, Image as ImageIcon } from 'lucide-react';

// Mock data
const conversations = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'SJ',
    channel: 'WhatsApp',
    lastMessage: 'Thank you for your help! The issue is resolved.',
    status: 'resolved',
    lifecycle: 'Customer',
    unread: 0,
    timestamp: '2m ago',
    aiAgent: 'Rashed AI',
    handledBy: 'ai',
  },
  {
    id: 2,
    name: 'Mike Chen',
    avatar: 'MC',
    channel: 'Telegram',
    lastMessage: 'When will my order arrive?',
    status: 'open',
    lifecycle: 'Lead',
    unread: 3,
    timestamp: '5m ago',
    aiAgent: 'Ahmed AI',
    handledBy: 'ai',
  },
  {
    id: 3,
    name: 'Emma Wilson',
    avatar: 'EW',
    channel: 'WhatsApp',
    lastMessage: 'I need assistance with my account',
    status: 'pending',
    lifecycle: 'Prospect',
    unread: 1,
    timestamp: '12m ago',
    aiAgent: 'Rashed AI',
    handledBy: 'human',
  },
];

const mockMessages = [
  {
    id: 1,
    sender: 'customer',
    text: 'Hi, I need help with my order',
    timestamp: '10:30 AM',
  },
  {
    id: 2,
    sender: 'ai',
    text: "Hello! I'd be happy to help you with your order. Could you please provide your order number?",
    timestamp: '10:31 AM',
  },
  {
    id: 3,
    sender: 'customer',
    text: "Sure, it's #12345",
    timestamp: '10:32 AM',
  },
  {
    id: 4,
    sender: 'ai',
    text: "Thank you! I'm looking up your order now. One moment please.",
    timestamp: '10:32 AM',
  },
];

export default function InboxPage() {
  const [selectedConversation, setSelectedConversation] = useState<typeof conversations[0] | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'assigned' | 'unassigned'>('all');
  const [contextTab, setContextTab] = useState<'profile' | 'timeline' | 'notes'>('profile');
  const [message, setMessage] = useState('');
  const [isAIMode, setIsAIMode] = useState(true);

  const handleSend = () => {
    if (!message.trim()) return;
    // TODO: Implement send message
    console.log('Sending:', message);
    setMessage('');
  };

  const handleTakeover = () => {
    setIsAIMode(!isAIMode);
    // TODO: Implement takeover logic to notify N8N
    console.log('Takeover toggled:', !isAIMode);
  };

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
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'all'
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-light-bg text-text-secondary hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('assigned')}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'assigned'
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-light-bg text-text-secondary hover:bg-gray-200'
                }`}
              >
                Assigned
              </button>
              <button
                onClick={() => setActiveTab('unassigned')}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'unassigned'
                    ? 'bg-primary text-white shadow-md'
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
                className="w-full pl-10 pr-4 py-2.5 bg-light-bg border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-all hover:bg-light-bg ${
                  selectedConversation?.id === conv.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
                    {conv.avatar}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-dark text-sm">{conv.name}</span>
                      <span className="text-xs text-text-secondary">{conv.timestamp}</span>
                    </div>

                    <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                      <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent rounded-md font-bold">
                        {conv.channel}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                        conv.handledBy === 'ai' ? 'bg-primary/20 text-primary' : 'bg-purple/20 text-purple'
                      }`}>
                        {conv.handledBy === 'ai' ? '🤖' : '👤'} {conv.aiAgent}
                      </span>
                    </div>

                    <p className="text-sm text-text-secondary truncate mb-2">{conv.lastMessage}</p>

                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      conv.lifecycle === 'Customer' ? 'bg-green/20 text-green' :
                      conv.lifecycle === 'Lead' ? 'bg-blue/20 text-blue' :
                      'bg-amber/20 text-amber'
                    }`}>
                      {conv.lifecycle}
                    </span>

                    {conv.unread > 0 && (
                      <div className="mt-2">
                        <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 bg-primary text-white text-xs font-bold rounded-full shadow-md">
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
        {selectedConversation ? (
          <div className="flex-1 bg-white flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-white to-light-bg">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold shadow-lg">
                  {selectedConversation.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-dark text-lg">{selectedConversation.name}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent rounded-md font-bold">
                      {selectedConversation.channel}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                      selectedConversation.handledBy === 'ai' ? 'bg-primary/20 text-primary' : 'bg-purple/20 text-purple'
                    }`}>
                      {selectedConversation.handledBy === 'ai' ? '🤖 AI Mode' : '👤 Human Mode'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTakeover}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 shadow-md hover:shadow-lg ${
                    isAIMode
                      ? 'bg-purple text-white hover:bg-purple/90'
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                >
                  {isAIMode ? (
                    <div className="flex items-center gap-2">
                      <UserCheck size={16} />
                      <span>Take Over</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Bot size={16} />
                      <span>Return to AI</span>
                    </div>
                  )}
                </button>
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
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-light-bg/30 to-white">
              {mockMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  <div className={`max-w-md ${msg.sender === 'customer' ? '' : ''}`}>
                    <div className={`px-4 py-3 rounded-2xl shadow-md transition-all hover:shadow-lg ${
                      msg.sender === 'customer'
                        ? 'bg-white text-dark border border-gray-200'
                        : msg.sender === 'ai'
                        ? 'bg-gradient-to-br from-primary to-primary/90 text-white'
                        : 'bg-gradient-to-br from-purple to-purple/90 text-white'
                    }`}>
                      {msg.sender === 'ai' && (
                        <div className="text-xs font-bold text-white/90 mb-1 flex items-center gap-1">
                          <Bot size={14} />
                          AI Assistant
                        </div>
                      )}
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                    <span className="text-xs text-text-secondary mt-1.5 block px-2">{msg.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Footer */}
            <div className="p-4 border-t border-gray-200 bg-white">
              {!isAIMode && (
                <div className="mb-3 px-3 py-2 bg-purple/10 border border-purple/30 rounded-lg">
                  <p className="text-xs font-bold text-purple flex items-center gap-2">
                    <UserCheck size={14} />
                    You're in Human Mode - AI is paused for this conversation
                  </p>
                </div>
              )}
              <div className="flex items-end gap-3">
                <button className="p-2.5 hover:bg-light-bg rounded-lg transition-colors">
                  <Paperclip size={20} className="text-text-secondary" />
                </button>
                <button className="p-2.5 hover:bg-light-bg rounded-lg transition-colors">
                  <ImageIcon size={20} className="text-text-secondary" />
                </button>
                <button className="p-2.5 hover:bg-light-bg rounded-lg transition-colors">
                  <Smile size={20} className="text-text-secondary" />
                </button>

                <div className="flex-1">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Type your message..."
                    rows={2}
                    className="w-full px-4 py-3 bg-light-bg border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <button
                  onClick={handleSend}
                  className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <Send size={18} />
                  Send
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-gradient-to-br from-light-bg to-white flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full flex items-center justify-center">
                <Bot size={48} className="text-primary" />
              </div>
              <h3 className="text-2xl font-extrabold text-dark mb-2">Select a conversation</h3>
              <p className="text-text-secondary">Choose a conversation from the list to start chatting</p>
            </div>
          </div>
        )}

        {/* Column 3: Context Panel */}
        {selectedConversation && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            {/* Tabs */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex gap-1">
                {['profile', 'timeline', 'notes'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setContextTab(tab as any)}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                      contextTab === tab
                        ? 'bg-primary text-white shadow-md'
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
                    <p className="text-sm text-dark mt-1 font-semibold">{selectedConversation.name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Channel</label>
                    <p className="text-sm text-dark mt-1">{selectedConversation.channel}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">AI Agent</label>
                    <p className="text-sm text-dark mt-1">{selectedConversation.aiAgent}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Lifecycle Stage</label>
                    <div className="mt-2">
                      <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold ${
                        selectedConversation.lifecycle === 'Customer' ? 'bg-green/20 text-green' :
                        selectedConversation.lifecycle === 'Lead' ? 'bg-blue/20 text-blue' :
                        'bg-amber/20 text-amber'
                      }`}>
                        {selectedConversation.lifecycle}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {contextTab === 'timeline' && (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-dark">Conversation started</p>
                      <p className="text-xs text-text-secondary">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-1.5"></div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-dark">Assigned to {selectedConversation.aiAgent}</p>
                      <p className="text-xs text-text-secondary">1 hour ago</p>
                    </div>
                  </div>
                </div>
              )}

              {contextTab === 'notes' && (
                <div>
                  <textarea
                    placeholder="Add notes about this contact..."
                    rows={10}
                    className="w-full px-3 py-2 bg-light-bg border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
