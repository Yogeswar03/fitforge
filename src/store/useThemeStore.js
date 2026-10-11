import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * useThemeStore
 * Global theme management supporting Dark and White/Light themes.
 * Persisted in localStorage and synchronizes HTML document class.
 */
const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'dark', // 'dark' | 'light'

      toggleTheme: () => {
        const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: nextTheme });
        applyThemeClass(nextTheme);
      },

      setTheme: (newTheme) => {
        const validTheme = newTheme === 'light' ? 'light' : 'dark';
        set({ theme: validTheme });
        applyThemeClass(validTheme);
      },
    }),
    {
      name: 'fitforge-theme',
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          applyThemeClass(state.theme);
        }
      },
    }
  )
);

function applyThemeClass(theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'light') {
    root.classList.add('light-theme');
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  } else {
    root.classList.remove('light-theme');
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  }
}

export default useThemeStore;
