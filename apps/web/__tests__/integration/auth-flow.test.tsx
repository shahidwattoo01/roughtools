import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignInPage } from '@/app/(auth)/signin/page';
import { SignUpPage } from '@/app/(auth)/signup/page';

// Mock next-auth — use jest.fn() inline so the factory can reference it
// during Jest's hoisted mock execution (const has TDZ, inline avoids it)
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
  useSession: () => ({
    data: null,
    status: 'unauthenticated',
  }),
  getSession: jest.fn(),
}));

const mockSignIn = jest.requireMock('next-auth/react').signIn as jest.Mock;
const mockSignUp = jest.fn(); // unused in next-auth mock, kept for test references

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    pathname: '/auth/signin',
  }),
  usePathname: () => '/auth/signin',
  useSearchParams: () => new URLSearchParams(),
}));

describe('Authentication Flow Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Sign In Flow', () => {
    it('completes email/password sign in successfully', async () => {
      mockSignIn.mockResolvedValue({ ok: true, error: null });

      const user = userEvent.setup();
      render(<SignInPage />);

      // Fill in credentials
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'Password123!');

      // Submit form
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('credentials', {
          email: 'test@example.com',
          password: 'Password123!',
          redirect: false,
        });
      });
    });

    it('shows error on invalid credentials', async () => {
      mockSignIn.mockResolvedValue({
        ok: false,
        error: 'Invalid credentials',
      });

      const user = userEvent.setup();
      render(<SignInPage />);

      await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
      await user.type(screen.getByLabelText(/password/i), 'wrongpass');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });

    it('validates required fields before submission', async () => {
      const user = userEvent.setup();
      render(<SignInPage />);

      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      expect(mockSignIn).not.toHaveBeenCalled();
    });

    it('validates email format', async () => {
      const user = userEvent.setup();
      render(<SignInPage />);

      await user.type(screen.getByLabelText(/email/i), 'notanemail');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      expect(mockSignIn).not.toHaveBeenCalled();
    });

    it('signs in with OAuth provider', async () => {
      mockSignIn.mockResolvedValue({ ok: true });

      const user = userEvent.setup();
      render(<SignInPage />);

      await user.click(screen.getByRole('button', { name: /sign in with google/i }));

      expect(mockSignIn).toHaveBeenCalledWith('google', { callbackUrl: '/' });
    });
  });

  describe('Sign Up Flow', () => {
    it('completes registration successfully', async () => {
      mockSignUp.mockResolvedValue({ ok: true });

      const user = userEvent.setup();
      render(<SignUpPage />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/^password/i), 'StrongP@ss123');
      await user.type(screen.getByLabelText(/confirm password/i), 'StrongP@ss123');
      await user.click(screen.getByRole('checkbox', { name: /terms/i }));
      await user.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'StrongP@ss123',
        });
      });
    });

    it('validates password match', async () => {
      const user = userEvent.setup();
      render(<SignUpPage />);

      await user.type(screen.getByLabelText(/^password/i), 'Password123!');
      await user.type(screen.getByLabelText(/confirm password/i), 'Different123!');
      await user.click(screen.getByRole('button', { name: /create account/i }));

      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      expect(mockSignUp).not.toHaveBeenCalled();
    });

    it('validates password strength', async () => {
      const user = userEvent.setup();
      render(<SignUpPage />);

      await user.type(screen.getByLabelText(/^password/i), 'weak');
      await user.click(screen.getByRole('button', { name: /create account/i }));

      expect(screen.getByText(/password must be/i)).toBeInTheDocument();
    });
  });
});
