/**
 * Chat Widget API
 *
 * Handles web chat messages from the floating chat widget.
 * Reuses existing contact/conversation per user, inserts messages, triggers n8n.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { triggerN8nWorkflow } from '@/lib/n8n/trigger';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseAdmin = any;

interface ChatRequest {
  message: string;
  conversation_id?: string;
}

/**
 * POST /api/chat
 *
 * Send a message in the web chat widget.
 * Reuses existing contact + conversation for the logged-in user.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const serverSupabase = await createClient();
  const { data: { user }, error: authError } = await serverSupabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let payload: ChatRequest;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { message, conversation_id } = payload;

  if (!message || !message.trim()) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  const supabase: SupabaseAdmin = createAdminClient();
  const contactPhone = `web:${user.id}`;

  try {
    let convId: string | undefined = conversation_id;
    let aiAgent = null;

    // Find or create contact (one per user, always reused)
    let contact;
    const { data: existingContact } = await supabase
      .from('contacts')
      .select('id')
      .eq('phone', contactPhone)
      .maybeSingle();

    if (existingContact) {
      contact = existingContact;
    } else {
      const contactName = user.user_metadata?.full_name || user.email || 'Web User';
      const { data: newContact, error: contactError } = await supabase
        .from('contacts')
        .insert({ phone: contactPhone, name: contactName, metadata: { source: 'web_chat', user_id: user.id } })
        .select('id')
        .single();

      if (contactError || !newContact) {
        return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });
      }
      contact = newContact;
    }

    // Get the default active AI agent
    const { data: defaultAgent } = await supabase
      .from('ai_agents')
      .select('id, name, model, system_prompt, greeting_message, behaviors')
      .eq('status', 'active')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    aiAgent = defaultAgent || null;

    // If no conversation_id provided, find existing web conversation for this contact
    if (!convId) {
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('id')
        .eq('contact_id', contact.id)
        .eq('channel', 'web')
        .eq('status', 'active')
        .order('last_message_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingConv) {
        convId = existingConv.id;
      }
    }

    // Still no conversation? Create one
    if (!convId) {
      const now = new Date().toISOString();
      const { data: conv, error: convError } = await supabase
        .from('conversations')
        .insert({
          contact_id: contact.id,
          channel: 'web',
          status: 'active',
          handler_type: 'ai',
          ai_agent_id: aiAgent?.id || null,
          last_message_at: now,
          last_customer_message_at: now,
        })
        .select('id')
        .single();

      if (convError || !conv) {
        return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
      }
      convId = conv.id;
    }

    // Fetch AI agent from conversation if we don't have it yet
    if (!aiAgent) {
      const { data: convData } = await supabase
        .from('conversations')
        .select('ai_agent:ai_agents(id, name, model, system_prompt, greeting_message, behaviors)')
        .eq('id', convId)
        .single();

      if (convData?.ai_agent) {
        aiAgent = Array.isArray(convData.ai_agent) ? convData.ai_agent[0] : convData.ai_agent;
      }
    }

    // Insert the user message
    const { data: insertedMessage, error: msgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: convId,
        direction: 'inbound',
        content: message.trim(),
        content_type: 'text',
        sender_type: 'customer',
        metadata: { source: 'web_chat', user_id: user.id },
      })
      .select('id')
      .single();

    if (msgError || !insertedMessage) {
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }

    // Update conversation timestamp
    const now = new Date().toISOString();
    await supabase
      .from('conversations')
      .update({ last_message_at: now, last_customer_message_at: now })
      .eq('id', convId);

    if (!convId) {
      return NextResponse.json({ error: 'Failed to resolve conversation' }, { status: 500 });
    }

    // Trigger n8n (fire-and-forget)
    triggerN8nWorkflow({
      conversation_id: convId,
      message_id: insertedMessage.id,
      customer_message: message.trim(),
      channel: 'web',
      contact: { id: contact.id, phone: contactPhone, name: user.user_metadata?.full_name || null },
      ai_agent: aiAgent,
    }).catch(err => console.error('[Chat API] n8n trigger error:', err));

    return NextResponse.json({
      conversation_id: convId,
      message_id: insertedMessage.id,
    });
  } catch (error) {
    console.error('[Chat API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
