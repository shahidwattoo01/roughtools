import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card } from '../src/components/Card';

describe('@workspace/ui Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders with title', () => {
    render(<Card title="Card Title">Content</Card>);
    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  it('renders with subtitle', () => {
    render(<Card title="Title" subtitle="Subtitle">Content</Card>);
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
  });

  it('renders with footer', () => {
    render(<Card footer={<span>Footer content</span>}>Content</Card>);
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('renders with image', () => {
    render(
      <Card image={{ src: '/test.jpg', alt: 'Test image' }}>
        Content
      </Card>
    );
    const img = screen.getByRole('img', { name: 'Test image' });
    expect(img).toHaveAttribute('src', '/test.jpg');
  });

  it('applies hover effect when interactive', () => {
    const { container } = render(<Card interactive>Clickable card</Card>);
    expect(container.firstChild).toHaveClass(/interactive|hover/i);
  });

  it('applies different padding sizes', () => {
    const { container, rerender } = render(<Card padding="sm">Content</Card>);
    expect(container.firstChild).toHaveClass(/sm/);

    rerender(<Card padding="lg">Content</Card>);
    expect(container.firstChild).toHaveClass(/lg/);
  });
});