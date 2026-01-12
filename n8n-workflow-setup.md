# n8n Workflow Setup - Telegram AI Agent

## Workflow Overview

**Purpose:** Route incoming Telegram messages to AI agents with conversation state management

**Flow:**
1. Telegram webhook receives message
2. Query Supabase for conversation state
3. Check if handler_type='ai' (skip if 'human')
4. Load last 10 messages for context
5. Call OpenAI API for response
6. POST response to Next.js webhook
7. Error handling with escalation to human takeover

## Step-by-Step Workflow Building

### Prerequisites

1. Log in to https://n8n.alaaai.online/
2. Configure credentials (see n8n-config.md)

### Node 1: Telegram Webhook Trigger

**Node Type:** Telegram Trigger
**Name:** `Telegram Incoming Message`

**Configuration:**
- **Credential:** Select "Telegram Bot - AI Inbox"
- **Updates:** Select "message"
- **Download Files:** No
- **Additional Fields:**
  - Allowed Updates: `message`

**What it does:** Triggers when someone sends a message to your Telegram bot

### Node 2: Extract Message Data

**Node Type:** Code (JavaScript)
**Name:** `Extract Telegram Data`

**Code:**
```javascript
// Extract data from Telegram webhook
const message = $input.item.json.message;
const chatId = message.chat.id;
const userId = message.from.id;
const username = message.from.username || message.from.first_name;
const messageText = message.text || '';
const messageId = message.message_id;

// Create conversation_id (format: telegram_<chat_id>)
const conversationId = `telegram_${chatId}`;

return {
  json: {
    conversation_id: conversationId,
    platform: 'telegram',
    chat_id: chatId,
    user_id: userId,
    username: username,
    message_content: messageText,
    telegram_message_id: messageId,
    raw_message: message
  }
};
```

### Node 3: Query Conversation State

**Node Type:** Supabase
**Name:** `Get Conversation State`

**Configuration:**
- **Credential:** Select "Supabase - AI Inbox"
- **Operation:** Get Row(s)
- **Table:** `conversations`
- **Filter:**
  - Field: `id`
  - Operator: `equals`
  - Value: `={{ $json.conversation_id }}`

**Options:**
- Return All: No

**What it does:** Looks up conversation in Supabase to check handler_type

### Node 4: Check Handler Type

**Node Type:** IF
**Name:** `Is AI Handling?`

**Conditions:**
- **Condition 1:**
  - Field: `{{ $json.handler_type }}`
  - Operation: `Equal`
  - Value: `ai`

**Routing:**
- **True:** Continue to AI flow
- **False:** Connect to Stop node (human is handling)

### Node 5a: Stop (Human Handling)

**Node Type:** Stop and Error
**Name:** `Stop - Human Handling`

**Configuration:**
- **Error Message:** `Conversation {{ $('Extract Telegram Data').item.json.conversation_id }} is human-handled. Skipping AI processing.`

### Node 5b: Load Message History

**Node Type:** Supabase
**Name:** `Load Last 10 Messages`

**Configuration:**
- **Credential:** Select "Supabase - AI Inbox"
- **Operation:** Get Row(s)
- **Table:** `messages`
- **Filter:**
  - Field: `conversation_id`
  - Operator: `equals`
  - Value: `={{ $('Extract Telegram Data').item.json.conversation_id }}`
- **Options:**
  - Return All: Yes
  - Sort:
    - Field: `created_at`
    - Direction: `DESC`
  - Limit: 10

**What it does:** Gets conversation history for AI context

### Node 6: Format Context for OpenAI

**Node Type:** Code (JavaScript)
**Name:** `Format Context`

**Code:**
```javascript
const extractedData = $('Extract Telegram Data').item.json;
const messages = $input.all();

// Reverse messages (oldest first)
const sortedMessages = messages.reverse();

// Format for OpenAI
const conversationHistory = sortedMessages.map(msg => ({
  role: msg.json.role === 'agent' ? 'assistant' : 'user',
  content: msg.json.content
}));

// Add current message
conversationHistory.push({
  role: 'user',
  content: extractedData.message_content
});

return {
  json: {
    conversation_id: extractedData.conversation_id,
    messages: conversationHistory,
    current_message: extractedData.message_content
  }
};
```

### Node 7: Call OpenAI

**Node Type:** OpenAI
**Name:** `Generate AI Response`

**Configuration:**
- **Credential:** Select "OpenAI - AI Agents"
- **Resource:** Chat
- **Operation:** Create a Chat Completion
- **Model:** `gpt-4o-mini` (or `gpt-4o` for better quality)
- **Messages:**
  - **System Message:**
    ```
    You are a helpful customer support AI agent for a tourism company. Be friendly, concise, and professional. If you cannot help with something, acknowledge it clearly.
    ```
  - **User Message(s):** `={{ $json.messages }}`

**Options:**
- Temperature: 0.7
- Max Tokens: 500

**Settings (Error Handling):**
- **Continue On Fail:** Yes
- **Retry On Fail:** Yes
- **Max Tries:** 3
- **Wait Between Tries (ms):** 1000

### Node 8a: Send Response to Next.js

**Node Type:** HTTP Request
**Name:** `POST AI Response`

**Configuration:**
- **Method:** POST
- **URL:** `https://your-app.vercel.app/api/webhooks/n8n/ai-response`
  - (Replace with your actual Next.js app URL)
- **Authentication:** None (using header)
- **Send Headers:** Yes
  - Header 1: `x-webhook-secret` = `35e790f8e5df59cacfce350e80812d15d5cc0d64e77947f548a567bdb090769f`
  - Header 2: `Content-Type` = `application/json`
- **Send Body:** Yes
- **Body Content Type:** JSON
- **Specify Body:** Using Fields Below
- **Body:**
  ```json
  {
    "conversation_id": "={{ $('Extract Telegram Data').item.json.conversation_id }}",
    "content": "={{ $json.choices[0].message.content }}"
  }
  ```

### Node 8b: Error - Human Takeover

**Node Type:** HTTP Request
**Name:** `Escalate to Human`

**Connect this to the Error output of "Generate AI Response" node**

**Configuration:**
- **Method:** POST
- **URL:** `https://your-app.vercel.app/api/webhooks/n8n/human-takeover`
- **Send Headers:** Yes
  - Header 1: `x-webhook-secret` = `35e790f8e5df59cacfce350e80812d15d5cc0d64e77947f548a567bdb090769f`
  - Header 2: `Content-Type` = `application/json`
- **Send Body:** Yes
- **Body:**
  ```json
  {
    "conversation_id": "={{ $('Extract Telegram Data').item.json.conversation_id }}",
    "reason": "OpenAI API error after retries"
  }
  ```

## Complete Workflow Connections

```
Telegram Incoming Message
  → Extract Telegram Data
    → Get Conversation State
      → Is AI Handling?
        → [False] Stop - Human Handling
        → [True] Load Last 10 Messages
          → Format Context
            → Generate AI Response
              → [Success] POST AI Response
              → [Error] Escalate to Human
```

## Testing

### 1. Test Telegram Webhook

Send a message to your bot and check n8n executions:
- Should see webhook triggered
- Should see data extracted

### 2. Test Full Flow

1. Ensure you have a conversation in Supabase with `handler_type='ai'`
2. Send message to bot
3. Verify:
   - n8n workflow executes
   - OpenAI responds
   - Response posted to Next.js
   - Message appears in Supabase

### 3. Test Human Handling

1. Set a conversation to `handler_type='human'`
2. Send message
3. Verify workflow stops at "Is AI Handling?" node

## Export Workflow

Once built:
1. Click workflow menu (three dots)
2. Select "Download"
3. Save as `n8n-workflow-export.json`

## Troubleshooting

**Telegram webhook not triggering:**
- Verify webhook is set: `curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"`
- Should show your n8n URL

**OpenAI errors:**
- Check API key is valid
- Verify you have credits/quota
- Check message format is correct array

**Supabase errors:**
- Verify service role key (not anon key)
- Check table names match schema
- Verify RLS policies allow service role

**Next.js webhook fails:**
- Verify app is deployed
- Check webhook secret matches
- Check endpoint URL is correct
