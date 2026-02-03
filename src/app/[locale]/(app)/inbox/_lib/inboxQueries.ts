import { createClient } from '@/lib/supabase/client'

export async function fetchConversations() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('conversations')
    .select('id, channel, status, handler_type, last_message_at, unread_count')
    .order('last_message_at', { ascending: false })
  if (error) throw error
  return data
}
