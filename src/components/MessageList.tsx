import { createClient } from '@/lib/supabase/server'
import { Message } from '@/types/database'
import { MessageListClient } from './MessageListClient'

interface MessageListProps {
  conversationId: string
}

export async function MessageList({ conversationId }: MessageListProps) {
  const supabase = await createClient()

  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching messages:', error)
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-red-500">Error loading messages</p>
      </div>
    )
  }

  return (
    <MessageListClient
      conversationId={conversationId}
      initialMessages={(messages as Message[]) || []}
    />
  )
}
