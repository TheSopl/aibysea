/**
 * Document Template Detail Routes
 *
 * Handles individual template operations:
 * - GET: Returns a single template by ID
 * - PUT: Updates a template
 * - DELETE: Soft deletes a template (archives it)
 *
 * @route /api/documents/templates/[id]
 */

import { NextRequest, NextResponse } from 'next/server'
import { Template, UpdateTemplateRequest } from '@/types/documents'

// Mock templates data (same as in the list route - in real implementation would query DB)
const mockTemplates: Template[] = [
  {
    id: 'tmpl-001',
    name: 'Standard Invoice',
    description: 'Template for extracting data from standard business invoices',
    type: 'invoice',
    fields: [
      {
        name: 'invoice_number',
        type: 'text',
        required: true,
        validation: '^INV-[0-9]{6}$',
      },
      {
        name: 'invoice_date',
        type: 'date',
        required: true,
      },
      {
        name: 'total_amount',
        type: 'currency',
        required: true,
      },
      {
        name: 'vendor_name',
        type: 'text',
        required: true,
      },
      {
        name: 'line_items',
        type: 'text',
        required: false,
      },
    ],
    status: 'active',
    created_by: 'agent-001',
    usage_count: 487,
    success_rate: 96.2,
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'tmpl-002',
    name: 'Retail Receipt',
    description:
      'Template for retail receipts with store info and transaction details',
    type: 'receipt',
    fields: [
      {
        name: 'receipt_number',
        type: 'text',
        required: true,
      },
      {
        name: 'transaction_date',
        type: 'date',
        required: true,
      },
      {
        name: 'total_paid',
        type: 'currency',
        required: true,
      },
      {
        name: 'merchant_name',
        type: 'text',
        required: true,
      },
    ],
    status: 'active',
    created_by: 'agent-002',
    usage_count: 234,
    success_rate: 94.8,
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Store for updates (in-memory, resets on server restart)
let templateUpdates: Map<string, Template> = new Map()

/**
 * GET /api/documents/templates/[id]
 * Returns a single template by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params

    // Check updates first
    if (templateUpdates.has(id)) {
      return NextResponse.json(templateUpdates.get(id), { status: 200 })
    }

    // Check mock data
    const template = mockTemplates.find((t) => t.id === id)

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 },
      )
    }

    return NextResponse.json(template, { status: 200 })
  } catch (error) {
    console.error('[Template Detail API] GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 },
    )
  }
}

/**
 * PUT /api/documents/templates/[id]
 * Updates a template
 * Request body: UpdateTemplateRequest
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params
    const body = (await request.json()) as UpdateTemplateRequest

    // Find existing template
    let template = templateUpdates.get(id)
    if (!template) {
      template = mockTemplates.find((t) => t.id === id)
    }

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 },
      )
    }

    // Update fields
    const updatedTemplate: Template = {
      ...template,
      ...(body.name !== undefined && { name: body.name }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.fields !== undefined && { fields: body.fields }),
      ...(body.status !== undefined && { status: body.status }),
      updated_at: new Date().toISOString(),
    }

    templateUpdates.set(id, updatedTemplate)

    return NextResponse.json(updatedTemplate, { status: 200 })
  } catch (error) {
    console.error('[Template Detail API] PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 },
    )
  }
}

/**
 * DELETE /api/documents/templates/[id]
 * Soft deletes a template (sets status to archived)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params

    // Find existing template
    let template = templateUpdates.get(id)
    if (!template) {
      template = mockTemplates.find((t) => t.id === id)
    }

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 },
      )
    }

    // Soft delete by archiving
    const archivedTemplate: Template = {
      ...template,
      status: 'archived',
      updated_at: new Date().toISOString(),
    }

    templateUpdates.set(id, archivedTemplate)

    return NextResponse.json(
      { message: 'Template archived successfully', data: archivedTemplate },
      { status: 200 },
    )
  } catch (error) {
    console.error('[Template Detail API] DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 },
    )
  }
}
