# n8n Integration Guide

## Overview
AI BY SEA integrates seamlessly with n8n to provide real-time synchronization of conversations, workflows, and agent actions. This document outlines all integration points and webhooks.

## Integration Points

### 1. Inbox & Conversations

#### Takeover Mode Toggle
**Endpoint**: `POST /api/n8n/takeover`

```typescript
{
  conversationId: number,
  mode: 'ai' | 'human',
  timestamp: string (ISO 8601)
}
```

**Purpose**: Notify n8n when a human agent takes over or returns control to AI.

**n8n Workflow Actions**:
- Pause AI responses for the conversation
- Notify the AI agent to stop processing
- Update conversation status in n8n database
- Send notification to team members

---

#### Send Message
**Endpoint**: `POST /api/n8n/messages`

```typescript
{
  conversationId: number,
  sender: 'ai' | 'human' | 'customer',
  text: string,
  timestamp: string,
  metadata: {
    channel: string,
    userId: number
  }
}
```

**Purpose**: Send messages from the platform to n8n for processing and delivery.

**n8n Workflow Actions**:
- Route message to appropriate channel (WhatsApp, Telegram, etc.)
- Store message in conversation history
- Trigger AI response if in AI mode
- Update conversation metrics

---

#### Receive Message (Webhook)
**Endpoint**: `POST /api/webhooks/n8n/incoming-message`

```typescript
{
  conversationId: number,
  contactId: number,
  channel: 'WhatsApp' | 'Telegram' | 'Facebook' | 'Instagram',
  message: {
    text: string,
    timestamp: string,
    attachments?: Array<{
      type: string,
      url: string
    }>
  }
}
```

**Purpose**: Receive incoming messages from n8n to display in the inbox.

**Expected Behavior**:
- Update inbox conversation list
- Display new message in chat thread
- Increment unread count
- Trigger notification

---

### 2. Contact Lifecycle Management

#### Update Lifecycle Stage
**Endpoint**: `POST /api/n8n/lifecycle/update`

```typescript
{
  contactId: number,
  previousStage: string,
  newStage: string,
  reason: string,
  timestamp: string
}
```

**Purpose**: Synchronize lifecycle stage changes with n8n.

**n8n Workflow Actions**:
- Update contact record in CRM
- Trigger lifecycle-specific automation
- Send notifications to relevant team members
- Update analytics and reporting

---

### 3. AI Agents

#### Agent Status Change
**Endpoint**: `POST /api/n8n/agents/status`

```typescript
{
  agentId: number,
  agentName: string,
  status: 'active' | 'standby' | 'paused',
  timestamp: string
}
```

**Purpose**: Notify n8n when an AI agent's status changes.

**n8n Workflow Actions**:
- Update agent availability in routing logic
- Redistribute conversations if agent goes offline
- Log status change for analytics

---

#### Agent Performance Metrics
**Endpoint**: `POST /api/n8n/agents/metrics`

```typescript
{
  agentId: number,
  metrics: {
    totalConversations: number,
    avgResponseTime: number,
    successRate: number,
    activeConversations: number
  },
  timestamp: string
}
```

**Purpose**: Send agent performance data to n8n for analytics and optimization.

---

### 4. Workflows

#### Workflow Execution
**Endpoint**: `POST /api/n8n/workflows/execute`

```typescript
{
  workflowId: number,
  trigger: string,
  data: object,
  timestamp: string
}
```

**Purpose**: Trigger n8n workflow execution from the platform.

---

#### Workflow Status Update (Webhook)
**Endpoint**: `POST /api/webhooks/n8n/workflow-status`

```typescript
{
  workflowId: number,
  executionId: string,
  status: 'running' | 'completed' | 'failed',
  result?: object,
  error?: string,
  timestamp: string
}
```

**Purpose**: Receive workflow execution status updates from n8n.

---

### 5. Channels

#### Channel Connection Status
**Endpoint**: `POST /api/n8n/channels/status`

```typescript
{
  channelId: number,
  channelType: string,
  status: 'connected' | 'disconnected' | 'error',
  metadata: object,
  timestamp: string
}
```

**Purpose**: Synchronize channel connection status with n8n.

---

### 6. Team & User Management

#### User Invitation
**Endpoint**: `POST /api/n8n/users/invite`

```typescript
{
  email: string,
  role: 'Admin' | 'Member',
  invitedBy: number,
  timestamp: string
}
```

**Purpose**: Notify n8n when a new user is invited.

**n8n Workflow Actions**:
- Send invitation email
- Create provisional user record
- Set up onboarding sequence

---

## Webhook Configuration

### Setting up n8n Webhooks

1. **Create Webhook Node in n8n**
   - Add a Webhook node to your n8n workflow
   - Set HTTP Method to POST
   - Copy the webhook URL

2. **Configure in Platform**
   - Navigate to Settings > Integrations
   - Add n8n webhook URL
   - Test connection

3. **Authentication**
   - Use API key authentication
   - Add header: `X-API-Key: your_api_key`

---

## Environment Variables

```env
# n8n Integration
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook
N8N_API_KEY=your_secure_api_key
N8N_TIMEOUT=30000
```

---

## Error Handling

All n8n API calls should implement:

1. **Retry Logic**: 3 attempts with exponential backoff
2. **Timeout**: 30 seconds default
3. **Fallback**: Queue failed requests for later retry
4. **Logging**: Log all failed requests for debugging

Example:

```typescript
async function sendToN8N(endpoint: string, data: object) {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const response = await fetch(`${N8N_WEBHOOK_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': N8N_API_KEY,
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      attempt++;
      if (attempt >= maxRetries) {
        console.error('N8N request failed after retries:', error);
        // Queue for later retry
        await queueFailedRequest(endpoint, data);
        throw error;
      }
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
}
```

---

## Real-time Synchronization

For real-time updates, implement WebSocket connection with n8n:

```typescript
// WebSocket connection for real-time updates
const ws = new WebSocket('wss://your-n8n-instance.com/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  switch (data.type) {
    case 'new_message':
      handleIncomingMessage(data.payload);
      break;
    case 'workflow_complete':
      updateWorkflowStatus(data.payload);
      break;
    case 'agent_update':
      updateAgentStatus(data.payload);
      break;
  }
};
```

---

## Testing

Test all integration points using:

1. **Postman Collection**: Available in `/docs/postman/`
2. **n8n Test Workflows**: Pre-built test workflows in `/docs/n8n/`
3. **Integration Tests**: Run `npm test:integration`

---

## Security Best Practices

1. **Always use HTTPS** for webhooks
2. **Validate webhook signatures** to ensure requests come from n8n
3. **Rate limit** incoming webhooks
4. **Sanitize all input** from n8n
5. **Use environment variables** for sensitive data
6. **Implement IP whitelisting** for production

---

## Support

For integration issues:
- Email: dev@aibysea.com
- Docs: https://docs.aibysea.com/n8n-integration
- n8n Community: https://community.n8n.io
