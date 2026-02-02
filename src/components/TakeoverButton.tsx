'use client'

import { useState, useTransition } from 'react'
import { updateConversationHandler } from '@/app/actions/conversations'

interface TakeoverButtonProps {
  conversationId: string
  initialHandlerType: 'ai' | 'human'
  onHandlerChange?: (newHandler: 'ai' | 'human') => void
}

export function TakeoverButton({
  conversationId,
  initialHandlerType,
  onHandlerChange
}: TakeoverButtonProps) {
  const [handlerType, setHandlerType] = useState<'ai' | 'human'>(initialHandlerType)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleToggle = async (newHandler: 'ai' | 'human') => {
    if (isPending) return

    setError(null)

    // Optimistic update
    const previousHandler = handlerType
    setHandlerType(newHandler)
    onHandlerChange?.(newHandler)

    startTransition(async () => {
      const result = await updateConversationHandler(conversationId, newHandler)

      if (!result.success) {
        // Revert on error
        setHandlerType(previousHandler)
        onHandlerChange?.(previousHandler)
        setError(result.error || 'Failed to update handler')
      }
    })
  }

  const isAIHandling = handlerType === 'ai'

  return (
    <div className="flex items-center gap-2">
      {/* Handler Status Badge */}
      <div className={`text-xs px-2 py-1 rounded font-medium ${
        isAIHandling
          ? 'bg-primary-100 text-primary-700'
          : 'bg-service-documents-100 text-service-documents-700'
      }`}>
        {isAIHandling ? 'AI Handling' : "You're Handling"}
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => handleToggle(isAIHandling ? 'human' : 'ai')}
        disabled={isPending}
        className={`text-xs px-3 py-1 min-h-[44px] rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
          isAIHandling
            ? 'bg-service-documents-500 text-white hover:bg-service-documents-600'
            : 'bg-primary-500 text-white hover:bg-primary-600'
        }`}
      >
        {isPending ? (
          <span className="flex items-center gap-1">
            <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
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
            <span>Updating...</span>
          </span>
        ) : (
          isAIHandling ? 'Take Over' : 'Resume AI'
        )}
      </button>

      {/* Error Display */}
      {error && (
        <div className="absolute top-full mt-1 end-0 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600 shadow-lg z-10 max-w-xs">
          {error}
        </div>
      )}
    </div>
  )
}
