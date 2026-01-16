'use client';

import TopBar from '@/components/layout/TopBar';
import Image from 'next/image';
import React, { useState } from 'react';
import { Search, MoreVertical, Paperclip, Send, Phone, Video, UserCheck, Bot, Smile, Image as ImageIcon, Zap } from 'lucide-react';

// Mock data
const conversations = [
  {
    id: 1,
    name: 'Alex Rivera',
    avatar: 'AR',
    channel: 'WhatsApp',
    lastMessage: 'Perfect! The integration is working smoothly now.',
    status: 'resolved',
    lifecycle: 'Customer',
    unread: 0,
    timestamp: '2m ago',
    aiAgent: 'Rashed',
    handledBy: 'ai',
  },
  {
    id: 2,
    name: 'Maya Patel',
    avatar: 'MP',
    channel: 'Telegram',
    lastMessage: 'Can you help me upgrade my subscription plan?',
    status: 'open',
    lifecycle: 'Lead',
    unread: 3,
    timestamp: '5m ago',
    aiAgent: 'Rashed',
    handledBy: 'ai',
  },
  {
    id: 3,
    name: 'James Kim',
    avatar: 'JK',
    channel: 'WhatsApp',
    lastMessage: 'Looking for enterprise pricing options',
    status: 'pending',
    lifecycle: 'Prospect',
    unread: 1,
    timestamp: '12m ago',
    aiAgent: 'Rashed',
    handledBy: 'human',
  },
  {
    id: 4,
    name: 'Sofia Andersson',
    avatar: 'SA',
    channel: 'Facebook',
    lastMessage: 'Great demo! When can we schedule implementation?',
    status: 'open',
    lifecycle: 'Qualified Lead',
    unread: 2,
    timestamp: '18m ago',
    aiAgent: 'Rashed',
    handledBy: 'ai',
  },
  {
    id: 5,
    name: 'Omar Hassan',
    avatar: 'OH',
    channel: 'Instagram',
    lastMessage: 'The AI responses are incredibly accurate!',
    status: 'resolved',
    lifecycle: 'Customer',
    unread: 0,
    timestamp: '1h ago',
    aiAgent: 'Rashed',
    handledBy: 'ai',
  },
];

const mockMessages = [
  {
    id: 1,
    sender: 'customer',
    text: "Hi! I'm interested in integrating your AI agents with our existing CRM system.",
    timestamp: '2:15 PM',
  },
  {
    id: 2,
    sender: 'ai',
    text: "Hello Alex! Great to hear from you. We have seamless integrations with major CRM platforms. Which CRM are you currently using?",
    timestamp: '2:15 PM',
  },
  {
    id: 3,
    sender: 'customer',
    text: "We're using Salesforce. Do you have native integration or would we need to use APIs?",
    timestamp: '2:16 PM',
  },
  {
    id: 4,
    sender: 'ai',
    text: "Perfect! We offer both a native Salesforce connector and REST API options. The native connector can sync contacts, conversations, and lifecycle stages automatically. Would you like me to send you the integration guide?",
    timestamp: '2:17 PM',
  },
  {
    id: 5,
    sender: 'customer',
    text: "Yes please! Also, what's the typical setup time?",
    timestamp: '2:18 PM',
  },
  {
    id: 6,
    sender: 'ai',
    text: "I've sent the integration guide to your email. Most customers complete the Salesforce integration in 2-3 hours. Our team can also handle the setup for you if needed. The integration is working smoothly now!",
    timestamp: '2:19 PM',
  },
  {
    id: 7,
    sender: 'customer',
    text: "Perfect! The integration is working smoothly now.",
    timestamp: '2:28 PM',
  },
];

export default function InboxPage() {
  const [selectedConversation, setSelectedConversation] = useState<typeof conversations[0] | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'assigned' | 'unassigned'>('all');
  const [contextTab, setContextTab] = useState<'profile' | 'timeline' | 'notes' | 'agents'>('profile');
  const [message, setMessage] = useState('');
  const [isAIMode, setIsAIMode] = useState(true);
  const [messages, setMessages] = useState(mockMessages);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: isAIMode ? 'ai' : 'human',
      text: message,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // TODO: Send to N8N webhook
    console.log('Message sent:', newMessage);
  };

  const handleTakeover = () => {
    const newMode = !isAIMode;
    setIsAIMode(newMode);

    // TODO: Notify N8N about takeover
    fetch('/api/n8n/takeover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId: selectedConversation?.id,
        mode: newMode ? 'ai' : 'human',
        timestamp: new Date().toISOString(),
      }),
    }).catch(err => console.error('Failed to notify N8N:', err));

    console.log(`${newMode ? 'AI' : 'Human'} takeover activated`);
  };

  return (
    <>
      <TopBar title="Inbox" />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Column 1: Conversation List */}
        <div className="w-80 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col">
          {/* Filter Tabs */}
          <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'all'
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-light-bg dark:bg-slate-700 text-dark dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('assigned')}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'assigned'
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-light-bg text-text-secondary hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                Assigned
              </button>
              <button
                onClick={() => setActiveTab('unassigned')}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'unassigned'
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-light-bg text-text-secondary hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                Unassigned
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-slate-300" size={16} />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2.5 bg-light-bg dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-dark dark:text-white placeholder:text-text-secondary dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto scroll-smooth">
            {conversations.map((conv, index) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`p-4 border-b border-gray-200 dark:border-slate-700 cursor-pointer transition-all duration-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:scale-[1.01] ${
                  selectedConversation?.id === conv.id ? 'bg-primary/5 border-l-4 border-l-primary shadow-lg' : ''
                }`}
                style={{
                  animation: `slideInFromLeft 0.3s ease-out ${index * 0.05}s both`
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-dark dark:text-white font-bold text-sm flex-shrink-0 shadow-md">
                    {conv.avatar}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-dark dark:text-white text-sm">{conv.name}</span>
                      <span className="text-xs text-text-secondary dark:text-slate-300">{conv.timestamp}</span>
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

                    <p className="text-sm text-text-secondary dark:text-slate-300 truncate mb-2">{conv.lastMessage}</p>

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
          <div className="flex-1 bg-white dark:bg-slate-900 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between bg-gradient-to-r from-white to-light-bg dark:from-slate-800 dark:to-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-dark dark:text-white font-bold shadow-lg">
                  {selectedConversation.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-dark dark:text-white text-lg">{selectedConversation.name}</h3>
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
                <button className="p-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <Phone size={20} className="text-text-secondary dark:text-slate-300" />
                </button>
                <button className="p-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <Video size={20} className="text-text-secondary dark:text-slate-300" />
                </button>
                <button className="p-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <MoreVertical size={20} className="text-text-secondary dark:text-slate-300" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-light-bg/30 to-white dark:from-slate-900 dark:to-slate-900 scroll-smooth">
              {messages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}
                  style={{
                    animation: `fadeIn 0.4s ease-out ${index * 0.05}s both`
                  }}
                >
                  <div className={`max-w-md ${msg.sender === 'customer' ? '' : ''}`}>
                    <div className={`px-4 py-3 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                      msg.sender === 'customer'
                        ? 'bg-white dark:bg-slate-800 text-dark dark:text-white border border-gray-200 dark:border-slate-700'
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
                    <span className="text-xs text-text-secondary dark:text-slate-400 mt-1.5 block px-2">{msg.timestamp}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              {!isAIMode && (
                <div className="mb-3 px-3 py-2 bg-purple/10 border border-purple/30 rounded-lg">
                  <p className="text-xs font-bold text-purple flex items-center gap-2">
                    <UserCheck size={14} />
                    You're in Human Mode - AI is paused for this conversation
                  </p>
                </div>
              )}
              <div className="flex items-end gap-3">
                <button className="p-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <Paperclip size={20} className="text-text-secondary dark:text-slate-300" />
                </button>
                <button className="p-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <ImageIcon size={20} className="text-text-secondary dark:text-slate-300" />
                </button>
                <button className="p-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <Smile size={20} className="text-text-secondary dark:text-slate-300" />
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
                    className="w-full px-4 py-3 bg-light-bg dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl resize-none text-dark dark:text-white placeholder:text-text-secondary dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
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
          <div className="flex-1 bg-gradient-to-br from-light-bg to-white dark:from-slate-900 dark:to-slate-900 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full flex items-center justify-center">
                <Bot size={48} className="text-primary" />
              </div>
              <h3 className="text-2xl font-extrabold text-dark dark:text-white mb-2">Select a conversation</h3>
              <p className="text-text-secondary dark:text-slate-300">Choose a conversation from the list to start chatting</p>
            </div>
          </div>
        )}

        {/* Column 3: Context Panel */}
        {selectedConversation && (
          <div className="w-80 bg-white dark:bg-slate-800 border-l border-gray-200 dark:border-slate-700 flex flex-col">
            {/* Tabs */}
            <div className="p-4 border-b border-gray-200 dark:border-slate-700">
              <div className="grid grid-cols-2 gap-1">
                {[
                  { id: 'profile', label: 'Profile' },
                  { id: 'agents', label: 'AI Agents' },
                  { id: 'timeline', label: 'Timeline' },
                  { id: 'notes', label: 'Notes' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setContextTab(tab.id as any)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      contextTab === tab.id
                        ? 'bg-primary text-white shadow-md'
                        : 'text-text-secondary dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {contextTab === 'profile' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">Name</label>
                    <p className="text-sm text-dark dark:text-white mt-1 font-semibold">{selectedConversation.name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">Channel</label>
                    <p className="text-sm text-dark dark:text-white mt-1">{selectedConversation.channel}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">AI Agent</label>
                    <p className="text-sm text-dark dark:text-white mt-1">{selectedConversation.aiAgent}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">Lifecycle Stage</label>
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
                      <p className="text-sm font-bold text-dark dark:text-white">Conversation started</p>
                      <p className="text-xs text-text-secondary dark:text-slate-400">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-1.5"></div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-dark dark:text-white">Assigned to {selectedConversation.aiAgent}</p>
                      <p className="text-xs text-text-secondary dark:text-slate-400">1 hour ago</p>
                    </div>
                  </div>
                </div>
              )}

              {contextTab === 'notes' && (
                <div>
                  <textarea
                    placeholder="Add notes about this contact..."
                    rows={10}
                    className="w-full px-3 py-2 bg-light-bg dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg resize-none text-dark dark:text-white placeholder:text-text-secondary dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  />
                </div>
              )}

              {contextTab === 'agents' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-4 border-2 border-primary/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg">
                        <Image
                          src="/rashed.jpeg"
                          alt="Rashed"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-extrabold text-dark dark:text-white text-base">Rashed</h3>
                        <p className="text-xs text-text-secondary dark:text-slate-400">Primary Agent</p>
                      </div>
                      <div className="w-3 h-3 bg-green rounded-full shadow-lg animate-pulse"></div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">Status</label>
                        <p className="text-sm text-dark dark:text-white mt-1 font-semibold">Active & Learning</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">Model</label>
                        <p className="text-sm text-dark dark:text-white mt-1">GPT-4 Turbo</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">Specialization</label>
                        <p className="text-sm text-dark dark:text-white mt-1">Customer Support & Sales</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">Response Time</label>
                        <p className="text-sm text-dark dark:text-white mt-1">~2 seconds avg</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">Success Rate</label>
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-dark dark:text-white">94%</span>
                            <span className="text-xs text-text-secondary dark:text-slate-400">Resolved</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                            <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full" style={{ width: '94%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
