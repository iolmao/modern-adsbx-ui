import { useUIStore } from '@/store/uiStore';
import { Button } from '@/components/ui/button';

export function ModeToggle() {
  const { viewMode, setViewMode } = useUIStore();

  return (
    <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
      <Button
        variant={viewMode === 'standard' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setViewMode('standard')}
        className="h-8"
      >
        Standard
      </Button>
      <Button
        variant={viewMode === 'realistic' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setViewMode('realistic')}
        className="h-8"
      >
        Realistic
      </Button>
    </div>
  );
}
