'use client';

import { cn } from '@/lib/utils';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'main' | 'article';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
}

const maxWidthClasses = {
  sm: 'max-w-screen-sm',      // 640px
  md: 'max-w-screen-md',      // 768px
  lg: 'max-w-screen-lg',      // 1024px
  xl: 'max-w-[1200px]',       // 1200px
  '2xl': 'max-w-[1400px]',    // 1400px
  full: 'max-w-full',
};

export function ResponsiveContainer({
  children,
  className,
  as: Component = 'div',
  maxWidth = 'xl',
  padding = true,
}: ResponsiveContainerProps) {
  return (
    <Component
      className={cn(
        'w-full mx-auto',
        maxWidthClasses[maxWidth],
        padding && 'px-page sm:px-page-sm tablet:px-page-md lg:px-page-lg',
        className
      )}
    >
      {children}
    </Component>
  );
}
