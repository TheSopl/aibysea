import { createClient } from '@/lib/supabase/client'

export function subscribeToBroadcast(channelName: string, callback: (payload: unknown) => void) {
  const supabase = createClient()
  return supabase.channel(channelName).on('broadcast', { event: '*' }, callback).subscribe()
}
