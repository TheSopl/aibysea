/**
 * Voice Call Log Detail API Routes
 *
 * Handles individual call operations:
 * - GET: Returns single call log by ID with full transcription
 * - PUT: Updates call log metadata
 * - DELETE: Removes call log
 *
 * @route /api/voice/calls/[id]
 */

import { NextRequest, NextResponse } from 'next/server'
import { CallLog, CallLogRequest } from '@/features/voice/types'

/**
 * Mock data for call logs (replicated from calls/route.ts)
 */
const mockCallLogs: CallLog[] = [
  {
    id: 'call-001',
    agent_id: 'agent-001',
    caller_number: '+1-555-1001',
    caller_name: 'John Smith',
    direction: 'inbound',
    status: 'completed',
    duration_seconds: 342,
    transcription:
      'Customer called about billing inquiry. Agent resolved the issue by reviewing account history. Customer satisfied with resolution.',
    sentiment: 'positive',
    keywords: ['billing', 'account', 'resolved'],
    started_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    ended_at: new Date(Date.now() - 54 * 60 * 1000).toISOString(),
  },
  {
    id: 'call-002',
    agent_id: 'agent-002',
    caller_number: '+1-555-1002',
    caller_name: 'Emma Johnson',
    direction: 'inbound',
    status: 'completed',
    duration_seconds: 615,
    transcription:
      'Customer requested technical support for connectivity issues. Agent provided step-by-step troubleshooting. Issue resolved successfully.',
    sentiment: 'neutral',
    keywords: ['technical_support', 'connectivity', 'troubleshooting'],
    started_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    ended_at: new Date(Date.now() - 2.9 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'call-003',
    agent_id: 'agent-003',
    caller_number: '+1-555-1003',
    caller_name: 'Carlos Rodriguez',
    direction: 'outbound',
    status: 'completed',
    duration_seconds: 487,
    transcription:
      'Agent called customer regarding appointment scheduling. Customer booked service for next week. Confirmation sent via SMS.',
    sentiment: 'positive',
    keywords: ['appointment', 'booking', 'service'],
    started_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    ended_at: new Date(Date.now() - 4.9 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'call-004',
    agent_id: 'agent-004',
    caller_number: '+1-555-1004',
    caller_name: 'Patricia Lee',
    direction: 'inbound',
    status: 'missed',
    duration_seconds: 0,
    transcription: '',
    sentiment: null,
    keywords: [],
    started_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    ended_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'call-005',
    agent_id: 'agent-005',
    caller_number: '+1-555-1005',
    caller_name: 'Michael Brown',
    direction: 'inbound',
    status: 'completed',
    duration_seconds: 423,
    transcription:
      'Customer inquired about sales options. Agent presented available plans. Customer interested in premium tier.',
    sentiment: 'positive',
    keywords: ['sales', 'premium', 'plans'],
    started_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    ended_at: new Date(Date.now() - 7.9 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'call-006',
    agent_id: 'agent-006',
    caller_number: '+1-555-1006',
    caller_name: 'Sophia Chen',
    direction: 'inbound',
    status: 'transferred',
    duration_seconds: 156,
    transcription:
      'Customer had complex billing question. Agent transferred to senior support specialist for detailed assistance.',
    sentiment: 'neutral',
    keywords: ['billing', 'transfer', 'escalation'],
    started_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    ended_at: new Date(Date.now() - 9.97 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'call-007',
    agent_id: 'agent-007',
    caller_number: '+1-555-1007',
    caller_name: 'David Wilson',
    direction: 'inbound',
    status: 'abandoned',
    duration_seconds: 45,
    transcription: '',
    sentiment: null,
    keywords: [],
    started_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    ended_at: new Date(Date.now() - 12 * 60 * 60 * 1000 + 45 * 1000).toISOString(),
  },
  {
    id: 'call-008',
    agent_id: 'agent-001',
    caller_number: '+1-555-1008',
    caller_name: 'Rachel Taylor',
    direction: 'inbound',
    status: 'completed',
    duration_seconds: 289,
    transcription:
      'Customer called with appointment confirmation. Agent verified details and sent reminder email. Customer satisfied.',
    sentiment: 'positive',
    keywords: ['appointment', 'confirmation', 'reminder'],
    started_at: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    ended_at: new Date(Date.now() - 13.95 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'call-009',
    agent_id: 'agent-008',
    caller_number: '+1-555-1009',
    caller_name: 'James Anderson',
    direction: 'outbound',
    status: 'completed',
    duration_seconds: 512,
    transcription:
      'Agent followed up on previous inquiry. Customer had additional questions about service features. All concerns addressed.',
    sentiment: 'neutral',
    keywords: ['follow-up', 'features', 'inquiry'],
    started_at: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
    ended_at: new Date(Date.now() - 15.91 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'call-010',
    agent_id: 'agent-002',
    caller_number: '+1-555-1010',
    caller_name: 'Lisa Martin',
    direction: 'inbound',
    status: 'completed',
    duration_seconds: 678,
    transcription:
      'Technical support call for integration issues. Agent debugged system configuration. Issue resolved with documentation provided.',
    sentiment: 'positive',
    keywords: ['technical_support', 'integration', 'configuration'],
    started_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    ended_at: new Date(Date.now() - 17.88 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'call-011',
    agent_id: 'agent-003',
    caller_number: '+1-555-1011',
    caller_name: 'Kevin White',
    direction: 'inbound',
    status: 'missed',
    duration_seconds: 0,
    transcription: '',
    sentiment: null,
    keywords: [],
    started_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    ended_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'call-012',
    agent_id: 'agent-004',
    caller_number: '+1-555-1012',
    caller_name: 'Angela Davis',
    direction: 'inbound',
    status: 'completed',
    duration_seconds: 234,
    transcription:
      'Customer called with billing dispute. Agent reviewed transactions and provided credit. Customer satisfied with outcome.',
    sentiment: 'positive',
    keywords: ['billing', 'dispute', 'credit'],
    started_at: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    ended_at: new Date(Date.now() - 21.96 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'call-013',
    agent_id: 'agent-005',
    caller_number: '+1-555-1013',
    caller_name: 'Christopher Moore',
    direction: 'outbound',
    status: 'completed',
    duration_seconds: 423,
    transcription:
      'Sales follow-up call. Agent presented new product features. Customer showed interest in trial period.',
    sentiment: 'positive',
    keywords: ['sales', 'product', 'trial'],
    started_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    ended_at: new Date(Date.now() - 23.9 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'call-014',
    agent_id: 'agent-006',
    caller_number: '+1-555-1014',
    caller_name: 'Jennifer Jackson',
    direction: 'inbound',
    status: 'transferred',
    duration_seconds: 187,
    transcription:
      'Customer had account security concern. Agent initiated security review and transferred to fraud prevention team.',
    sentiment: 'negative',
    keywords: ['security', 'fraud', 'account'],
    started_at: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    ended_at: new Date(Date.now() - 25.97 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'call-015',
    agent_id: 'agent-007',
    caller_number: '+1-555-1015',
    caller_name: 'Daniel Harris',
    direction: 'inbound',
    status: 'completed',
    duration_seconds: 345,
    transcription:
      'Appointment booking inquiry. Agent checked availability and scheduled appointment. Confirmation email sent.',
    sentiment: 'positive',
    keywords: ['appointment', 'booking', 'confirmation'],
    started_at: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    ended_at: new Date(Date.now() - 27.94 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'call-016',
    agent_id: 'agent-001',
    caller_number: '+1-555-1016',
    caller_name: 'Margaret Clark',
    direction: 'inbound',
    status: 'abandoned',
    duration_seconds: 23,
    transcription: '',
    sentiment: null,
    keywords: [],
    started_at: new Date(Date.now() - 29 * 60 * 60 * 1000).toISOString(),
    ended_at: new Date(Date.now() - 29 * 60 * 60 * 1000 + 23 * 1000).toISOString(),
  },
  {
    id: 'call-017',
    agent_id: 'agent-008',
    caller_number: '+1-555-1017',
    caller_name: 'Thomas Lewis',
    direction: 'outbound',
    status: 'completed',
    duration_seconds: 567,
    transcription:
      'Customer satisfaction survey call. Agent conducted full survey and thanked customer for business.',
    sentiment: 'positive',
    keywords: ['survey', 'satisfaction', 'feedback'],
    started_at: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    ended_at: new Date(Date.now() - 29.81 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'call-018',
    agent_id: 'agent-002',
    caller_number: '+1-555-1018',
    caller_name: 'Rebecca Walker',
    direction: 'inbound',
    status: 'completed',
    duration_seconds: 456,
    transcription:
      'Technical issue with dashboard. Agent remote connected and fixed configuration. Customer provided positive feedback.',
    sentiment: 'positive',
    keywords: ['technical_support', 'dashboard', 'configuration'],
    started_at: new Date(Date.now() - 32 * 60 * 60 * 1000).toISOString(),
    ended_at: new Date(Date.now() - 31.92 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'call-019',
    agent_id: 'agent-003',
    caller_number: '+1-555-1019',
    caller_name: 'George Hall',
    direction: 'inbound',
    status: 'completed',
    duration_seconds: 289,
    transcription:
      'Customer renewal notification. Agent discussed upgrade options. Customer renewed with additional services.',
    sentiment: 'positive',
    keywords: ['renewal', 'upgrade', 'services'],
    started_at: new Date(Date.now() - 33 * 60 * 60 * 1000).toISOString(),
    ended_at: new Date(Date.now() - 32.95 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'call-020',
    agent_id: 'agent-004',
    caller_number: '+1-555-1020',
    caller_name: 'Mary Young',
    direction: 'inbound',
    status: 'missed',
    duration_seconds: 0,
    transcription: '',
    sentiment: null,
    keywords: [],
    started_at: new Date(Date.now() - 34 * 60 * 60 * 1000).toISOString(),
    ended_at: new Date(Date.now() - 34 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'call-021',
    agent_id: 'agent-005',
    caller_number: '+1-555-1021',
    caller_name: 'Paul King',
    direction: 'inbound',
    status: 'transferred',
    duration_seconds: 234,
    transcription:
      'Complex query about licensing. Agent gathered information and transferred to licensing specialist.',
    sentiment: 'neutral',
    keywords: ['licensing', 'transfer', 'inquiry'],
    started_at: new Date(Date.now() - 35 * 60 * 60 * 1000).toISOString(),
    ended_at: new Date(Date.now() - 34.96 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'call-022',
    agent_id: 'agent-006',
    caller_number: '+1-555-1022',
    caller_name: 'Susan Wright',
    direction: 'outbound',
    status: 'completed',
    duration_seconds: 378,
    transcription:
      'Outbound sales call about new service bundle. Agent explained features and benefits. Customer requested demo.',
    sentiment: 'neutral',
    keywords: ['sales', 'service', 'demo'],
    started_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    ended_at: new Date(Date.now() - 35.89 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'call-023',
    agent_id: 'agent-007',
    caller_number: '+1-555-1023',
    caller_name: 'Ronald Green',
    direction: 'inbound',
    status: 'completed',
    duration_seconds: 512,
    transcription:
      'Customer had multiple appointment changes needed. Agent rescheduled all bookings with new times.',
    sentiment: 'positive',
    keywords: ['appointment', 'rescheduled', 'changes'],
    started_at: new Date(Date.now() - 37 * 60 * 60 * 1000).toISOString(),
    ended_at: new Date(Date.now() - 36.84 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'call-024',
    agent_id: 'agent-008',
    caller_number: '+1-555-1024',
    caller_name: 'Dorothy Adams',
    direction: 'inbound',
    status: 'completed',
    duration_seconds: 423,
    transcription:
      'Complaint about previous service. Agent apologized, reviewed records, and provided compensation.',
    sentiment: 'negative',
    keywords: ['complaint', 'service', 'compensation'],
    started_at: new Date(Date.now() - 38 * 60 * 60 * 1000).toISOString(),
    ended_at: new Date(Date.now() - 37.88 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'call-025',
    agent_id: 'agent-001',
    caller_number: '+1-555-1025',
    caller_name: 'Kenneth Nelson',
    direction: 'inbound',
    status: 'completed',
    duration_seconds: 267,
    transcription:
      'General inquiry about features. Agent provided comprehensive product overview. Customer interested in signing up.',
    sentiment: 'positive',
    keywords: ['inquiry', 'features', 'signup'],
    started_at: new Date(Date.now() - 39 * 60 * 60 * 1000).toISOString(),
    ended_at: new Date(Date.now() - 38.95 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'call-026',
    agent_id: 'agent-002',
    caller_number: '+1-555-1026',
    caller_name: 'Carol Carter',
    direction: 'inbound',
    status: 'missed',
    duration_seconds: 0,
    transcription: '',
    sentiment: null,
    keywords: [],
    started_at: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString(),
    ended_at: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'call-027',
    agent_id: 'agent-003',
    caller_number: '+1-555-1027',
    caller_name: 'Steven Roberts',
    direction: 'outbound',
    status: 'completed',
    duration_seconds: 334,
    transcription:
      'Appointment reminder call. Agent confirmed appointment and answered preparatory questions.',
    sentiment: 'positive',
    keywords: ['appointment', 'reminder', 'confirmation'],
    started_at: new Date(Date.now() - 41 * 60 * 60 * 1000).toISOString(),
    ended_at: new Date(Date.now() - 40.94 * 60 * 60 * 1000).toISOString(),
  },
]

// Store for created call logs (in-memory)
const createdCallLogs: CallLog[] = []

/**
 * GET /api/voice/calls/[id]
 * Returns single call log by ID with full details
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await context.params

    if (!id) {
      return NextResponse.json(
        { error: 'Invalid call ID' },
        { status: 400 },
      )
    }

    // Search in mock logs first, then created logs
    const callLog = mockCallLogs.find((log) => log.id === id) || createdCallLogs.find((log) => log.id === id)

    if (!callLog) {
      return NextResponse.json(
        { error: 'Call log not found' },
        { status: 404 },
      )
    }

    return NextResponse.json(callLog, { status: 200 })
  } catch (error) {
    console.error('[Voice Call Detail API] GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch call log' },
      { status: 500 },
    )
  }
}

/**
 * PUT /api/voice/calls/[id]
 * Updates call log metadata
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await context.params
    const body = (await request.json()) as Partial<CallLogRequest>

    if (!id) {
      return NextResponse.json(
        { error: 'Invalid call ID' },
        { status: 400 },
      )
    }

    // Find call log in mock or created logs
    let callLog = mockCallLogs.find((log) => log.id === id)
    let isCreated = false

    if (!callLog) {
      callLog = createdCallLogs.find((log) => log.id === id)
      isCreated = true
    }

    if (!callLog) {
      return NextResponse.json(
        { error: 'Call log not found' },
        { status: 404 },
      )
    }

    // Update call log fields
    const updatedCallLog: CallLog = {
      ...callLog,
      sentiment: body.sentiment ?? callLog.sentiment,
      keywords: body.keywords ?? callLog.keywords,
      transcription: body.transcription ?? callLog.transcription,
    }

    // Update in appropriate store
    if (isCreated) {
      const index = createdCallLogs.findIndex((log) => log.id === id)
      createdCallLogs[index] = updatedCallLog
    } else {
      mockCallLogs[mockCallLogs.findIndex((log) => log.id === id)] = updatedCallLog
    }

    return NextResponse.json(updatedCallLog, { status: 200 })
  } catch (error) {
    console.error('[Voice Call Detail API] PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update call log' },
      { status: 500 },
    )
  }
}

/**
 * DELETE /api/voice/calls/[id]
 * Removes a call log
 */
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await context.params

    if (!id) {
      return NextResponse.json(
        { error: 'Invalid call ID' },
        { status: 400 },
      )
    }

    // Check if call log exists
    const mockIndex = mockCallLogs.findIndex((log) => log.id === id)
    const createdIndex = createdCallLogs.findIndex((log) => log.id === id)

    if (mockIndex === -1 && createdIndex === -1) {
      return NextResponse.json(
        { error: 'Call log not found' },
        { status: 404 },
      )
    }

    // Remove from appropriate store
    if (createdIndex !== -1) {
      createdCallLogs.splice(createdIndex, 1)
    } else if (mockIndex !== -1) {
      mockCallLogs.splice(mockIndex, 1)
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('[Voice Call Detail API] DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to delete call log' },
      { status: 500 },
    )
  }
}
