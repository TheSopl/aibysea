'use client'

import { useState, useTransition } from 'react'
import { updateConversationHandler } from '@/app/actions/conversations'
import Button from '@/components/ui/Button'

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
      <Button
        variant="primary"
        size="sm"
        onClick={() => handleToggle(isAIHandling ? 'human' : 'ai')}
        disabled={isPending}
        loading={isPending}
        className={`text-xs min-h-[44px] ${
          isAIHandling
            ? 'bg-service-documents-500 hover:bg-service-documents-600'
            : ''
        }`}
      >
        {isAIHandling ? 'Take Over' : 'Resume AI'}
      </Button>

      {/* Error Display */}
      {error && (
        <div className="absolute top-full mt-1 end-0 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600 shadow-lg z-10 max-w-xs">
          {error}
        </div>
      )}
    </div>
  )
}
