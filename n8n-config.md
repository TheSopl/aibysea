# n8n Configuration Guide

## Instance Details

**Instance URL:** https://n8n.alaaai.online/
**Hosting:** Hostinger
**Purpose:** AI agent message routing and automation

## Required Credentials

Configure these credentials in your n8n instance (Settings → Credentials):

### 1. Supabase Credential

**Credential Type:** Supabase API
**Name:** `Supabase - AI Inbox`

**Configuration:**
- **Host:** `https://qzwpemaczxjmtgftckrd.supabase.co`
- **Service Role Key:** (Use SUPABASE_SERVICE_ROLE_KEY from .env.local)

### 2. OpenAI Credential

**Credential Type:** OpenAI API
**Name:** `OpenAI - AI Agents`

**Configuration:**
- **API Key:** (Use OPENAI_API_KEY from .env.local)

### 3. Telegram Bot Credential

**Credential Type:** Telegram API
**Name:** `Telegram Bot - AI Inbox`

**Configuration:**
- **Bot Token:** `8592169316:AAHdgi5QcPB-APNx5PnyFPAqiHLOPD3ovEQ`

## Webhook Configuration

### Telegram Webhook Setup

1. In n8n, create a Webhook node to receive Telegram updates
2. Set webhook URL in Telegram:
   ```bash
   curl -X POST "https://api.telegram.org/bot8592169316:AAHdgi5QcPB-APNx5PnyFPAqiHLOPD3ovEQ/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://n8n.alaaai.online/webhook/telegram-incoming"}'
   ```

3. Verify webhook is set:
   ```bash
   curl "https://api.telegram.org/bot8592169316:AAHdgi5QcPB-APNx5PnyFPAqiHLOPD3ovEQ/getWebhookInfo"
   ```

### Next.js Webhook Endpoints

The n8n workflow will POST AI responses back to Next.js:

**AI Response Endpoint:**
- URL: `https://your-app.vercel.app/api/webhooks/n8n/ai-response`
- Method: POST
- Headers:
  - `Content-Type: application/json`
  - `x-webhook-secret: 35e790f8e5df59cacfce350e80812d15d5cc0d64e77947f548a567bdb090769f`
- Body: `{ conversation_id: string, content: string }`

**Human Takeover Endpoint (error escalation):**
- URL: `https://your-app.vercel.app/api/webhooks/n8n/human-takeover`
- Method: POST
- Headers: Same as above
- Body: `{ conversation_id: string, reason: string }`

## Environment Variables Reference

Make sure these are set in .env.local:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://qzwpemaczxjmtgftckrd.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# Telegram
TELEGRAM_BOT_TOKEN=8592169316:AAHdgi5QcPB-APNx5PnyFPAqiHLOPD3ovEQ
TELEGRAM_WEBHOOK_SECRET=ai-seatourism-telegram-9c7f2e4b

# n8n
N8N_INSTANCE_URL=https://n8n.alaaai.online
N8N_WEBHOOK_SECRET=35e790f8e5df59cacfce350e80812d15d5cc0d64e77947f548a567bdb090769f

# OpenAI
OPENAI_API_KEY=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
```

## Security Notes

- Never commit .env.local to git (already in .gitignore)
- N8N_WEBHOOK_SECRET authenticates requests from n8n to Next.js
- TELEGRAM_WEBHOOK_SECRET is for Telegram → Next.js webhooks (different from n8n)
- Use SUPABASE_SERVICE_ROLE_KEY in n8n (bypasses RLS for automation)

## Next Steps

1. Configure the three credentials in n8n dashboard
2. Import the workflow from n8n-workflow-export.json
3. Test the workflow with a Telegram message
4. Verify AI responses are stored in Supabase
