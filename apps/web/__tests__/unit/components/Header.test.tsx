import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from '@/components/layout/Header';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn().mockReturnValue({
    data: {
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        image: null,
      },
    },
    status: 'authenticated',
  }),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

describe('Header Component', () => {
  it('renders the logo/brand name', () => {
    render(<Header />);
    const brandElement = screen.getByRole('link', { name: /brand/i });
    expect(brandElement).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
  });

  it('renders sign out button when authenticated', () => {
    render(<Header />);
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
  });

  it('renders sign in button when unauthenticated', () => {
    jest.requireMock('next-auth/react').useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<Header />);
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('toggles mobile menu on hamburger click', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const hamburgerButton = screen.getByRole('button', { name: /menu/i });
    await user.click(hamburgerButton);

    // Mobile nav should now be visible
    expect(screen.getByTestId('mobile-nav')).toBeVisible();
  });

  it('applies active style to current route link', () => {
    render(<Header />);
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toHaveAttribute('aria-current', 'page');
  });

  it('is accessible', () => {
    render(<Header />);
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });
});
