import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@workspace/ui';

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass(/primary/i);

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass(/secondary/i);

    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole('button')).toHaveClass(/danger/i);

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button')).toHaveClass(/ghost/i);
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass(/sm/i);

    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByRole('button')).toHaveClass(/md/i);

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass(/lg/i);
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire click when disabled', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick} disabled>Click me</Button>);
    await user.click(screen.getByRole('button'));

    expect(handleClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows loading state', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('renders as a link when href is provided', () => {
    render(<Button href="/about">About</Button>);
    const link = screen.getByRole('link', { name: /about/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/about');
  });

  it('supports full width', () => {
    render(<Button fullWidth>Full Width</Button>);
    expect(screen.getByRole('button')).toHaveClass(/fullWidth/i);
  });

  it('renders left and right icons', () => {
    const LeftIcon = () => <span data-testid="left-icon">←</span>;
    const RightIcon = () => <span data-testid="right-icon">→</span>;

    render(
      <Button leftIcon={<LeftIcon />} rightIcon={<RightIcon />}>
        With Icons
      </Button>
    );

    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });
});