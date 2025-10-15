import { Request, Response } from 'express';
import { PluginService } from './plugin.service';
import { PluginEngine } from './plugin.engine';
import { pluginMarketplace } from './plugin.marketplace';
import logger from '../../utils/logger';
import { PluginStatus } from '@prisma/client';
import { AuthRequest } from '../../middleware/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const pluginEngine = new PluginEngine(prisma);
const pluginService = new PluginService(prisma, pluginEngine);

/**
 * Plugin Controller
 * Handle HTTP requests cho plugin management
 */
export class PluginController {
  /**
   * GET /api/plugins
   * Lấy danh sách plugins đã cài đặt
   */
  async listInstalledPlugins(req: AuthRequest, res: Response) {
    try {
      const { status, page = 1, limit = 20 } = req.query;

      const filters: any = {};
      if (status && Object.values(PluginStatus).includes(status as PluginStatus)) {
        filters.status = status as PluginStatus;
      }

      const plugins = await pluginService.getPlugins(filters);
      
      const result = {
        plugins,
        total: plugins.length,
        page: Number(page),
        limit: Number(limit),
      };

      res.json(result);
    } catch (error) {
      logger.error('Failed to list plugins', { error });
      res.status(500).json({ error: 'Failed to retrieve plugins' });
    }
  }

  /**
   * GET /api/plugins/:id
   * Lấy thông tin chi tiết plugin
   */
  async getPluginDetails(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const plugin = await pluginService.getPluginById(id);

      if (!plugin) {
        return res.status(404).json({ error: 'Plugin not found' });
      }

      res.json(plugin);
    } catch (error) {
      logger.error('Failed to get plugin details', { error, id: req.params.id });
      res.status(500).json({ error: 'Failed to retrieve plugin details' });
    }
  }

  /**
   * POST /api/plugins/:id/activate
   * Kích hoạt plugin
   */
  async activatePlugin(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const plugin = await pluginService.activatePlugin(id, userId);

      res.json({
        message: 'Plugin activated successfully',
        plugin,
      });
    } catch (error: any) {
      logger.error('Failed to activate plugin', { error, id: req.params.id });
      res.status(500).json({ error: error.message || 'Failed to activate plugin' });
    }
  }

  /**
   * POST /api/plugins/:id/deactivate
   * Vô hiệu hóa plugin
   */
  async deactivatePlugin(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const plugin = await pluginService.deactivatePlugin(id, userId);

      res.json({
        message: 'Plugin deactivated successfully',
        plugin,
      });
    } catch (error: any) {
      logger.error('Failed to deactivate plugin', { error, id: req.params.id });
      res.status(500).json({ error: error.message || 'Failed to deactivate plugin' });
    }
  }

  /**
   * DELETE /api/plugins/:id
   * Gỡ cài đặt plugin
   */
  async uninstallPlugin(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      await pluginService.uninstallPlugin(id, userId);

      res.json({
        message: 'Plugin uninstalled successfully',
      });
    } catch (error: any) {
      logger.error('Failed to uninstall plugin', { error, id: req.params.id });
      res.status(500).json({ error: error.message || 'Failed to uninstall plugin' });
    }
  }

  /**
   * GET /api/plugins/:id/logs
   * Lấy logs của plugin
   */
  async getPluginLogs(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { page = 1, limit = 50 } = req.query;

      // Fetch logs from database
      const logs = await prisma.pluginLog.findMany({
        where: { pluginId: id },
        orderBy: { createdAt: 'desc' },
        take: Number(limit),
        skip: (Number(page) - 1) * Number(limit),
      });

      const total = await prisma.pluginLog.count({
        where: { pluginId: id },
      });

      res.json({
        logs,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      });
    } catch (error) {
      logger.error('Failed to get plugin logs', { error, id: req.params.id });
      res.status(500).json({ error: 'Failed to retrieve plugin logs' });
    }
  }

  /**
   * POST /api/plugins/:id/update
   * Cập nhật plugin
   */
  async updatePlugin(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { version } = req.body;
      const userId = req.user?.userId;

      const plugin = await pluginService.updatePlugin(id, version, userId);

      res.json({
        message: 'Plugin updated successfully',
        plugin,
      });
    } catch (error: any) {
      logger.error('Failed to update plugin', { error, id: req.params.id });
      res.status(500).json({ error: error.message || 'Failed to update plugin' });
    }
  }

  /**
   * GET /api/plugins/check-updates
   * Kiểm tra updates cho tất cả plugins
   */
  async checkUpdates(req: AuthRequest, res: Response) {
    try {
      // Get all installed plugins and check for updates via marketplace
      const plugins = await pluginService.getPlugins({ status: PluginStatus.ACTIVE });
      const updates = await Promise.all(
        plugins.map(async (plugin: any) => {
          try {
            if (plugin.marketplaceId) {
              const marketplacePlugin = await pluginMarketplace.getPluginDetails(plugin.marketplaceId);
              if (marketplacePlugin && marketplacePlugin.version !== plugin.version) {
                return {
                  pluginId: plugin.id,
                  currentVersion: plugin.version,
                  latestVersion: marketplacePlugin.version,
                  hasUpdate: true,
                };
              }
            }
          } catch (e) {
            // Plugin not in marketplace
          }
          return null;
        })
      );

      const availableUpdates = updates.filter((u: any) => u !== null);

      res.json({
        updates: availableUpdates,
        hasUpdates: availableUpdates.length > 0,
      });
    } catch (error) {
      logger.error('Failed to check updates', { error });
      res.status(500).json({ error: 'Failed to check for updates' });
    }
  }

  /**
   * GET /api/marketplace
   * Lấy danh sách plugins từ marketplace
   */
  async listMarketplacePlugins(req: AuthRequest, res: Response) {
    try {
      const {
        page = 1,
        limit = 20,
        category,
        search,
        sort = 'downloads',
        order = 'desc',
      } = req.query;

      const result = await pluginMarketplace.listPlugins({
        page: Number(page),
        limit: Number(limit),
        category: category as string,
        search: search as string,
        sort: sort as any,
        order: order as any,
      });

      res.json(result);
    } catch (error) {
      logger.error('Failed to list marketplace plugins', { error });
      res.status(500).json({ error: 'Failed to retrieve marketplace plugins' });
    }
  }

  /**
   * GET /api/marketplace/:id
   * Lấy thông tin plugin từ marketplace
   */
  async getMarketplacePluginDetails(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const plugin = await pluginMarketplace.getPluginDetails(id);

      res.json(plugin);
    } catch (error) {
      logger.error('Failed to get marketplace plugin details', { error, id: req.params.id });
      res.status(404).json({ error: 'Plugin not found in marketplace' });
    }
  }

  /**
   * POST /api/plugins/install
   * Cài đặt plugin từ package path (server-side file)
   */
  async installFromPath(req: AuthRequest, res: Response) {
    try {
      const { packagePath } = req.body;
      const userId = req.user?.userId;

      if (!packagePath) {
        return res.status(400).json({ error: 'Package path is required' });
      }

      // Install plugin from local path
      const plugin = await pluginService.installPlugin({
        localPath: packagePath,
        activate: false,
        verify: true,
      }, userId);

      res.status(201).json({
        message: 'Plugin installed successfully',
        plugin,
      });
    } catch (error: any) {
      logger.error('Failed to install plugin from path', {
        error,
        packagePath: req.body.packagePath,
      });
      res.status(500).json({ error: error.message || 'Failed to install plugin' });
    }
  }

  /**
   * POST /api/plugins/install-file
   * Cài đặt plugin từ file upload
   */
  async installFromFile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const file = (req as any).file; // Multer adds file to request

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Install plugin from uploaded file
      const plugin = await pluginService.installPlugin({
        localPath: file.path,
        activate: false,
        verify: true,
      }, userId);

      res.status(201).json({
        message: 'Plugin installed successfully',
        plugin,
      });
    } catch (error: any) {
      logger.error('Failed to install plugin from file', {
        error,
        file: (req as any).file?.filename,
      });
      res.status(500).json({ error: error.message || 'Failed to install plugin' });
    }
  }

  /**
   * POST /api/marketplace/:id/install
   * Cài đặt plugin từ marketplace
   */
  async installFromMarketplace(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { version } = req.body;
      const userId = req.user?.userId;

      // Get plugin info from marketplace
      const marketplacePlugin = await pluginMarketplace.getPluginDetails(id);
      
      // Install plugin
      const plugin = await pluginService.installPlugin({
        marketplaceId: id,
        downloadUrl: marketplacePlugin.downloadUrl,
        activate: true,
        verify: true,
      }, userId);

      // Report installation to marketplace
      await pluginMarketplace.reportInstallation(id, version);

      res.status(201).json({
        message: 'Plugin installed successfully',
        plugin,
      });
    } catch (error: any) {
      logger.error('Failed to install plugin from marketplace', {
        error,
        id: req.params.id,
      });
      res.status(500).json({ error: error.message || 'Failed to install plugin' });
    }
  }

  /**
   * GET /api/marketplace/featured
   * Lấy featured plugins
   */
  async getFeaturedPlugins(req: AuthRequest, res: Response) {
    try {
      const plugins = await pluginMarketplace.getFeaturedPlugins();
      res.json({ plugins });
    } catch (error) {
      logger.error('Failed to get featured plugins', { error });
      res.status(500).json({ error: 'Failed to retrieve featured plugins' });
    }
  }

  /**
   * GET /api/marketplace/categories
   * Lấy danh sách categories
   */
  async getCategories(req: AuthRequest, res: Response) {
    try {
      const categories = await pluginMarketplace.getCategories();
      res.json({ categories });
    } catch (error) {
      logger.error('Failed to get categories', { error });
      res.status(500).json({ error: 'Failed to retrieve categories' });
    }
  }

  /**
   * GET /api/marketplace/search
   * Tìm kiếm plugins
   */
  async searchMarketplace(req: AuthRequest, res: Response) {
    try {
      const { q } = req.query;

      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: 'Search query is required' });
      }

      const plugins = await pluginMarketplace.searchPlugins(q);
      res.json({ plugins });
    } catch (error) {
      logger.error('Failed to search marketplace', { error, query: req.query.q });
      res.status(500).json({ error: 'Search failed' });
    }
  }

  /**
   * POST /api/marketplace/:id/rating
   * Submit rating cho plugin
   */
  async submitRating(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { rating, review } = req.body;

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }

      await pluginMarketplace.submitRating(id, rating, review);

      res.json({
        message: 'Rating submitted successfully',
      });
    } catch (error) {
      logger.error('Failed to submit rating', { error, id: req.params.id });
      res.status(500).json({ error: 'Failed to submit rating' });
    }
  }

  /**
   * GET /api/marketplace/health
   * Check marketplace connectivity
   */
  async checkMarketplaceHealth(req: AuthRequest, res: Response) {
    try {
      const isHealthy = await pluginMarketplace.healthCheck();

      res.json({
        status: isHealthy ? 'online' : 'offline',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(503).json({
        status: 'offline',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /api/plugins/:pluginName/static/*
   * Serve static files from plugin's public folder
   */
  async serveStaticFile(req: Request, res: Response) {
    try {
      const { pluginName } = req.params;
      const filePath = req.params[0]; // Everything after /static/

      const publicPath = pluginEngine.getPluginStaticPath(pluginName);

      if (!publicPath) {
        return res.status(404).json({ error: 'Plugin not found or has no public folder' });
      }

      // Construct full file path
      const fs = require('fs-extra');
      const path = require('path');
      const fullPath = path.join(publicPath, filePath);

      // Security check: ensure file is within plugin's public folder
      if (!fullPath.startsWith(publicPath)) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Check if file exists
      if (!(await fs.pathExists(fullPath))) {
        return res.status(404).json({ error: 'File not found' });
      }

      // Serve file
      res.sendFile(fullPath);
    } catch (error) {
      logger.error('Failed to serve plugin static file', { error });
      res.status(500).json({ error: 'Failed to serve file' });
    }
  }
}

export const pluginController = new PluginController();
