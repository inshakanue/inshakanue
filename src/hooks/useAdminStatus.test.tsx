import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAdminStatus } from './useAdminStatus';
import { supabase } from '@/integrations/supabase/client';

// Helper to wait for hook updates
const waitFor = async (callback: () => void, timeout = 1000) => {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    try {
      callback();
      return;
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
  callback(); // Final attempt
};

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: {
          subscription: {
            unsubscribe: vi.fn(),
          },
        },
      })),
    },
    rpc: vi.fn(),
  },
}));

describe('useAdminStatus', () => {
  it('should return loading state initially', () => {
    const { result } = renderHook(() => useAdminStatus());
    
    expect(result.current.loading).toBe(true);
  });

  it('should return isAdmin false when no user is logged in', async () => {
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const { result } = renderHook(() => useAdminStatus());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.isAdmin).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it('should check admin status when user is logged in', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: mockUser as any },
      error: null,
    });
    
    vi.mocked(supabase.rpc).mockResolvedValue({
      data: true,
      error: null,
    });

    const { result } = renderHook(() => useAdminStatus());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.isAdmin).toBe(true);
    expect(result.current.user).toEqual(mockUser);
  });
});
