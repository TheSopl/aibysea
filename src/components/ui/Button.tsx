'use client';

import { Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  iconOnly?: boolean;
  children?: ReactNode;
  className?: string;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconOnly = false,
  children,
  className,
  onClick,
  type = 'button',
  ...props
}: ButtonProps) {
  const variantStyles = {
    primary: 'text-white hover:brightness-110 active:brightness-95',
    secondary: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white active:scale-[0.98]',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 active:scale-[0.98]',
    danger: 'text-white hover:brightness-110 active:brightness-95',
  };

  const variantInlineStyles: Record<string, React.CSSProperties> = {
    primary: { background: '#003EF3' },
    secondary: {},
    ghost: {},
    danger: { background: '#EF4444' },
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm min-h-[32px]',
    md: 'px-4 py-2 text-base min-h-[44px]',
    lg: 'px-6 py-3 text-lg min-h-[56px]',
  };

  const baseStyles = 'rounded-lg font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 hover:shadow-lg hover:-translate-y-[1px] active:translate-y-0 active:shadow-sm';

  const disabledStyles = (disabled || loading) ? 'opacity-50 cursor-not-allowed hover:shadow-none hover:translate-y-0' : '';

  const iconOnlyStyles = iconOnly ? 'aspect-square justify-center p-0' : '';

  return (
    <button
      type={type}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        disabledStyles,
        iconOnlyStyles,
        'flex items-center gap-2',
        className
      )}
      style={variantInlineStyles[variant]}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {!iconOnly && <span>Loading...</span>}
        </>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {!iconOnly && children}
        </>
      )}
    </button>
  );
}
