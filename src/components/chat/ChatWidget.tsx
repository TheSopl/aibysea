'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const STORAGE_KEY = 'rashed-chat-conversation-id';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Restore conversationId from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setConversationId(stored);
    }
  }, []);

  // Save conversationId to localStorage when it changes
  useEffect(() => {
    if (conversationId) {
      localStorage.setItem(STORAGE_KEY, conversationId);
    }
  }, [conversationId]);

  // Load previous messages when chat opens and we have a conversation
  useEffect(() => {
    if (!isOpen || !conversationId || historyLoaded) return;

    const supabase = createClient();
    supabase
      .from('messages')
      .select('id, direction, content, created_at')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(50)
      .then(({ data }) => {
        if (data && data.length > 0) {
          const loaded: ChatMessage[] = data.map((msg: { id: string; direction: string; content: string; created_at: string }) => ({
            id: msg.id,
            role: msg.direction === 'inbound' ? 'user' as const : 'assistant' as const,
            content: msg.content,
            timestamp: msg.created_at,
          }));
          setMessages(loaded);
        }
        setHistoryLoaded(true);
      });
  }, [isOpen, conversationId, historyLoaded]);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Subscribe to realtime messages when we have a conversation
  useEffect(() => {
    if (!conversationId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`chat-widget-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const msg = payload.new as {
            id: string;
            direction: string;
            content: string;
            created_at: string;
            sender_type: string;
          };

          // Only add AI/agent responses (outbound messages)
          if (msg.direction === 'outbound') {
            setMessages(prev => {
              if (prev.some(m => m.id === msg.id)) return prev;
              return [...prev, {
                id: msg.id,
                role: 'assistant',
                content: msg.content,
                timestamp: msg.created_at,
              }];
            });
            setLoading(false);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '0px';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 96) + 'px';
    }
  }, [input]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const tempId = `temp-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: tempId,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          conversation_id: conversationId,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      const data = await res.json();

      if (!conversationId) {
        setConversationId(data.conversation_id);
      }

      setMessages(prev =>
        prev.map(m => m.id === tempId ? { ...m, id: data.message_id } : m)
      );
    } catch {
      setLoading(false);
      setMessages(prev => prev.filter(m => m.id !== tempId));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 end-4 sm:end-6 z-50 w-[calc(100vw-32px)] sm:w-[380px] h-[520px] max-h-[calc(100vh-120px)] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="relative px-4 py-3 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex-shrink-0">
            <div className="absolute top-0 start-0 end-0 h-[3px] bg-gradient-to-r from-primary to-accent" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-primary/20">
                  <Image src="/rashed-avatar.jpeg" alt="Rashed" width={36} height={36} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-dark dark:text-white">Rashed</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[11px] text-text-secondary dark:text-slate-400">AI Assistant</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X size={18} className="text-text-secondary dark:text-slate-400" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden mb-3 ring-2 ring-primary/20">
                  <Image src="/rashed-avatar.jpeg" alt="Rashed" width={64} height={64} className="w-full h-full object-cover" />
                </div>
                <h4 className="text-sm font-bold text-dark dark:text-white mb-1">Hi, I&apos;m Rashed!</h4>
                <p className="text-xs text-text-secondary dark:text-slate-400">
                  Your AI travel assistant. How can I help you today?
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${msg.role === 'assistant' ? 'flex gap-2' : ''}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-lg overflow-hidden flex-shrink-0 mt-0.5">
                      <Image src="/rashed-avatar.jpeg" alt="Rashed" width={24} height={24} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    <div
                      className={`px-3.5 py-2.5 text-[13px] leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-primary text-white rounded-2xl rounded-br-md'
                          : 'bg-gray-100 dark:bg-slate-700 text-dark dark:text-white rounded-2xl rounded-tl-md'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    </div>
                    <p className={`text-[10px] text-text-secondary dark:text-slate-500 mt-1 ${msg.role === 'user' ? 'text-end' : 'text-start'}`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-lg overflow-hidden flex-shrink-0 mt-0.5">
                    <Image src="/rashed-avatar.jpeg" alt="Rashed" width={24} height={24} className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-gray-100 dark:bg-slate-700 rounded-2xl rounded-tl-md px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex-shrink-0 p-3 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={1}
                className="flex-1 resize-none bg-gray-100 dark:bg-slate-700 rounded-xl px-3.5 py-2.5 text-[13px] text-dark dark:text-white placeholder:text-text-secondary dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[40px] max-h-[96px]"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="w-10 h-10 bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
              >
                <Send size={16} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bubble - Rashed's profile picture */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 end-4 sm:bottom-6 sm:end-6 z-50 w-[60px] h-[60px] rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-xl overflow-hidden ${
          isOpen ? 'ring-3 ring-primary' : 'ring-3 ring-white dark:ring-slate-700'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <div className="w-full h-full bg-gray-600 dark:bg-slate-600 flex items-center justify-center">
            <X size={24} className="text-white" />
          </div>
        ) : (
          <Image src="/rashed-avatar.jpeg" alt="Rashed - AI Assistant" width={60} height={60} className="w-full h-full object-cover" />
        )}
      </button>
    </>
  );
}
