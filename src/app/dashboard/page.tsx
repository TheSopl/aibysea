import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Welcome to AIBYSEA
        </h2>
        <p className="text-gray-600">
          Logged in as {user?.email}
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Select a conversation from the sidebar to begin.
        </p>
      </div>
    </div>
  )
}
