'use client';

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface BottomNavItemProps {
  href?: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

export default function BottomNavItem({
  href,
  icon: Icon,
  label,
  isActive,
  onClick,
}: BottomNavItemProps) {
  const baseStyles =
    'flex-1 flex flex-col items-center justify-center min-h-[56px] min-w-[64px] gap-0.5 transition-colors duration-200';

  const activeStyles = 'bg-gradient-to-r from-accent to-primary text-white';
  const inactiveStyles = 'text-muted-foreground hover:text-foreground';

  const content = (
    <>
      <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
      <span className="text-[10px] font-semibold">{label}</span>
    </>
  );

  // Button for More (no navigation, triggers onClick)
  if (onClick && !href) {
    return (
      <button
        onClick={onClick}
        className={`${baseStyles} ${isActive ? activeStyles : inactiveStyles}`}
        aria-label={label}
      >
        {content}
      </button>
    );
  }

  // Link for navigation items
  return (
    <Link
      href={href || '/'}
      className={`${baseStyles} ${isActive ? activeStyles : inactiveStyles}`}
      aria-label={label}
    >
      {content}
    </Link>
  );
}
