import { createClient } from '@/lib/supabase/client'

export async function markConversationRead(conversationId: string) {
  const supabase = createClient()
  await supabase
    .from('conversations')
    .update({ unread_count: 0 })
    .eq('id', conversationId)
}

export async function sendMessage(conversationId: string, content: string) {
  const supabase = createClient()
  const { error } = await supabase.from('messages').insert({
    conversation_id: conversationId,
    content,
    direction: 'outbound',
    content_type: 'text',
    sender_type: 'agent',
  })
  if (error) throw error
}
