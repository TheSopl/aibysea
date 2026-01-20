/**
 * AI Agent by ID API Routes
 *
 * Handles single AI agent operations:
 * - GET: Returns a specific AI agent
 * - PATCH: Updates an AI agent
 * - DELETE: Deletes an AI agent
 *
 * @route /api/ai-agents/[id]
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// Supabase admin client type (with any to bypass strict RLS type checking)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseAdmin = any;

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/ai-agents/[id]
 * Returns a single AI agent by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const supabase: SupabaseAdmin = createAdminClient();

    const { data, error } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'AI agent not found' },
          { status: 404 }
        );
      }
      console.error('[AI Agents API] GET by ID error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch AI agent' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('[AI Agents API] GET by ID error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI agent' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/ai-agents/[id]
 * Updates an AI agent (partial update)
 * Request body: { name?, model?, system_prompt?, greeting_message?, triggers?, behaviors?, status? }
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate status if provided
    if (body.status && !['active', 'inactive'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: active, inactive' },
        { status: 400 }
      );
    }

    const supabase: SupabaseAdmin = createAdminClient();

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.model !== undefined) updateData.model = body.model;
    if (body.system_prompt !== undefined) updateData.system_prompt = body.system_prompt;
    if (body.greeting_message !== undefined) updateData.greeting_message = body.greeting_message;
    if (body.triggers !== undefined) updateData.triggers = body.triggers;
    if (body.behaviors !== undefined) updateData.behaviors = body.behaviors;
    if (body.status !== undefined) updateData.status = body.status;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('ai_agents')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'AI agent not found' },
          { status: 404 }
        );
      }
      console.error('[AI Agents API] PATCH error:', error);
      return NextResponse.json(
        { error: 'Failed to update AI agent' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('[AI Agents API] PATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to update AI agent' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/ai-agents/[id]
 * Deletes an AI agent
 */
export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const supabase: SupabaseAdmin = createAdminClient();

    // First check if agent exists
    const { data: existing, error: fetchError } = await supabase
      .from('ai_agents')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: 'AI agent not found' },
        { status: 404 }
      );
    }

    const { error } = await supabase
      .from('ai_agents')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[AI Agents API] DELETE error:', error);
      return NextResponse.json(
        { error: 'Failed to delete AI agent' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[AI Agents API] DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete AI agent' },
      { status: 500 }
    );
  }
}
