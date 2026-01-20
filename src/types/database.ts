export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      ai_agents: {
        Row: {
          id: string
          name: string
          model: string
          system_prompt: string | null
          greeting_message: string | null
          triggers: string[]
          behaviors: Record<string, unknown>
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          model?: string
          system_prompt?: string | null
          greeting_message?: string | null
          triggers?: string[]
          behaviors?: Record<string, unknown>
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          model?: string
          system_prompt?: string | null
          greeting_message?: string | null
          triggers?: string[]
          behaviors?: Record<string, unknown>
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      agents: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          phone: string
          name: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          phone: string
          name?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          phone?: string
          name?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          contact_id: string
          channel: string
          status: string
          handler_type: string
          assigned_agent_id: string | null
          last_message_at: string | null
          last_customer_message_at: string | null
          unread_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          contact_id: string
          channel?: string
          status?: string
          handler_type?: string
          assigned_agent_id?: string | null
          last_message_at?: string | null
          last_customer_message_at?: string | null
          unread_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          contact_id?: string
          channel?: string
          status?: string
          handler_type?: string
          assigned_agent_id?: string | null
          last_message_at?: string | null
          last_customer_message_at?: string | null
          unread_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          direction: string
          content: string
          content_type: string
          metadata: Json
          sender_type: string
          sender_id: string | null
          whatsapp_message_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          direction: string
          content: string
          content_type?: string
          metadata?: Json
          sender_type: string
          sender_id?: string | null
          whatsapp_message_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          direction?: string
          content?: string
          content_type?: string
          metadata?: Json
          sender_type?: string
          sender_id?: string | null
          whatsapp_message_id?: string | null
          created_at?: string
        }
      }
    }
  }
}

// Convenience type aliases
export type Agent = Database['public']['Tables']['agents']['Row']
export type AIAgent = Database['public']['Tables']['ai_agents']['Row']
export type Contact = Database['public']['Tables']['contacts']['Row']
export type Conversation = Database['public']['Tables']['conversations']['Row']
export type Message = Database['public']['Tables']['messages']['Row']

export type NewAgent = Database['public']['Tables']['agents']['Insert']
export type NewAIAgent = Database['public']['Tables']['ai_agents']['Insert']
export type NewContact = Database['public']['Tables']['contacts']['Insert']
export type NewConversation = Database['public']['Tables']['conversations']['Insert']
export type NewMessage = Database['public']['Tables']['messages']['Insert']
