import { PluginCard } from './PluginCard';
import type { Plugin } from '@/types/plugin.types';
import { Loader2 } from 'lucide-react';

interface PluginListProps {
  plugins: Plugin[];
  isLoading?: boolean;
  onActivate?: (id: string) => void;
  onDeactivate?: (id: string) => void;
  onUninstall?: (id: string) => void;
  onUpdate?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  emptyMessage?: string;
}

export function PluginList({
  plugins,
  isLoading = false,
  onActivate,
  onDeactivate,
  onUninstall,
  onUpdate,
  onViewDetails,
  emptyMessage = 'No plugins found',
}: PluginListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (plugins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {plugins.map((plugin) => (
        <PluginCard
          key={plugin.id}
          plugin={plugin}
          onActivate={onActivate}
          onDeactivate={onDeactivate}
          onUninstall={onUninstall}
          onUpdate={onUpdate}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}
