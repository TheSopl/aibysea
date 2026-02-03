'use client';

import TopBar from '@/components/layout/TopBar';
import React, { useState, useEffect, useCallback } from 'react';
import { Search, MoreVertical, Paperclip, Send, Phone, Video, UserCheck, Bot, Smile, Image as ImageIcon, ArrowLeft, Info, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useTranslations } from 'next-intl';
import { usePageTitle } from '@/hooks/usePageTitle';

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

interface AIAgentBasic {
  id: string;
  name: string;
  model: string;
  status: string;
}

interface AIAgentFull extends AIAgentBasic {
  system_prompt: string | null;
  greeting_message: string | null;
  behaviors: Record<string, unknown>;
}

interface ConversationRaw {
  id: string;
  channel: string;
  status: string;
  handler_type: 'ai' | 'human';
  ai_agent_id: string | null;
  last_message_at: string | null;
  unread_count: number;
  contact: Contact | Contact[] | null;
  ai_agent: AIAgentBasic | AIAgentBasic[] | null;
  messages: { content: string }[];
}

interface Conversation {
  id: string;
  channel: string;
  status: string;
  handler_type: 'ai' | 'human';
  ai_agent_id: string | null;
  last_message_at: string | null;
  unread_count: number;
  contact: Contact | null;
  ai_agent: AIAgentBasic | null;
  messages: { content: string }[];
}

function normalizeContact(contact: Contact | Contact[] | null): Contact | null {
  if (!contact) return null;
  if (Array.isArray(contact)) return contact[0] || null;
  return contact;
}

function normalizeAIAgent(agent: AIAgentBasic | AIAgentBasic[] | null): AIAgentBasic | null {
  if (!agent) return null;
  if (Array.isArray(agent)) return agent[0] || null;
  return agent;
}

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

function getInitials(name: string | null, phone: string): string {
  if (name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
  return phone.slice(-2).toUpperCase();
}

function getContactDisplayName(name: string | null, phone: string | undefined): string {
  if (name) return name;
  if (!phone) return 'Unknown';
  if (phone.startsWith('telegram:')) {
    return `User ${phone.replace('telegram:', '')}`;
  }
  return phone;
}

export default function InboxPage() {
  usePageTitle('Inbox');
  const t = useTranslations('Inbox');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'assigned' | 'unassigned'>('all');
  const [contextTab, setContextTab] = useState<'profile' | 'timeline' | 'notes' | 'agents'>('profile');
  const [message, setMessage] = useState('');
  const [isAIMode, setIsAIMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [availableAgents, setAvailableAgents] = useState<AIAgentFull[]>([]);
  const [updatingAgent, setUpdatingAgent] = useState(false);
  const [showMobileContext, setShowMobileContext] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const supabase = createClient();

  const tabLabels: Record<'all' | 'assigned' | 'unassigned', string> = {
    all: t('all'),
    assigned: t('assigned'),
    unassigned: t('unassigned'),
  };

  const fetchConversations = useCallback(async () => {
    let data;
    let error;

    const result = await supabase
      .from('conversations')
      .select(`
        id,
        channel,
        status,
        handler_type,
        ai_agent_id,
        last_message_at,
        unread_count,
        contact:contacts(id, name, phone),
        ai_agent:ai_agents(id, name, model, status),
        messages(content, created_at)
      `)
      .order('last_message_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false, referencedTable: 'messages' })
      .limit(1, { referencedTable: 'messages' });

    data = result.data;
    error = result.error;

    if (error) {
      console.warn('Falling back to basic query (ai_agent_id column may not exist yet):', error.message);
      const fallbackResult = await supabase
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

      if (fallbackResult.error) {
        console.error('Error fetching conversations:', fallbackResult.error);
        setLoading(false);
        return;
      }

      const normalizedFallback = (fallbackResult.data as unknown as Omit<ConversationRaw, 'ai_agent_id' | 'ai_agent'>[]).map(conv => ({
        ...conv,
        ai_agent_id: null,
        ai_agent: null,
        unread_count: conv.unread_count || 0,
        contact: normalizeContact(conv.contact),
      }));

      setConversations(normalizedFallback as Conversation[]);
      setLoading(false);
      return;
    }

    const normalized = (data as unknown as ConversationRaw[]).map(conv => ({
      ...conv,
      unread_count: conv.unread_count || 0,
      contact: normalizeContact(conv.contact),
      ai_agent: normalizeAIAgent(conv.ai_agent),
    }));

    setConversations(normalized);
    setLoading(false);
  }, [supabase]);

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

  const fetchAvailableAgents = useCallback(async () => {
    try {
      const response = await fetch('/api/ai-agents?status=active');
      if (response.ok) {
        const data = await response.json();
        setAvailableAgents(data);
      }
    } catch (err) {
      console.error('Error fetching AI agents:', err);
    }
  }, []);

  const handleAgentChange = async (agentId: string | null) => {
    if (!selectedConversation || updatingAgent) return;

    setUpdatingAgent(true);
    const previousAgent = selectedConversation.ai_agent;
    const previousAgentId = selectedConversation.ai_agent_id;

    const newAgent = agentId ? availableAgents.find(a => a.id === agentId) || null : null;
    setSelectedConversation({
      ...selectedConversation,
      ai_agent_id: agentId,
      ai_agent: newAgent ? { id: newAgent.id, name: newAgent.name, model: newAgent.model, status: newAgent.status } : null,
    });
    setConversations(prev => prev.map(conv =>
      conv.id === selectedConversation.id
        ? { ...conv, ai_agent_id: agentId, ai_agent: newAgent ? { id: newAgent.id, name: newAgent.name, model: newAgent.model, status: newAgent.status } : null }
        : conv
    ));

    try {
      const { error } = await supabase
        .from('conversations')
        .update({ ai_agent_id: agentId })
        .eq('id', selectedConversation.id);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating AI agent:', err);
      setSelectedConversation({
        ...selectedConversation,
        ai_agent_id: previousAgentId,
        ai_agent: previousAgent,
      });
      setConversations(prev => prev.map(conv =>
        conv.id === selectedConversation.id
          ? { ...conv, ai_agent_id: previousAgentId, ai_agent: previousAgent }
          : conv
      ));
    } finally {
      setUpdatingAgent(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    fetchAvailableAgents();
  }, [fetchConversations, fetchAvailableAgents]);

  const markAsRead = useCallback(async (conversationId: string) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId ? { ...conv, unread_count: 0 } : conv
    ));
    await supabase
      .from('conversations')
      .update({ unread_count: 0 })
      .eq('id', conversationId);
  }, [supabase]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      setIsAIMode(selectedConversation.handler_type === 'ai');
      if (selectedConversation.unread_count > 0) {
        markAsRead(selectedConversation.id);
      }
    }
  }, [selectedConversation, fetchMessages, markAsRead]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchConversations();
    }, 3000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

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
          if (data.length !== prev.length || (data.length > 0 && prev.length > 0 && data[data.length - 1].id !== prev[prev.length - 1].id)) {
            return data as Message[];
          }
          return prev;
        });
      }
    };

    const interval = setInterval(pollMessages, 2000);
    return () => clearInterval(interval);
  }, [supabase, selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || !selectedConversation || sendingMessage) return;

    setSendingMessage(true);
    const content = message;
    setMessage('');

    try {
      const channel = selectedConversation.channel;
      let sendResult: { success?: boolean; template_required?: boolean; error?: string } = {};

      if (channel === 'whatsapp' && selectedConversation.contact?.phone) {
        const response = await fetch('/api/channels/whatsapp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: selectedConversation.contact.phone,
            message: content,
            conversation_id: selectedConversation.id,
            skip_handler_check: true,
          }),
        });
        sendResult = await response.json();
        console.log('[Inbox] WhatsApp send result:', sendResult, 'Status:', response.status);

        if (sendResult.template_required) {
          alert('24-hour messaging window expired. Template message required.');
          setMessage(content);
          setSendingMessage(false);
          return;
        }

        if (!sendResult.success) {
          console.error('WhatsApp send failed:', sendResult);
          alert(`Failed to send message: ${sendResult.error || 'Unknown error'}`);
          setMessage(content);
          setSendingMessage(false);
          return;
        }

        console.log('[Inbox] Message sent successfully');
      } else if (channel === 'telegram' && selectedConversation.contact?.phone) {
        const chatId = selectedConversation.contact.phone.replace('telegram:', '');
        const response = await fetch('/api/channels/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatId,
            message: content,
            conversation_id: selectedConversation.id,
            skip_handler_check: true,
          }),
        });
        sendResult = await response.json();

        if (!sendResult.success && sendResult.error) {
          console.error('Telegram send error:', sendResult.error);
        }
      }

      if (channel !== 'whatsapp') {
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
          console.error('Error saving message:', insertError);
        }
      }

      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', selectedConversation.id);

    } catch (err) {
      console.error('Error sending message:', err);
      setMessage(content);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleTakeover = async () => {
    if (!selectedConversation) return;

    const newMode = !isAIMode;
    const newHandlerType = newMode ? 'ai' : 'human';

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

  const formatMessageTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleMobileBack = () => {
    setSelectedConversation(null);
    setShowMobileContext(false);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title={t('title')} />

      <div className="flex flex-1 overflow-hidden relative">
        <div className={`w-full md:w-72 lg:w-80 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col flex-shrink-0 ${
          selectedConversation ? 'hidden md:flex' : 'flex'
        }`}>
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
                  className={`flex-1 px-3 py-2 min-h-[44px] rounded-lg text-xs font-bold transition-all shadow-lg border capitalize ${
                    activeTab === tab
                      ? ''
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600 border-gray-200 dark:border-slate-600'
                  }`}
                >
                  {tabLabels[tab]}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-slate-300" size={16} />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                className="w-full ps-10 pe-4 py-2.5 bg-light-bg dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-dark dark:text-white placeholder:text-text-secondary dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-text-secondary">{t('loading')}</div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-text-secondary">
                {t('noConversations')}
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`p-4 min-h-[72px] border-b border-gray-200 dark:border-slate-700 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-slate-700 active:bg-gray-100 dark:active:bg-slate-600 ${
                    selectedConversation?.id === conv.id ? 'bg-primary/5 border-s-4 border-s-primary shadow-lg' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
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
                          {conv.handler_type === 'ai' ? `🤖 ${t('aiHandler')}` : `👤 ${t('humanHandler')}`}
                        </span>
                        {conv.ai_agent ? (
                          <span className="text-xs px-2 py-0.5 bg-green/20 text-green-600 dark:text-green-400 rounded-md font-bold truncate max-w-[100px]" title={conv.ai_agent.name}>
                            {conv.ai_agent.name}
                          </span>
                        ) : conv.handler_type === 'ai' ? (
                          <span className="text-xs px-2 py-0.5 bg-service-documents-500/20 text-service-documents-600 dark:text-service-documents-400 rounded-md font-bold">
                            {t('noAgent')}
                          </span>
                        ) : null}
                      </div>

                      <p className="text-sm text-text-secondary dark:text-slate-300 truncate">
                        {conv.messages?.[0]?.content || t('noMessages')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {selectedConversation ? (
          <div className={`flex-1 bg-white dark:bg-slate-900 flex flex-col overflow-hidden ${
            showMobileContext ? 'hidden md:flex' : 'flex'
          }`}>
            <div className="p-2 md:p-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between bg-gradient-to-r from-white to-light-bg dark:from-slate-800 dark:to-slate-800">
              <div className="flex items-center gap-2 md:gap-3">
                <button
                  onClick={handleMobileBack}
                  className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <ArrowLeft size={20} className="text-dark dark:text-white" />
                </button>

                <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-dark dark:text-white font-bold shadow-lg text-sm md:text-base">
                  {getInitials(selectedConversation.contact?.name ?? null, selectedConversation.contact?.phone ?? '')}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-dark dark:text-white text-sm md:text-lg truncate max-w-[120px] md:max-w-none">
                    {getContactDisplayName(selectedConversation.contact?.name ?? null, selectedConversation.contact?.phone)}
                  </h3>
                  <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                    <span className="text-xs px-1.5 md:px-2 py-0.5 bg-accent/20 text-accent rounded-md font-bold capitalize">
                      {selectedConversation.channel}
                    </span>
                    <span className={`text-xs px-1.5 md:px-2 py-0.5 rounded-md font-bold ${
                      isAIMode ? 'bg-primary/20 text-primary' : 'bg-purple/20 text-purple'
                    }`}>
                      {isAIMode ? `🤖 ${t('aiHandler')}` : `👤 ${t('humanHandler')}`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 md:gap-2">
                <button
                  onClick={handleTakeover}
                  className={`px-2 md:px-4 py-1.5 md:py-2 rounded-lg font-bold text-xs md:text-sm transition-all duration-300 shadow-md hover:shadow-lg border ${
                    isAIMode
                      ? 'bg-purple-600 dark:bg-purple text-white hover:bg-purple-700 dark:hover:bg-purple/90 border-purple-700 dark:border-purple'
                      : 'bg-emerald-600 dark:bg-emerald-500 text-white hover:bg-emerald-700 dark:hover:bg-emerald-600 border-emerald-700 dark:border-emerald-500'
                  }`}
                >
                  {isAIMode ? (
                    <div className="flex items-center gap-1 md:gap-2">
                      <UserCheck size={14} className="md:w-4 md:h-4" />
                      <span className="hidden sm:inline">{t('takeOver')}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 md:gap-2">
                      <Bot size={14} className="md:w-4 md:h-4" />
                      <span className="hidden sm:inline">{t('returnToAI')}</span>
                    </div>
                  )}
                </button>

                <button
                  onClick={() => setShowMobileContext(true)}
                  className="lg:hidden p-2 min-h-[44px] min-w-[44px] hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Info size={20} className="text-text-secondary dark:text-slate-300" />
                </button>

                <button className="hidden lg:block p-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <Phone size={20} className="text-text-secondary dark:text-slate-300" />
                </button>
                <button className="hidden lg:block p-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <Video size={20} className="text-text-secondary dark:text-slate-300" />
                </button>
                <button className="p-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <MoreVertical size={20} className="text-text-secondary dark:text-slate-300" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4 bg-gray-100 dark:bg-slate-900 scroll-smooth">
              {messages.length === 0 ? (
                <div className="text-center text-text-secondary py-8">{t('noMessagesYet')}</div>
              ) : (
                messages.map((msg, index) => {
                  const animateFromIndex = Math.max(0, messages.length - 6);
                  const shouldAnimate = index >= animateFromIndex;
                  const animationIndex = index - animateFromIndex;

                  return (
                  <div
                    key={msg.id}
                    className={`flex ${msg.direction === 'inbound' ? 'justify-start' : 'justify-end'}`}
                    style={shouldAnimate ? {
                      animation: `fadeIn 0.4s ease-out ${animationIndex * 0.05}s both`
                    } : undefined}
                  >
                    <div className="max-w-[85%] sm:max-w-xs tablet:max-w-sm lg:max-w-md">
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
                            {t('aiAssistant')}
                          </div>
                        )}
                        {msg.direction === 'outbound' && msg.sender_type === 'agent' && (
                          <div className="text-xs font-bold text-dark/80 dark:text-white/90 mb-1 flex items-center gap-1">
                            <UserCheck size={14} />
                            {t('you')}
                          </div>
                        )}
                        <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                      </div>
                      <span className="text-xs text-text-secondary dark:text-slate-400 mt-1.5 block px-2">
                        {formatMessageTime(msg.created_at)}
                      </span>
                    </div>
                  </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-2 md:p-4 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              {!isAIMode && (
                <div className="mb-2 md:mb-3 px-2 md:px-3 py-1.5 md:py-2 bg-purple/10 border border-purple/30 rounded-lg">
                  <p className="text-xs font-bold text-purple flex items-center gap-2">
                    <UserCheck size={14} />
                    <span className="hidden sm:inline">{t('humanModeActive')}</span>
                    <span className="sm:hidden">{t('humanModeShort')}</span>
                  </p>
                </div>
              )}
              <div className="flex items-end gap-1 md:gap-3">
                <button className="hidden md:block p-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <Paperclip size={20} className="text-text-secondary dark:text-slate-300" />
                </button>
                <button className="hidden md:block p-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <ImageIcon size={20} className="text-text-secondary dark:text-slate-300" />
                </button>
                <button className="hidden md:block p-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <Smile size={20} className="text-text-secondary dark:text-slate-300" />
                </button>

                <button className="md:hidden p-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <Paperclip size={18} className="text-text-secondary dark:text-slate-300" />
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
                    placeholder={t('typeMessage')}
                    rows={1}
                    className="w-full px-3 md:px-4 py-2 md:py-3 bg-light-bg dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl resize-none text-dark dark:text-white placeholder:text-text-secondary dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm md:text-base"
                  />
                </div>

                <button
                  onClick={handleSend}
                  disabled={sendingMessage || !message.trim()}
                  className="px-3 md:px-6 py-2 md:py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-1 md:gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                >
                  <Send size={16} className="md:w-[18px] md:h-[18px]" />
                  <span className="hidden sm:inline">{sendingMessage ? t('sending') : t('send')}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 bg-gradient-to-br from-light-bg to-white dark:from-slate-900 dark:to-slate-900 items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full flex items-center justify-center">
                <Bot size={48} className="text-primary" />
              </div>
              <h3 className="text-heading-2 font-extrabold text-dark dark:text-white mb-2">{t('selectConversation')}</h3>
              <p className="text-text-secondary dark:text-slate-300">{t('selectConversationHint')}</p>
            </div>
          </div>
        )}

        {selectedConversation && (
          <>
            {showMobileContext && (
              <div
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setShowMobileContext(false)}
              />
            )}
            <div className={`
              fixed lg:relative inset-y-0 end-0 w-full max-w-sm lg:w-80
              bg-white dark:bg-slate-800 border-s border-gray-200 dark:border-slate-700
              flex-col overflow-hidden flex-shrink-0 z-50
              transform transition-transform duration-300 ease-out
              ${showMobileContext ? 'flex translate-x-0' : 'hidden lg:flex lg:translate-x-0'}
            `}>
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
              <h3 className="font-bold text-dark dark:text-white">{t('details')}</h3>
              <button
                onClick={() => setShowMobileContext(false)}
                className="p-2 min-h-[44px] min-w-[44px] hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center"
              >
                <X size={20} className="text-dark dark:text-white" />
              </button>
            </div>

            <div className="p-4 border-b border-gray-200 dark:border-slate-700">
              <div className="grid grid-cols-2 gap-1">
                {[
                  { id: 'profile', label: t('profile') },
                  { id: 'agents', label: t('aiAgents') },
                  { id: 'timeline', label: t('timeline') },
                  { id: 'notes', label: t('notes') }
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

            <div className="flex-1 overflow-y-auto p-4 bg-light-bg dark:bg-slate-900">
              {contextTab === 'profile' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl p-4 border border-primary/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {getInitials(selectedConversation.contact?.name ?? null, selectedConversation.contact?.phone ?? '')}
                      </div>
                      <div>
                        <h3 className="font-bold text-dark dark:text-white text-base">
                          {getContactDisplayName(selectedConversation.contact?.name ?? null, selectedConversation.contact?.phone)}
                        </h3>
                        <p className="text-xs text-text-secondary dark:text-slate-400">Contact Profile</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700 space-y-3">
                    <div className="pb-3 border-b border-gray-200 dark:border-slate-700">
                      <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">{t('phoneId')}</label>
                      <p className="text-sm text-dark dark:text-white mt-1.5 font-medium">
                        {selectedConversation.contact?.phone?.replace('telegram:', '') || 'N/A'}
                      </p>
                    </div>
                    <div className="pb-3 border-b border-gray-200 dark:border-slate-700">
                      <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">{t('channel')}</label>
                      <p className="text-sm text-dark dark:text-white mt-1.5 capitalize font-medium">{selectedConversation.channel}</p>
                    </div>
                    <div className="pb-3 border-b border-gray-200 dark:border-slate-700">
                      <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">{t('status')}</label>
                      <p className="text-sm text-dark dark:text-white mt-1.5 capitalize font-medium">{selectedConversation.status}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">{t('handler')}</label>
                      <p className="text-sm text-dark dark:text-white mt-1.5 font-medium">
                        {selectedConversation.handler_type === 'ai' ? `🤖 ${t('aiAgent')}` : `👤 ${t('humanAgent')}`}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {contextTab === 'timeline' && (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-dark dark:text-white">{t('conversationStarted')}</p>
                      <p className="text-xs text-text-secondary dark:text-slate-400">
                        {selectedConversation.last_message_at
                          ? new Date(selectedConversation.last_message_at).toLocaleString()
                          : t('unknown')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {contextTab === 'notes' && (
                <div>
                  <textarea
                    placeholder={t('addNotes')}
                    rows={10}
                    className="w-full px-3 py-2 bg-light-bg dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg resize-none text-dark dark:text-white placeholder:text-text-secondary dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  />
                </div>
              )}

              {contextTab === 'agents' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider block mb-2">
                      {t('assignedAIAgent')}
                    </label>
                    <select
                      value={selectedConversation.ai_agent_id || ''}
                      onChange={(e) => handleAgentChange(e.target.value || null)}
                      disabled={updatingAgent}
                      className="w-full px-3 py-2.5 bg-light-bg dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">{t('noAgentAssigned')}</option>
                      {availableAgents.map(agent => (
                        <option key={agent.id} value={agent.id}>
                          {agent.name} ({agent.model})
                        </option>
                      ))}
                    </select>
                    {updatingAgent && (
                      <p className="text-xs text-text-secondary dark:text-slate-400 mt-1">{t('updating')}</p>
                    )}
                  </div>

                  {selectedConversation.ai_agent ? (
                    <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-4 border-2 border-primary/20">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                          <Bot size={24} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-extrabold text-dark dark:text-white text-base">{selectedConversation.ai_agent.name}</h3>
                          <p className="text-xs text-text-secondary dark:text-slate-400">{t('aiAgent')}</p>
                        </div>
                        <div className={`w-3 h-3 rounded-full shadow-lg ${
                          selectedConversation.ai_agent.status === 'active' && isAIMode ? 'bg-green animate-pulse' : 'bg-gray-400'
                        }`}></div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">{t('status')}</label>
                          <p className="text-sm text-dark dark:text-white mt-1 font-semibold">
                            {!isAIMode ? 'Paused (Human Mode)' :
                             selectedConversation.ai_agent.status === 'active' ? 'Active & Handling' : 'Inactive'}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">Model</label>
                          <p className="text-sm text-dark dark:text-white mt-1">{selectedConversation.ai_agent.model}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-service-documents-500/10 rounded-xl p-4 border-2 border-service-documents-500/20">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-service-documents-500/20 flex items-center justify-center">
                          <Bot size={24} className="text-service-documents-500" />
                        </div>
                        <div>
                          <h3 className="font-bold text-dark dark:text-white text-sm">{t('noAgentAssignedTitle')}</h3>
                          <p className="text-xs text-text-secondary dark:text-slate-400">
                            {t('selectAgentHint')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-text-secondary dark:text-slate-400 text-center">
                    {availableAgents.length} active agent{availableAgents.length !== 1 ? 's' : ''} available
                  </p>
                </div>
              )}
            </div>
          </div>
          </>
        )}
      </div>
    </div>
  );
}
