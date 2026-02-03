'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { sendMessage } from '@/app/actions/messages'
import Button from '@/components/ui/Button'

interface MessageComposeProps {
  conversationId: string
  channel: string
  onMessageSent?: () => void
}

export function MessageCompose({ conversationId, channel, onMessageSent }: MessageComposeProps) {
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 96)}px` // max 4 lines (~96px)
    }
  }, [message])

  const handleSubmit = async () => {
    if (!message.trim() || isPending) return

    setError(null)
    const content = message.trim()

    startTransition(async () => {
      const result = await sendMessage(conversationId, content)

      if (result.success) {
        setMessage('')
        // Real-time subscription will handle message display
        onMessageSent?.()
      } else {
        setError(result.error || 'Failed to send message')
      }
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+Enter or Cmd+Enter to send
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="border-t border-accent-surface bg-dark-surface p-4 flex-shrink-0">
      {/* WhatsApp 24h window indicator */}
      {channel === 'whatsapp' && (
        <p className="text-xs text-text-secondary mb-2">
          Replying within 24h window
        </p>
      )}

      {/* Error display */}
      {error && (
        <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Compose form - layout stays same, text direction adapts */}
      <div className="flex items-end gap-3">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={isPending}
          rows={1}
          className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!message.trim() || isPending}
          loading={isPending}
          className="min-h-[44px] min-w-[44px]"
        >
          {isPending ? 'Sending' : 'Send'}
        </Button>
      </div>

      {/* Keyboard shortcut hint */}
      <p className="text-xs text-gray-400 mt-2">
        Press Ctrl+Enter to send
      </p>
    </div>
  )
}
