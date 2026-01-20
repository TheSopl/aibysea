import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const { chatId, message, conversation_id, skip_handler_check } = await request.json();

    if (!chatId || !message) {
      return NextResponse.json(
        { error: 'Missing chatId or message' },
        { status: 400 }
      );
    }

    // Check if conversation is in human mode (skip AI messages)
    if (conversation_id && !skip_handler_check) {
      const supabase = createAdminClient();
      const { data: conversation } = await supabase
        .from('conversations')
        .select('handler_type')
        .eq('id', conversation_id)
        .single();

      const conv = conversation as { handler_type: string } | null;
      if (conv?.handler_type === 'human') {
        console.log('[Telegram Send] Blocked - conversation in human mode:', conversation_id);
        return NextResponse.json(
          { error: 'Conversation is in human mode', blocked: true },
          { status: 200 }
        );
      }
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      console.error('[Telegram Send] Missing TELEGRAM_BOT_TOKEN');
      return NextResponse.json(
        { error: 'Telegram not configured' },
        { status: 500 }
      );
    }

    // Send message via Telegram Bot API
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    );

    const result = await response.json();

    if (!result.ok) {
      console.error('[Telegram Send] API error:', result);
      return NextResponse.json(
        { error: result.description || 'Failed to send message' },
        { status: 500 }
      );
    }

    console.log('[Telegram Send] Message sent to chat:', chatId);
    return NextResponse.json({ success: true, message_id: result.result.message_id });
  } catch (error) {
    console.error('[Telegram Send] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
