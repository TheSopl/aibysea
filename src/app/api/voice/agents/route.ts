/**
 * Voice Agents API Routes
 *
 * Handles voice agent CRUD operations:
 * - GET: Returns list of all voice agents
 * - POST: Creates a new voice agent
 *
 * @route /api/voice/agents
 */

import { NextRequest, NextResponse } from 'next/server'
import { VoiceAgent, VoiceAgentRequest } from '@/types/voice'

/**
 * Mock data for voice agents
 * 5-8 agents with realistic metrics and status distribution
 */
const mockAgents: VoiceAgent[] = [
  {
    id: 'agent-001',
    name: 'Sarah Mitchell',
    status: 'available',
    phone_number: '+1-555-0101',
    language: 'en',
    skills: ['customer_support', 'appointment_booking'],
    total_calls: 342,
    avg_duration: 8.5,
    success_rate: 94.2,
    last_active: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
  },
  {
    id: 'agent-002',
    name: 'James Chen',
    status: 'on-call',
    phone_number: '+1-555-0102',
    language: 'en',
    skills: ['technical_support', 'sales'],
    total_calls: 521,
    avg_duration: 12.3,
    success_rate: 91.8,
    last_active: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'agent-003',
    name: 'Maria Garcia',
    status: 'busy',
    phone_number: '+1-555-0103',
    language: 'es',
    skills: ['customer_support', 'technical_support'],
    total_calls: 428,
    avg_duration: 9.7,
    success_rate: 92.5,
    last_active: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'agent-004',
    name: 'Robert Thompson',
    status: 'offline',
    phone_number: '+1-555-0104',
    language: 'en',
    skills: ['sales', 'appointment_booking'],
    total_calls: 612,
    avg_duration: 11.2,
    success_rate: 95.1,
    last_active: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'agent-005',
    name: 'Lisa Wong',
    status: 'available',
    phone_number: '+1-555-0105',
    language: 'en',
    skills: ['customer_support', 'sales'],
    total_calls: 289,
    avg_duration: 7.8,
    success_rate: 93.4,
    last_active: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'agent-006',
    name: 'Ahmed Hassan',
    status: 'available',
    phone_number: '+1-555-0106',
    language: 'ar',
    skills: ['technical_support', 'customer_support'],
    total_calls: 378,
    avg_duration: 10.1,
    success_rate: 90.7,
    last_active: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'agent-007',
    name: 'Jessica Brown',
    status: 'on-call',
    phone_number: '+1-555-0107',
    language: 'en',
    skills: ['appointment_booking'],
    total_calls: 195,
    avg_duration: 6.4,
    success_rate: 96.2,
    last_active: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'agent-008',
    name: 'David Martinez',
    status: 'busy',
    phone_number: '+1-555-0108',
    language: 'es',
    skills: ['sales', 'customer_support'],
    total_calls: 476,
    avg_duration: 13.5,
    success_rate: 88.9,
    last_active: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Store for created agents (in-memory, resets on server restart)
const createdAgents: VoiceAgent[] = []
let nextId = 100

/**
 * GET /api/voice/agents
 * Returns array of all voice agents
 */
export async function GET(): Promise<NextResponse> {
  try {
    const allAgents = [...mockAgents, ...createdAgents]
    return NextResponse.json(allAgents, { status: 200 })
  } catch (error) {
    console.error('[Voice Agents API] GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 },
    )
  }
}

/**
 * POST /api/voice/agents
 * Creates a new voice agent with mock data
 * Request body: VoiceAgentRequest
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as VoiceAgentRequest

    // Validate required fields
    if (!body.name || !body.status || !body.phone_number || !body.language) {
      return NextResponse.json(
        { error: 'Missing required fields: name, status, phone_number, language' },
        { status: 400 },
      )
    }

    // Validate status enum
    const validStatuses = ['available', 'on-call', 'offline', 'busy']
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: available, on-call, offline, busy' },
        { status: 400 },
      )
    }

    // Create new agent
    const newAgent: VoiceAgent = {
      id: `agent-${String(nextId).padStart(3, '0')}`,
      name: body.name,
      status: body.status,
      phone_number: body.phone_number,
      language: body.language,
      skills: body.skills || [],
      total_calls: 0,
      avg_duration: 0,
      success_rate: 0,
      last_active: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }

    nextId++
    createdAgents.push(newAgent)

    return NextResponse.json(newAgent, { status: 201 })
  } catch (error) {
    console.error('[Voice Agents API] POST error:', error)
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 },
    )
  }
}
