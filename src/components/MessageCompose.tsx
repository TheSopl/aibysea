'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { sendMessage } from '@/app/actions/messages'

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
  const router = useRouter()

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
        router.refresh() // Reload messages from server
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
    <div className="border-t border-gray-200 bg-white p-4 flex-shrink-0">
      {/* WhatsApp 24h window indicator */}
      {channel === 'whatsapp' && (
        <p className="text-xs text-gray-400 mb-2">
          Replying within 24h window
        </p>
      )}

      {/* Error display */}
      {error && (
        <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Compose form */}
      <div className="flex items-end gap-3">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={isPending}
          rows={1}
          className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleSubmit}
          disabled={!message.trim() || isPending}
          className="bg-blue-500 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isPending ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Sending</span>
            </>
          ) : (
            'Send'
          )}
        </button>
      </div>

      {/* Keyboard shortcut hint */}
      <p className="text-xs text-gray-400 mt-2">
        Press Ctrl+Enter to send
      </p>
    </div>
  )
}
