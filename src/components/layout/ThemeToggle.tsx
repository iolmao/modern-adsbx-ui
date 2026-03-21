import { Sun, Moon } from 'lucide-react';
import { useConfigStore } from '@/store/configStore';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { nightMode, updateConfig } = useConfigStore();

  const toggleTheme = () => {
    // Toggle between light and dark (skip auto)
    const newMode = nightMode === 'dark' ? 'light' : 'dark';
    updateConfig({ nightMode: newMode });
  };

  const isDark = nightMode === 'dark' || (nightMode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}
