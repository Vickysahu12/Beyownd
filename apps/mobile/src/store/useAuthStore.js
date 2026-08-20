import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '@/utils/storage';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      hasCompletedOnboarding: false,

      // Actions
      login: (userData, accessToken, refreshToken) => {
        set({
          user: userData,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      // Sirf tokens update karne ke liye (refresh flow ke andar use hoga)
      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken });
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      updateUser: (updatedData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedData } : null,
        }));
      },

      setCompletedOnboarding: (status) => {
        set({ hasCompletedOnboarding: status });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);