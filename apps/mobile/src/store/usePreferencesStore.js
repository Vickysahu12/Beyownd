import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '@/utils/storage';

export const usePreferencesStore = create(
  persist(
    (set) => ({
      isDarkMode: false,
      notificationsEnabled: true,
      soundEnabled: true,

      // Actions
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      toggleNotifications: () =>
        set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
    }),
    {
      name: 'preferences-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);