export interface InboxConversation {
  id: string
  channel: string
  status: string
  handler_type: 'ai' | 'human'
  last_message_at: string | null
  unread_count: number
}

export interface InboxMessage {
  id: string
  content: string
  direction: 'inbound' | 'outbound'
  sender_type: 'customer' | 'ai' | 'agent'
  created_at: string
}
