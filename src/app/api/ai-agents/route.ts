/**
 * AI Agents API Routes
 *
 * Handles AI agent CRUD operations:
 * - GET: Returns list of all AI agents
 * - POST: Creates a new AI agent
 *
 * @route /api/ai-agents
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// Supabase admin client type (with any to bypass strict RLS type checking)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseAdmin = any;

/**
 * GET /api/ai-agents
 * Returns array of all AI agents, ordered by created_at desc
 */
export async function GET(): Promise<NextResponse> {
  try {
    const supabase: SupabaseAdmin = createAdminClient();

    const { data, error } = await supabase
      .from('ai_agents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[AI Agents API] GET error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch AI agents' },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? [], { status: 200 });
  } catch (error) {
    console.error('[AI Agents API] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI agents' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ai-agents
 * Creates a new AI agent
 * Request body: { name, model, system_prompt?, greeting_message?, triggers?, behaviors?, status? }
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (body.status && !['active', 'inactive'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: active, inactive' },
        { status: 400 }
      );
    }

    const supabase: SupabaseAdmin = createAdminClient();

    const newAgent = {
      name: body.name,
      model: body.model || 'gpt-4-turbo',
      system_prompt: body.system_prompt || null,
      greeting_message: body.greeting_message || null,
      triggers: body.triggers || [],
      behaviors: body.behaviors || {},
      status: body.status || 'active',
    };

    const { data, error } = await supabase
      .from('ai_agents')
      .insert(newAgent)
      .select()
      .single();

    if (error) {
      console.error('[AI Agents API] POST error:', error);
      return NextResponse.json(
        { error: 'Failed to create AI agent' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('[AI Agents API] POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create AI agent' },
      { status: 500 }
    );
  }
}
