import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PluginList, UploadPluginDialog } from '@/components/plugins';
import {
  usePlugins,
  useActivatePlugin,
  useDeactivatePlugin,
  useUninstallPlugin,
  usePluginUpdates,
} from '@/queries/plugin.query-options';
import { PluginStatus } from '@/types/plugin.types';
import { Search, Plus, RefreshCw, Package, Upload } from 'lucide-react';

export default function Plugins() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PluginStatus | 'all'>('all');
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // Queries
  const { data: pluginsData, isLoading } = usePlugins({
    status: statusFilter === 'all' ? undefined : statusFilter,
  });
  const { data: updatesData } = usePluginUpdates();

  // Mutations
  const activateMutation = useActivatePlugin();
  const deactivateMutation = useDeactivatePlugin();
  const uninstallMutation = useUninstallPlugin();

  const plugins = pluginsData?.plugins || [];
  const filteredPlugins = plugins.filter((plugin) =>
    plugin.displayName.toLowerCase().includes(search.toLowerCase()) ||
    plugin.description.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: plugins.length,
    active: plugins.filter((p) => p.status === PluginStatus.ACTIVE).length,
    inactive: plugins.filter((p) => p.status === PluginStatus.INACTIVE).length,
    updates: updatesData?.updates?.length || 0,
  };

  const handleActivate = (id: string) => {
    activateMutation.mutate(id);
  };

  const handleDeactivate = (id: string) => {
    deactivateMutation.mutate(id);
  };

  const handleUninstall = (id: string) => {
    if (confirm('Are you sure you want to uninstall this plugin? This action cannot be undone.')) {
      uninstallMutation.mutate(id);
    }
  };

  const handleViewDetails = (id: string) => {
    console.log('[Debug] Navigate to plugin details:', id);
    navigate({ to: `/plugins/${id}` });
  };

  const handleUpdate = (id: string) => {
    // TODO: Implement update dialog
    console.log('Update plugin:', id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Plugin Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage installed plugins and discover new ones
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => setShowUploadDialog(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Install from File
          </Button>
          <Button onClick={() => navigate({ to: '/plugins/marketplace' })}>
            <Plus className="h-4 w-4 mr-2" />
            Browse Marketplace
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Plugins</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.active}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Inactive</CardDescription>
            <CardTitle className="text-3xl text-gray-600">{stats.inactive}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Updates Available</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{stats.updates}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search plugins..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plugins List */}
      <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
        <TabsList>
          <TabsTrigger value="all">
            All ({stats.total})
          </TabsTrigger>
          <TabsTrigger value={PluginStatus.ACTIVE}>
            Active ({stats.active})
          </TabsTrigger>
          <TabsTrigger value={PluginStatus.INACTIVE}>
            Inactive ({stats.inactive})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter} className="mt-6">
          <PluginList
            plugins={filteredPlugins}
            isLoading={isLoading}
            onActivate={handleActivate}
            onDeactivate={handleDeactivate}
            onUninstall={handleUninstall}
            onUpdate={handleUpdate}
            onViewDetails={handleViewDetails}
            emptyMessage={
              search
                ? 'No plugins match your search'
                : 'No plugins installed. Browse the marketplace to get started.'
            }
          />
        </TabsContent>
      </Tabs>

      {/* Empty State */}
      {!isLoading && plugins.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Plugins Installed</h3>
            <p className="text-muted-foreground text-center mb-4 max-w-md">
              Get started by browsing the plugin marketplace and installing your first plugin.
            </p>
            <Button onClick={() => navigate({ to: '/plugins/marketplace' })}>
              <Plus className="h-4 w-4 mr-2" />
              Browse Marketplace
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Upload Dialog */}
      <UploadPluginDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
      />
    </div>
  );
}
