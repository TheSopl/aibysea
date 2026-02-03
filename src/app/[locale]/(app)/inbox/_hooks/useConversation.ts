import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useConversation(conversationId: string | null) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return []
    setLoading(true)
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
    setLoading(false)
    return data ?? []
  }, [conversationId, supabase])

  return { fetchMessages, loading }
}
