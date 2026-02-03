import { createClient } from '@/lib/supabase/client'

export function trackPresence(channelName: string, state: Record<string, unknown>) {
  const supabase = createClient()
  return supabase.channel(channelName).track(state)
}
