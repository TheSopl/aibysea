import { createAdminClient } from '@/lib/supabase/admin';
import type { TelegramUpdate, TelegramMessage } from '@/features/channels/telegram/lib/types';
import { triggerN8nWorkflow } from '@/lib/n8n/trigger';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseAdmin = any;

// AI Agent type for context
interface AIAgentContext {
  id: string;
  name: string;
  model: string;
  system_prompt: string | null;
  greeting_message: string | null;
  behaviors: Record<string, unknown>;
}

export async function processTelegramUpdate(update: TelegramUpdate): Promise<void> {
  try {
    // Only process message updates for now
    if (!update.message) {
      console.log('[Telegram Processor] Skipping non-message update');
      return;
    }

    await processIncomingMessage(update.message);
  } catch (error) {
    console.error('[Telegram Processor] Error:', error);
  }
}

async function processIncomingMessage(message: TelegramMessage): Promise<void> {
  const supabase: SupabaseAdmin = createAdminClient();

  // Use chat.id as unique identifier (as string for consistency)
  const chatId = message.chat.id.toString();
  const messageId = message.message_id.toString();

  // Build contact name from Telegram user info
  // Priority: first_name + last_name > username > chat.first_name
  let contactName: string | null = null;
  if (message.from) {
    const fullName = [message.from.first_name, message.from.last_name].filter(Boolean).join(' ');
    contactName = fullName || (message.from.username ? `@${message.from.username}` : null);
  }
  if (!contactName && message.chat.first_name) {
    contactName = message.chat.first_name;
  }
  if (!contactName && message.chat.username) {
    contactName = `@${message.chat.username}`;
  }

  console.log('[Telegram Processor] Processing message:', {
    chatId,
    messageId,
    from: contactName,
  });

  try {
    // Step 1: Find or create contact (using chat_id as phone equivalent)
    const contact = await findOrCreateContact(supabase, chatId, contactName);

    // Step 2: Find or create conversation
    const conversation = await findOrCreateConversation(supabase, contact.id);

    // Step 3: Check for duplicate
    const isDuplicate = await checkDuplicateMessage(supabase, `tg_${chatId}_${messageId}`);
    if (isDuplicate) {
      console.log('[Telegram Processor] Duplicate message, skipping');
      return;
    }

    // Step 4: Extract content
    const content = message.text || '[Non-text message]';

    // Check if AI should process this message
    const shouldProcessWithAI = conversation.handler_type === 'ai';

    // Step 5: Fetch AI agent context if assigned
    const aiAgent = await getConversationAIAgent(supabase, conversation.id);

    // Step 6: Insert message with handler info and AI agent context for n8n
    const { data: insertedMessage, error: insertError } = await supabase.from('messages').insert({
      conversation_id: conversation.id,
      direction: 'inbound',
      content,
      content_type: 'text',
      sender_type: 'customer',
      whatsapp_message_id: `tg_${chatId}_${messageId}`, // Reuse field for dedup
      metadata: {
        telegram_chat_id: chatId,
        telegram_message_id: messageId,
        telegram_user: message.from,
        timestamp: message.date,
        handler_type: conversation.handler_type,
        should_process_ai: shouldProcessWithAI,
        ai_agent: aiAgent ? JSON.parse(JSON.stringify(aiAgent)) : null,
      },
    }).select('id').single();

    if (insertError || !insertedMessage) {
      console.error('[Telegram Processor] Insert error:', insertError);
      return;
    }

    console.log('[Telegram Processor] Message saved');

    // Trigger n8n workflow for AI processing (fire-and-forget)
    if (shouldProcessWithAI) {
      const phone = `telegram:${chatId}`;
      triggerN8nWorkflow({
        conversation_id: conversation.id,
        message_id: insertedMessage.id,
        customer_message: content,
        channel: 'telegram',
        contact: { id: contact.id, phone, name: contact.name },
        ai_agent: aiAgent,
      }).catch(err => console.error('[Telegram Processor] n8n trigger error:', err));
    } else {
      console.log('[Telegram Processor] Skipping n8n trigger (human mode)');
    }

    // Step 6: Update conversation timestamps
    const now = new Date().toISOString();
    await supabase
      .from('conversations')
      .update({ last_message_at: now, last_customer_message_at: now })
      .eq('id', conversation.id);

    // Step 7: Update contact name if we have one and it's different
    if (contactName && contactName !== contact.name) {
      await supabase
        .from('contacts')
        .update({ name: contactName })
        .eq('id', contact.id);
      console.log('[Telegram Processor] Updated contact name:', contactName);
    }
  } catch (error) {
    console.error('[Telegram Processor] Error:', error);
  }
}

/**
 * Fetch the AI agent assigned to a conversation.
 * Returns the agent context if one is assigned, null otherwise.
 */
async function getConversationAIAgent(
  supabase: SupabaseAdmin,
  conversationId: string
): Promise<AIAgentContext | null> {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      ai_agent_id,
      ai_agent:ai_agents(id, name, model, system_prompt, greeting_message, behaviors)
    `)
    .eq('id', conversationId)
    .single();

  if (error || !data?.ai_agent) {
    return null;
  }

  // Handle array response from Supabase join
  const agent = Array.isArray(data.ai_agent) ? data.ai_agent[0] : data.ai_agent;
  return agent || null;
}

async function findOrCreateContact(
  supabase: SupabaseAdmin,
  chatId: string,
  name: string | null
): Promise<{ id: string; name: string | null }> {
  // Use telegram:{chat_id} as phone to distinguish from WhatsApp
  const phone = `telegram:${chatId}`;

  const { data: existing } = await supabase
    .from('contacts')
    .select('id, name')
    .eq('phone', phone)
    .single();

  if (existing) return existing;

  const { data: newContact, error } = await supabase
    .from('contacts')
    .insert({ phone, name, metadata: { telegram_chat_id: chatId } })
    .select('id, name')
    .single();

  if (error || !newContact) {
    throw new Error(`Failed to create contact: ${error?.message}`);
  }

  console.log('[Telegram Processor] Created contact:', phone);
  return newContact;
}

async function findOrCreateConversation(
  supabase: SupabaseAdmin,
  contactId: string
): Promise<{ id: string; handler_type: string }> {
  const { data: existing } = await supabase
    .from('conversations')
    .select('id, handler_type')
    .eq('contact_id', contactId)
    .eq('channel', 'telegram')
    .single();

  if (existing) return existing;

  const now = new Date().toISOString();
  const { data: newConv, error } = await supabase
    .from('conversations')
    .insert({
      contact_id: contactId,
      channel: 'telegram',
      status: 'active',
      handler_type: 'ai',
      last_message_at: now,
      last_customer_message_at: now,
    })
    .select('id, handler_type')
    .single();

  if (error || !newConv) {
    throw new Error(`Failed to create conversation: ${error?.message}`);
  }

  console.log('[Telegram Processor] Created conversation');
  return newConv;
}

async function checkDuplicateMessage(
  supabase: SupabaseAdmin,
  messageKey: string
): Promise<boolean> {
  const { data } = await supabase
    .from('messages')
    .select('id')
    .eq('whatsapp_message_id', messageKey)
    .limit(1);

  return (data?.length ?? 0) > 0;
}
