export function Sidebar() {
  return (
    <aside className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-medium text-gray-900">Conversations</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-sm text-gray-500">
          No conversations yet. They will appear here once WhatsApp integration is complete.
        </p>
      </div>
    </aside>
  )
}
