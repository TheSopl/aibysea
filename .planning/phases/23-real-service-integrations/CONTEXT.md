# Phase 23: Real Service Integrations — Context

**Goal:** Replace mock data with real integrations for Voice Agents (Twilio/ElevenLabs/Bland.ai) and Document Intelligence (GPT-4 Vision, OCR), connect to Supabase.

**Source:** [codebase/CONCERNS.md](../../codebase/CONCERNS.md) — Broken / Incomplete Functionality (lines 125-183)

---

## 💔 Critical Issues to Fix

### 1. Voice Agents Module is Mock Data Only
**Current State:**
- All Voice API endpoints return hardcoded arrays
- No real voice provider integration
- Voice module is a non-functional UI demo

**From CONCERNS.md:**
```
### Mock Data Modules (Voice & Documents)
- Issue: Voice Agents and Document Intelligence use hardcoded mock data
- Files:
  - src/app/api/voice/**/*.ts - All endpoints return mock arrays
- Why: Real integrations deferred to v5.0 (per STATE.md)
- Impact: Voice module is non-functional demo
- Blocks: Cannot use voice services in production
```

**Mock endpoints to replace:**
```
GET  /api/voice/agents          → Returns MOCK_VOICE_AGENTS array
GET  /api/voice/calls           → Returns MOCK_CALL_LOGS array
GET  /api/voice/phone-numbers   → Returns MOCK_PHONE_NUMBERS array
POST /api/voice/agents          → Fakes creation, no persistence
```

**From STATE.md (Phase 11-01):**
```
- Phase 11-01: Voice agents API uses pure mock data, Supabase integration deferred
- URL query parameters for filtering (agent_id, status, from_date, to_date, direction)
- Pagination with limit/offset pattern, capped at 500 results per page
```

---

### 2. Documents Module is Mock Data Only
**Current State:**
- All Document API endpoints return hardcoded arrays
- No real document processing
- Documents module is a non-functional UI demo

**From CONCERNS.md:**
```
- Files:
  - src/app/api/documents/**/*.ts - All endpoints return mock data
- Impact: Documents module is non-functional demo
- Blocks: Cannot use document services in production
```

**Mock endpoints to replace:**
```
GET  /api/documents/jobs        → Returns MOCK_EXTRACTION_JOBS array
GET  /api/documents/templates   → Returns MOCK_TEMPLATES array
POST /api/documents/upload      → Fakes upload, no processing
POST /api/documents/templates   → Fakes creation, no persistence
```

**From STATE.md (Phase 11-02):**
```
- Phase 11-02: Document Intelligence API uses pure mock data, Supabase integration deferred
- URL query parameters for filtering (type, status, from_date, to_date)
- Soft delete for templates via archived status
```

---

## 🎯 Voice Agents: Technical Approach

### Provider Selection (Research Required)
**Options:**
1. **Twilio Voice API**
   - Pros: Industry standard, excellent docs, reliable
   - Cons: More expensive, complex setup
   - Use case: Traditional phone calls, IVR

2. **ElevenLabs**
   - Pros: Best AI voice quality, simple API
   - Cons: Text-to-speech only (no inbound calls)
   - Use case: Outbound AI voice notifications

3. **Bland.ai**
   - Pros: Built for AI phone agents, conversational
   - Cons: Newer service, fewer features
   - Use case: AI-powered phone conversations

**Recommended approach:**
- Start with **Twilio** for real phone infrastructure
- Add **ElevenLabs** for high-quality AI voice (optional)
- Or use **Bland.ai** for full AI agent experience

### Twilio Integration Architecture
**Flow:**
1. User creates voice agent in UI
2. Backend provisions Twilio phone number
3. Configure webhook: `https://yourdomain.com/api/webhooks/twilio/voice`
4. Incoming call → Twilio webhook → Process with AI → TwiML response
5. Store call logs in Supabase

**Webhook handler:**
```typescript
// src/app/api/webhooks/twilio/voice/route.ts
export async function POST(req: Request) {
  const formData = await req.formData()
  const callSid = formData.get('CallSid')
  const from = formData.get('From')
  const to = formData.get('To')

  // Store call in database
  await supabase.from('voice_calls').insert({
    call_sid: callSid,
    from_number: from,
    to_number: to,
    status: 'in-progress',
    started_at: new Date()
  })

  // Generate TwiML response
  const twiml = `
    <Response>
      <Say voice="Polly.Joanna">Hello, this is your AI assistant.</Say>
      <Record transcribe="true" transcribeCallback="/api/webhooks/twilio/transcription" />
    </Response>
  `

  return new Response(twiml, {
    headers: { 'Content-Type': 'text/xml' }
  })
}
```

### Supabase Tables for Voice
```sql
-- Voice agents (replace mock)
CREATE TABLE voice_agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone_number TEXT,
  voice_provider TEXT, -- 'twilio', 'elevenlabs', 'bland'
  voice_config JSONB, -- Provider-specific settings
  prompt TEXT,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Phone numbers
CREATE TABLE phone_numbers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number TEXT UNIQUE NOT NULL,
  country_code TEXT,
  provider TEXT, -- 'twilio'
  provider_sid TEXT, -- Twilio PhoneNumber SID
  capabilities JSONB, -- { voice: true, sms: true }
  assigned_agent_id UUID REFERENCES voice_agents(id),
  status TEXT, -- 'active', 'inactive'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Call logs
CREATE TABLE voice_calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  call_sid TEXT UNIQUE, -- Twilio Call SID
  agent_id UUID REFERENCES voice_agents(id),
  from_number TEXT NOT NULL,
  to_number TEXT NOT NULL,
  direction TEXT, -- 'inbound', 'outbound'
  status TEXT, -- 'queued', 'ringing', 'in-progress', 'completed', 'failed'
  duration INTEGER, -- seconds
  recording_url TEXT,
  transcription TEXT,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🎯 Document Intelligence: Technical Approach

### Processing Pipeline
**Options:**
1. **GPT-4 Vision** (recommended)
   - Extract structured data from documents
   - Supports templates for field extraction
   - High accuracy

2. **OCR Services** (supplement)
   - Tesseract (open source, free)
   - Google Cloud Vision (paid, high accuracy)
   - AWS Textract (paid, specialized for forms)

**Recommended approach:**
- Use **GPT-4 Vision** for intelligent extraction
- Add **Tesseract** for text-only documents (cost savings)
- Store extracted data in Supabase

### GPT-4 Vision Integration
```typescript
// src/lib/documents/extractor.ts
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function extractFromDocument(
  imageUrl: string,
  template: DocumentTemplate
) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Extract the following fields from this document: ${template.fields.join(', ')}`
          },
          {
            type: "image_url",
            image_url: { url: imageUrl }
          }
        ]
      }
    ],
    max_tokens: 1000
  })

  // Parse structured response
  return JSON.parse(completion.choices[0].message.content)
}
```

### Document Upload Flow
**Process:**
1. User uploads document (PDF, image)
2. Upload to Supabase Storage
3. Create extraction job in database
4. Background worker processes with GPT-4 Vision
5. Store extracted data
6. Update job status → 'completed'

**Background processing:**
- Use Supabase Edge Functions or external worker (Vercel Cron, Inngest)
- Process jobs asynchronously to avoid timeout

### Supabase Tables for Documents
```sql
-- Document templates
CREATE TABLE document_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  document_type TEXT, -- 'invoice', 'receipt', 'id_card', etc.
  fields JSONB NOT NULL, -- [{ name: 'total', type: 'number' }]
  extraction_prompt TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'archived'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Uploaded documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL, -- Supabase Storage URL
  file_size INTEGER,
  mime_type TEXT,
  template_id UUID REFERENCES document_templates(id),
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Extraction jobs
CREATE TABLE extraction_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id),
  template_id UUID REFERENCES document_templates(id),
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  extracted_data JSONB, -- Structured data from extraction
  confidence_score NUMERIC(3,2), -- 0.00 to 1.00
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 📁 Files to Create/Modify

### Voice Agents
```
src/lib/voice/twilio.ts                    # Twilio client wrapper
src/lib/voice/types.ts                     # Voice types (replace mock)
src/app/api/voice/agents/route.ts          # REPLACE: Supabase queries
src/app/api/voice/calls/route.ts           # REPLACE: Supabase queries
src/app/api/voice/phone-numbers/route.ts   # REPLACE: Supabase queries
src/app/api/webhooks/twilio/voice/route.ts # NEW: Incoming call handler
src/app/api/webhooks/twilio/transcription/route.ts # NEW: Transcription callback
```

### Document Intelligence
```
src/lib/documents/extractor.ts             # GPT-4 Vision integration
src/lib/documents/ocr.ts                   # Tesseract fallback (optional)
src/lib/documents/types.ts                 # Document types (replace mock)
src/app/api/documents/upload/route.ts      # REPLACE: Real upload to Supabase Storage
src/app/api/documents/jobs/route.ts        # REPLACE: Supabase queries
src/app/api/documents/templates/route.ts   # REPLACE: Supabase queries
src/app/api/documents/process/route.ts     # NEW: Background extraction job
```

### Supabase
```
supabase/migrations/00X_voice_tables.sql   # Voice tables
supabase/migrations/00Y_document_tables.sql # Document tables
```

---

## 🔧 Environment Variables Required

```bash
# Voice providers
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+1234567890
ELEVENLABS_API_KEY=xxxxx  # Optional

# Document processing
OPENAI_API_KEY=sk-xxxxx
GOOGLE_CLOUD_VISION_API_KEY=xxxxx  # Optional OCR

# Supabase Storage (for document uploads)
NEXT_PUBLIC_SUPABASE_URL=xxxxx  # Already exists
SUPABASE_SERVICE_ROLE_KEY=xxxxx  # Already exists
```

---

## 🎯 Success Criteria

Phase 23 is complete when:

- [ ] **Voice Agents:**
  - [ ] Twilio account set up and configured
  - [ ] Supabase tables created (`voice_agents`, `phone_numbers`, `voice_calls`)
  - [ ] Real phone number provisioned
  - [ ] Incoming call webhook working
  - [ ] Call logs persisted to database
  - [ ] UI displays real call data (not mock)
  - [ ] Transcription working (optional)

- [ ] **Document Intelligence:**
  - [ ] OpenAI API key configured
  - [ ] Supabase tables created (`document_templates`, `documents`, `extraction_jobs`)
  - [ ] Document upload to Supabase Storage working
  - [ ] GPT-4 Vision extraction working
  - [ ] Extracted data saved to database
  - [ ] UI displays real extraction jobs (not mock)
  - [ ] Background job processing implemented

- [ ] **Mock Data Removed:**
  - [ ] All `MOCK_*` constants deleted
  - [ ] API routes return real data from Supabase
  - [ ] UI pages work with real data

- [ ] **Testing:**
  - [ ] Test real phone call end-to-end
  - [ ] Test document upload and extraction
  - [ ] Verify webhook security (Twilio signature validation)
  - [ ] Load testing for background jobs

---

## 📚 Related Documentation

**Codebase analysis:**
- [codebase/CONCERNS.md](../../codebase/CONCERNS.md) — Mock Data Modules (lines 127-138)
- [codebase/INTEGRATIONS.md](../../codebase/INTEGRATIONS.md) — Current mock integrations

**External resources:**
- Twilio Voice: https://www.twilio.com/docs/voice
- Twilio Webhooks: https://www.twilio.com/docs/usage/webhooks
- ElevenLabs: https://elevenlabs.io/docs
- Bland.ai: https://docs.bland.ai/
- OpenAI GPT-4 Vision: https://platform.openai.com/docs/guides/vision
- Supabase Storage: https://supabase.com/docs/guides/storage

**Prior decisions (STATE.md):**
- Phase 11-01: Voice API with URL query parameters for filtering
- Phase 11-02: Document API with soft delete for templates
- Pagination pattern: limit/offset, capped at 500

---

## 🚧 Blockers & Dependencies

**Depends on:**
- Phase 20 complete (migrations system needed for new tables)
- Phase 21 complete (UI polish makes real data more impressive)

**Blocks:**
- None (independent work)

**External dependencies:**
- Twilio account (sign up, verify phone number)
- OpenAI API access (GPT-4 Vision waitlist may exist)
- Payment method for Twilio/OpenAI (both paid services)

**Risks:**
- Twilio setup can be complex (webhooks, TwiML)
- GPT-4 Vision rate limits (handle gracefully)
- Background job processing needs infrastructure (Edge Functions or external)
- Cost: Real usage incurs API charges

**Mitigation:**
- Start with Twilio trial account
- Implement rate limiting and error handling
- Use Supabase Edge Functions for background jobs (free tier)
- Monitor API usage and costs

---

## 💡 Planning Notes

**Suggested plan breakdown:**
1. **23-01:** Voice Agent Infrastructure (Twilio setup, database tables, webhook handler)
2. **23-02:** Voice Agent API Integration (replace mock endpoints, connect UI)
3. **23-03:** Document Processing Infrastructure (GPT-4 Vision, database tables, storage)
4. **23-04:** Document API Integration (replace mock endpoints, background jobs, connect UI)

**Or combine into 2 major plans:**
1. **23-01:** Voice Agents (complete Twilio integration end-to-end)
2. **23-02:** Document Intelligence (complete GPT-4 Vision integration end-to-end)

**Estimated complexity:** Very High (two complex integrations, external services, webhooks, background processing)

**Research required:**
- Twilio Voice API patterns (TwiML, webhooks, call flow)
- ElevenLabs vs Bland.ai comparison (if considering alternatives)
- GPT-4 Vision structured output best practices
- Background job processing options (Edge Functions vs external worker)

**Testing strategy:**
- Manual: Make real phone calls, upload real documents
- Automated: Mock Twilio webhooks, test extraction logic
- Integration: End-to-end tests with real services (staging environment)

---

*Context prepared: 2026-02-02*
*Ready for: /gsd:plan-phase 23 (or /gsd:research-phase 23 first)*
