import { Suspense } from 'react'
import { ConversationList } from './ConversationList'

function ConversationListSkeleton() {
  return (
    <div className="divide-y divide-accent-surface">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="px-4 py-3 flex items-start gap-3 animate-pulse">
          <div className="w-4 h-4 bg-accent-surface rounded mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <div className="h-4 bg-accent-surface rounded w-24" />
              <div className="h-3 bg-accent-surface rounded w-8" />
            </div>
            <div className="h-3 bg-accent-surface rounded w-40 mt-2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="w-80 border-r border-accent-surface bg-dark-surface flex flex-col">
      <div className="p-4 border-b border-accent-surface">
        <h2 className="font-medium text-text-primary">Conversations</h2>
      </div>
      <div className="p-3 border-b border-accent-surface">
        <input
          type="text"
          placeholder="Search conversations..."
          className="w-full px-3 py-2 min-h-[44px] text-sm border border-accent-surface rounded-lg bg-navy text-text-primary focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
          disabled
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        <Suspense fallback={<ConversationListSkeleton />}>
          <ConversationList />
        </Suspense>
      </div>
    </aside>
  )
}
