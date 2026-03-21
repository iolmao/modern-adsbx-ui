import { useEffect } from 'react';
import { useConfigStore } from '@/store/configStore';

export function useTheme() {
  const { nightMode } = useConfigStore();

  useEffect(() => {
    const root = document.documentElement;

    if (nightMode === 'dark') {
      root.classList.add('dark');
    } else if (nightMode === 'light') {
      root.classList.remove('dark');
    } else {
      // Auto mode - usa le preferenze del sistema
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const updateTheme = () => {
        if (mediaQuery.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      };

      updateTheme();
      mediaQuery.addEventListener('change', updateTheme);

      return () => mediaQuery.removeEventListener('change', updateTheme);
    }
  }, [nightMode]);
}
