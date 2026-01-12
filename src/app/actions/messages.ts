'use server'

import { createClient } from '@/lib/supabase/server'
import { sendTextMessage, isWithin24HourWindow } from '@/lib/whatsapp/client'
import { sendTelegramMessage } from '@/lib/telegram/client'
import type { NewMessage } from '@/types/database'

interface SendMessageResult {
  success: boolean
  error?: string
}

interface ConversationWithContact {
  id: string
  channel: string
  last_customer_message_at: string | null
  contact: {
    phone: string
  } | null
}

/**
 * Send a message from an agent to a customer.
 * Handles both WhatsApp and Telegram channels.
 */
export async function sendMessage(
  conversationId: string,
  content: string
): Promise<SendMessageResult> {
  // Validate content
  if (!content || content.trim().length === 0) {
    return { success: false, error: 'Message cannot be empty' }
  }

  const trimmedContent = content.trim()

  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error('[SendMessage] Auth error:', authError)
      return { success: false, error: 'Not authenticated' }
    }

    // Get or create agent record
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let { data: agent, error: agentError } = await (supabase as any)
      .from('agents')
      .select('id')
      .eq('id', user.id)
      .single() as { data: { id: string } | null; error: unknown }

    // If agent doesn't exist, create it
    if (agentError || !agent) {
      console.log('[SendMessage] Agent not found, creating:', user.id)
      const agentName = user.user_metadata?.name || user.email?.split('@')[0] || 'Agent'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: newAgent, error: createError } = await (supabase as any)
        .from('agents')
        .insert({
          id: user.id,
          email: user.email!,
          name: agentName,
        })
        .select('id')
        .single() as { data: { id: string } | null; error: unknown }

      if (createError || !newAgent) {
        console.error('[SendMessage] Failed to create agent:', createError)
        return { success: false, error: 'Failed to create agent record' }
      }
      agent = newAgent
    }

    // Fetch conversation with contact
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error: convError } = await (supabase as any)
      .from('conversations')
      .select(`
        id,
        channel,
        last_customer_message_at,
        contact:contacts(phone)
      `)
      .eq('id', conversationId)
      .single() as { data: ConversationWithContact | null; error: unknown }

    if (convError || !data) {
      console.error('[SendMessage] Conversation not found:', convError)
      return { success: false, error: 'Conversation not found' }
    }

    const conversation = data
    const phone = conversation.contact?.phone

    if (!phone) {
      return { success: false, error: 'Contact phone not found' }
    }

    // Send message based on channel
    if (conversation.channel === 'whatsapp') {
      // Check 24h window for WhatsApp
      if (!isWithin24HourWindow(conversation.last_customer_message_at)) {
        return {
          success: false,
          error: '24-hour window expired. Use a message template.'
        }
      }

      // Phone is already in correct format (raw WhatsApp number)
      await sendTextMessage(phone, trimmedContent)
    } else if (conversation.channel === 'telegram') {
      // Extract chat_id from phone (format: "telegram:{chat_id}")
      const chatId = phone.replace('telegram:', '')
      await sendTelegramMessage(chatId, trimmedContent)
    } else {
      return { success: false, error: `Unsupported channel: ${conversation.channel}` }
    }

    // Insert message to database
    const messageData: NewMessage = {
      conversation_id: conversationId,
      direction: 'outbound',
      content: trimmedContent,
      content_type: 'text',
      sender_type: 'agent',
      sender_id: agent.id,
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (supabase as any)
      .from('messages')
      .insert(messageData)

    if (insertError) {
      console.error('[SendMessage] Failed to insert message:', insertError)
      // Message was sent but not stored - log for debugging
      // Continue as success since message was delivered
    }

    // Update conversation last_message_at
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversationId)

    if (updateError) {
      console.error('[SendMessage] Failed to update conversation:', updateError)
    }

    return { success: true }
  } catch (error) {
    console.error('[SendMessage] Send failed:', error)
    const message = error instanceof Error ? error.message : 'Failed to send message'
    return { success: false, error: message }
  }
}
