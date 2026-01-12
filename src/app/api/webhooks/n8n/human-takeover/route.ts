/**
 * n8n Human Takeover Webhook Handler
 *
 * Receives human takeover requests from n8n workflow and updates conversation state.
 * This endpoint is called by n8n when:
 * - AI agent gets stuck and cannot handle the conversation
 * - Customer explicitly requests to speak with a human
 * - Workflow determines human intervention is needed
 *
 * Security: Uses N8N_WEBHOOK_SECRET for authentication with timing-safe comparison.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { timingSafeEqual } from 'crypto';

// Supabase admin client type (with any to bypass strict RLS type checking)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseAdmin = any;

interface HumanTakeoverPayload {
  conversation_id: string;
  agent_id: string;
  reason?: string;
}

/**
 * POST /api/webhooks/n8n/human-takeover
 *
 * Transfers a conversation from AI handling to human agent handling.
 *
 * Request body:
 * - conversation_id: UUID of the conversation to transfer
 * - agent_id: UUID of the agent taking over (or 'unassigned')
 * - reason: Optional reason for the takeover (e.g., "customer_request", "ai_stuck")
 *
 * Headers:
 * - Authorization: Bearer {N8N_WEBHOOK_SECRET}
 *
 * Returns:
 * - 200: { success: true, conversation_id: string, assigned_agent_id: string }
 * - 400: Invalid payload
 * - 401: Authentication failed
 * - 404: Conversation not found
 * - 500: Database error
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  // Step 1: Verify authentication
  const authHeader = request.headers.get('authorization');
  if (!verifyAuthentication(authHeader)) {
    console.warn('[N8nWebhook] Human Takeover - Authentication failed');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Step 2: Parse and validate payload
  let payload: HumanTakeoverPayload;
  try {
    payload = (await request.json()) as HumanTakeoverPayload;
  } catch (error) {
    console.error('[N8nWebhook] Human Takeover - Failed to parse JSON:', error);
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }

  const { conversation_id, agent_id, reason } = payload;

  if (!conversation_id || !agent_id) {
    console.error('[N8nWebhook] Human Takeover - Missing required fields');
    return NextResponse.json(
      { error: 'Missing required fields: conversation_id, agent_id' },
      { status: 400 }
    );
  }

  console.log('[N8nWebhook] Human Takeover - Processing:', {
    conversation_id,
    agent_id,
    reason: reason || 'not specified',
  });

  const supabase: SupabaseAdmin = createAdminClient();

  try {
    // Step 3: Verify conversation exists
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .select('id, handler_type')
      .eq('id', conversation_id)
      .single();

    if (conversationError || !conversation) {
      console.error('[N8nWebhook] Human Takeover - Conversation not found:', conversation_id);
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Step 4: Update conversation state
    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from('conversations')
      .update({
        handler_type: 'human',
        assigned_agent_id: agent_id === 'unassigned' ? null : agent_id,
        last_message_at: now,
      })
      .eq('id', conversation_id);

    if (updateError) {
      console.error('[N8nWebhook] Human Takeover - Failed to update conversation:', updateError);
      return NextResponse.json(
        { error: 'Database error', details: updateError.message },
        { status: 500 }
      );
    }

    // Step 5: Log the takeover
    console.log(
      `[Human Takeover] Conversation ${conversation_id} assigned to ${agent_id} (reason: ${reason || 'not specified'})`
    );

    // Step 6: Return success response
    return NextResponse.json(
      {
        success: true,
        conversation_id,
        assigned_agent_id: agent_id === 'unassigned' ? null : agent_id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[N8nWebhook] Human Takeover - Unexpected error:', error);
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
