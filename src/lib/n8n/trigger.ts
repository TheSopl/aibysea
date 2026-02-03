/**
 * n8n Workflow Trigger
 *
 * Sends inbound customer messages to n8n for AI processing.
 * n8n receives the message with conversation context and AI agent config,
 * processes it through an AI workflow, and POSTs the response back
 * to /api/webhooks/n8n/ai-response.
 */

interface TriggerPayload {
  conversation_id: string;
  message_id: string;
  customer_message: string;
  channel: 'whatsapp' | 'telegram' | 'web';
  contact: {
    id: string;
    phone: string;
    name: string | null;
  };
  ai_agent: {
    id: string;
    name: string;
    model: string;
    system_prompt: string | null;
    greeting_message: string | null;
    behaviors: Record<string, unknown>;
  } | null;
}

/**
 * Trigger n8n workflow with a customer message.
 * Sends the message payload to n8n's webhook endpoint for AI processing.
 *
 * This is fire-and-forget: we don't wait for the AI response here.
 * n8n will POST the response back to /api/webhooks/n8n/ai-response.
 */
export async function triggerN8nWorkflow(payload: TriggerPayload): Promise<void> {
  const n8nUrl = process.env.N8N_INSTANCE_URL;
  const n8nSecret = process.env.N8N_WEBHOOK_SECRET;

  if (!n8nUrl) {
    console.warn('[n8n Trigger] N8N_INSTANCE_URL not configured, skipping');
    return;
  }

  if (!n8nSecret) {
    console.warn('[n8n Trigger] N8N_WEBHOOK_SECRET not configured, skipping');
    return;
  }

  // Skip if no AI agent is assigned to the conversation
  if (!payload.ai_agent) {
    console.log('[n8n Trigger] No AI agent assigned, skipping:', payload.conversation_id);
    return;
  }

  const webhookUrl = `${n8nUrl}/webhook/customer-message`;

  try {
    console.log('[n8n Trigger] Sending message to n8n:', {
      conversation_id: payload.conversation_id,
      channel: payload.channel,
      ai_agent: payload.ai_agent.name,
    });

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${n8nSecret}`,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    if (!response.ok) {
      const text = await response.text().catch(() => 'No response body');
      console.error('[n8n Trigger] Failed to trigger workflow:', {
        status: response.status,
        body: text,
      });
      return;
    }

    console.log('[n8n Trigger] Workflow triggered successfully');
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      console.error('[n8n Trigger] Request timed out');
    } else {
      console.error('[n8n Trigger] Error triggering workflow:', error);
    }
  }
}
