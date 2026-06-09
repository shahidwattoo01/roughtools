import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  getSession: jest.fn(),
}));

import { useSession, signIn, signOut } from 'next-auth/react';

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns unauthenticated state initially', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('returns authenticated state when session exists', () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      image: null,
    };

    (useSession as jest.Mock).mockReturnValue({
      data: { user: mockUser },
      status: 'authenticated',
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isLoading).toBe(false);
  });

  it('returns loading state', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'loading',
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.isLoading).toBe(true);
  });

  it('calls signIn with correct provider', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('google');
    });

    expect(signIn).toHaveBeenCalledWith('google', { callbackUrl: '/' });
  });

  it('calls signOut on logout', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { id: '1', name: 'Test' } },
      status: 'authenticated',
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logout();
    });

    expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/auth/signin' });
  });

  it('checks user role correctly', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: { id: '1', name: 'Admin', email: 'admin@test.com', role: 'admin' },
      },
      status: 'authenticated',
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.hasRole('admin')).toBe(true);
    expect(result.current.hasRole('user')).toBe(false);
  });
});