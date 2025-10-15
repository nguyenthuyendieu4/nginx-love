import api from './api';
import type {
  Plugin,
  PluginListResponse,
  PluginLogsResponse,
  PluginUpdateInfo,
  InstallPluginRequest,
  UpdatePluginRequest,
  MarketplacePlugin,
  MarketplaceListResponse,
  SubmitRatingRequest,
} from '@/types/plugin.types';

/**
 * Plugin Service
 * API calls for plugin management
 */
class PluginService {
  private baseUrl = '/plugins';
  private marketplaceUrl = '/marketplace';

  /**
   * Get all installed plugins
   */
  async getAll(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PluginListResponse> {
    const response = await api.get(this.baseUrl, { params });
    return response.data;
  }

  /**
   * Get plugin by ID
   */
  async getById(id: string): Promise<Plugin> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Activate plugin
   */
  async activate(id: string): Promise<{ message: string; plugin: Plugin }> {
    const response = await api.post(`${this.baseUrl}/${id}/activate`);
    return response.data;
  }

  /**
   * Deactivate plugin
   */
  async deactivate(id: string): Promise<{ message: string; plugin: Plugin }> {
    const response = await api.post(`${this.baseUrl}/${id}/deactivate`);
    return response.data;
  }

  /**
   * Uninstall plugin
   */
  async uninstall(id: string): Promise<{ message: string }> {
    const response = await api.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Get plugin logs
   */
  async getLogs(
    id: string,
    params?: { page?: number; limit?: number }
  ): Promise<PluginLogsResponse> {
    const response = await api.get(`${this.baseUrl}/${id}/logs`, { params });
    return response.data;
  }

  /**
   * Update plugin
   */
  async update(id: string, data: UpdatePluginRequest): Promise<{ message: string; plugin: Plugin }> {
    const response = await api.post(`${this.baseUrl}/${id}/update`, data);
    return response.data;
  }

  /**
   * Check for updates
   */
  async checkUpdates(): Promise<{ updates: PluginUpdateInfo[]; hasUpdates: boolean }> {
    const response = await api.get(`${this.baseUrl}/check-updates`);
    return response.data;
  }

  /**
   * Install plugin from local file
   */
  async installFromFile(file: File): Promise<{ message: string; plugin: Plugin }> {
    const formData = new FormData();
    formData.append('package', file);
    
    const response = await api.post(`${this.baseUrl}/install-file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Install plugin from package path (server-side)
   */
  async installFromPath(packagePath: string): Promise<{ message: string; plugin: Plugin }> {
    const response = await api.post(`${this.baseUrl}/install`, { packagePath });
    return response.data;
  }

  /**
   * Get marketplace plugins
   */
  async getMarketplacePlugins(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sort?: 'downloads' | 'rating' | 'updated' | 'name';
    order?: 'asc' | 'desc';
  }): Promise<MarketplaceListResponse> {
    const response = await api.get(this.marketplaceUrl, { params });
    return response.data;
  }

  /**
   * Get marketplace plugin details
   */
  async getMarketplacePluginById(id: string): Promise<MarketplacePlugin> {
    const response = await api.get(`${this.marketplaceUrl}/${id}`);
    return response.data;
  }

  /**
   * Install plugin from marketplace
   */
  async installFromMarketplace(
    id: string,
    data?: InstallPluginRequest
  ): Promise<{ message: string; plugin: Plugin }> {
    const response = await api.post(`${this.marketplaceUrl}/${id}/install`, data);
    return response.data;
  }

  /**
   * Get featured plugins
   */
  async getFeaturedPlugins(): Promise<{ plugins: MarketplacePlugin[] }> {
    const response = await api.get(`${this.marketplaceUrl}/featured`);
    return response.data;
  }

  /**
   * Get categories
   */
  async getCategories(): Promise<{ categories: string[] }> {
    const response = await api.get(`${this.marketplaceUrl}/categories`);
    return response.data;
  }

  /**
   * Search marketplace
   */
  async searchMarketplace(query: string): Promise<{ plugins: MarketplacePlugin[] }> {
    const response = await api.get(`${this.marketplaceUrl}/search`, {
      params: { q: query },
    });
    return response.data;
  }

  /**
   * Submit rating
   */
  async submitRating(id: string, data: SubmitRatingRequest): Promise<{ message: string }> {
    const response = await api.post(`${this.marketplaceUrl}/${id}/rating`, data);
    return response.data;
  }

  /**
   * Check marketplace health
   */
  async checkMarketplaceHealth(): Promise<{ status: string; timestamp: string }> {
    const response = await api.get(`${this.marketplaceUrl}/health`);
    return response.data;
  }
}

export const pluginService = new PluginService();
export default pluginService;
