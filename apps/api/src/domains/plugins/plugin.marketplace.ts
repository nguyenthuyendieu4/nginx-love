import axios from 'axios';
import { PluginManifest, MarketplacePlugin } from './plugin.types';
import logger from '../../utils/logger';

/**
 * Plugin Marketplace Client
 * Tích hợp với central repository để fetch, search plugins
 */
export class PluginMarketplace {
  private baseUrl: string;
  private apiKey?: string;

  constructor() {
    this.baseUrl = process.env.PLUGIN_MARKETPLACE_URL || 'https://marketplace.nginx-love.com/api';
    this.apiKey = process.env.PLUGIN_MARKETPLACE_API_KEY;
  }

  /**
   * Lấy danh sách plugins từ marketplace
   */
  async listPlugins(options?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sort?: 'downloads' | 'rating' | 'updated' | 'name';
    order?: 'asc' | 'desc';
  }): Promise<{
    plugins: MarketplacePlugin[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      // TODO: Replace with real marketplace API
      // For now, return mock data when marketplace is not available
      logger.warn('Marketplace not available, returning mock data');
      
      return {
        plugins: [],
        total: 0,
        page: options?.page || 1,
        totalPages: 0,
      };
    } catch (error) {
      logger.error('Failed to fetch marketplace plugins', { error });
      throw new Error('Unable to connect to marketplace');
    }
  }

  /**
   * Lấy thông tin chi tiết của một plugin
   */
  async getPluginDetails(marketplaceId: string): Promise<MarketplacePlugin> {
    try {
      // TODO: Replace with real marketplace API
      logger.warn('Marketplace not available, plugin details not found');
      throw new Error('Plugin not found in marketplace');
    } catch (error) {
      logger.error('Failed to fetch plugin details', { marketplaceId, error });
      throw new Error('Plugin not found in marketplace');
    }
  }

  /**
   * Download plugin package từ marketplace
   */
  async downloadPlugin(marketplaceId: string, version: string): Promise<Buffer> {
    try {
      logger.info('Downloading plugin from marketplace', { marketplaceId, version });

      const response = await axios.get(
        `${this.baseUrl}/plugins/${marketplaceId}/download/${version}`,
        {
          headers: this.getHeaders(),
          responseType: 'arraybuffer',
          timeout: 60000, // 60 seconds for download
        }
      );

      return Buffer.from(response.data);
    } catch (error) {
      logger.error('Failed to download plugin', { marketplaceId, version, error });
      throw new Error('Failed to download plugin package');
    }
  }

  /**
   * Verify plugin signature từ marketplace
   */
  async verifySignature(
    marketplaceId: string,
    version: string
  ): Promise<{
    signature: string;
    checksum: string;
    algorithm: string;
  }> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/plugins/${marketplaceId}/signature/${version}`,
        {
          headers: this.getHeaders(),
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Failed to verify plugin signature', { marketplaceId, version, error });
      throw new Error('Failed to verify plugin signature');
    }
  }

  /**
   * Check for plugin updates
   */
  async checkUpdate(
    marketplaceId: string,
    currentVersion: string
  ): Promise<{
    hasUpdate: boolean;
    latestVersion?: string;
    changelog?: string;
    releaseDate?: string;
  }> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/plugins/${marketplaceId}/check-update`,
        {
          headers: this.getHeaders(),
          params: { currentVersion },
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Failed to check plugin update', { marketplaceId, currentVersion, error });
      return { hasUpdate: false };
    }
  }

  /**
   * Report plugin installation
   */
  async reportInstallation(marketplaceId: string, version: string): Promise<void> {
    try {
      await axios.post(
        `${this.baseUrl}/plugins/${marketplaceId}/install`,
        { version },
        {
          headers: this.getHeaders(),
          timeout: 5000,
        }
      );
    } catch (error) {
      // Non-critical, just log
      logger.warn('Failed to report plugin installation', { marketplaceId, version });
    }
  }

  /**
   * Submit plugin rating
   */
  async submitRating(
    marketplaceId: string,
    rating: number,
    review?: string
  ): Promise<void> {
    try {
      await axios.post(
        `${this.baseUrl}/plugins/${marketplaceId}/rating`,
        { rating, review },
        {
          headers: this.getHeaders(),
          timeout: 5000,
        }
      );
    } catch (error) {
      logger.error('Failed to submit plugin rating', { marketplaceId, rating, error });
      throw new Error('Failed to submit rating');
    }
  }

  /**
   * Search plugins by keyword
   */
  async searchPlugins(query: string): Promise<MarketplacePlugin[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/plugins/search`, {
        headers: this.getHeaders(),
        params: { q: query },
        timeout: 10000,
      });

      return response.data.plugins;
    } catch (error) {
      logger.error('Failed to search plugins', { query, error });
      throw new Error('Search failed');
    }
  }

  /**
   * Get plugin categories
   */
  async getCategories(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/categories`, {
        headers: this.getHeaders(),
        timeout: 10000,
      });

      return response.data.categories;
    } catch (error) {
      logger.error('Failed to fetch categories', { error });
      return [];
    }
  }

  /**
   * Get featured/recommended plugins
   */
  async getFeaturedPlugins(): Promise<MarketplacePlugin[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/plugins/featured`, {
        headers: this.getHeaders(),
        timeout: 10000,
      });

      return response.data.plugins;
    } catch (error) {
      logger.error('Failed to fetch featured plugins', { error });
      return [];
    }
  }

  /**
   * Check marketplace connectivity
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/health`, {
        timeout: 5000,
      });

      return response.status === 200;
    } catch (error) {
      logger.warn('Marketplace health check failed', { error });
      return false;
    }
  }

  /**
   * Get request headers
   */
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': `nginx-love-api/${process.env.APP_VERSION || '1.0.0'}`,
    };

    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }

    return headers;
  }
}

// Singleton instance
export const pluginMarketplace = new PluginMarketplace();
