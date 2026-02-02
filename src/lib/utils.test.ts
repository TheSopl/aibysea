/**
 * Utility Functions Tests
 *
 * Tests the cn() utility function for class name merging and Tailwind conflict resolution.
 */

import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('should merge class names correctly', () => {
    const result = cn('text-red-500', 'bg-blue-500');
    expect(result).toBe('text-red-500 bg-blue-500');
  });

  it('should resolve Tailwind class conflicts (last wins)', () => {
    const result = cn('px-2', 'px-4');
    expect(result).toBe('px-4');
  });

  it('should handle multiple conflicting classes', () => {
    const result = cn('text-sm', 'text-base', 'text-lg');
    expect(result).toBe('text-lg');
  });

  it('should return empty string for no inputs', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should handle empty strings', () => {
    const result = cn('', 'text-red-500', '');
    expect(result).toBe('text-red-500');
  });

  it('should handle undefined and null values', () => {
    const result = cn('text-red-500', undefined, null, 'bg-blue-500');
    expect(result).toBe('text-red-500 bg-blue-500');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const result = cn('base-class', isActive && 'active-class');
    expect(result).toBe('base-class active-class');
  });

  it('should handle false conditionals', () => {
    const isActive = false;
    const result = cn('base-class', isActive && 'active-class');
    expect(result).toBe('base-class');
  });

  it('should merge complex class combinations', () => {
    const result = cn(
      'flex items-center justify-center',
      'px-4 py-2',
      'bg-blue-500 hover:bg-blue-600'
    );
    expect(result).toBe(
      'flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600'
    );
  });

  it('should handle responsive classes', () => {
    const result = cn('text-sm', 'md:text-base', 'lg:text-lg');
    expect(result).toBe('text-sm md:text-base lg:text-lg');
  });

  it('should resolve conflicting responsive classes', () => {
    const result = cn('md:px-2', 'md:px-4');
    expect(result).toBe('md:px-4');
  });

  it('should handle array of classes', () => {
    const result = cn(['text-red-500', 'bg-blue-500']);
    expect(result).toBe('text-red-500 bg-blue-500');
  });

  it('should handle mixed arrays and strings', () => {
    const result = cn('base', ['text-red-500', 'bg-blue-500'], 'extra');
    expect(result).toBe('base text-red-500 bg-blue-500 extra');
  });

  it('should resolve margin conflicts', () => {
    const result = cn('m-2', 'm-4');
    expect(result).toBe('m-4');
  });

  it('should resolve padding conflicts', () => {
    const result = cn('p-2', 'p-4');
    expect(result).toBe('p-4');
  });

  it('should resolve width conflicts', () => {
    const result = cn('w-full', 'w-1/2');
    expect(result).toBe('w-1/2');
  });

  it('should resolve height conflicts', () => {
    const result = cn('h-screen', 'h-full');
    expect(result).toBe('h-full');
  });

  it('should handle dark mode classes', () => {
    const result = cn('bg-white', 'dark:bg-gray-900');
    expect(result).toBe('bg-white dark:bg-gray-900');
  });

  it('should resolve dark mode conflicts', () => {
    const result = cn('dark:bg-gray-800', 'dark:bg-gray-900');
    expect(result).toBe('dark:bg-gray-900');
  });
});
