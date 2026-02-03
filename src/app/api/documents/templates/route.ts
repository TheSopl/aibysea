/**
 * Document Templates API Routes
 *
 * Handles template CRUD operations:
 * - GET: Returns list of all templates with optional filtering by type and status
 * - POST: Creates a new extraction template
 *
 * @route /api/documents/templates
 */

import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import {
  Template,
  DocumentField,
  CreateTemplateRequest,
} from '@/features/documents/types'

/**
 * Mock data for extraction templates
 * 10 templates covering common document types and custom cases
 */
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
  {
    id: 'tmpl-003',
    name: 'Contract Agreement',
    description: 'Template for legal contracts and service agreements',
    type: 'contract',
    fields: [
      {
        name: 'contract_id',
        type: 'text',
        required: true,
      },
      {
        name: 'parties',
        type: 'text',
        required: true,
      },
      {
        name: 'effective_date',
        type: 'date',
        required: true,
      },
      {
        name: 'contract_amount',
        type: 'currency',
        required: true,
      },
      {
        name: 'terms_and_conditions',
        type: 'text',
        required: false,
      },
      {
        name: 'signature_required',
        type: 'boolean',
        required: true,
      },
      {
        name: 'expiry_date',
        type: 'date',
        required: false,
      },
    ],
    status: 'active',
    created_by: 'agent-001',
    usage_count: 156,
    success_rate: 91.5,
    created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'tmpl-004',
    name: 'Application Form',
    description: 'Template for job and service application forms',
    type: 'form',
    fields: [
      {
        name: 'full_name',
        type: 'text',
        required: true,
      },
      {
        name: 'email_address',
        type: 'text',
        required: true,
        validation: '^[\\w\\.-]+@[\\w\\.-]+\\.\\w+$',
      },
      {
        name: 'phone_number',
        type: 'text',
        required: true,
      },
      {
        name: 'position_applied',
        type: 'text',
        required: true,
      },
      {
        name: 'years_experience',
        type: 'number',
        required: true,
      },
      {
        name: 'education_level',
        type: 'select',
        required: true,
        options: ['High School', 'Bachelor', 'Master', 'PhD'],
      },
      {
        name: 'resume_provided',
        type: 'boolean',
        required: true,
      },
      {
        name: 'available_start_date',
        type: 'date',
        required: false,
      },
      {
        name: 'salary_expectation',
        type: 'currency',
        required: false,
      },
      {
        name: 'additional_notes',
        type: 'text',
        required: false,
      },
    ],
    status: 'active',
    created_by: 'agent-003',
    usage_count: 312,
    success_rate: 93.1,
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'tmpl-005',
    name: 'Medical Records',
    description: 'Template for extracting data from medical reports',
    type: 'custom',
    fields: [
      {
        name: 'patient_name',
        type: 'text',
        required: true,
      },
      {
        name: 'date_of_birth',
        type: 'date',
        required: true,
      },
      {
        name: 'diagnosis',
        type: 'text',
        required: true,
      },
      {
        name: 'test_results',
        type: 'text',
        required: false,
      },
      {
        name: 'prescribed_treatment',
        type: 'text',
        required: false,
      },
    ],
    status: 'active',
    created_by: 'agent-002',
    usage_count: 89,
    success_rate: 87.3,
    created_at: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'tmpl-006',
    name: 'Insurance Claim',
    description: 'Template for processing insurance claim documents',
    type: 'custom',
    fields: [
      {
        name: 'claim_number',
        type: 'text',
        required: true,
      },
      {
        name: 'claim_date',
        type: 'date',
        required: true,
      },
      {
        name: 'policy_number',
        type: 'text',
        required: true,
      },
      {
        name: 'claim_amount',
        type: 'currency',
        required: true,
      },
      {
        name: 'claim_reason',
        type: 'text',
        required: true,
      },
      {
        name: 'incident_date',
        type: 'date',
        required: true,
      },
    ],
    status: 'active',
    created_by: 'agent-001',
    usage_count: 267,
    success_rate: 92.8,
    created_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'tmpl-007',
    name: 'Bank Statement',
    description: 'Template for bank statement reconciliation',
    type: 'custom',
    fields: [
      {
        name: 'account_number',
        type: 'text',
        required: true,
      },
      {
        name: 'statement_period',
        type: 'date',
        required: true,
      },
      {
        name: 'opening_balance',
        type: 'currency',
        required: true,
      },
      {
        name: 'closing_balance',
        type: 'currency',
        required: true,
      },
      {
        name: 'total_deposits',
        type: 'currency',
        required: false,
      },
      {
        name: 'total_withdrawals',
        type: 'currency',
        required: false,
      },
    ],
    status: 'active',
    created_by: 'agent-003',
    usage_count: 145,
    success_rate: 98.1,
    created_at: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'tmpl-008',
    name: 'Purchase Order',
    description: 'Template for purchase order processing',
    type: 'custom',
    fields: [
      {
        name: 'po_number',
        type: 'text',
        required: true,
      },
      {
        name: 'po_date',
        type: 'date',
        required: true,
      },
      {
        name: 'vendor_name',
        type: 'text',
        required: true,
      },
      {
        name: 'delivery_date',
        type: 'date',
        required: true,
      },
      {
        name: 'order_total',
        type: 'currency',
        required: true,
      },
      {
        name: 'item_count',
        type: 'number',
        required: true,
      },
    ],
    status: 'active',
    created_by: 'agent-002',
    usage_count: 321,
    success_rate: 95.6,
    created_at: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'tmpl-009',
    name: 'Property Deed',
    description: 'Template for real estate property documents',
    type: 'custom',
    fields: [
      {
        name: 'property_address',
        type: 'text',
        required: true,
      },
      {
        name: 'deed_number',
        type: 'text',
        required: true,
      },
      {
        name: 'owner_name',
        type: 'text',
        required: true,
      },
      {
        name: 'property_value',
        type: 'currency',
        required: true,
      },
      {
        name: 'recording_date',
        type: 'date',
        required: true,
      },
    ],
    status: 'active',
    created_by: 'agent-001',
    usage_count: 78,
    success_rate: 89.4,
    created_at: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'tmpl-010',
    name: 'Utility Bill',
    description: 'Template for utility bill data extraction',
    type: 'custom',
    fields: [
      {
        name: 'account_number',
        type: 'text',
        required: true,
      },
      {
        name: 'bill_date',
        type: 'date',
        required: true,
      },
      {
        name: 'service_provider',
        type: 'text',
        required: true,
      },
      {
        name: 'total_due',
        type: 'currency',
        required: true,
      },
      {
        name: 'usage_amount',
        type: 'number',
        required: true,
      },
      {
        name: 'due_date',
        type: 'date',
        required: true,
      },
    ],
    status: 'active',
    created_by: 'agent-003',
    usage_count: 203,
    success_rate: 94.2,
    created_at: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Store for created templates (in-memory, resets on server restart)
const createdTemplates: Template[] = []
let nextId = 100

/**
 * GET /api/documents/templates
 * Returns array of all templates with optional filtering
 * Query parameters:
 *   - type: Filter by template type (invoice, receipt, contract, form, custom)
 *   - status: Filter by status (active, archived)
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const typeFilter = searchParams.get('type')
    const statusFilter = searchParams.get('status') || 'active'

    let templates = [...mockTemplates, ...createdTemplates]

    // Apply filters
    if (typeFilter) {
      templates = templates.filter((t) => t.type === typeFilter)
    }

    templates = templates.filter((t) => t.status === statusFilter)

    return NextResponse.json(templates, { status: 200 })
  } catch (error) {
    console.error('[Templates API] GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 },
    )
  }
}

/**
 * POST /api/documents/templates
 * Creates a new extraction template
 * Request body: CreateTemplateRequest
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as CreateTemplateRequest

    // Validate required fields
    if (!body.name || !body.type || !Array.isArray(body.fields)) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: name, type, fields (array of field definitions)',
        },
        { status: 400 },
      )
    }

    // Validate type enum
    const validTypes = ['invoice', 'receipt', 'contract', 'form', 'custom']
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        {
          error: `Invalid type. Must be one of: ${validTypes.join(', ')}`,
        },
        { status: 400 },
      )
    }

    // Create new template
    const newTemplate: Template = {
      id: `tmpl-${String(nextId).padStart(3, '0')}`,
      name: body.name,
      description: body.description || '',
      type: body.type,
      fields: body.fields,
      status: 'active',
      created_by: 'agent-001', // In real implementation, would come from auth context
      usage_count: 0,
      success_rate: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    nextId++
    createdTemplates.push(newTemplate)

    return NextResponse.json(newTemplate, { status: 201 })
  } catch (error) {
    console.error('[Templates API] POST error:', error)
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 },
    )
  }
}
