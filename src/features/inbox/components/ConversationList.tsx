import { createClient } from '@/lib/supabase/server'
import { ConversationItem } from './ConversationItem'

interface ConversationWithContact {
  id: string
  channel: string
  status: string
  handler_type: string
  last_message_at: string | null
  contact: {
    id: string
    name: string | null
    phone: string
  } | null
  messages: {
    content: string
  }[]
}

export async function ConversationList() {
  const supabase = await createClient()

  const { data: conversations, error } = await supabase
    .from('conversations')
    .select(`
      id,
      channel,
      status,
      handler_type,
      last_message_at,
      contact:contacts(id, name, phone),
      messages(content)
    `)
    .order('last_message_at', { ascending: false, nullsFirst: false })
    .limit(1, { foreignTable: 'messages' })

  if (error) {
    console.error('Error fetching conversations:', error)
    return (
      <div className="p-4 text-sm text-red-500">
        Error loading conversations
      </div>
    )
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-500 text-center">
        No conversations yet. They will appear here when messages arrive.
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {(conversations as unknown as ConversationWithContact[]).map((conversation) => {
        const contact = conversation.contact
        const lastMessage = conversation.messages?.[0]?.content ?? null

        return (
          <ConversationItem
            key={conversation.id}
            id={conversation.id}
            contactName={contact?.name ?? null}
            contactPhone={contact?.phone ?? 'Unknown'}
            channel={conversation.channel as 'whatsapp' | 'telegram'}
            lastMessage={lastMessage}
            lastMessageAt={conversation.last_message_at}
            status={conversation.status}
            handlerType={conversation.handler_type}
          />
        )
      })}
    </div>
  )
}
