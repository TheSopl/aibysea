'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { smooth } from '@/lib/animations/transitions';

interface CardProps {
  variant?: 'default' | 'interactive' | 'flat';
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}

interface CardSubComponentProps {
  className?: string;
  children: ReactNode;
}

/**
 * Card Component
 *
 * Unified card component with consistent styling and hover animations.
 * Uses compound component pattern for flexible composition.
 *
 * @example
 * ```tsx
 * <Card variant="default">
 *   <Card.Header>
 *     <Card.Title>Title</Card.Title>
 *     <Card.Description>Description text</Card.Description>
 *   </Card.Header>
 *   <Card.Content>
 *     Content goes here
 *   </Card.Content>
 *   <Card.Footer>
 *     <Button>Action</Button>
 *   </Card.Footer>
 * </Card>
 *
 * <Card variant="interactive" onClick={handleClick}>
 *   ...
 * </Card>
 * ```
 */
function Card({
  variant = 'default',
  className,
  onClick,
  children,
}: CardProps) {
  // Check for reduced motion preference
  const shouldReduceMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  // Variant styles
  const variantStyles = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-slate-700',
    interactive: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-slate-700 cursor-pointer',
    flat: 'bg-white dark:bg-gray-800',
  };

  // Base styles — tight padding, subtle border instead of heavy shadow
  const baseStyles = 'rounded-lg p-4';

  // Animation props for interactive variant — subtle hover only
  const animationProps = variant === 'interactive' && !shouldReduceMotion
    ? {
        whileHover: { borderColor: 'rgba(59,130,246,0.4)' },
        transition: smooth,
      }
    : {};

  const MotionDiv = motion.div;

  return (
    <MotionDiv
      className={cn(
        baseStyles,
        variantStyles[variant],
        className
      )}
      onClick={onClick}
      {...animationProps}
    >
      {children}
    </MotionDiv>
  );
}

/**
 * Card.Header - Header section for card
 * Provides flex layout for title and optional actions
 */
function CardHeader({ className, children }: CardSubComponentProps) {
  return (
    <div className={cn('flex justify-between items-start mb-2', className)}>
      {children}
    </div>
  );
}

/**
 * Card.Title - Title heading for card
 * Uses heading-3 token for consistent typography
 */
function CardTitle({ className, children }: CardSubComponentProps) {
  return (
    <h3 className={cn('text-lg font-semibold text-gray-900 dark:text-white', className)}>
      {children}
    </h3>
  );
}

/**
 * Card.Description - Subtitle/description text
 * Muted text style for secondary information
 */
function CardDescription({ className, children }: CardSubComponentProps) {
  return (
    <p className={cn('text-sm text-gray-500 dark:text-gray-400 mt-1', className)}>
      {children}
    </p>
  );
}

/**
 * Card.Content - Main content area
 * Standard text styling for card body
 */
function CardContent({ className, children }: CardSubComponentProps) {
  return (
    <div className={cn('text-gray-700 dark:text-gray-300', className)}>
      {children}
    </div>
  );
}

/**
 * Card.Footer - Footer section for actions
 * Right-aligned flex layout for buttons
 */
function CardFooter({ className, children }: CardSubComponentProps) {
  return (
    <div className={cn('mt-3 flex justify-end gap-2', className)}>
      {children}
    </div>
  );
}

// Attach compound components to Card
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
