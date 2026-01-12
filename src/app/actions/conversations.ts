'use server'

import { createClient } from '@/lib/supabase/server'

interface UpdateHandlerResult {
  success: boolean
  error?: string
}

/**
 * Update the handler_type for a conversation (toggles between 'ai' and 'human').
 * Used when agents take over from AI or resume AI handling.
 */
export async function updateConversationHandler(
  conversationId: string,
  handlerType: 'ai' | 'human'
): Promise<UpdateHandlerResult> {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error('[UpdateHandler] Auth error:', authError)
      return { success: false, error: 'Not authenticated' }
    }

    // Update conversation handler_type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from('conversations')
      .update({ handler_type: handlerType })
      .eq('id', conversationId)

    if (updateError) {
      console.error('[UpdateHandler] Failed to update handler:', updateError)
      return { success: false, error: 'Failed to update conversation handler' }
    }

    console.log('[UpdateHandler] Handler updated:', { conversationId, handlerType })
    return { success: true }
  } catch (error) {
    console.error('[UpdateHandler] Update failed:', error)
    const message = error instanceof Error ? error.message : 'Failed to update handler'
    return { success: false, error: message }
  }
}
