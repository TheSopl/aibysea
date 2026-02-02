import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen } from '@/lib/test-utils';
import Card from './Card';

describe('Card Component', () => {
  describe('Variants', () => {
    it('renders default variant with shadow', () => {
      renderWithProviders(
        <Card variant="default">
          <div>Content</div>
        </Card>
      );
      const card = screen.getByText('Content').parentElement;
      expect(card).toHaveClass('shadow-card');
      expect(card).toHaveClass('bg-white');
      expect(card).toHaveClass('dark:bg-gray-800');
    });

    it('renders interactive variant with cursor-pointer', () => {
      renderWithProviders(
        <Card variant="interactive">
          <div>Clickable</div>
        </Card>
      );
      const card = screen.getByText('Clickable').parentElement;
      expect(card).toHaveClass('cursor-pointer');
      expect(card).toHaveClass('shadow-card');
    });

    it('renders flat variant without shadow', () => {
      renderWithProviders(
        <Card variant="flat">
          <div>Flat card</div>
        </Card>
      );
      const card = screen.getByText('Flat card').parentElement;
      expect(card).not.toHaveClass('shadow-card');
      expect(card).toHaveClass('bg-white');
      expect(card).toHaveClass('dark:bg-gray-800');
    });

    it('uses default variant when not specified', () => {
      renderWithProviders(
        <Card>
          <div>Default</div>
        </Card>
      );
      const card = screen.getByText('Default').parentElement;
      expect(card).toHaveClass('shadow-card');
    });
  });

  describe('Base Styles', () => {
    it('has consistent border radius', () => {
      renderWithProviders(
        <Card>
          <div>Content</div>
        </Card>
      );
      const card = screen.getByText('Content').parentElement;
      expect(card).toHaveClass('rounded-design-lg');
    });

    it('has card padding', () => {
      renderWithProviders(
        <Card>
          <div>Content</div>
        </Card>
      );
      const card = screen.getByText('Content').parentElement;
      expect(card).toHaveClass('p-card');
    });
  });

  describe('Click Handler', () => {
    it('fires onClick for interactive cards', () => {
      const handleClick = vi.fn();
      renderWithProviders(
        <Card variant="interactive" onClick={handleClick}>
          <div>Click me</div>
        </Card>
      );
      const card = screen.getByText('Click me').parentElement;
      if (card) {
        card.click();
        expect(handleClick).toHaveBeenCalledTimes(1);
      }
    });

    it('can have onClick for default cards', () => {
      const handleClick = vi.fn();
      renderWithProviders(
        <Card onClick={handleClick}>
          <div>Click me</div>
        </Card>
      );
      const card = screen.getByText('Click me').parentElement;
      if (card) {
        card.click();
        expect(handleClick).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('Custom ClassName', () => {
    it('merges custom className with base classes', () => {
      renderWithProviders(
        <Card className="custom-class">
          <div>Custom</div>
        </Card>
      );
      const card = screen.getByText('Custom').parentElement;
      expect(card).toHaveClass('custom-class');
      expect(card).toHaveClass('rounded-design-lg'); // Base class still present
    });
  });

  describe('Compound Components', () => {
    it('renders Card.Header correctly', () => {
      renderWithProviders(
        <Card>
          <Card.Header>
            <div>Header content</div>
          </Card.Header>
        </Card>
      );
      const header = screen.getByText('Header content').parentElement;
      expect(header).toHaveClass('flex');
      expect(header).toHaveClass('justify-between');
      expect(header).toHaveClass('items-start');
      expect(header).toHaveClass('mb-4');
    });

    it('renders Card.Title correctly', () => {
      renderWithProviders(
        <Card>
          <Card.Title>Card Title</Card.Title>
        </Card>
      );
      const title = screen.getByText('Card Title');
      expect(title.tagName).toBe('H3');
      expect(title).toHaveClass('text-lg');
      expect(title).toHaveClass('font-semibold');
      expect(title).toHaveClass('text-gray-900');
      expect(title).toHaveClass('dark:text-white');
    });

    it('renders Card.Description correctly', () => {
      renderWithProviders(
        <Card>
          <Card.Description>Description text</Card.Description>
        </Card>
      );
      const description = screen.getByText('Description text');
      expect(description.tagName).toBe('P');
      expect(description).toHaveClass('text-sm');
      expect(description).toHaveClass('text-gray-500');
      expect(description).toHaveClass('dark:text-gray-400');
      expect(description).toHaveClass('mt-1');
    });

    it('renders Card.Content correctly', () => {
      renderWithProviders(
        <Card>
          <Card.Content>
            <p>Content goes here</p>
          </Card.Content>
        </Card>
      );
      const content = screen.getByText('Content goes here').parentElement;
      expect(content).toHaveClass('text-gray-700');
      expect(content).toHaveClass('dark:text-gray-300');
    });

    it('renders Card.Footer correctly', () => {
      renderWithProviders(
        <Card>
          <Card.Footer>
            <button>Action</button>
          </Card.Footer>
        </Card>
      );
      const footer = screen.getByRole('button', { name: /action/i }).parentElement;
      expect(footer).toHaveClass('mt-6');
      expect(footer).toHaveClass('flex');
      expect(footer).toHaveClass('justify-end');
      expect(footer).toHaveClass('gap-2');
    });

    it('renders full card structure with all components', () => {
      renderWithProviders(
        <Card>
          <Card.Header>
            <Card.Title>Title</Card.Title>
          </Card.Header>
          <Card.Content>
            <p>Main content</p>
          </Card.Content>
          <Card.Footer>
            <button>Save</button>
            <button>Cancel</button>
          </Card.Footer>
        </Card>
      );

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Main content')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('renders Card.Header with title and description', () => {
      renderWithProviders(
        <Card>
          <Card.Header>
            <div>
              <Card.Title>Card Title</Card.Title>
              <Card.Description>Card description</Card.Description>
            </div>
          </Card.Header>
        </Card>
      );

      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card description')).toBeInTheDocument();
    });
  });

  describe('Compound Component Custom Classes', () => {
    it('accepts custom className on Card.Header', () => {
      renderWithProviders(
        <Card>
          <Card.Header className="custom-header">
            <div>Header</div>
          </Card.Header>
        </Card>
      );
      const header = screen.getByText('Header').parentElement;
      expect(header).toHaveClass('custom-header');
      expect(header).toHaveClass('flex'); // Base class still present
    });

    it('accepts custom className on Card.Title', () => {
      renderWithProviders(
        <Card>
          <Card.Title className="custom-title">Title</Card.Title>
        </Card>
      );
      const title = screen.getByText('Title');
      expect(title).toHaveClass('custom-title');
      expect(title).toHaveClass('text-lg'); // Base class still present
    });

    it('accepts custom className on Card.Content', () => {
      renderWithProviders(
        <Card>
          <Card.Content className="custom-content">
            <div>Content</div>
          </Card.Content>
        </Card>
      );
      const content = screen.getByText('Content').parentElement;
      expect(content).toHaveClass('custom-content');
      expect(content).toHaveClass('text-gray-700'); // Base class still present
    });
  });
});
