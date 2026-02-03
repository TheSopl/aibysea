import { signOut } from '@/app/actions/auth'
import Button from '@/components/ui/Button'

export function Header() {
  return (
    <header className="h-16 border-b border-accent-surface bg-dark-surface flex items-center justify-between px-6">
      <h1 className="text-heading-3 font-semibold text-text-primary">AIBYSEA</h1>
      <form action={signOut}>
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          className="text-text-secondary hover:text-text-primary"
        >
          Sign out
        </Button>
      </form>
    </header>
  )
}
