import { createAdminClient } from '@/lib/supabase/admin';
import type { TelegramUpdate, TelegramMessage } from '@/lib/telegram/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseAdmin = any;

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
  const contactName = message.from
    ? [message.from.first_name, message.from.last_name].filter(Boolean).join(' ')
    : message.chat.first_name || null;

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

    // Step 5: Insert message
    const { error: insertError } = await supabase.from('messages').insert({
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
      },
    });

    if (insertError) {
      console.error('[Telegram Processor] Insert error:', insertError);
      return;
    }

    console.log('[Telegram Processor] Message saved');

    // Step 6: Update conversation timestamps
    const now = new Date().toISOString();
    await supabase
      .from('conversations')
      .update({ last_message_at: now, last_customer_message_at: now })
      .eq('id', conversation.id);

    // Step 7: Update contact name if needed
    if (contactName && !contact.name) {
      await supabase
        .from('contacts')
        .update({ name: contactName })
        .eq('id', contact.id);
    }
  } catch (error) {
    console.error('[Telegram Processor] Error:', error);
  }
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
): Promise<{ id: string }> {
  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
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
    .select('id')
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
