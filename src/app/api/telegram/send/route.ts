import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { chatId, message } = await request.json();

    if (!chatId || !message) {
      return NextResponse.json(
        { error: 'Missing chatId or message' },
        { status: 400 }
      );
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
