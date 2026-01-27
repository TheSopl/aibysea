# WhatsApp Integration Troubleshooting Guide

## Problem: "24-hour messaging window expired" or "Account not registered" Errors

### Symptoms
- ❌ Error: "24-hour messaging window expired. Template message required."
- ❌ Error: "WhatsApp Error 133010: Account not registered"
- ❌ Error: "WhatsApp Error 100: Object with ID does not exist"
- ❌ Messages not sending from inbox
- ❌ Can't send to test phone numbers even though they're verified

### Root Causes & Solutions

## 1. Expired Access Token (Most Common)

**How to Identify:**
```
Error validating access token: Session has expired
```

**Solution:**
1. Go to Meta Business Manager: https://business.facebook.com
2. Navigate to: WhatsApp → API Setup
3. Generate a **new System User Token** (Permanent, not temporary!)
4. Copy the token
5. Update in **Vercel Environment Variables**:
   - Go to: Vercel Dashboard → Your Project → Settings → Environment Variables
   - Find: `WHATSAPP_ACCESS_TOKEN`
   - Update with new token
   - **Save**
6. Redeploy: Settings → Deployments → Redeploy latest

**Also update locally:**
```bash
# Update .env.local
WHATSAPP_ACCESS_TOKEN=your_new_token_here
```

---

## 2. Wrong Phone Number ID

**How to Identify:**
```
Object with ID 'XXXXXXXXX' does not exist
```

**Solution:**
1. Get the correct Phone Number ID from Meta:
   - Meta Business Manager → WhatsApp → API Setup
   - Copy the Phone Number ID (should be like: `866310636573920`)

2. Update in **Vercel Environment Variables**:
   - Go to: Vercel Dashboard → Settings → Environment Variables
   - Find: `WHATSAPP_PHONE_NUMBER_ID`
   - Update with correct ID
   - **Save**

3. Redeploy

**Also update locally:**
```bash
# Update .env.local
WHATSAPP_PHONE_NUMBER_ID=866310636573920
```

---

## 3. 24-Hour Window Issue (Database Not Updating)

**How to Identify:**
- Messages show in Vercel logs: `[WhatsApp Processor] Processing message`
- But `last_customer_message_at` in database is old/null

**Check Database:**
```sql
SELECT
  c.id,
  co.phone,
  c.last_customer_message_at,
  EXTRACT(EPOCH FROM (NOW() - c.last_customer_message_at)) / 3600 as hours_ago
FROM conversations c
JOIN contacts co ON c.contact_id = co.id
WHERE co.phone = '971543638614';
```

If `hours_ago` > 24, that's the problem.

**Solution - Webhook Not Receiving Messages:**

1. Check webhook URL in Meta Business Manager:
   - Go to: developers.facebook.com → Your App → WhatsApp → Configuration
   - Callback URL should be: `https://aibysea.vercel.app/api/webhooks/whatsapp`
   - NOT ngrok or localhost!
   - Verify Token: `whatsapp_verify_a3b9c2f1e4d8x7y6`
   - Click "Verify and Save"

2. Make sure "messages" field is subscribed (checked)

3. Test webhook by sending a WhatsApp message and checking Vercel Runtime Logs for:
   ```
   [WhatsApp Processor] Message saved successfully
   ```

**Quick Fix (Manual Database Update):**
```sql
-- Force update to open 24-hour window NOW
UPDATE conversations
SET last_customer_message_at = NOW()
WHERE contact_id IN (
  SELECT id FROM contacts WHERE phone = '971543638614'
);
```

---

## 4. Webhook Database Error (Duplicate Contact)

**How to Identify:**
```
Error: Failed to create contact: duplicate key value violates unique constraint
```

**Status:** ✅ Already fixed in commit `6a0af99`

The webhook processor now handles duplicate contacts correctly with `.maybeSingle()` instead of `.single()`.

---

## 5. Test Mode Restrictions

**Issue:** WhatsApp Business in Test/Development mode only allows messaging verified test recipients.

**Solution:**
1. Go to: Meta Business Manager → WhatsApp → Phone Numbers
2. Add test recipient: `+971543638614`
3. Verify on the recipient's phone (they'll receive a WhatsApp verification message)
4. Wait 5-10 minutes for propagation

**Important:** Even with verified test numbers, expired tokens will still fail!

---

## Complete Environment Variables Checklist

Make sure these match in **BOTH** `.env.local` AND Vercel:

```bash
# WhatsApp Cloud API Configuration
WHATSAPP_PHONE_NUMBER_ID=866310636573920
WHATSAPP_ACCESS_TOKEN=EAAc... (your current valid token)
WHATSAPP_WEBHOOK_VERIFY_TOKEN=whatsapp_verify_a3b9c2f1e4d8x7y6
WHATSAPP_APP_SECRET=0faa7168c235fac5d67ad283b6646d12
WHATSAPP_API_VERSION=v21.0
```

---

## Quick Diagnostic Commands

### Test if webhook is accessible:
```bash
curl "https://aibysea.vercel.app/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=whatsapp_verify_a3b9c2f1e4d8x7y6&hub.challenge=test123"
# Should return: test123
```

### Test if access token works:
```bash
curl -X POST https://graph.facebook.com/v21.0/866310636573920/messages \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "971543638614",
    "type": "template",
    "template": {
      "name": "hello_world",
      "language": { "code": "en_US" }
    }
  }'
```

### Check conversation timestamp:
Run in Supabase SQL Editor:
```sql
SELECT
  c.id,
  co.phone,
  c.last_customer_message_at,
  c.last_message_at,
  EXTRACT(EPOCH FROM (NOW() - c.last_customer_message_at)) / 3600 as hours_ago
FROM conversations c
JOIN contacts co ON c.contact_id = co.id
WHERE co.phone = '971543638614';
```

---

## Prevention Checklist

✅ Use **System User Permanent Tokens** (not temporary ones)
✅ Keep Vercel and local `.env.local` environment variables in sync
✅ Set webhook URL to production domain, not ngrok/localhost
✅ Verify test recipients in Meta Business Manager
✅ Monitor Vercel Runtime Logs for webhook processing
✅ Check Supabase database timestamps when debugging 24-hour window

---

## Common Mistakes

❌ Updating `.env.local` but forgetting to update Vercel
❌ Using temporary access tokens that expire quickly
❌ Wrong webhook URL (ngrok instead of production)
❌ Not verifying test recipients in test mode
❌ Mixing up Phone Number IDs between different apps

---

## Files Involved

- **Webhook Handler:** `src/app/api/webhooks/whatsapp/route.ts`
- **Message Processor:** `src/services/whatsapp/processor.ts`
- **Send API:** `src/app/api/whatsapp/send/route.ts`
- **WhatsApp Client:** `src/lib/whatsapp/client.ts`
- **Inbox UI:** `src/app/[locale]/(main)/inbox/page.tsx`

---

## Last Fixed: 2026-01-27

**Final Solution:**
- Updated expired access token in Vercel environment variables
- Corrected Phone Number ID mismatch
- All messages now sending successfully ✅
