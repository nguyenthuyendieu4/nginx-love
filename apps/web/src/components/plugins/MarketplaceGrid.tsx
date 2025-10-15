import { MarketplaceCard } from './MarketplaceCard';
import type { MarketplacePlugin } from '@/types/plugin.types';
import { Loader2 } from 'lucide-react';

interface MarketplaceGridProps {
  plugins: MarketplacePlugin[];
  installedPluginIds?: string[];
  isLoading?: boolean;
  onInstall?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  emptyMessage?: string;
}

export function MarketplaceGrid({
  plugins,
  installedPluginIds = [],
  isLoading = false,
  onInstall,
  onViewDetails,
  emptyMessage = 'No plugins available',
}: MarketplaceGridProps) {
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
        <MarketplaceCard
          key={plugin.id}
          plugin={plugin}
          isInstalled={installedPluginIds.includes(plugin.id)}
          onInstall={onInstall}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}
