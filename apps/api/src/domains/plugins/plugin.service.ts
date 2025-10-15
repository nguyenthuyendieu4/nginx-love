import { PrismaClient, Plugin, PluginStatus, PluginAction, LogStatus } from '@prisma/client';
import fs from 'fs-extra';
import path from 'path';
import AdmZip from 'adm-zip';
import axios from 'axios';
import {
  PluginManifest,
  PluginInstallOptions,
  PluginFilterOptions,
  PluginSortOptions,
  PluginStats,
  PluginUpdateInfo,
  PluginConflictInfo,
  PluginHealthCheck,
} from './plugin.types';
import { PluginEngine } from './plugin.engine';
import { PluginValidator } from './plugin.validator';
import logger from '../../utils/logger';

export class PluginService {
  private prisma: PrismaClient;
  private engine: PluginEngine;
  private validator: PluginValidator;
  private pluginDataPath: string;

  constructor(prisma: PrismaClient, engine: PluginEngine) {
    this.prisma = prisma;
    this.engine = engine;
    this.validator = new PluginValidator();
    this.pluginDataPath = process.env.PLUGIN_DATA_PATH || '/data/plugins';
  }

  /**
   * Get all plugins with filters
   */
  async getPlugins(filter?: PluginFilterOptions, sort?: PluginSortOptions) {
    const where: any = {};

    if (filter?.status) {
      where.status = filter.status;
    }

    if (filter?.category) {
      where.category = filter.category;
    }

    if (filter?.tags && filter.tags.length > 0) {
      where.tags = {
        hasSome: filter.tags,
      };
    }

    if (filter?.author) {
      where.author = {
        contains: filter.author,
        mode: 'insensitive',
      };
    }

    if (filter?.verified !== undefined) {
      where.verified = filter.verified;
    }

    if (filter?.search) {
      where.OR = [
        { displayName: { contains: filter.search, mode: 'insensitive' } },
        { description: { contains: filter.search, mode: 'insensitive' } },
        { name: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    if (sort) {
      orderBy[sort.field] = sort.order;
    } else {
      orderBy.installedAt = 'desc';
    }

    const plugins = await this.prisma.plugin.findMany({
      where,
      orderBy,
      include: {
        routes: true,
        menuItems: true,
        logs: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return plugins;
  }

  /**
   * Get plugin by ID
   */
  async getPluginById(id: string) {
    const plugin = await this.prisma.plugin.findUnique({
      where: { id },
      include: {
        routes: true,
        menuItems: true,
        logs: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!plugin) {
      throw new Error('Plugin not found');
    }

    // Transform JSON fields to match frontend types
    return {
      ...plugin,
      dependencies: Array.isArray(plugin.dependencies) ? plugin.dependencies : [],
      permissions: Array.isArray(plugin.permissions) ? plugin.permissions : [],
      manifest: typeof plugin.manifestPath === 'string' 
        ? await this.loadManifest(plugin.name)
        : plugin.manifestPath,
    };
  }

  /**
   * Load manifest from file
   */
  private async loadManifest(pluginName: string): Promise<any> {
    try {
      const manifestPath = path.join(this.pluginDataPath, 'installed', pluginName, 'manifest.json');
      const content = await fs.readFile(manifestPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      logger.error('Failed to load manifest', { pluginName, error });
      return {};
    }
  }

  /**
   * Get plugin by name
   */
  async getPluginByName(name: string) {
    const plugin = await this.prisma.plugin.findUnique({
      where: { name },
      include: {
        routes: true,
        menuItems: true,
      },
    });

    if (!plugin) {
      throw new Error('Plugin not found');
    }

    return plugin;
  }

  /**
   * Install plugin
   */
  async installPlugin(options: PluginInstallOptions, userId?: string) {
    let pluginPath: string;
    let manifest: PluginManifest;

    try {
      // Log installation start
      await this.logAction({
        action: 'INSTALL',
        status: 'INFO',
        message: 'Starting plugin installation',
        userId,
      });

      // Download or extract plugin
      if (options.downloadUrl) {
        pluginPath = await this.downloadPlugin(options.downloadUrl);
      } else if (options.localPath) {
        pluginPath = await this.extractPlugin(options.localPath);
      } else {
        throw new Error('No download URL or local path provided');
      }

      // Read manifest
      const manifestPath = path.join(pluginPath, 'manifest.json');
      const manifestContent = await fs.readFile(manifestPath, 'utf-8');
      manifest = JSON.parse(manifestContent);

      // Validate manifest
      const validation = await this.validator.validateManifest(manifest);
      if (!validation.valid) {
        throw new Error(`Manifest validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
      }

      // Check if plugin already exists
      const existing = await this.prisma.plugin.findUnique({
        where: { name: manifest.name },
      });

      if (existing && !options.overwrite) {
        throw new Error('Plugin already installed. Use overwrite option to replace.');
      }

      // Scan for malicious code
      const maliciousErrors = await this.validator.scanForMaliciousCode(pluginPath);
      if (maliciousErrors.length > 0) {
        throw new Error(`Security scan failed: ${maliciousErrors.map(e => e.message).join(', ')}`);
      }

      // Validate dependencies
      const installedPlugins = new Map<string, PluginManifest>();
      const allPlugins = await this.prisma.plugin.findMany();
      for (const p of allPlugins) {
        const m = JSON.parse(await fs.readFile(path.join(this.pluginDataPath, 'installed', p.name, 'manifest.json'), 'utf-8'));
        installedPlugins.set(p.name, m);
      }

      const depErrors = await this.validator.validateDependencies(
        manifest.requires.dependencies || [],
        installedPlugins
      );
      if (depErrors.length > 0) {
        throw new Error(`Dependency check failed: ${depErrors.map(e => e.message).join(', ')}`);
      }

      // Calculate checksum
      const checksumPath = path.join(pluginPath, 'package.zip');
      let checksum = '';
      if (await fs.pathExists(checksumPath)) {
        checksum = await this.validator.calculateChecksum(checksumPath);
      }

      // Move to installed directory
      const installedPath = path.join(this.pluginDataPath, 'installed', manifest.name);
      if (await fs.pathExists(installedPath)) {
        await fs.remove(installedPath);
      }
      await fs.move(pluginPath, installedPath);

      // Save to database
      const pluginData = {
        name: manifest.name,
        displayName: manifest.displayName,
        description: manifest.description,
        version: manifest.version,
        author: manifest.author.name,
        authorEmail: manifest.author.email,
        homepage: manifest.homepage,
        repository: manifest.repository,
        minAppVersion: manifest.requires.minAppVersion,
        maxAppVersion: manifest.requires.maxAppVersion,
        dependencies: manifest.requires.dependencies || [],
        permissions: manifest.security.permissions || [],
        manifestPath: path.join(installedPath, 'manifest.json'),
        mainEntry: manifest.entry,
        assetsPath: manifest.assets ? path.join(installedPath, manifest.assets) : null,
        category: manifest.category,
        tags: manifest.tags || [],
        checksum,
        verified: options.verify || false,
        status: options.activate ? PluginStatus.ACTIVE : PluginStatus.INACTIVE,
      };

      let plugin: Plugin;
      if (existing) {
        plugin = await this.prisma.plugin.update({
          where: { id: existing.id },
          data: pluginData,
        });
      } else {
        plugin = await this.prisma.plugin.create({
          data: pluginData,
        });
      }

      // Save routes
      if (manifest.capabilities?.routes) {
        await this.prisma.pluginRoute.deleteMany({
          where: { pluginId: plugin.id },
        });

        for (const route of manifest.capabilities.routes) {
          await this.prisma.pluginRoute.create({
            data: {
              pluginId: plugin.id,
              path: route.path,
              method: route.method,
              handler: route.handler,
              middleware: route.middleware || [],
              permissions: route.permissions || [],
              description: route.description,
            },
          });
        }
      }

      // Save menu items
      if (manifest.capabilities?.menuItems) {
        await this.prisma.pluginMenuItem.deleteMany({
          where: { pluginId: plugin.id },
        });

        for (const item of manifest.capabilities.menuItems) {
          await this.prisma.pluginMenuItem.create({
            data: {
              pluginId: plugin.id,
              label: item.label,
              icon: item.icon,
              path: item.path,
              position: item.position,
              order: item.order || 100,
              permissions: item.permissions || [],
            },
          });
        }
      }

      // Activate if requested
      if (options.activate) {
        await this.engine.loadPlugin(manifest.name);
      }

      // Check for conflicts
      await this.checkConflicts(plugin.id);

      // Log success
      await this.logAction({
        pluginId: plugin.id,
        action: 'INSTALL',
        status: 'SUCCESS',
        message: `Plugin ${manifest.displayName} installed successfully`,
        userId,
      });

      return plugin;
    } catch (error: any) {
      // Log error
      await this.logAction({
        action: 'INSTALL',
        status: 'FAILED',
        message: `Plugin installation failed: ${error.message}`,
        details: { error: error.message, stack: error.stack },
        userId,
      });

      throw error;
    }
  }

  /**
   * Uninstall plugin
   */
  async uninstallPlugin(id: string, userId?: string) {
    const plugin = await this.getPluginById(id);

    try {
      // Deactivate if active
      if (plugin.status === 'ACTIVE') {
        await this.deactivatePlugin(id, userId);
      }

      // Remove from filesystem
      const installedPath = path.join(this.pluginDataPath, 'installed', plugin.name);
      if (await fs.pathExists(installedPath)) {
        await fs.remove(installedPath);
      }

      // Remove plugin data
      const dataPath = path.join(this.pluginDataPath, 'data', plugin.name);
      if (await fs.pathExists(dataPath)) {
        await fs.remove(dataPath);
      }

      // Delete from database
      await this.prisma.plugin.delete({
        where: { id },
      });

      // Log success
      await this.logAction({
        action: 'UNINSTALL',
        status: 'SUCCESS',
        message: `Plugin ${plugin.displayName} uninstalled successfully`,
        userId,
      });

      return { success: true };
    } catch (error: any) {
      await this.logAction({
        pluginId: id,
        action: 'UNINSTALL',
        status: 'FAILED',
        message: `Plugin uninstallation failed: ${error.message}`,
        userId,
      });

      throw error;
    }
  }

  /**
   * Activate plugin
   */
  async activatePlugin(id: string, userId?: string) {
    const plugin = await this.getPluginById(id);

    try {
      if (plugin.status === 'ACTIVE') {
        return plugin;
      }

      // Load plugin
      await this.engine.loadPlugin(plugin.name);

      // Update status
      const updated = await this.prisma.plugin.update({
        where: { id },
        data: {
          status: 'ACTIVE',
          lastActivated: new Date(),
        },
      });

      await this.logAction({
        pluginId: id,
        action: 'ACTIVATE',
        status: 'SUCCESS',
        message: `Plugin ${plugin.displayName} activated successfully`,
        userId,
      });

      return updated;
    } catch (error: any) {
      await this.prisma.plugin.update({
        where: { id },
        data: { status: 'ERROR' },
      });

      await this.logAction({
        pluginId: id,
        action: 'ACTIVATE',
        status: 'FAILED',
        message: `Plugin activation failed: ${error.message}`,
        userId,
      });

      throw error;
    }
  }

  /**
   * Deactivate plugin
   */
  async deactivatePlugin(id: string, userId?: string) {
    const plugin = await this.getPluginById(id);

    try {
      if (plugin.status === 'INACTIVE') {
        return plugin;
      }

      // Unload plugin
      await this.engine.unloadPlugin(plugin.name);

      // Update status
      const updated = await this.prisma.plugin.update({
        where: { id },
        data: { status: 'INACTIVE' },
      });

      await this.logAction({
        pluginId: id,
        action: 'DEACTIVATE',
        status: 'SUCCESS',
        message: `Plugin ${plugin.displayName} deactivated successfully`,
        userId,
      });

      return updated;
    } catch (error: any) {
      await this.logAction({
        pluginId: id,
        action: 'DEACTIVATE',
        status: 'FAILED',
        message: `Plugin deactivation failed: ${error.message}`,
        userId,
      });

      throw error;
    }
  }

  /**
   * Update plugin
   */
  async updatePlugin(id: string, updateInfo: PluginUpdateInfo, userId?: string) {
    const plugin = await this.getPluginById(id);

    try {
      // Download new version
      const options: PluginInstallOptions = {
        downloadUrl: updateInfo.downloadUrl,
        verify: true,
        activate: plugin.status === 'ACTIVE',
        overwrite: true,
      };

      const updated = await this.installPlugin(options, userId);

      await this.logAction({
        pluginId: id,
        action: 'UPDATE',
        status: 'SUCCESS',
        message: `Plugin updated from ${updateInfo.currentVersion} to ${updateInfo.latestVersion}`,
        userId,
      });

      return updated;
    } catch (error: any) {
      await this.logAction({
        pluginId: id,
        action: 'UPDATE',
        status: 'FAILED',
        message: `Plugin update failed: ${error.message}`,
        userId,
      });

      throw error;
    }
  }

  /**
   * Get plugin statistics
   */
  async getPluginStats(): Promise<PluginStats> {
    const [total, active, inactive, error, routes, menuItems, avgRating, totalDownloads] = await Promise.all([
      this.prisma.plugin.count(),
      this.prisma.plugin.count({ where: { status: 'ACTIVE' } }),
      this.prisma.plugin.count({ where: { status: 'INACTIVE' } }),
      this.prisma.plugin.count({ where: { status: 'ERROR' } }),
      this.prisma.pluginRoute.count(),
      this.prisma.pluginMenuItem.count(),
      this.prisma.plugin.aggregate({ _avg: { rating: true } }),
      this.prisma.plugin.aggregate({ _sum: { downloads: true } }),
    ]);

    return {
      totalPlugins: total,
      activePlugins: active,
      inactivePlugins: inactive,
      errorPlugins: error,
      totalRoutes: routes,
      totalMenuItems: menuItems,
      averageRating: avgRating._avg.rating || 0,
      totalDownloads: totalDownloads._sum.downloads || 0,
    };
  }

  /**
   * Check plugin health
   */
  async checkPluginHealth(id: string): Promise<PluginHealthCheck> {
    const plugin = await this.getPluginById(id);
    const pluginPath = path.join(this.pluginDataPath, 'installed', plugin.name);

    const checks = {
      manifest: await fs.pathExists(path.join(pluginPath, 'manifest.json')),
      files: await fs.pathExists(path.join(pluginPath, plugin.mainEntry)),
      dependencies: true,
      routes: plugin.routes.length > 0,
      permissions: plugin.permissions !== null,
    };

    const errors: string[] = [];
    if (!checks.manifest) errors.push('Manifest file missing');
    if (!checks.files) errors.push('Entry file missing');

    return {
      pluginId: id,
      healthy: errors.length === 0,
      checks,
      errors,
      lastCheck: new Date(),
    };
  }

  /**
   * Check for plugin conflicts
   */
  private async checkConflicts(pluginId: string): Promise<void> {
    const plugin = await this.getPluginById(pluginId);
    const allPlugins = await this.getPlugins({ status: 'ACTIVE' });

    for (const other of allPlugins) {
      if (other.id === pluginId) continue;

      // Check route conflicts
      for (const route of plugin.routes) {
        for (const otherRoute of other.routes) {
          if (route.path === otherRoute.path && route.method === otherRoute.method) {
            await this.prisma.pluginConflict.create({
              data: {
                plugin1Id: pluginId,
                plugin2Id: other.id,
                conflictType: 'route',
                description: `Route conflict: ${route.method} ${route.path}`,
                severity: 'error',
              },
            });
          }
        }
      }
    }
  }

  /**
   * Download plugin from URL
   */
  private async downloadPlugin(url: string): Promise<string> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const tempPath = path.join(this.pluginDataPath, 'temp', `plugin-${Date.now()}.zip`);
    await fs.ensureDir(path.dirname(tempPath));
    await fs.writeFile(tempPath, response.data);
    return await this.extractPlugin(tempPath);
  }

  /**
   * Extract plugin zip file
   */
  private async extractPlugin(zipPath: string): Promise<string> {
    const extractPath = path.join(this.pluginDataPath, 'temp', `extract-${Date.now()}`);
    await fs.ensureDir(extractPath);

    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractPath, true);

    // Check if plugin is in a subdirectory (e.g., plugin-name/manifest.json)
    const files = await fs.readdir(extractPath);
    
    // If there's only one directory, the plugin is likely inside it
    if (files.length === 1) {
      const subPath = path.join(extractPath, files[0]);
      const stat = await fs.stat(subPath);
      
      if (stat.isDirectory()) {
        // Check if manifest exists in subdirectory
        const manifestPath = path.join(subPath, 'manifest.json');
        if (await fs.pathExists(manifestPath)) {
          return subPath;
        }
      }
    }

    return extractPath;
  }

  /**
   * Log plugin action
   */
  private async logAction(data: {
    pluginId?: string;
    action: PluginAction;
    status: LogStatus;
    message: string;
    details?: any;
    userId?: string;
  }) {
    if (data.pluginId) {
      await this.prisma.pluginLog.create({
        data: {
          pluginId: data.pluginId,
          action: data.action,
          status: data.status,
          message: data.message,
          details: data.details,
          userId: data.userId,
        },
      });
    }
  }
}
