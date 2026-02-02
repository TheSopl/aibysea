/**
 * Document Extraction Job Detail Routes
 *
 * Handles individual job operations:
 * - GET: Returns a single extraction job with full details
 * - PUT: Updates a job (status, progress, result, error_message)
 * - DELETE: Removes a job
 *
 * @route /api/documents/jobs/[id]
 */

import { NextRequest, NextResponse } from 'next/server'
import { ExtractionJob, UpdateJobRequest, ExtractedData } from '@/types/documents'

// Mock job data (would come from database in real implementation)
const mockJobs: ExtractionJob[] = [
  {
    id: 'job-001',
    document_id: 'doc-001',
    template_id: 'tmpl-001',
    status: 'completed',
    progress: 100,
    result: {
      invoice_number: 'INV-201901',
      invoice_date: '2025-12-15',
      total_amount: '15,450.00',
      vendor_name: 'Acme Corporation',
      line_items: '5 items',
    },
    error_message: null,
    started_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(
      Date.now() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000,
    ).toISOString(),
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(
      Date.now() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000,
    ).toISOString(),
  },
  {
    id: 'job-011',
    document_id: 'doc-011',
    template_id: 'tmpl-001',
    status: 'processing',
    progress: 65,
    result: null,
    error_message: null,
    started_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    completed_at: null,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 'job-016',
    document_id: 'doc-016',
    template_id: 'tmpl-002',
    status: 'pending',
    progress: 0,
    result: null,
    error_message: null,
    started_at: null,
    completed_at: null,
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 'job-020',
    document_id: 'doc-020',
    template_id: 'tmpl-001',
    status: 'failed',
    progress: 0,
    result: null,
    error_message: 'Unable to extract field: vendor_name (low confidence)',
    started_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(
      Date.now() - 12 * 60 * 60 * 1000 + 60 * 60 * 1000,
    ).toISOString(),
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(
      Date.now() - 12 * 60 * 60 * 1000 + 60 * 60 * 1000,
    ).toISOString(),
  },
]

// Sample extracted data for a completed job
const sampleExtractedData: ExtractedData[] = [
  {
    id: 'data-001',
    job_id: 'job-001',
    field_name: 'invoice_number',
    extracted_value: 'INV-201901',
    confidence: 0.98,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'data-002',
    job_id: 'job-001',
    field_name: 'invoice_date',
    extracted_value: '2025-12-15',
    confidence: 0.95,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'data-003',
    job_id: 'job-001',
    field_name: 'total_amount',
    extracted_value: '15,450.00',
    confidence: 0.99,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'data-004',
    job_id: 'job-001',
    field_name: 'vendor_name',
    extracted_value: 'Acme Corporation',
    confidence: 0.92,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'data-005',
    job_id: 'job-001',
    field_name: 'line_items',
    extracted_value: '5 items',
    confidence: 0.88,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Store for updates (in-memory, resets on server restart)
const jobUpdates: Map<string, ExtractionJob> = new Map()

/**
 * GET /api/documents/jobs/[id]
 * Returns a single extraction job with full details and extracted data
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params

    // Check updates first
    if (jobUpdates.has(id)) {
      const job = jobUpdates.get(id)!
      const extractedData = id === 'job-001' ? sampleExtractedData : []
      return NextResponse.json({ job, extracted_data: extractedData }, { status: 200 })
    }

    // Check mock data
    const job = mockJobs.find((j) => j.id === id)

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 },
      )
    }

    // Return job with extracted data for completed jobs
    const extractedData = id === 'job-001' ? sampleExtractedData : []

    return NextResponse.json({ job, extracted_data: extractedData }, { status: 200 })
  } catch (error) {
    console.error('[Job Detail API] GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 },
    )
  }
}

/**
 * PUT /api/documents/jobs/[id]
 * Updates a job (status, progress, result, error_message)
 * Request body: UpdateJobRequest
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params
    const body = (await request.json()) as UpdateJobRequest

    // Find existing job
    let job = jobUpdates.get(id)
    if (!job) {
      job = mockJobs.find((j) => j.id === id)
    }

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 },
      )
    }

    // Update fields
    const updatedJob: ExtractionJob = {
      ...job,
      ...(body.status !== undefined && { status: body.status }),
      ...(body.progress !== undefined && { progress: body.progress }),
      ...(body.result !== undefined && { result: body.result }),
      ...(body.error_message !== undefined && { error_message: body.error_message }),
      ...(body.started_at !== undefined && { started_at: body.started_at }),
      ...(body.completed_at !== undefined && { completed_at: body.completed_at }),
      updated_at: new Date().toISOString(),
    }

    jobUpdates.set(id, updatedJob)

    return NextResponse.json(updatedJob, { status: 200 })
  } catch (error) {
    console.error('[Job Detail API] PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 },
    )
  }
}

/**
 * DELETE /api/documents/jobs/[id]
 * Removes a job
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params

    // Check if job exists
    let job = jobUpdates.get(id)
    if (!job) {
      job = mockJobs.find((j) => j.id === id)
    }

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 },
      )
    }

    // In mock implementation, just remove from updates map
    jobUpdates.delete(id)

    return NextResponse.json(
      { message: 'Job deleted successfully', data: job },
      { status: 200 },
    )
  } catch (error) {
    console.error('[Job Detail API] DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 },
    )
  }
}
