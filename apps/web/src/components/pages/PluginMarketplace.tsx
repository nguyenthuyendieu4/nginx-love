import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MarketplaceGrid, InstallDialog } from '@/components/plugins';
import {
  useMarketplacePlugins,
  useFeaturedPlugins,
  usePluginCategories,
  usePlugins,
} from '@/queries/plugin.query-options';
import { MarketplacePlugin } from '@/types/plugin.types';
import { Search, TrendingUp, Filter } from 'lucide-react';

export default function PluginMarketplace() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'downloads' | 'rating' | 'updated'>('downloads');
  const [selectedPlugin, setSelectedPlugin] = useState<MarketplacePlugin | null>(null);
  const [showInstallDialog, setShowInstallDialog] = useState(false);

  // Queries
  const { data: marketplaceData, isLoading } = useMarketplacePlugins({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    search: search || undefined,
    sort: sortBy,
    order: 'desc',
  });

  const { data: featuredData } = useFeaturedPlugins();
  const { data: categoriesData } = usePluginCategories();
  const { data: installedData } = usePlugins();

  const plugins = marketplaceData?.plugins || [];
  const featuredPlugins = featuredData?.plugins || [];
  const categories = categoriesData?.categories || [];
  const installedPluginIds = installedData?.plugins.map((p) => p.marketplaceId).filter(Boolean) || [];

  const handleInstall = (id: string) => {
    const plugin = plugins.find((p) => p.id === id);
    if (plugin) {
      setSelectedPlugin(plugin);
      setShowInstallDialog(true);
    }
  };

  const handleViewDetails = (id: string) => {
    navigate({ to: `/plugins/marketplace/${id}` });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Plugin Marketplace</h1>
          <p className="text-muted-foreground mt-1">
            Discover and install plugins to extend your system
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate({ to: '/plugins' })}>
          View Installed
        </Button>
      </div>

      {/* Featured Plugins */}
      {featuredPlugins.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Featured Plugins</h2>
          </div>
          <MarketplaceGrid
            plugins={featuredPlugins.slice(0, 3)}
            installedPluginIds={installedPluginIds}
            onInstall={handleInstall}
            onViewDetails={handleViewDetails}
          />
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Search */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search marketplace..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border rounded-md"
            >
              <option value="downloads">Most Downloads</option>
              <option value="rating">Highest Rated</option>
              <option value="updated">Recently Updated</option>
            </select>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Categories</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory('all')}
                >
                  All
                </Badge>
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Plugins */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Plugins</h2>
        <MarketplaceGrid
          plugins={plugins}
          installedPluginIds={installedPluginIds}
          isLoading={isLoading}
          onInstall={handleInstall}
          onViewDetails={handleViewDetails}
          emptyMessage={
            search
              ? 'No plugins found matching your search'
              : 'No plugins available in this category'
          }
        />
      </div>

      {/* Install Dialog */}
      <InstallDialog
        plugin={selectedPlugin}
        open={showInstallDialog}
        onOpenChange={setShowInstallDialog}
      />
    </div>
  );
}
