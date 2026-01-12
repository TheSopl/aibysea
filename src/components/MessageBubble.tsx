'use client'

import { Message } from '@/types/database'

interface MessageBubbleProps {
  message: Message
}

function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isInbound = message.direction === 'inbound'
  const isAI = message.sender_type === 'ai'

  return (
    <div
      className={`flex ${isInbound ? 'justify-start' : 'justify-end'}`}
    >
      <div className="max-w-[70%]">
        <div
          className={`px-4 py-2 ${
            isInbound
              ? 'bg-gray-100 text-gray-900 rounded-lg rounded-tl-none'
              : 'bg-blue-500 text-white rounded-lg rounded-tr-none'
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        <div
          className={`flex items-center gap-2 mt-1 ${
            isInbound ? 'justify-start' : 'justify-end'
          }`}
        >
          <span className="text-xs text-gray-400">
            {formatTime(message.created_at)}
          </span>
          {isAI && (
            <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
              AI
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
