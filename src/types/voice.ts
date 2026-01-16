/**
 * Voice Agents and Call Logs Type Definitions
 *
 * Defines TypeScript types for:
 * - VoiceAgent: Voice agent configuration and metrics
 * - VoiceAgentRequest: Request body for creating/updating agents
 * - CallLog: Call history records with transcription and sentiment
 */

/**
 * VoiceAgent represents a voice agent in the system
 */
export interface VoiceAgent {
  id: string
  name: string
  status: 'available' | 'on-call' | 'offline' | 'busy'
  phone_number: string
  language: string
  skills: string[]
  total_calls: number
  avg_duration: number // in minutes
  success_rate: number // percentage (0-100)
  last_active: string // ISO format
  created_at: string // ISO format
}

/**
 * VoiceAgentRequest is the request body for creating/updating voice agents
 */
export interface VoiceAgentRequest {
  name: string
  status: 'available' | 'on-call' | 'offline' | 'busy'
  phone_number: string
  language: string
  skills: string[]
}

/**
 * CallLog represents a single voice call record
 */
export interface CallLog {
  id: string
  agent_id: string
  caller_number: string
  caller_name: string
  direction: 'inbound' | 'outbound'
  status: 'completed' | 'missed' | 'transferred' | 'abandoned'
  duration_seconds: number
  transcription: string
  sentiment: 'positive' | 'neutral' | 'negative' | null
  keywords: string[]
  started_at: string // ISO format
  ended_at: string // ISO format
}

/**
 * CallLogRequest is the request body for creating/updating call logs
 */
export interface CallLogRequest {
  agent_id: string
  caller_number: string
  caller_name: string
  direction: 'inbound' | 'outbound'
  status: 'completed' | 'missed' | 'transferred' | 'abandoned'
  duration_seconds: number
  transcription: string
  sentiment?: 'positive' | 'neutral' | 'negative' | null
  keywords?: string[]
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
