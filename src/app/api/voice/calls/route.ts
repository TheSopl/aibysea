/**
 * Voice Call Logs API Routes
 *
 * Handles call log operations:
 * - GET: Returns call logs with filtering by agent, status, date range, direction, and pagination
 * - POST: Creates a new call log
 *
 * @route /api/voice/calls
 */

import { NextRequest, NextResponse } from 'next/server'
import { CallLog, CallLogRequest } from '@/features/voice/types'

/**
 * Mock data for call logs
 * 50+ call logs with realistic distribution
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
let nextId = 100

/**
 * Parse date from string, handling ISO format
 */
function parseDate(dateString: string): Date | null {
  try {
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? null : date
  } catch {
    return null
  }
}

/**
 * GET /api/voice/calls
 * Returns call logs with optional filtering and pagination
 * Query parameters:
 * - agent_id: Filter by agent ID
 * - status: Filter by call status
 * - from_date: Start date (YYYY-MM-DD)
 * - to_date: End date (YYYY-MM-DD)
 * - direction: Filter by direction (inbound/outbound)
 * - limit: Results per page (default: 50)
 * - offset: Results offset (default: 0)
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams

    // Get filter parameters
    const agentId = searchParams.get('agent_id')
    const status = searchParams.get('status')
    const fromDate = searchParams.get('from_date')
    const toDate = searchParams.get('to_date')
    const direction = searchParams.get('direction')
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50', 10), 500)
    const offset = parseInt(searchParams.get('offset') ?? '0', 10)

    // Combine all logs
    let allLogs = [...mockCallLogs, ...createdCallLogs]

    // Apply filters
    if (agentId) {
      allLogs = allLogs.filter((log) => log.agent_id === agentId)
    }

    if (status) {
      allLogs = allLogs.filter((log) => log.status === status)
    }

    if (direction) {
      allLogs = allLogs.filter((log) => log.direction === direction)
    }

    if (fromDate) {
      const startDate = parseDate(fromDate)
      if (startDate) {
        allLogs = allLogs.filter((log) => new Date(log.started_at) >= startDate)
      }
    }

    if (toDate) {
      const endDate = parseDate(toDate)
      if (endDate) {
        // Set to end of day
        endDate.setHours(23, 59, 59, 999)
        allLogs = allLogs.filter((log) => new Date(log.started_at) <= endDate)
      }
    }

    // Sort by started_at descending (most recent first)
    allLogs.sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())

    // Apply pagination
    const paginatedLogs = allLogs.slice(offset, offset + limit)

    return NextResponse.json(
      {
        data: paginatedLogs,
        total: allLogs.length,
        limit,
        offset,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('[Voice Calls API] GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch call logs' },
      { status: 500 },
    )
  }
}

/**
 * POST /api/voice/calls
 * Creates a new call log
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as CallLogRequest

    // Validate required fields
    if (
      !body.agent_id ||
      !body.caller_number ||
      !body.direction ||
      !body.status ||
      body.duration_seconds === undefined
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    // Create new call log
    const now = new Date()
    const newCallLog: CallLog = {
      id: `call-${String(nextId).padStart(3, '0')}`,
      agent_id: body.agent_id,
      caller_number: body.caller_number,
      caller_name: body.caller_name,
      direction: body.direction,
      status: body.status,
      duration_seconds: body.duration_seconds,
      transcription: body.transcription,
      sentiment: body.sentiment ?? null,
      keywords: body.keywords ?? [],
      started_at: now.toISOString(),
      ended_at: new Date(now.getTime() + body.duration_seconds * 1000).toISOString(),
    }

    nextId++
    createdCallLogs.push(newCallLog)

    return NextResponse.json(newCallLog, { status: 201 })
  } catch (error) {
    console.error('[Voice Calls API] POST error:', error)
    return NextResponse.json(
      { error: 'Failed to create call log' },
      { status: 500 },
    )
  }
}
