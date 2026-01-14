import { signOut } from '@/app/actions/auth'

export function Header() {
  return (
    <header className="h-16 border-b border-accent-surface bg-dark-surface flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-text-primary">AIBYSEA</h1>
      <form action={signOut}>
        <button
          type="submit"
          className="text-sm text-text-secondary hover:text-text-primary"
        >
          Sign out
        </button>
      </form>
    </header>
  )
}
