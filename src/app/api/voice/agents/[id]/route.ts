/**
 * Voice Agent Detail API Routes
 *
 * Handles individual agent operations:
 * - GET: Returns single agent by ID
 * - PUT: Updates an agent
 * - DELETE: Removes an agent
 *
 * @route /api/voice/agents/[id]
 */

import { NextRequest, NextResponse } from 'next/server'
import { VoiceAgent, VoiceAgentRequest } from '@/types/voice'

/**
 * Mock data for voice agents (replicated from agents/route.ts for now)
 * In production, this would be fetched from database
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
    last_active: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
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
    last_active: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
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
    last_active: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
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

// Store for created agents (in-memory)
let createdAgents: VoiceAgent[] = []

/**
 * GET /api/voice/agents/[id]
 * Returns single agent by ID
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await context.params

    if (!id) {
      return NextResponse.json(
        { error: 'Invalid agent ID' },
        { status: 400 },
      )
    }

    // Search in mock agents first, then created agents
    const agent = mockAgents.find((a) => a.id === id) || createdAgents.find((a) => a.id === id)

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 },
      )
    }

    return NextResponse.json(agent, { status: 200 })
  } catch (error) {
    console.error('[Voice Agent Detail API] GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agent' },
      { status: 500 },
    )
  }
}

/**
 * PUT /api/voice/agents/[id]
 * Updates an agent with provided fields
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await context.params
    const body = (await request.json()) as Partial<VoiceAgentRequest>

    if (!id) {
      return NextResponse.json(
        { error: 'Invalid agent ID' },
        { status: 400 },
      )
    }

    // Find agent in mock or created agents
    let agent = mockAgents.find((a) => a.id === id)
    let isCreated = false

    if (!agent) {
      agent = createdAgents.find((a) => a.id === id)
      isCreated = true
    }

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 },
      )
    }

    // Update agent fields
    const updatedAgent: VoiceAgent = {
      ...agent,
      name: body.name ?? agent.name,
      status: body.status ?? agent.status,
      phone_number: body.phone_number ?? agent.phone_number,
      language: body.language ?? agent.language,
      skills: body.skills ?? agent.skills,
      last_active: new Date().toISOString(),
    }

    // Update in appropriate store
    if (isCreated) {
      const index = createdAgents.findIndex((a) => a.id === id)
      createdAgents[index] = updatedAgent
    } else {
      // For mock agents, we can't actually update but return the updated version
      // In production, this would update the database
      mockAgents[mockAgents.findIndex((a) => a.id === id)] = updatedAgent
    }

    return NextResponse.json(updatedAgent, { status: 200 })
  } catch (error) {
    console.error('[Voice Agent Detail API] PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update agent' },
      { status: 500 },
    )
  }
}

/**
 * DELETE /api/voice/agents/[id]
 * Removes an agent
 */
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await context.params

    if (!id) {
      return NextResponse.json(
        { error: 'Invalid agent ID' },
        { status: 400 },
      )
    }

    // Check if agent exists
    const mockIndex = mockAgents.findIndex((a) => a.id === id)
    const createdIndex = createdAgents.findIndex((a) => a.id === id)

    if (mockIndex === -1 && createdIndex === -1) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 },
      )
    }

    // Remove from appropriate store
    if (createdIndex !== -1) {
      createdAgents.splice(createdIndex, 1)
    } else if (mockIndex !== -1) {
      // In production, this would soft delete from database
      mockAgents.splice(mockIndex, 1)
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('[Voice Agent Detail API] DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to delete agent' },
      { status: 500 },
    )
  }
}
