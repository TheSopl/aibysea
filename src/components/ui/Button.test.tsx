import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen } from '@/lib/test-utils';
import Button from './Button';
import { PlusIcon, TrashIcon } from 'lucide-react';

describe('Button Component', () => {
  describe('Variants', () => {
    it('renders primary variant with correct classes', () => {
      renderWithProviders(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole('button', { name: /primary/i });
      expect(button).toHaveClass('bg-primary-500');
      expect(button).toHaveClass('hover:bg-primary-600');
      expect(button).toHaveClass('text-white');
    });

    it('renders secondary variant with correct classes', () => {
      renderWithProviders(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button', { name: /secondary/i });
      expect(button).toHaveClass('bg-gray-200');
      expect(button).toHaveClass('dark:bg-gray-700');
    });

    it('renders ghost variant with correct classes', () => {
      renderWithProviders(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button', { name: /ghost/i });
      expect(button).toHaveClass('bg-transparent');
      expect(button).toHaveClass('hover:bg-gray-100');
    });

    it('renders danger variant with correct classes', () => {
      renderWithProviders(<Button variant="danger">Delete</Button>);
      const button = screen.getByRole('button', { name: /delete/i });
      expect(button).toHaveClass('bg-red-500');
      expect(button).toHaveClass('hover:bg-red-600');
    });
  });

  describe('Sizes', () => {
    it('renders small size with correct min-height', () => {
      renderWithProviders(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button', { name: /small/i });
      expect(button).toHaveClass('min-h-[32px]');
      expect(button).toHaveClass('px-3');
      expect(button).toHaveClass('py-1.5');
      expect(button).toHaveClass('text-sm');
    });

    it('renders medium size (default) with 44px touch target', () => {
      renderWithProviders(<Button size="md">Medium</Button>);
      const button = screen.getByRole('button', { name: /medium/i });
      expect(button).toHaveClass('min-h-[44px]');
      expect(button).toHaveClass('px-4');
      expect(button).toHaveClass('py-2');
      expect(button).toHaveClass('text-base');
    });

    it('renders large size with correct min-height', () => {
      renderWithProviders(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button', { name: /large/i });
      expect(button).toHaveClass('min-h-[56px]');
      expect(button).toHaveClass('px-6');
      expect(button).toHaveClass('py-3');
      expect(button).toHaveClass('text-lg');
    });

    it('uses medium size as default when size not specified', () => {
      renderWithProviders(<Button>Default Size</Button>);
      const button = screen.getByRole('button', { name: /default size/i });
      expect(button).toHaveClass('min-h-[44px]');
    });
  });

  describe('Disabled State', () => {
    it('renders disabled state with correct styles', () => {
      renderWithProviders(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button', { name: /disabled/i });
      expect(button).toBeDisabled();
      expect(button).toHaveClass('opacity-50');
      expect(button).toHaveClass('cursor-not-allowed');
    });

    it('prevents click when disabled', () => {
      const handleClick = vi.fn();
      renderWithProviders(
        <Button disabled onClick={handleClick}>
          Click me
        </Button>
      );
      const button = screen.getByRole('button', { name: /click me/i });
      button.click();
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('shows spinner when loading', () => {
      renderWithProviders(<Button loading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('opacity-50');
      expect(button).toBeDisabled();
      // Check for spinner by class (Loader2 component)
      const spinner = button.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('prevents click when loading', () => {
      const handleClick = vi.fn();
      renderWithProviders(
        <Button loading onClick={handleClick}>
          Click me
        </Button>
      );
      const button = screen.getByRole('button');
      button.click();
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('hides children text when loading but not iconOnly', () => {
      renderWithProviders(<Button loading>Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Loading...');
    });
  });

  describe('Icon Support', () => {
    it('renders icon before text', () => {
      renderWithProviders(
        <Button icon={<PlusIcon data-testid="plus-icon" />}>
          Add Item
        </Button>
      );
      const button = screen.getByRole('button', { name: /add item/i });
      const icon = screen.getByTestId('plus-icon');
      expect(button).toContainElement(icon);
      expect(button).toHaveTextContent('Add Item');
    });

    it('renders iconOnly button without text', () => {
      renderWithProviders(
        <Button
          iconOnly
          icon={<TrashIcon data-testid="trash-icon" />}
          aria-label="Delete"
        />
      );
      const button = screen.getByRole('button', { name: /delete/i });
      const icon = screen.getByTestId('trash-icon');
      expect(button).toContainElement(icon);
      expect(button).not.toHaveTextContent('Delete'); // aria-label is not text content
    });
  });

  describe('Click Handler', () => {
    it('fires onClick handler when clicked', () => {
      const handleClick = vi.fn();
      renderWithProviders(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole('button', { name: /click me/i });
      button.click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not fire onClick when disabled', () => {
      const handleClick = vi.fn();
      renderWithProviders(
        <Button disabled onClick={handleClick}>
          Click me
        </Button>
      );
      const button = screen.getByRole('button', { name: /click me/i });
      button.click();
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not fire onClick when loading', () => {
      const handleClick = vi.fn();
      renderWithProviders(
        <Button loading onClick={handleClick}>
          Click me
        </Button>
      );
      const button = screen.getByRole('button');
      button.click();
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Custom ClassName', () => {
    it('merges custom className with base classes', () => {
      renderWithProviders(
        <Button className="custom-class">Custom</Button>
      );
      const button = screen.getByRole('button', { name: /custom/i });
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveClass('rounded-lg'); // Base class still present
    });
  });

  describe('Accessibility', () => {
    it('has button role', () => {
      renderWithProviders(<Button>Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('has type="button" by default', () => {
      renderWithProviders(<Button>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('accepts custom type attribute', () => {
      renderWithProviders(<Button type="submit">Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('requires aria-label for iconOnly buttons', () => {
      // This is a design requirement - the component should be used with aria-label
      renderWithProviders(
        <Button
          iconOnly
          icon={<TrashIcon />}
          aria-label="Delete item"
        />
      );
      const button = screen.getByRole('button', { name: /delete item/i });
      expect(button).toBeInTheDocument();
    });
  });
});
