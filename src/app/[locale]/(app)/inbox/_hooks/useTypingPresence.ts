import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useTypingPresence(channelName: string, userId: string) {
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase.channel(channelName)
    channel.subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [channelName, userId, supabase])
}
