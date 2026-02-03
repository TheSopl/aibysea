/**
 * WhatsApp Webhook Message Processor
 *
 * Processes incoming WhatsApp webhook payloads and persists messages to database.
 * Handles contact/conversation creation and message deduplication.
 */

import { createAdminClient } from '@/lib/supabase/admin';
import type { Database } from '@/types/database';
import type {
  WebhookPayload,
  WebhookMessage,
  WebhookValue,
  MessageContentType,
} from '@/features/channels/whatsapp/lib/types';
import { normalizePhoneNumber } from '@/features/channels/whatsapp/lib/types';
import { triggerN8nWorkflow } from '@/lib/n8n/trigger';

type MessageInsert = Database['public']['Tables']['messages']['Insert'];

// Supabase admin client type (with any to bypass strict RLS type checking)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseAdmin = any;

/**
 * Process an incoming WhatsApp webhook payload.
 * Iterates through all messages and persists them to the database.
 *
 * @param payload - The validated webhook payload from Meta
 */
export async function processWebhook(payload: WebhookPayload): Promise<void> {
  try {
    // Iterate through all entries
    for (const entry of payload.entry ?? []) {
      // Iterate through all changes
      for (const change of entry.changes ?? []) {
        // Only process message-related changes
        if (change.field !== 'messages') {
          continue;
        }

        const value = change.value as WebhookValue;

        // Process incoming messages
        if (value.messages && value.messages.length > 0) {
          for (const message of value.messages) {
            await processIncomingMessage(message, value);
          }
        }

        // Log delivery status updates (not persisting for now)
        if (value.statuses && value.statuses.length > 0) {
          for (const status of value.statuses) {
            console.log('[WhatsApp Processor] Status update:', {
              messageId: status.id,
              status: status.status,
              recipientId: status.recipient_id,
              timestamp: status.timestamp,
            });
          }
        }
      }
    }
  } catch (error) {
    // Log but don't throw - webhook processing should not fail the response
    console.error('[WhatsApp Processor] Error processing webhook:', error);
  }
}

/**
 * Process a single incoming message.
 * Creates contact/conversation if needed, checks for duplicates, and inserts message.
 *
 * @param message - The incoming WhatsApp message
 * @param value - The webhook value containing contact info
 */
async function processIncomingMessage(
  message: WebhookMessage,
  value: WebhookValue
): Promise<void> {
  // Cast to any to bypass strict Supabase RLS type checking
  // The admin client bypasses RLS at runtime, but TypeScript doesn't know this
  const supabase: SupabaseAdmin = createAdminClient();

  // Extract message details
  const fromPhone = normalizePhoneNumber(message.from);
  const messageId = message.id;
  const timestamp = message.timestamp;
  const messageType = message.type as MessageContentType;

  // Get contact name from webhook contacts array if available
  const contactInfo = value.contacts?.find((c) => c.wa_id === message.from);
  const contactName = contactInfo?.profile?.name ?? null;

  console.log('[WhatsApp Processor] Processing message:', {
    from: fromPhone,
    messageId,
    type: messageType,
    hasContactName: !!contactName,
  });

  try {
    // Step 1: Find or create contact
    const contact = await findOrCreateContact(supabase, fromPhone, contactName);

    // Step 2: Find or create conversation
    const conversation = await findOrCreateConversation(supabase, contact.id);

    // Step 3: Check for duplicate message
    const isDuplicate = await checkDuplicateMessage(supabase, messageId);
    if (isDuplicate) {
      console.log('[WhatsApp Processor] Duplicate message, skipping:', messageId);
      return;
    }

    // Step 4: Extract message content
    const content = extractMessageContent(message);

    // Step 5: Fetch AI agent context if assigned
    const aiAgent = await getConversationAIAgent(supabase, conversation.id);

    // Step 6: Insert message with AI agent context for n8n
    const messageData: MessageInsert = {
      conversation_id: conversation.id,
      direction: 'inbound',
      content,
      content_type: messageType,
      sender_type: 'customer',
      whatsapp_message_id: messageId,
      metadata: {
        timestamp,
        raw_message: JSON.parse(JSON.stringify(message)),
        // Include AI agent context for n8n to use for personalized responses
        ai_agent: aiAgent ? JSON.parse(JSON.stringify(aiAgent)) : null,
      },
    };
    const { data: insertedMessage, error: insertError } = await supabase
      .from('messages')
      .insert(messageData)
      .select('id')
      .single();

    if (insertError || !insertedMessage) {
      console.error('[WhatsApp Processor] Failed to insert message:', insertError);
      return;
    }

    console.log('[WhatsApp Processor] Message saved successfully:', messageId);

    // Step 6b: Trigger n8n workflow for AI processing (fire-and-forget)
    if (conversation.handler_type === 'ai') {
      triggerN8nWorkflow({
        conversation_id: conversation.id,
        message_id: insertedMessage.id,
        customer_message: content,
        channel: 'whatsapp',
        contact: { id: contact.id, phone: fromPhone, name: contact.name },
        ai_agent: aiAgent,
      }).catch(err => console.error('[WhatsApp Processor] n8n trigger error:', err));
    } else {
      console.log('[WhatsApp Processor] Skipping n8n trigger (human mode)');
    }

    // Step 6: Update conversation timestamps
    // Update both last_message_at and last_customer_message_at since this is an inbound message
    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from('conversations')
      .update({
        last_message_at: now,
        last_customer_message_at: now,
      })
      .eq('id', conversation.id);

    if (updateError) {
      console.error('[WhatsApp Processor] Failed to update conversation:', updateError);
    }

    // Step 7: Update contact name if provided and different
    if (contactName && contactName !== contact.name) {
      const { error: nameError } = await supabase
        .from('contacts')
        .update({ name: contactName })
        .eq('id', contact.id);

      if (nameError) {
        console.error('[WhatsApp Processor] Failed to update contact name:', nameError);
      } else {
        console.log('[WhatsApp Processor] Updated contact name:', contactName);
      }
    }
  } catch (error) {
    console.error('[WhatsApp Processor] Error processing message:', error);
  }
}

/**
 * Find an existing contact by phone number or create a new one.
 */
async function findOrCreateContact(
  supabase: SupabaseAdmin,
  phone: string,
  name: string | null
): Promise<{ id: string; name: string | null }> {
  // Try to find existing contact
  const { data: existingContact, error: selectError } = await supabase
    .from('contacts')
    .select('id, name')
    .eq('phone', phone)
    .maybeSingle();

  // If contact exists, return it
  if (existingContact) {
    return existingContact;
  }

  // Only log non-PGRST116 errors (PGRST116 = no rows, expected)
  if (selectError && selectError.code !== 'PGRST116') {
    console.error('[WhatsApp Processor] Error checking for contact:', selectError);
  }

  // Create new contact
  const { data: newContact, error: insertError } = await supabase
    .from('contacts')
    .insert({
      phone,
      name,
      metadata: {},
    })
    .select('id, name')
    .single();

  if (insertError || !newContact) {
    // If insert failed due to duplicate (race condition), try to fetch again
    if (insertError?.code === '23505') { // Postgres unique violation
      const { data: retryContact } = await supabase
        .from('contacts')
        .select('id, name')
        .eq('phone', phone)
        .maybeSingle();

      if (retryContact) {
        console.log('[WhatsApp Processor] Contact existed (race condition), using existing:', phone);
        return retryContact;
      }
    }
    throw new Error(`Failed to create contact: ${insertError?.message}`);
  }

  console.log('[WhatsApp Processor] Created new contact:', phone);
  return newContact;
}

// AI Agent type for context
interface AIAgentContext {
  id: string;
  name: string;
  model: string;
  system_prompt: string | null;
  greeting_message: string | null;
  behaviors: Record<string, unknown>;
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

/**
 * Find an existing WhatsApp conversation for a contact or create a new one.
 */
async function findOrCreateConversation(
  supabase: SupabaseAdmin,
  contactId: string
): Promise<{ id: string; handler_type: string }> {
  // Try to find existing conversation
  const { data: existingConversation, error: selectError } = await supabase
    .from('conversations')
    .select('id, handler_type')
    .eq('contact_id', contactId)
    .eq('channel', 'whatsapp')
    .single();

  if (existingConversation && !selectError) {
    return existingConversation;
  }

  // Create new conversation
  const now = new Date().toISOString();
  const { data: newConversation, error: insertError } = await supabase
    .from('conversations')
    .insert({
      contact_id: contactId,
      channel: 'whatsapp',
      status: 'active',
      handler_type: 'ai',
      last_message_at: now,
      last_customer_message_at: now,
    })
    .select('id, handler_type')
    .single();

  if (insertError || !newConversation) {
    throw new Error(`Failed to create conversation: ${insertError?.message}`);
  }

  console.log('[WhatsApp Processor] Created new conversation for contact:', contactId);
  return newConversation;
}

/**
 * Check if a message with this WhatsApp message ID already exists.
 * Used for deduplication since WhatsApp may retry webhook delivery.
 */
async function checkDuplicateMessage(
  supabase: SupabaseAdmin,
  whatsappMessageId: string
): Promise<boolean> {
  // Query for existing message with this WhatsApp ID
  const { data, error } = await supabase
    .from('messages')
    .select('id')
    .eq('whatsapp_message_id', whatsappMessageId)
    .limit(1);

  if (error) {
    console.error('[WhatsApp Processor] Error checking for duplicate:', error);
    return false; // Allow processing on error
  }

  return (data?.length ?? 0) > 0;
}

/**
 * Extract the text content from a WhatsApp message.
 * For non-text messages, returns a placeholder indicating the media type.
 */
function extractMessageContent(message: WebhookMessage): string {
  // Check for text message
  if ('text' in message && message.text?.body) {
    return message.text.body;
  }

  // For media messages, return placeholder with type info
  const type = message.type;
  switch (type) {
    case 'image':
      return '[Image]';
    case 'audio':
      return '[Audio]';
    case 'video':
      return '[Video]';
    case 'document':
      return '[Document]';
    case 'sticker':
      return '[Sticker]';
    case 'interactive':
      return '[Interactive Message]';
    case 'button':
      return '[Button Response]';
    case 'order':
      return '[Order]';
    case 'system':
      return '[System Message]';
    default:
      return '[Media]';
  }
}
