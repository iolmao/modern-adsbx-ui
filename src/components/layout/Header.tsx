import { Settings, Table2 } from 'lucide-react';
import { useAircraftStore } from '@/store/aircraftStore';
import { useUIStore } from '@/store/uiStore';
import { Button } from '@/components/ui/button';
import { ModeToggle } from './ModeToggle';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const { aircraft } = useAircraftStore();
  const { setSettingsPanelOpen, setAircraftListOpen, visibleCount } = useUIStore();

  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 py-3 flex items-center justify-between text-foreground">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-foreground">ADS-B Tracker</h1>
        <button
          onClick={() => setAircraftListOpen(true)}
          className="hidden md:block text-sm text-muted-foreground font-mono underline decoration-dotted hover:text-foreground transition-colors cursor-pointer"
        >
          {visibleCount} / {aircraft.length} aircraft
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex">
          <ModeToggle />
        </div>
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setAircraftListOpen(true)}
          aria-label="Aircraft list"
          className="md:hidden"
        >
          <Table2 className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSettingsPanelOpen(true)}
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
