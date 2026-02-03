'use client'

interface InboxShellProps {
  children: React.ReactNode
}

export default function InboxShell({ children }: InboxShellProps) {
  return <div className="flex h-full overflow-hidden">{children}</div>
}
