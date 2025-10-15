import { useQuery, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import pluginService from '@/services/plugin.service';
import type {
  Plugin,
  PluginUpdateInfo,
  InstallPluginRequest,
  UpdatePluginRequest,
  MarketplacePlugin,
  SubmitRatingRequest,
} from '@/types/plugin.types';
import { createQueryKeys } from '@/lib/query-client';
import { toast } from 'sonner';

// Create query keys for plugin operations
export const pluginQueryKeys = createQueryKeys('plugins');
export const marketplaceQueryKeys = createQueryKeys('marketplace');

/**
 * Plugin Query Options
 */
export const pluginQueryOptions = {
  // Get all installed plugins
  all: (params?: { status?: string; page?: number; limit?: number }) => ({
    queryKey: pluginQueryKeys.list(params || {}),
    queryFn: () => pluginService.getAll(params),
  }),

  // Get plugin by ID
  byId: (id: string) => ({
    queryKey: pluginQueryKeys.detail(id),
    queryFn: () => pluginService.getById(id),
    enabled: !!id,
  }),

  // Get plugin logs
  logs: (id: string, params?: { page?: number; limit?: number }) => ({
    queryKey: [...pluginQueryKeys.detail(id), 'logs', params || {}],
    queryFn: () => pluginService.getLogs(id, params),
    enabled: !!id,
  }),

  // Check for updates
  updates: {
    queryKey: [...pluginQueryKeys.all, 'updates'],
    queryFn: pluginService.checkUpdates,
  },
};

/**
 * Marketplace Query Options
 */
export const marketplaceQueryOptions = {
  // Get marketplace plugins
  all: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sort?: 'downloads' | 'rating' | 'updated' | 'name';
    order?: 'asc' | 'desc';
  }) => ({
    queryKey: marketplaceQueryKeys.list(params || {}),
    queryFn: () => pluginService.getMarketplacePlugins(params),
  }),

  // Get marketplace plugin by ID
  byId: (id: string) => ({
    queryKey: marketplaceQueryKeys.detail(id),
    queryFn: () => pluginService.getMarketplacePluginById(id),
    enabled: !!id,
  }),

  // Get featured plugins
  featured: {
    queryKey: [...marketplaceQueryKeys.all, 'featured'],
    queryFn: pluginService.getFeaturedPlugins,
  },

  // Get categories
  categories: {
    queryKey: [...marketplaceQueryKeys.all, 'categories'],
    queryFn: pluginService.getCategories,
  },

  // Search marketplace
  search: (query: string) => ({
    queryKey: [...marketplaceQueryKeys.all, 'search', query],
    queryFn: () => pluginService.searchMarketplace(query),
    enabled: query.length > 0,
  }),

  // Check marketplace health
  health: {
    queryKey: [...marketplaceQueryKeys.all, 'health'],
    queryFn: pluginService.checkMarketplaceHealth,
  },
};

/**
 * Custom Hooks
 */

// Hook to get all plugins
export const usePlugins = (params?: { status?: string; page?: number; limit?: number }) => {
  return useQuery(pluginQueryOptions.all(params));
};

// Hook to get plugin by ID
export const usePlugin = (id: string) => {
  return useQuery(pluginQueryOptions.byId(id));
};

// Hook to get plugin logs
export const usePluginLogs = (id: string, params?: { page?: number; limit?: number }) => {
  return useQuery(pluginQueryOptions.logs(id, params));
};

// Hook to check updates
export const usePluginUpdates = () => {
  return useQuery(pluginQueryOptions.updates);
};

// Hook to get marketplace plugins
export const useMarketplacePlugins = (params?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: 'downloads' | 'rating' | 'updated' | 'name';
  order?: 'asc' | 'desc';
}) => {
  return useQuery(marketplaceQueryOptions.all(params));
};

// Hook to get marketplace plugin
export const useMarketplacePlugin = (id: string) => {
  return useQuery(marketplaceQueryOptions.byId(id));
};

// Hook to get featured plugins
export const useFeaturedPlugins = () => {
  return useQuery(marketplaceQueryOptions.featured);
};

// Hook to get categories
export const usePluginCategories = () => {
  return useQuery(marketplaceQueryOptions.categories);
};

// Hook to search marketplace
export const useSearchMarketplace = (query: string) => {
  return useQuery(marketplaceQueryOptions.search(query));
};

/**
 * Mutation Hooks
 */

// Hook to activate plugin
export const useActivatePlugin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => pluginService.activate(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: pluginQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: pluginQueryKeys.detail(data.plugin.id) });
      toast.success(data.message || 'Plugin activated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to activate plugin');
    },
  });
};

// Hook to deactivate plugin
export const useDeactivatePlugin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => pluginService.deactivate(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: pluginQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: pluginQueryKeys.detail(data.plugin.id) });
      toast.success(data.message || 'Plugin deactivated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to deactivate plugin');
    },
  });
};

// Hook to uninstall plugin
export const useUninstallPlugin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => pluginService.uninstall(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: pluginQueryKeys.all });
      toast.success(data.message || 'Plugin uninstalled successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to uninstall plugin');
    },
  });
};

// Hook to update plugin
export const useUpdatePlugin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePluginRequest }) =>
      pluginService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: pluginQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: pluginQueryKeys.detail(data.plugin.id) });
      toast.success(data.message || 'Plugin updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update plugin');
    },
  });
};

// Hook to install plugin from marketplace
export const useInstallPlugin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: InstallPluginRequest }) =>
      pluginService.installFromMarketplace(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: pluginQueryKeys.all });
      toast.success(data.message || 'Plugin installed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to install plugin');
    },
  });
};

// Hook to submit rating
export const useSubmitRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SubmitRatingRequest }) =>
      pluginService.submitRating(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: marketplaceQueryKeys.detail(variables.id) });
      toast.success(data.message || 'Rating submitted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to submit rating');
    },
  });
};

// Hook to install plugin from file
export const useInstallPluginFromFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => pluginService.installFromFile(file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: pluginQueryKeys.all });
      toast.success(data.message || 'Plugin installed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to install plugin');
    },
  });
};

// Hook to install plugin from path
export const useInstallPluginFromPath = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (packagePath: string) => pluginService.installFromPath(packagePath),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: pluginQueryKeys.all });
      toast.success(data.message || 'Plugin installed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to install plugin');
    },
  });
};
