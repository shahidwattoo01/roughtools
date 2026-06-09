import { renderHook, act } from '@testing-library/react';
import { useTheme } from '@/hooks/useTheme';

describe('useTheme Hook', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('dark', 'light');
  });

  it('defaults to light theme', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
  });

  it('reads theme from localStorage', () => {
    window.localStorage.setItem('theme', 'dark');
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
  });

  it('toggles theme between light and dark', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('light');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');
    expect(window.localStorage.getItem('theme')).toBe('dark');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('light');
    expect(window.localStorage.getItem('theme')).toBe('light');
  });

  it('sets theme explicitly', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark');
    expect(window.localStorage.getItem('theme')).toBe('dark');
  });

  it('respects system preference when no saved theme', () => {
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    window.localStorage.removeItem('theme');
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('dark');
  });
});