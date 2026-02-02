'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { spring } from '@/lib/animations/transitions';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  iconOnly?: boolean;
  children?: ReactNode;
  className?: string;
}

/**
 * Button Component
 *
 * Unified button component with consistent styling, animations, and accessibility.
 * Replaces 15+ inline button variations across the platform.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md">Click me</Button>
 * <Button variant="secondary" icon={<PlusIcon />}>Add Item</Button>
 * <Button variant="danger" loading>Deleting...</Button>
 * <Button iconOnly icon={<TrashIcon />} aria-label="Delete" />
 * ```
 */
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
  // Check for reduced motion preference
  const shouldReduceMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  // Variant styles
  const variantStyles = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white',
    secondary: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm min-h-[32px]',
    md: 'px-4 py-2 text-base min-h-[44px]',
    lg: 'px-6 py-3 text-lg min-h-[56px]',
  };

  // Base styles
  const baseStyles = 'rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900';

  // Disabled/loading styles
  const disabledStyles = (disabled || loading) ? 'opacity-50 cursor-not-allowed' : '';

  // Icon-only styles
  const iconOnlyStyles = iconOnly ? 'aspect-square justify-center p-0' : '';

  // Animation props
  const animationProps = !shouldReduceMotion && !disabled && !loading
    ? {
        whileHover: { scale: 1.02, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" },
        whileTap: { scale: 0.98 },
        transition: spring,
      }
    : {};

  const MotionButton = motion.button;

  return (
    <MotionButton
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
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
      {...animationProps}
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
    </MotionButton>
  );
}
