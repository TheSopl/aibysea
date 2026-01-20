/**
 * n8n AI Response Webhook Handler
 *
 * Receives AI agent responses from n8n workflow and stores them in the database.
 * This endpoint is called by n8n after the AI generates a response to a customer message.
 *
 * Security: Uses N8N_WEBHOOK_SECRET for authentication with timing-safe comparison.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { timingSafeEqual } from 'crypto';

// Supabase admin client type (with any to bypass strict RLS type checking)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseAdmin = any;

interface AIResponsePayload {
  conversation_id: string;
  content: string;
  metadata?: Record<string, unknown>;
}

/**
 * POST /api/webhooks/n8n/ai-response
 *
 * Receives AI agent responses from n8n and stores them in the messages table.
 *
 * Request body:
 * - conversation_id: UUID of the conversation
 * - content: The AI-generated response text
 * - metadata: Optional metadata about the AI response
 *
 * Headers:
 * - Authorization: Bearer {N8N_WEBHOOK_SECRET}
 *
 * Returns:
 * - 200: { success: true, message_id: string }
 * - 400: Invalid payload
 * - 401: Authentication failed
 * - 404: Conversation not found
 * - 500: Database error
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  // Step 1: Verify authentication
  const authHeader = request.headers.get('authorization');
  if (!verifyAuthentication(authHeader)) {
    console.warn('[N8nWebhook] AI Response - Authentication failed');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Step 2: Parse and validate payload
  let payload: AIResponsePayload;
  try {
    payload = (await request.json()) as AIResponsePayload;
  } catch (error) {
    console.error('[N8nWebhook] AI Response - Failed to parse JSON:', error);
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }

  const { conversation_id, content, metadata } = payload;

  if (!conversation_id || !content) {
    console.error('[N8nWebhook] AI Response - Missing required fields');
    return NextResponse.json(
      { error: 'Missing required fields: conversation_id, content' },
      { status: 400 }
    );
  }

  console.log('[N8nWebhook] AI Response - Processing:', {
    conversation_id,
    contentLength: content.length,
  });

  const supabase: SupabaseAdmin = createAdminClient();

  try {
    // Step 3: Verify conversation exists and is AI-handled
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .select('id, handler_type')
      .eq('id', conversation_id)
      .single();

    if (conversationError || !conversation) {
      console.error('[N8nWebhook] AI Response - Conversation not found:', conversation_id);
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    if (conversation.handler_type !== 'ai') {
      console.log('[N8nWebhook] AI Response - Rejected (human takeover active):', {
        conversation_id,
        handler_type: conversation.handler_type,
      });
      // Reject AI messages when human has taken over
      return NextResponse.json(
        { error: 'Conversation is in human mode', rejected: true },
        { status: 200 } // Return 200 to not trigger n8n retries
      );
    }

    // Step 4: Insert message to database
    const { data: message, error: insertError} = await supabase
      .from('messages')
      .insert({
        conversation_id,
        direction: 'outbound',
        content,
        content_type: 'text',
        sender_type: 'ai',
        metadata: metadata || {},
      })
      .select('id')
      .single();

    if (insertError || !message) {
      console.error('[N8nWebhook] AI Response - Failed to insert message:', insertError);
      return NextResponse.json(
        { error: 'Database error', details: insertError?.message },
        { status: 500 }
      );
    }

    console.log('[N8nWebhook] AI Response - Message saved:', message.id);

    // Step 5: Update conversation.last_message_at
    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from('conversations')
      .update({ last_message_at: now })
      .eq('id', conversation_id);

    if (updateError) {
      console.error(
        '[N8nWebhook] AI Response - Failed to update conversation timestamp:',
        updateError
      );
      // Don't fail the request - message was saved successfully
    }

    // Step 6: Return success response
    return NextResponse.json(
      {
        success: true,
        message_id: message.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[N8nWebhook] AI Response - Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Verify the Authorization header matches N8N_WEBHOOK_SECRET.
 * Uses timing-safe comparison to prevent timing attacks.
 *
 * Expected header format: "Bearer {secret}"
 */
function verifyAuthentication(authHeader: string | null | undefined): boolean {
  if (!authHeader) {
    return false;
  }

  const secret = process.env.N8N_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[N8nWebhook] N8N_WEBHOOK_SECRET is not configured');
    return false;
  }

  // Extract bearer token
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return false;
  }

  const providedSecret = match[1];

  try {
    // Convert to buffers for timing-safe comparison
    const expectedBuffer = Buffer.from(secret, 'utf8');
    const actualBuffer = Buffer.from(providedSecret, 'utf8');

    // Check length first to avoid timingSafeEqual throwing
    if (expectedBuffer.length !== actualBuffer.length) {
      return false;
    }

    // Constant-time comparison prevents timing attacks
    return timingSafeEqual(expectedBuffer, actualBuffer);
  } catch (error) {
    console.error('[N8nWebhook] Error verifying authentication:', error);
    return false;
  }
}
