'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Message } from '@/types/database'
import { MessageBubble } from './MessageBubble'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface MessageListClientProps {
  conversationId: string
  initialMessages: Message[]
}

type ConnectionState = 'connected' | 'disconnected' | 'connecting'

export function MessageListClient({ conversationId, initialMessages }: MessageListClientProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [error, setError] = useState<string | null>(null)
  const [connectionState, setConnectionState] = useState<ConnectionState>('connecting')
  const [showDisconnectedBanner, setShowDisconnectedBanner] = useState(false)
  const subscriptionRef = useRef<RealtimeChannel | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const disconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const supabase = createClient()

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Real-time subscription
  useEffect(() => {
    // Create real-time subscription
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          console.log('[Real-time] New message received:', payload.new)
          const newMessage = payload.new as Message

          // Use Set to deduplicate by id (handle race condition with initial fetch)
          setMessages((current) => {
            const messageIds = new Set(current.map(m => m.id))
            if (messageIds.has(newMessage.id)) {
              console.log('[Real-time] Message already exists, skipping:', newMessage.id)
              return current // Message already exists, skip
            }

            console.log('[Real-time] Adding new message to list:', newMessage.id)
            // Append new message and maintain sort order (created_at ascending)
            return [...current, newMessage].sort(
              (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            )
          })
        }
      )
      .subscribe((status) => {
        console.log('[Real-time] Subscription status:', status)
        if (status === 'SUBSCRIBED') {
          console.log('[Real-time] Successfully subscribed to conversation:', conversationId)
          setConnectionState('connected')
          setShowDisconnectedBanner(false)
          // Clear any pending disconnect timeout
          if (disconnectTimeoutRef.current) {
            clearTimeout(disconnectTimeoutRef.current)
            disconnectTimeoutRef.current = null
          }
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.error('[Real-time] Connection error:', status)
          setConnectionState('disconnected')
          // Delay showing banner to avoid flicker on quick reconnects
          disconnectTimeoutRef.current = setTimeout(() => {
            setShowDisconnectedBanner(true)
          }, 2000)
        }
      })

    subscriptionRef.current = channel

    // Cleanup subscription on unmount
    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current)
        subscriptionRef.current = null
      }
      if (disconnectTimeoutRef.current) {
        clearTimeout(disconnectTimeoutRef.current)
        disconnectTimeoutRef.current = null
      }
    }
  }, [conversationId, supabase])

  // Handle visibility change (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && connectionState === 'disconnected') {
        // Re-subscribe when tab regains focus and was disconnected
        if (subscriptionRef.current) {
          supabase.removeChannel(subscriptionRef.current)
        }

        const channel = supabase
          .channel(`messages:${conversationId}`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'messages',
              filter: `conversation_id=eq.${conversationId}`,
            },
            (payload) => {
              const newMessage = payload.new as Message

              setMessages((current) => {
                const messageIds = new Set(current.map(m => m.id))
                if (messageIds.has(newMessage.id)) {
                  return current
                }

                return [...current, newMessage].sort(
                  (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                )
              })
            }
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              setConnectionState('connected')
              setShowDisconnectedBanner(false)
              if (disconnectTimeoutRef.current) {
                clearTimeout(disconnectTimeoutRef.current)
                disconnectTimeoutRef.current = null
              }
            } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
              setConnectionState('disconnected')
              disconnectTimeoutRef.current = setTimeout(() => {
                setShowDisconnectedBanner(true)
              }, 2000)
            }
          })

        subscriptionRef.current = channel
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [conversationId, connectionState, supabase])

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-navy">
        <p className="text-text-secondary">No messages yet</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 relative">
      <div className="flex flex-col gap-2">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {/* Scroll target */}
        <div ref={messagesEndRef} />
      </div>

      {/* Connection status banner */}
      {showDisconnectedBanner && (
        <div className="sticky bottom-0 inset-x-0 bg-red-50 border-t border-red-200 px-4 py-2 text-sm text-red-700 flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Connection lost - trying to reconnect...</span>
        </div>
      )}
    </div>
  )
}
