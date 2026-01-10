import { signOut } from '@/app/actions/auth'

export function Header() {
  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-gray-900">AIBYSEA</h1>
      <form action={signOut}>
        <button
          type="submit"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Sign out
        </button>
      </form>
    </header>
  )
}
