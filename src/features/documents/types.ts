/**
 * Document Intelligence Type Definitions
 *
 * Defines TypeScript types for:
 * - Document: Uploaded document metadata and processing status
 * - DocumentField: Field definition for template extraction
 * - Template: Extraction template for specific document types
 * - ExtractionJob: Document processing job with status tracking
 * - ExtractedData: Individual field extraction results
 * - Request types: Create and update request bodies
 */

/**
 * DocumentField represents a single field to extract from documents
 */
export interface DocumentField {
  name: string
  type: 'text' | 'number' | 'date' | 'currency' | 'select' | 'boolean'
  required: boolean
  validation?: string
  options?: string[]
}

/**
 * Document represents an uploaded document file
 */
export interface Document {
  id: string
  file_name: string
  file_type: string // pdf, docx, jpg, png, etc.
  file_size: number // in bytes
  storage_path: string // Supabase storage reference
  status: 'pending' | 'processing' | 'completed' | 'failed'
  template_id: string | null
  created_at: string // ISO format
  updated_at: string // ISO format
}

/**
 * Template represents an extraction template for a document type
 */
export interface Template {
  id: string
  name: string
  description: string
  type: 'invoice' | 'receipt' | 'contract' | 'form' | 'custom'
  fields: DocumentField[]
  status: 'active' | 'archived'
  created_by: string | null // agent id
  usage_count: number
  success_rate: number // percentage 0-100
  created_at: string // ISO format
  updated_at: string // ISO format
}

/**
 * ExtractionJob tracks document processing with status and results
 */
export interface ExtractionJob {
  id: string
  document_id: string | null
  template_id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number // 0-100
  result: Record<string, unknown> | null // extracted data in template field structure
  error_message: string | null
  started_at: string | null // ISO format
  completed_at: string | null // ISO format
  created_at: string // ISO format
  updated_at: string // ISO format
}

/**
 * ExtractedData represents a single field extraction result
 */
export interface ExtractedData {
  id: string
  job_id: string
  field_name: string
  extracted_value: string | null
  confidence: number // 0-1 accuracy score
  created_at: string // ISO format
}

/**
 * Request Types
 */

export interface CreateDocumentRequest {
  file_name: string
  file_type: string
  file_size: number
  template_id?: string
}

export interface CreateTemplateRequest {
  name: string
  description: string
  type: 'invoice' | 'receipt' | 'contract' | 'form' | 'custom'
  fields: DocumentField[]
}

export interface UpdateTemplateRequest {
  name?: string
  description?: string
  fields?: DocumentField[]
  status?: 'active' | 'archived'
}

export interface CreateJobRequest {
  document_id?: string
  template_id: string
}

export interface UpdateJobRequest {
  status?: 'pending' | 'processing' | 'completed' | 'failed'
  progress?: number
  result?: Record<string, unknown>
  error_message?: string
  started_at?: string
  completed_at?: string
}

/**
 * API Response wrapper types
 */
export interface ApiResponse<T> {
  data: T
  error?: string
}

export interface ApiListResponse<T> {
  data: T[]
  total: number
  limit: number
  offset: number
}
