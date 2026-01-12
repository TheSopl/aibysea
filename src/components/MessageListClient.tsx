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

export function MessageListClient({ conversationId, initialMessages }: MessageListClientProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [error, setError] = useState<string | null>(null)
  const subscriptionRef = useRef<RealtimeChannel | null>(null)
  const supabase = createClient()

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
          const newMessage = payload.new as Message

          // Use Set to deduplicate by id (handle race condition with initial fetch)
          setMessages((current) => {
            const messageIds = new Set(current.map(m => m.id))
            if (messageIds.has(newMessage.id)) {
              return current // Message already exists, skip
            }

            // Append new message and maintain sort order (created_at ascending)
            return [...current, newMessage].sort(
              (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            )
          })
        }
      )
      .subscribe()

    subscriptionRef.current = channel

    // Cleanup subscription on unmount
    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current)
        subscriptionRef.current = null
      }
    }
  }, [conversationId, supabase])

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">No messages yet</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="flex flex-col gap-2">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>
    </div>
  )
}
