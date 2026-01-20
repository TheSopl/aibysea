import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendTextMessage, isWithin24HourWindow } from '@/lib/whatsapp/client';

// Supabase admin client type (with any to bypass strict RLS type checking)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseAdmin = any;

export async function POST(request: NextRequest) {
  try {
    const { to, message, conversation_id, skip_handler_check } = await request.json();

    // Validate required fields
    if (!to || !message) {
      return NextResponse.json(
        { error: 'Missing to or message' },
        { status: 400 }
      );
    }

    const supabase: SupabaseAdmin = createAdminClient();

    // Check if conversation is in human mode (skip AI messages)
    if (conversation_id && !skip_handler_check) {
      const { data: conversation } = await supabase
        .from('conversations')
        .select('handler_type')
        .eq('id', conversation_id)
        .single();

      const conv = conversation as { handler_type: string } | null;
      if (conv?.handler_type === 'human') {
        console.log('[WhatsApp Send] Blocked - conversation in human mode:', conversation_id);
        return NextResponse.json(
          { error: 'Conversation is in human mode', blocked: true },
          { status: 200 }
        );
      }
    }

    // Check 24-hour messaging window if conversation_id provided
    if (conversation_id) {
      const { data: conversation } = await supabase
        .from('conversations')
        .select('last_customer_message_at')
        .eq('id', conversation_id)
        .single();

      const conv = conversation as { last_customer_message_at: string | null } | null;

      if (!isWithin24HourWindow(conv?.last_customer_message_at ?? null)) {
        console.log('[WhatsApp Send] Outside 24h window - template required:', conversation_id);
        return NextResponse.json(
          {
            error: '24-hour messaging window expired. Template message required.',
            template_required: true
          },
          { status: 200 }
        );
      }
    }

    // Send message via WhatsApp Cloud API
    const result = await sendTextMessage(to, message);
    const whatsappMessageId = result.messages[0]?.id;

    console.log('[WhatsApp Send] Message sent to:', to, 'Message ID:', whatsappMessageId);

    // Store outbound message in database (only if conversation_id provided)
    if (conversation_id) {
      const { error: insertError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation_id,
          content: message,
          direction: 'outbound',
          content_type: 'text',
          sender_type: 'agent',
          whatsapp_message_id: whatsappMessageId,
          created_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('[WhatsApp Send] Failed to store message:', insertError);
        // Don't fail the request - message was sent successfully
      } else {
        console.log('[WhatsApp Send] Message stored in database');
      }
    }

    return NextResponse.json({
      success: true,
      message_id: whatsappMessageId
    });
  } catch (error) {
    console.error('[WhatsApp Send] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
