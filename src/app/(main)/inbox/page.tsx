'use client';

import TopBar from '@/components/layout/TopBar';
import Image from 'next/image';
import React, { useState, useEffect, useCallback } from 'react';
import { Search, MoreVertical, Paperclip, Send, Phone, Video, UserCheck, Bot, Smile, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

// Types
interface Contact {
  id: string;
  name: string | null;
  phone: string;
}

interface Message {
  id: string;
  content: string;
  direction: 'inbound' | 'outbound';
  sender_type: 'customer' | 'ai' | 'agent';
  created_at: string;
}

interface ConversationRaw {
  id: string;
  channel: string;
  status: string;
  handler_type: 'ai' | 'human';
  last_message_at: string | null;
  unread_count: number;
  contact: Contact | Contact[] | null;
  messages: { content: string }[];
}

interface Conversation {
  id: string;
  channel: string;
  status: string;
  handler_type: 'ai' | 'human';
  last_message_at: string | null;
  unread_count: number;
  contact: Contact | null;
  messages: { content: string }[];
}

// Helper to normalize contact from Supabase (can be array or object)
function normalizeContact(contact: Contact | Contact[] | null): Contact | null {
  if (!contact) return null;
  if (Array.isArray(contact)) return contact[0] || null;
  return contact;
}

// Helper to format time ago
function timeAgo(dateString: string | null): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

// Helper to get initials
function getInitials(name: string | null, phone: string): string {
  if (name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
  return phone.slice(-2).toUpperCase();
}

// Helper to format contact display name
function getContactDisplayName(name: string | null, phone: string | undefined): string {
  if (name) return name;
  if (!phone) return 'Unknown';
  // Strip telegram: prefix for cleaner display
  if (phone.startsWith('telegram:')) {
    return `User ${phone.replace('telegram:', '')}`;
  }
  return phone;
}

export default function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'assigned' | 'unassigned'>('all');
  const [contextTab, setContextTab] = useState<'profile' | 'timeline' | 'notes' | 'agents'>('profile');
  const [message, setMessage] = useState('');
  const [isAIMode, setIsAIMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const supabase = createClient();

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        id,
        channel,
        status,
        handler_type,
        last_message_at,
        unread_count,
        contact:contacts(id, name, phone),
        messages(content, created_at)
      `)
      .order('last_message_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false, referencedTable: 'messages' })
      .limit(1, { referencedTable: 'messages' });

    if (error) {
      console.error('Error fetching conversations:', error);
      return;
    }

    // Normalize contacts (Supabase returns array for joins)
    const normalized = (data as unknown as ConversationRaw[]).map(conv => ({
      ...conv,
      unread_count: conv.unread_count || 0,
      contact: normalizeContact(conv.contact),
    }));

    setConversations(normalized);
    setLoading(false);
  }, [supabase]);

  // Fetch messages for selected conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('id, content, direction, sender_type, created_at')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    setMessages(data as Message[]);
  }, [supabase]);

  // Initial fetch
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Mark conversation as read
  const markAsRead = useCallback(async (conversationId: string) => {
    // Update local state immediately to remove badge
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId ? { ...conv, unread_count: 0 } : conv
    ));
    // Update database
    await supabase
      .from('conversations')
      .update({ unread_count: 0 })
      .eq('id', conversationId);
  }, [supabase]);

  // Fetch messages when conversation selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      setIsAIMode(selectedConversation.handler_type === 'ai');
      // Mark as read when opening conversation
      if (selectedConversation.unread_count > 0) {
        markAsRead(selectedConversation.id);
      }
    }
  }, [selectedConversation, fetchMessages, markAsRead]);

  // Fast polling for conversations (3 seconds) - updates list order and timestamps
  useEffect(() => {
    const interval = setInterval(() => {
      fetchConversations();
    }, 3000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  // Real-time subscription for conversations and messages (for reordering)
  useEffect(() => {
    const channelName = `inbox-list-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversations' },
        (payload) => {
          console.log('[Realtime] Conversation change:', payload.eventType);
          fetchConversations();
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          console.log('[Realtime] New message inserted');
          // Refetch conversations to update order and unread counts
          fetchConversations();
        }
      )
      .subscribe((status) => {
        console.log('[Realtime] Subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchConversations]);

  // Real-time subscription for messages in selected conversation
  useEffect(() => {
    if (!selectedConversation) return;

    const channelName = `inbox-chat-${selectedConversation.id}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversation.id}`
        },
        (payload) => {
          console.log('[Realtime] New message in chat:', payload.new);
          const newMsg = payload.new as Message;
          setMessages(prev => {
            // Avoid duplicates
            if (prev.some(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe((status) => {
        console.log('[Realtime] Chat subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, selectedConversation]);

  // Fast polling for messages (2 second backup if realtime is slow)
  useEffect(() => {
    if (!selectedConversation) return;

    const pollMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('id, content, direction, sender_type, created_at')
        .eq('conversation_id', selectedConversation.id)
        .order('created_at', { ascending: true });

      if (data) {
        setMessages(prev => {
          // Only update if there are new messages
          if (data.length !== prev.length || (data.length > 0 && prev.length > 0 && data[data.length - 1].id !== prev[prev.length - 1].id)) {
            return data as Message[];
          }
          return prev;
        });
      }
    };

    // Poll every 2 seconds for fast updates
    const interval = setInterval(pollMessages, 2000);
    return () => clearInterval(interval);
  }, [supabase, selectedConversation]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  // Send message
  const handleSend = async () => {
    if (!message.trim() || !selectedConversation || sendingMessage) return;

    setSendingMessage(true);
    const content = message;
    setMessage('');

    try {
      // Insert message to database
      const { error: insertError } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation.id,
          direction: 'outbound',
          content,
          content_type: 'text',
          sender_type: 'agent',
        });

      if (insertError) {
        console.error('Error sending message:', insertError);
        setMessage(content); // Restore message on error
        return;
      }

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', selectedConversation.id);

      // Send to Telegram if channel is telegram
      if (selectedConversation.channel === 'telegram' && selectedConversation.contact?.phone) {
        const chatId = selectedConversation.contact.phone.replace('telegram:', '');
        await fetch('/api/telegram/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chatId, message: content }),
        });
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setMessage(content);
    } finally {
      setSendingMessage(false);
    }
  };

  // Handle takeover toggle
  const handleTakeover = async () => {
    if (!selectedConversation) return;

    const newMode = !isAIMode;
    const newHandlerType = newMode ? 'ai' : 'human';

    // Update in database
    const { error } = await supabase
      .from('conversations')
      .update({ handler_type: newHandlerType })
      .eq('id', selectedConversation.id);

    if (error) {
      console.error('Error updating handler type:', error);
      return;
    }

    setIsAIMode(newMode);
    setSelectedConversation({ ...selectedConversation, handler_type: newHandlerType });

    // Notify n8n about takeover
    fetch('/api/webhooks/n8n/human-takeover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversation_id: selectedConversation.id,
        handler_type: newHandlerType,
        timestamp: new Date().toISOString(),
      }),
    }).catch(err => console.error('Failed to notify n8n:', err));
  };

  // Format message timestamp
  const formatMessageTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Inbox" />

      <div className="flex flex-1 overflow-hidden">
        {/* Column 1: Conversation List */}
        <div className="w-80 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col flex-shrink-0">
          {/* Filter Tabs */}
          <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <div className="flex gap-2 mb-4">
              {(['all', 'assigned', 'unassigned'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={activeTab === tab ? {
                    background: 'linear-gradient(to right, #003EF3, #4EB6C9)',
                    color: '#FFFFFF',
                    borderColor: '#003EF3'
                  } : {}}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-lg border capitalize ${
                    activeTab === tab
                      ? ''
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600 border-gray-200 dark:border-slate-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
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
            {loading ? (
              <div className="p-4 text-center text-text-secondary">Loading...</div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-text-secondary">
                No conversations yet. They will appear here when messages arrive.
              </div>
            ) : (
              conversations.map((conv, index) => (
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
                      {getInitials(conv.contact?.name ?? null, conv.contact?.phone ?? '')}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-dark dark:text-white text-sm">
                            {getContactDisplayName(conv.contact?.name ?? null, conv.contact?.phone)}
                          </span>
                          {conv.unread_count > 0 && selectedConversation?.id !== conv.id && (
                            <span className="min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                              {conv.unread_count > 99 ? '99+' : conv.unread_count}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-text-secondary dark:text-slate-300">
                          {timeAgo(conv.last_message_at)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                        <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent rounded-md font-bold capitalize">
                          {conv.channel}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                          conv.handler_type === 'ai' ? 'bg-primary/20 text-primary' : 'bg-purple/20 text-purple'
                        }`}>
                          {conv.handler_type === 'ai' ? '🤖 AI' : '👤 Human'}
                        </span>
                      </div>

                      <p className="text-sm text-text-secondary dark:text-slate-300 truncate">
                        {conv.messages?.[0]?.content || 'No messages'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Chat Thread */}
        {selectedConversation ? (
          <div className="flex-1 bg-white dark:bg-slate-900 flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between bg-gradient-to-r from-white to-light-bg dark:from-slate-800 dark:to-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-dark dark:text-white font-bold shadow-lg">
                  {getInitials(selectedConversation.contact?.name ?? null, selectedConversation.contact?.phone ?? '')}
                </div>
                <div>
                  <h3 className="font-bold text-dark dark:text-white text-lg">
                    {getContactDisplayName(selectedConversation.contact?.name ?? null, selectedConversation.contact?.phone)}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent rounded-md font-bold capitalize">
                      {selectedConversation.channel}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                      isAIMode ? 'bg-primary/20 text-primary' : 'bg-purple/20 text-purple'
                    }`}>
                      {isAIMode ? '🤖 AI Mode' : '👤 Human Mode'}
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
              {messages.length === 0 ? (
                <div className="text-center text-text-secondary py-8">No messages yet</div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.direction === 'inbound' ? 'justify-start' : 'justify-end'}`}
                    style={{
                      animation: `fadeIn 0.4s ease-out ${index * 0.05}s both`
                    }}
                  >
                    <div className="max-w-md">
                      <div className={`px-4 py-3 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                        msg.direction === 'inbound'
                          ? 'bg-white dark:bg-slate-800 text-dark dark:text-white border border-gray-200 dark:border-slate-700'
                          : msg.sender_type === 'ai'
                          ? 'bg-gradient-to-br from-primary to-primary/90 text-dark dark:text-white'
                          : 'bg-gradient-to-br from-purple to-purple/90 text-dark dark:text-white'
                      }`}>
                        {msg.direction === 'outbound' && msg.sender_type === 'ai' && (
                          <div className="text-xs font-bold text-dark/80 dark:text-white/90 mb-1 flex items-center gap-1">
                            <Bot size={14} />
                            AI Assistant
                          </div>
                        )}
                        {msg.direction === 'outbound' && msg.sender_type === 'agent' && (
                          <div className="text-xs font-bold text-dark/80 dark:text-white/90 mb-1 flex items-center gap-1">
                            <UserCheck size={14} />
                            You
                          </div>
                        )}
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                      <span className="text-xs text-text-secondary dark:text-slate-400 mt-1.5 block px-2">
                        {formatMessageTime(msg.created_at)}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              {!isAIMode && (
                <div className="mb-3 px-3 py-2 bg-purple/10 border border-purple/30 rounded-lg">
                  <p className="text-xs font-bold text-purple flex items-center gap-2">
                    <UserCheck size={14} />
                    You&apos;re in Human Mode - AI is paused for this conversation
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
                  disabled={sendingMessage || !message.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                  {sendingMessage ? 'Sending...' : 'Send'}
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
          <div className="w-80 bg-white dark:bg-slate-800 border-l border-gray-200 dark:border-slate-700 flex flex-col overflow-hidden flex-shrink-0">
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
                    onClick={() => setContextTab(tab.id as typeof contextTab)}
                    style={contextTab === tab.id ? {
                      background: 'linear-gradient(to right, #003EF3, #4EB6C9)',
                      color: '#FFFFFF',
                      borderColor: '#003EF3'
                    } : {}}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-md border ${
                      contextTab === tab.id
                        ? ''
                        : 'text-text-secondary dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 border-transparent'
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
                    <p className="text-sm text-dark dark:text-white mt-1 font-semibold">
                      {getContactDisplayName(selectedConversation.contact?.name ?? null, selectedConversation.contact?.phone)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">Phone/ID</label>
                    <p className="text-sm text-dark dark:text-white mt-1">
                      {selectedConversation.contact?.phone?.replace('telegram:', '') || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">Channel</label>
                    <p className="text-sm text-dark dark:text-white mt-1 capitalize">{selectedConversation.channel}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">Status</label>
                    <p className="text-sm text-dark dark:text-white mt-1 capitalize">{selectedConversation.status}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">Handler</label>
                    <p className="text-sm text-dark dark:text-white mt-1">
                      {selectedConversation.handler_type === 'ai' ? '🤖 AI Agent' : '👤 Human Agent'}
                    </p>
                  </div>
                </div>
              )}

              {contextTab === 'timeline' && (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-dark dark:text-white">Conversation started</p>
                      <p className="text-xs text-text-secondary dark:text-slate-400">
                        {selectedConversation.last_message_at
                          ? new Date(selectedConversation.last_message_at).toLocaleString()
                          : 'Unknown'}
                      </p>
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
                      <div className={`w-3 h-3 rounded-full shadow-lg ${isAIMode ? 'bg-green animate-pulse' : 'bg-gray-400'}`}></div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">Status</label>
                        <p className="text-sm text-dark dark:text-white mt-1 font-semibold">
                          {isAIMode ? 'Active & Handling' : 'Paused (Human Mode)'}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">Model</label>
                        <p className="text-sm text-dark dark:text-white mt-1">GPT-4 Turbo</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">Specialization</label>
                        <p className="text-sm text-dark dark:text-white mt-1">Customer Support & Sales</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
