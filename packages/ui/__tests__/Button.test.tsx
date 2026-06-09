import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../src/components/Button';

describe('@workspace/ui Button', () => {
  it('renders children correctly', () => {
    render(<Button>Hello</Button>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('applies variant styles', () => {
    const { container } = render(<Button variant="primary">Test</Button>);
    const button = container.firstChild as HTMLElement;
    expect(button.className).toMatch(/primary/);
  });

  it('applies size styles', () => {
    const { container } = render(<Button size="lg">Test</Button>);
    const button = container.firstChild as HTMLElement;
    expect(button.className).toMatch(/lg/);
  });

  it('calls onClick handler', async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={onClick}>Click</Button>);
    await user.click(screen.getByText('Click'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });

  it('shows spinner when loading', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders as different HTML elements based on "as" prop', () => {
    render(<Button as="a" href="/test">Link Button</Button>);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('supports ref forwarding', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref Test</Button>);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('BUTTON');
  });

  it('has correct aria attributes', () => {
    render(<Button aria-label="Close dialog" aria-expanded={false}>×</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Close dialog');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('handles keyboard interaction', async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={onClick}>Keyboard</Button>);
    const button = screen.getByText('Keyboard');

    button.focus();
    await user.keyboard('{Enter}');

    expect(onClick).toHaveBeenCalled();
  });
});