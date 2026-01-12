import { Suspense } from 'react'
import { ConversationList } from './ConversationList'

function ConversationListSkeleton() {
  return (
    <div className="divide-y divide-gray-100">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="px-4 py-3 flex items-start gap-3 animate-pulse">
          <div className="w-4 h-4 bg-gray-200 rounded mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-3 bg-gray-200 rounded w-8" />
            </div>
            <div className="h-3 bg-gray-200 rounded w-40 mt-2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-medium text-gray-900">Conversations</h2>
      </div>
      <div className="p-3 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search conversations..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
