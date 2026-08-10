import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '@/utils/storage';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      hasCompletedOnboarding: false,

      // Actions
      login: (userData, authToken) => {
        set({
          user: userData,
          token: authToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
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
      name: 'auth-storage', // AsyncStorage mein key ka naam
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);