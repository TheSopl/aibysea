'use client';

import { cn } from '@/lib/utils';

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    default?: number;
    xs?: number;
    sm?: number;
    md?: number;
    tablet?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
}

const gapClasses = {
  sm: 'gap-2 tablet:gap-3 lg:gap-4',
  md: 'gap-3 tablet:gap-4 lg:gap-6',
  lg: 'gap-4 tablet:gap-6 lg:gap-8',
};

export function ResponsiveGrid({
  children,
  className,
  cols = { default: 1, tablet: 2, lg: 3 },
  gap = 'md',
}: ResponsiveGridProps) {
  const colClasses = [
    cols.default && `grid-cols-${cols.default}`,
    cols.xs && `xs:grid-cols-${cols.xs}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.tablet && `tablet:grid-cols-${cols.tablet}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cn(
        'grid',
        colClasses,
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
}
