import { createFileRoute, useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { pluginQueryOptions } from '@/queries/plugin.query-options';
import { PluginStatus } from '@/types/plugin.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PluginStatusBadge } from '@/components/plugins/PluginStatusBadge';
import { 
  useActivatePlugin, 
  useDeactivatePlugin, 
  useUninstallPlugin,
  useUpdatePlugin 
} from '@/queries/plugin.query-options';
import { toast } from 'sonner';
import { 
  Settings, 
  FileText, 
  Shield, 
  User, 
  Calendar, 
  Package,
  Trash2,
  Power,
  PowerOff,
  RefreshCw,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

function RouteComponent() {
  const { pluginId } = useParams({ from: '/_auth/plugins/$pluginId' });
  
  const { data: plugin, isLoading } = useQuery(
    pluginQueryOptions.byId(pluginId)
  );

  const activateMutation = useActivatePlugin();
  const deactivateMutation = useDeactivatePlugin();
  const uninstallMutation = useUninstallPlugin();
  const updateMutation = useUpdatePlugin();

  const handleActivate = () => {
    activateMutation.mutate(pluginId, {
      onSuccess: () => {
        toast.success('Plugin activated successfully');
      },
    });
  };

  const handleDeactivate = () => {
    deactivateMutation.mutate(pluginId, {
      onSuccess: () => {
        toast.success('Plugin deactivated successfully');
      },
    });
  };

  const handleUninstall = () => {
    uninstallMutation.mutate(pluginId, {
      onSuccess: () => {
        toast.success('Plugin uninstalled successfully');
        window.history.back();
      },
    });
  };

  const handleUpdate = () => {
    updateMutation.mutate({ 
      id: pluginId, 
      data: { version: 'latest' } 
    }, {
      onSuccess: () => {
        toast.success('Plugin updated successfully');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-gray-200 rounded"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!plugin) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Plugin Not Found</h3>
            <p className="text-gray-500">The requested plugin could not be found.</p>
            <Button 
              onClick={() => window.history.back()} 
              className="mt-4"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{plugin.name}</h1>
            <PluginStatusBadge status={plugin.status} />
          </div>
          <p className="text-gray-500">{plugin.manifest.description || plugin.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {typeof plugin.manifest.author === 'string' ? plugin.manifest.author : plugin.manifest.author?.name || plugin.author}
            </div>
            <div className="flex items-center gap-1">
              <Package className="h-4 w-4" />
              v{plugin.version}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Installed {new Date(plugin.installedAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {plugin.hasUpdate && (
            <Button
              onClick={handleUpdate}
              disabled={updateMutation.isPending}
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Update Available
            </Button>
          )}
          
          {plugin.status === PluginStatus.INACTIVE ? (
            <Button
              onClick={handleActivate}
              disabled={activateMutation.isPending}
            >
              <Power className="h-4 w-4 mr-2" />
              Activate
            </Button>
          ) : (
            <Button
              onClick={handleDeactivate}
              disabled={deactivateMutation.isPending}
              variant="outline"
            >
              <PowerOff className="h-4 w-4 mr-2" />
              Deactivate
            </Button>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Uninstall
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Uninstall Plugin</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to uninstall <strong>{plugin.name}</strong>?
                  This action cannot be undone and all plugin data will be removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleUninstall}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Uninstall
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ui">Plugin UI</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Plugin Info */}
            <Card>
              <CardHeader>
                <CardTitle>Plugin Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-sm">{plugin.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Version</label>
                  <p className="text-sm">{plugin.version}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Author</label>
                  <p className="text-sm">{typeof plugin.manifest.author === 'string' ? plugin.manifest.author : plugin.manifest.author?.name || plugin.author}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-sm">{plugin.manifest.description || plugin.description}</p>
                </div>
                {(plugin.manifest.homepage || plugin.homepage) && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Homepage</label>
                    <a 
                      href={plugin.manifest.homepage || plugin.homepage} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline flex items-center gap-1"
                    >
                      Visit Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Installation Info */}
            <Card>
              <CardHeader>
                <CardTitle>Installation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <PluginStatusBadge status={plugin.status} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Installed At</label>
                  <p className="text-sm">
                    {new Date(plugin.installedAt).toLocaleString()}
                  </p>
                </div>
                {plugin.updatedAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Updated</label>
                    <p className="text-sm">
                      {new Date(plugin.updatedAt).toLocaleString()}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Plugin ID</label>
                  <p className="text-sm font-mono text-xs">{plugin.id}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Routes */}
          {plugin.routes && plugin.routes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Routes
                </CardTitle>
                <CardDescription>
                  API endpoints registered by this plugin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {plugin.routes.map((route, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <Badge variant="outline">{route.method}</Badge>
                      <code className="text-sm font-mono">{route.path}</code>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Menu Items */}
          {plugin.menuItems && plugin.menuItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Menu Items</CardTitle>
                <CardDescription>
                  Navigation items added by this plugin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {plugin.menuItems.map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.path}</p>
                      </div>
                      <Badge>{item.position}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Plugin UI Tab */}
        <TabsContent value="ui" className="space-y-4">
          <Card className="min-h-[600px]">
            <CardHeader>
              <CardTitle>Plugin User Interface</CardTitle>
              <CardDescription>
                The plugin's custom interface is displayed below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden bg-white">
                <iframe
                  src={`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/plugins/${plugin.name}/static/index.html`}
                  className="w-full h-[600px] border-0"
                  title={`${plugin.name} UI`}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Plugin Permissions
              </CardTitle>
              <CardDescription>
                Permissions required by this plugin to function properly
              </CardDescription>
            </CardHeader>
            <CardContent>
              {plugin.manifest.permissions && plugin.manifest.permissions.length > 0 ? (
                <div className="space-y-3">
                  {plugin.manifest.permissions.map((permission, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3 p-4 border rounded-lg"
                    >
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <p className="font-medium">{permission}</p>
                        <p className="text-sm text-gray-500">
                          {getPermissionDescription(permission)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No special permissions required
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Plugin Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-8">
                Plugin settings configuration will be available in a future update
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Activity Logs
              </CardTitle>
              <CardDescription>
                Recent activity and events for this plugin
              </CardDescription>
            </CardHeader>
            <CardContent>
              {plugin.logs && plugin.logs.length > 0 ? (
                <div className="space-y-2">
                  {plugin.logs.map((log) => (
                    <div 
                      key={log.id}
                      className="flex items-start gap-3 p-3 border rounded-lg"
                    >
                      <Badge 
                        variant={
                          log.level === 'error' ? 'destructive' : 
                          log.level === 'warning' ? 'outline' : 
                          'default'
                        }
                      >
                        {log.level}
                      </Badge>
                      <div className="flex-1">
                        <p className="text-sm">{log.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(log.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No activity logs available
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function getPermissionDescription(permission: string): string {
  const descriptions: Record<string, string> = {
    'database:read': 'Read data from the database',
    'database:write': 'Write data to the database',
    'file:read': 'Read files from the system',
    'file:write': 'Write files to the system',
    'network:request': 'Make HTTP requests to external services',
    'config:read': 'Read application configuration',
    'config:write': 'Modify application configuration',
  };
  return descriptions[permission] || 'Special permission required';
}

export const Route = createFileRoute('/_auth/plugins/$pluginId')({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const { queryClient } = context;
    const { pluginId } = params;
    
    await queryClient.prefetchQuery(pluginQueryOptions.byId(pluginId));
    
    return {};
  },
});
