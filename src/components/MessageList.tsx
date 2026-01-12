import { createClient } from '@/lib/supabase/server'
import { Message } from '@/types/database'
import { MessageBubble } from './MessageBubble'

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

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">No messages yet</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="flex flex-col gap-2">
        {(messages as Message[]).map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>
    </div>
  )
}
