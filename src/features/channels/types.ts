export type ChannelType = 'whatsapp' | 'telegram' | 'facebook' | 'instagram'

export interface ChannelConfig {
  type: ChannelType
  enabled: boolean
  credentials: Record<string, string>
}
