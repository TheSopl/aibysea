/**
 * Document Extraction Jobs API Routes
 *
 * Handles extraction job operations:
 * - GET: Returns list of extraction jobs with filtering and pagination
 * - POST: Creates a new extraction job
 *
 * Query parameters:
 *   - status: Filter by job status (pending, processing, completed, failed)
 *   - template_id: Filter by template ID
 *   - from_date: Filter by start date (YYYY-MM-DD)
 *   - to_date: Filter by end date (YYYY-MM-DD)
 *   - limit: Number of results per page (default: 50, max: 500)
 *   - offset: Number of results to skip (default: 0)
 *
 * @route /api/documents/jobs
 */

import { NextRequest, NextResponse } from 'next/server'
import { ExtractionJob, CreateJobRequest } from '@/types/documents'

/**
 * Mock data for extraction jobs
 * 30 jobs with various statuses and realistic data
 */
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
    id: 'job-002',
    document_id: 'doc-002',
    template_id: 'tmpl-001',
    status: 'completed',
    progress: 100,
    result: {
      invoice_number: 'INV-201902',
      invoice_date: '2025-12-10',
      total_amount: '8,920.50',
      vendor_name: 'TechSupply Inc',
      line_items: '3 items',
    },
    error_message: null,
    started_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(
      Date.now() - 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000,
    ).toISOString(),
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(
      Date.now() - 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000,
    ).toISOString(),
  },
  {
    id: 'job-003',
    document_id: 'doc-003',
    template_id: 'tmpl-002',
    status: 'completed',
    progress: 100,
    result: {
      receipt_number: 'RCP-45821',
      transaction_date: '2025-12-14',
      total_paid: '234.50',
      merchant_name: 'Best Buy Store #234',
    },
    error_message: null,
    started_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(
      Date.now() - 1 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000,
    ).toISOString(),
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(
      Date.now() - 1 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000,
    ).toISOString(),
  },
  {
    id: 'job-004',
    document_id: 'doc-004',
    template_id: 'tmpl-003',
    status: 'completed',
    progress: 100,
    result: {
      contract_id: 'CNT-2025-001',
      parties: 'ABC Inc and XYZ Corp',
      effective_date: '2025-01-01',
      contract_amount: '125,000.00',
      expiry_date: '2026-01-01',
    },
    error_message: null,
    started_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(
      Date.now() - 5 * 24 * 60 * 60 * 1000 + 120 * 60 * 1000,
    ).toISOString(),
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(
      Date.now() - 5 * 24 * 60 * 60 * 1000 + 120 * 60 * 1000,
    ).toISOString(),
  },
  {
    id: 'job-005',
    document_id: 'doc-005',
    template_id: 'tmpl-001',
    status: 'completed',
    progress: 100,
    result: {
      invoice_number: 'INV-201903',
      invoice_date: '2025-12-08',
      total_amount: '3,240.75',
      vendor_name: 'Office Depot',
      line_items: '8 items',
    },
    error_message: null,
    started_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(
      Date.now() - 4 * 24 * 60 * 60 * 1000 + 35 * 60 * 1000,
    ).toISOString(),
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(
      Date.now() - 4 * 24 * 60 * 60 * 1000 + 35 * 60 * 1000,
    ).toISOString(),
  },
  {
    id: 'job-006',
    document_id: 'doc-006',
    template_id: 'tmpl-002',
    status: 'completed',
    progress: 100,
    result: {
      receipt_number: 'RCP-45822',
      transaction_date: '2025-12-13',
      total_paid: '87.99',
      merchant_name: 'Target Store #421',
    },
    error_message: null,
    started_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(
      Date.now() - 6 * 24 * 60 * 60 * 1000 + 18 * 60 * 1000,
    ).toISOString(),
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(
      Date.now() - 6 * 24 * 60 * 60 * 1000 + 18 * 60 * 1000,
    ).toISOString(),
  },
  {
    id: 'job-007',
    document_id: 'doc-007',
    template_id: 'tmpl-001',
    status: 'completed',
    progress: 100,
    result: {
      invoice_number: 'INV-201904',
      invoice_date: '2025-12-05',
      total_amount: '22,100.00',
      vendor_name: 'Global Trading Ltd',
      line_items: '12 items',
    },
    error_message: null,
    started_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000 + 50 * 60 * 1000,
    ).toISOString(),
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000 + 50 * 60 * 1000,
    ).toISOString(),
  },
  {
    id: 'job-008',
    document_id: 'doc-008',
    template_id: 'tmpl-004',
    status: 'completed',
    progress: 100,
    result: {
      full_name: 'John Smith',
      email_address: 'john.smith@email.com',
      phone_number: '555-0123',
      position_applied: 'Senior Developer',
      years_experience: 8,
    },
    error_message: null,
    started_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(
      Date.now() - 8 * 24 * 60 * 60 * 1000 + 25 * 60 * 1000,
    ).toISOString(),
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(
      Date.now() - 8 * 24 * 60 * 60 * 1000 + 25 * 60 * 1000,
    ).toISOString(),
  },
  {
    id: 'job-009',
    document_id: 'doc-009',
    template_id: 'tmpl-001',
    status: 'completed',
    progress: 100,
    result: {
      invoice_number: 'INV-201905',
      invoice_date: '2025-12-02',
      total_amount: '5,678.90',
      vendor_name: 'Software Solutions',
      line_items: '4 items',
    },
    error_message: null,
    started_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(
      Date.now() - 9 * 24 * 60 * 60 * 1000 + 40 * 60 * 1000,
    ).toISOString(),
    created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(
      Date.now() - 9 * 24 * 60 * 60 * 1000 + 40 * 60 * 1000,
    ).toISOString(),
  },
  {
    id: 'job-010',
    document_id: 'doc-010',
    template_id: 'tmpl-002',
    status: 'completed',
    progress: 100,
    result: {
      receipt_number: 'RCP-45823',
      transaction_date: '2025-12-01',
      total_paid: '156.25',
      merchant_name: 'Amazon Go Store',
    },
    error_message: null,
    started_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(
      Date.now() - 10 * 24 * 60 * 60 * 1000 + 22 * 60 * 1000,
    ).toISOString(),
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(
      Date.now() - 10 * 24 * 60 * 60 * 1000 + 22 * 60 * 1000,
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
    id: 'job-012',
    document_id: 'doc-012',
    template_id: 'tmpl-002',
    status: 'processing',
    progress: 45,
    result: null,
    error_message: null,
    started_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    completed_at: null,
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: 'job-013',
    document_id: 'doc-013',
    template_id: 'tmpl-003',
    status: 'processing',
    progress: 78,
    result: null,
    error_message: null,
    started_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    completed_at: null,
    created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
  },
  {
    id: 'job-014',
    document_id: 'doc-014',
    template_id: 'tmpl-004',
    status: 'processing',
    progress: 52,
    result: null,
    error_message: null,
    started_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    completed_at: null,
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
  },
  {
    id: 'job-015',
    document_id: 'doc-015',
    template_id: 'tmpl-001',
    status: 'processing',
    progress: 88,
    result: null,
    error_message: null,
    started_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    completed_at: null,
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
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
    id: 'job-017',
    document_id: 'doc-017',
    template_id: 'tmpl-001',
    status: 'pending',
    progress: 0,
    result: null,
    error_message: null,
    started_at: null,
    completed_at: null,
    created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
  },
  {
    id: 'job-018',
    document_id: 'doc-018',
    template_id: 'tmpl-003',
    status: 'pending',
    progress: 0,
    result: null,
    error_message: null,
    started_at: null,
    completed_at: null,
    created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: 'job-019',
    document_id: 'doc-019',
    template_id: 'tmpl-004',
    status: 'pending',
    progress: 0,
    result: null,
    error_message: null,
    started_at: null,
    completed_at: null,
    created_at: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
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
  {
    id: 'job-021',
    document_id: 'doc-021',
    template_id: 'tmpl-002',
    status: 'failed',
    progress: 0,
    result: null,
    error_message: 'Document format not recognized',
    started_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(
      Date.now() - 18 * 60 * 60 * 1000 + 30 * 60 * 1000,
    ).toISOString(),
    created_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(
      Date.now() - 18 * 60 * 60 * 1000 + 30 * 60 * 1000,
    ).toISOString(),
  },
  {
    id: 'job-022',
    document_id: 'doc-022',
    template_id: 'tmpl-003',
    status: 'failed',
    progress: 0,
    result: null,
    error_message: 'File is corrupted or password protected',
    started_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(
      Date.now() - 24 * 60 * 60 * 1000 + 45 * 60 * 1000,
    ).toISOString(),
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(
      Date.now() - 24 * 60 * 60 * 1000 + 45 * 60 * 1000,
    ).toISOString(),
  },
  {
    id: 'job-023',
    document_id: 'doc-023',
    template_id: 'tmpl-001',
    status: 'completed',
    progress: 100,
    result: {
      invoice_number: 'INV-201906',
      invoice_date: '2025-11-30',
      total_amount: '9,450.25',
      vendor_name: 'Premium Supplies Co',
      line_items: '6 items',
    },
    error_message: null,
    started_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(
      Date.now() - 11 * 24 * 60 * 60 * 1000 + 38 * 60 * 1000,
    ).toISOString(),
    created_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(
      Date.now() - 11 * 24 * 60 * 60 * 1000 + 38 * 60 * 1000,
    ).toISOString(),
  },
  {
    id: 'job-024',
    document_id: 'doc-024',
    template_id: 'tmpl-004',
    status: 'completed',
    progress: 100,
    result: {
      full_name: 'Sarah Johnson',
      email_address: 'sarah.johnson@email.com',
      phone_number: '555-0456',
      position_applied: 'Product Manager',
      years_experience: 5,
    },
    error_message: null,
    started_at: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(
      Date.now() - 13 * 24 * 60 * 60 * 1000 + 32 * 60 * 1000,
    ).toISOString(),
    created_at: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(
      Date.now() - 13 * 24 * 60 * 60 * 1000 + 32 * 60 * 1000,
    ).toISOString(),
  },
  {
    id: 'job-025',
    document_id: 'doc-025',
    template_id: 'tmpl-002',
    status: 'completed',
    progress: 100,
    result: {
      receipt_number: 'RCP-45824',
      transaction_date: '2025-11-25',
      total_paid: '412.75',
      merchant_name: 'Walmart Store #567',
    },
    error_message: null,
    started_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(
      Date.now() - 14 * 24 * 60 * 60 * 1000 + 28 * 60 * 1000,
    ).toISOString(),
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(
      Date.now() - 14 * 24 * 60 * 60 * 1000 + 28 * 60 * 1000,
    ).toISOString(),
  },
  {
    id: 'job-026',
    document_id: 'doc-026',
    template_id: 'tmpl-001',
    status: 'completed',
    progress: 100,
    result: {
      invoice_number: 'INV-201907',
      invoice_date: '2025-11-20',
      total_amount: '18,765.00',
      vendor_name: 'Enterprise Solutions',
      line_items: '9 items',
    },
    error_message: null,
    started_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(
      Date.now() - 15 * 24 * 60 * 60 * 1000 + 55 * 60 * 1000,
    ).toISOString(),
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(
      Date.now() - 15 * 24 * 60 * 60 * 1000 + 55 * 60 * 1000,
    ).toISOString(),
  },
  {
    id: 'job-027',
    document_id: 'doc-027',
    template_id: 'tmpl-003',
    status: 'completed',
    progress: 100,
    result: {
      contract_id: 'CNT-2025-002',
      parties: 'Innovative Tech Ltd and Global Partners Inc',
      effective_date: '2025-02-01',
      contract_amount: '250,000.00',
      expiry_date: '2027-02-01',
    },
    error_message: null,
    started_at: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(
      Date.now() - 16 * 24 * 60 * 60 * 1000 + 135 * 60 * 1000,
    ).toISOString(),
    created_at: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(
      Date.now() - 16 * 24 * 60 * 60 * 1000 + 135 * 60 * 1000,
    ).toISOString(),
  },
  {
    id: 'job-028',
    document_id: 'doc-028',
    template_id: 'tmpl-004',
    status: 'completed',
    progress: 100,
    result: {
      full_name: 'Michael Chen',
      email_address: 'michael.chen@email.com',
      phone_number: '555-0789',
      position_applied: 'UX Designer',
      years_experience: 7,
    },
    error_message: null,
    started_at: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(
      Date.now() - 17 * 24 * 60 * 60 * 1000 + 29 * 60 * 1000,
    ).toISOString(),
    created_at: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(
      Date.now() - 17 * 24 * 60 * 60 * 1000 + 29 * 60 * 1000,
    ).toISOString(),
  },
  {
    id: 'job-029',
    document_id: 'doc-029',
    template_id: 'tmpl-002',
    status: 'completed',
    progress: 100,
    result: {
      receipt_number: 'RCP-45825',
      transaction_date: '2025-11-18',
      total_paid: '78.50',
      merchant_name: 'CVS Pharmacy #123',
    },
    error_message: null,
    started_at: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(
      Date.now() - 19 * 24 * 60 * 60 * 1000 + 19 * 60 * 1000,
    ).toISOString(),
    created_at: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(
      Date.now() - 19 * 24 * 60 * 60 * 1000 + 19 * 60 * 1000,
    ).toISOString(),
  },
  {
    id: 'job-030',
    document_id: 'doc-030',
    template_id: 'tmpl-001',
    status: 'completed',
    progress: 100,
    result: {
      invoice_number: 'INV-201908',
      invoice_date: '2025-11-15',
      total_amount: '12,340.80',
      vendor_name: 'Reliable Distributors',
      line_items: '7 items',
    },
    error_message: null,
    started_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(
      Date.now() - 20 * 24 * 60 * 60 * 1000 + 42 * 60 * 1000,
    ).toISOString(),
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(
      Date.now() - 20 * 24 * 60 * 60 * 1000 + 42 * 60 * 1000,
    ).toISOString(),
  },
]

// Store for created jobs (in-memory, resets on server restart)
let createdJobs: ExtractionJob[] = []
let nextId = 100

/**
 * GET /api/documents/jobs
 * Returns array of extraction jobs with optional filtering and pagination
 * Query parameters:
 *   - status: Filter by status (pending, processing, completed, failed)
 *   - template_id: Filter by template ID
 *   - from_date: Filter jobs created after this date (YYYY-MM-DD)
 *   - to_date: Filter jobs created before this date (YYYY-MM-DD)
 *   - limit: Results per page (default 50, max 500)
 *   - offset: Number of results to skip (default 0)
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status')
    const templateFilter = searchParams.get('template_id')
    const fromDate = searchParams.get('from_date')
    const toDate = searchParams.get('to_date')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 500)
    const offset = parseInt(searchParams.get('offset') || '0')

    let jobs = [...mockJobs, ...createdJobs]

    // Apply filters
    if (statusFilter) {
      jobs = jobs.filter((j) => j.status === statusFilter)
    }

    if (templateFilter) {
      jobs = jobs.filter((j) => j.template_id === templateFilter)
    }

    if (fromDate) {
      const fromTime = new Date(fromDate).getTime()
      jobs = jobs.filter((j) => new Date(j.created_at).getTime() >= fromTime)
    }

    if (toDate) {
      const toTime = new Date(toDate).getTime()
      jobs = jobs.filter((j) => new Date(j.created_at).getTime() <= toTime)
    }

    // Sort by created_at descending
    jobs.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )

    // Apply pagination
    const total = jobs.length
    const paginatedJobs = jobs.slice(offset, offset + limit)

    return NextResponse.json(
      {
        data: paginatedJobs,
        total,
        limit,
        offset,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('[Jobs API] GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 },
    )
  }
}

/**
 * POST /api/documents/jobs
 * Creates a new extraction job
 * Request body: CreateJobRequest
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as CreateJobRequest

    // Validate required fields
    if (!body.template_id) {
      return NextResponse.json(
        { error: 'Missing required field: template_id' },
        { status: 400 },
      )
    }

    // Create new job
    const newJob: ExtractionJob = {
      id: `job-${String(nextId).padStart(3, '0')}`,
      document_id: body.document_id || null,
      template_id: body.template_id,
      status: 'pending',
      progress: 0,
      result: null,
      error_message: null,
      started_at: null,
      completed_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    nextId++
    createdJobs.push(newJob)

    return NextResponse.json(newJob, { status: 201 })
  } catch (error) {
    console.error('[Jobs API] POST error:', error)
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 },
    )
  }
}
