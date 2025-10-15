import { Router } from 'express';
import fs from 'fs-extra';
import path from 'path';
import vm from 'vm';
import EventEmitter from 'events';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import {
  PluginManifest,
  PluginInstance,
  PluginContext,
  PluginLogger,
  PluginDatabaseAccess,
  PluginHttpClient,
  PluginStorage,
  PluginEventEmitter,
  PluginSandboxConfig,
} from './plugin.types';
import { PluginValidator } from './plugin.validator';

export class PluginEngine extends EventEmitter {
  private loadedPlugins: Map<string, PluginInstance> = new Map();
  private validator: PluginValidator;
  private prisma: PrismaClient;
  private pluginDataPath: string;
  private appVersion: string;

  constructor(prisma: PrismaClient) {
    super();
    this.prisma = prisma;
    this.validator = new PluginValidator();
    this.pluginDataPath = process.env.PLUGIN_DATA_PATH || '/data/plugins';
    this.appVersion = process.env.APP_VERSION || '1.0.0';
  }

  /**
   * Initialize plugin engine
   */
  async initialize(): Promise<void> {
    // Ensure plugin data directory exists
    await fs.ensureDir(this.pluginDataPath);
    await fs.ensureDir(path.join(this.pluginDataPath, 'installed'));
    await fs.ensureDir(path.join(this.pluginDataPath, 'data'));
    await fs.ensureDir(path.join(this.pluginDataPath, 'cache'));

    // Load all active plugins from database
    const activePlugins = await this.prisma.plugin.findMany({
      where: { status: 'ACTIVE' },
    });

    for (const plugin of activePlugins) {
      try {
        await this.loadPlugin(plugin.name);
      } catch (error: any) {
        console.error(`Failed to load plugin ${plugin.name}:`, error);
        await this.prisma.plugin.update({
          where: { id: plugin.id },
          data: { status: 'ERROR' },
        });
      }
    }
  }

  /**
   * Load a plugin
   */
  async loadPlugin(pluginName: string): Promise<PluginInstance> {
    const pluginPath = path.join(this.pluginDataPath, 'installed', pluginName);
    const manifestPath = path.join(pluginPath, 'manifest.json');

    // Read and parse manifest
    const manifestContent = await fs.readFile(manifestPath, 'utf-8');
    const manifest: PluginManifest = JSON.parse(manifestContent);

    // Validate manifest
    const validation = await this.validator.validateManifest(manifest);
    if (!validation.valid) {
      throw new Error(`Plugin manifest validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    // Check file structure
    const fileErrors = await this.validator.validateFileStructure(pluginPath, manifest);
    if (fileErrors.length > 0) {
      throw new Error(`Plugin file structure invalid: ${fileErrors.map(e => e.message).join(', ')}`);
    }

    // Get plugin from database
    const dbPlugin = await this.prisma.plugin.findUnique({
      where: { name: pluginName },
    });

    if (!dbPlugin) {
      throw new Error(`Plugin ${pluginName} not found in database`);
    }

    // Create plugin context
    const context = this.createPluginContext(dbPlugin.id, manifest);

    // Get sandbox config
    const sandboxConfig = this.validator.getSandboxConfig(manifest);

    // Load plugin module
    const entryPath = path.join(pluginPath, manifest.entry);
    const pluginModule = await this.loadPluginModule(entryPath, context, sandboxConfig);

    // Create router for plugin routes
    const router = this.createPluginRouter(manifest, pluginModule);

    const instance: PluginInstance = {
      manifest,
      module: pluginModule,
      context,
      router,
      active: true,
    };

    this.loadedPlugins.set(pluginName, instance);

    // Register hooks
    if (manifest.capabilities?.hooks) {
      for (const hook of manifest.capabilities.hooks) {
        this.on(`hook:${hook.name}`, (data: any) => {
          if (pluginModule[hook.handler]) {
            pluginModule[hook.handler](data, context);
          }
        });
      }
    }

    // Call plugin's onLoad hook if exists
    if (pluginModule.onLoad && typeof pluginModule.onLoad === 'function') {
      await pluginModule.onLoad(context);
    }

    this.emit('plugin:loaded', { pluginName, manifest });

    return instance;
  }

  /**
   * Unload a plugin
   */
  async unloadPlugin(pluginName: string): Promise<void> {
    const instance = this.loadedPlugins.get(pluginName);
    if (!instance) {
      throw new Error(`Plugin ${pluginName} is not loaded`);
    }

    // Call plugin's onUnload hook if exists
    if (instance.module.onUnload && typeof instance.module.onUnload === 'function') {
      await instance.module.onUnload(instance.context);
    }

    // Remove all event listeners for this plugin
    if (instance.manifest.capabilities?.hooks) {
      for (const hook of instance.manifest.capabilities.hooks) {
        this.removeAllListeners(`hook:${hook.name}`);
      }
    }

    // Mark as inactive
    instance.active = false;

    this.loadedPlugins.delete(pluginName);

    this.emit('plugin:unloaded', { pluginName });
  }

  /**
   * Reload a plugin
   */
  async reloadPlugin(pluginName: string): Promise<PluginInstance> {
    await this.unloadPlugin(pluginName);
    return await this.loadPlugin(pluginName);
  }

  /**
   * Get loaded plugin instance
   */
  getPlugin(pluginName: string): PluginInstance | undefined {
    return this.loadedPlugins.get(pluginName);
  }

  /**
   * Get all loaded plugins
   */
  getAllPlugins(): Map<string, PluginInstance> {
    return this.loadedPlugins;
  }

  /**
   * Get plugin static file path
   */
  getPluginStaticPath(pluginName: string): string | null {
    const pluginPath = path.join(this.pluginDataPath, 'installed', pluginName);
    const publicPath = path.join(pluginPath, 'public');
    
    // Check if public folder exists
    if (fs.pathExistsSync(publicPath)) {
      return publicPath;
    }
    
    return null;
  }

  /**
   * Get all plugin static paths for mounting
   */
  getAllPluginStaticPaths(): Map<string, string> {
    const staticPaths = new Map<string, string>();
    
    for (const [pluginName, instance] of this.loadedPlugins.entries()) {
      const staticPath = this.getPluginStaticPath(pluginName);
      if (staticPath) {
        staticPaths.set(pluginName, staticPath);
      }
    }
    
    return staticPaths;
  }

  /**
   * Create plugin context
   */
  private createPluginContext(pluginId: string, manifest: PluginManifest): PluginContext {
    const pluginDataPath = path.join(this.pluginDataPath, 'data', manifest.name);

    return {
      app: {
        version: this.appVersion,
        rootPath: process.cwd(),
      },
      plugin: {
        id: pluginId,
        name: manifest.name,
        version: manifest.version,
        dataPath: pluginDataPath,
      },
      logger: this.createPluginLogger(manifest.name),
      db: this.createPluginDatabaseAccess(manifest.name),
      http: this.createPluginHttpClient(manifest),
      storage: this.createPluginStorage(pluginDataPath),
      events: this.createPluginEventEmitter(manifest.name),
    };
  }

  /**
   * Create plugin logger
   */
  private createPluginLogger(pluginName: string): PluginLogger {
    return {
      info: (message: string, meta?: any) => {
        console.log(`[Plugin:${pluginName}] INFO:`, message, meta || '');
      },
      warn: (message: string, meta?: any) => {
        console.warn(`[Plugin:${pluginName}] WARN:`, message, meta || '');
      },
      error: (message: string, meta?: any) => {
        console.error(`[Plugin:${pluginName}] ERROR:`, message, meta || '');
      },
      debug: (message: string, meta?: any) => {
        if (process.env.NODE_ENV === 'development') {
          console.debug(`[Plugin:${pluginName}] DEBUG:`, message, meta || '');
        }
      },
    };
  }

  /**
   * Create plugin database access
   */
  private createPluginDatabaseAccess(pluginName: string): PluginDatabaseAccess {
    return {
      query: async (sql: string, params?: any[]) => {
        // Limited SQL access - only SELECT queries
        if (!sql.trim().toLowerCase().startsWith('select')) {
          throw new Error('Only SELECT queries are allowed');
        }
        return await this.prisma.$queryRawUnsafe(sql, ...(params || []));
      },
      table: (name: string) => {
        // Only allow access to plugin-specific tables
        if (!name.startsWith(`plugin_${pluginName}_`)) {
          throw new Error(`Access denied to table: ${name}`);
        }
        return (this.prisma as any)[name];
      },
    };
  }

  /**
   * Create plugin HTTP client
   */
  private createPluginHttpClient(manifest: PluginManifest): PluginHttpClient {
    const allowedHosts = manifest.security?.sandbox ? [] : ['*'];

    const checkHost = (url: string) => {
      if (allowedHosts.includes('*')) return true;
      const urlObj = new URL(url);
      return allowedHosts.some(host => urlObj.hostname.endsWith(host));
    };

    return {
      get: async (url: string, config?: any) => {
        if (!checkHost(url)) {
          throw new Error(`Access denied to host: ${url}`);
        }
        const response = await axios.get(url, config);
        return response.data;
      },
      post: async (url: string, data?: any, config?: any) => {
        if (!checkHost(url)) {
          throw new Error(`Access denied to host: ${url}`);
        }
        const response = await axios.post(url, data, config);
        return response.data;
      },
      put: async (url: string, data?: any, config?: any) => {
        if (!checkHost(url)) {
          throw new Error(`Access denied to host: ${url}`);
        }
        const response = await axios.put(url, data, config);
        return response.data;
      },
      delete: async (url: string, config?: any) => {
        if (!checkHost(url)) {
          throw new Error(`Access denied to host: ${url}`);
        }
        const response = await axios.delete(url, config);
        return response.data;
      },
    };
  }

  /**
   * Create plugin storage
   */
  private createPluginStorage(dataPath: string): PluginStorage {
    return {
      read: async (key: string) => {
        const filePath = path.join(dataPath, key);
        if (await fs.pathExists(filePath)) {
          return await fs.readFile(filePath, 'utf-8');
        }
        return null;
      },
      write: async (key: string, value: string) => {
        const filePath = path.join(dataPath, key);
        await fs.ensureDir(path.dirname(filePath));
        await fs.writeFile(filePath, value, 'utf-8');
      },
      delete: async (key: string) => {
        const filePath = path.join(dataPath, key);
        if (await fs.pathExists(filePath)) {
          await fs.remove(filePath);
        }
      },
      exists: async (key: string) => {
        const filePath = path.join(dataPath, key);
        return await fs.pathExists(filePath);
      },
      list: async () => {
        if (!(await fs.pathExists(dataPath))) {
          return [];
        }
        return await fs.readdir(dataPath);
      },
    };
  }

  /**
   * Create plugin event emitter
   */
  private createPluginEventEmitter(pluginName: string): PluginEventEmitter {
    return {
      on: (event: string, handler: (...args: any[]) => void) => {
        this.on(`plugin:${pluginName}:${event}`, handler);
      },
      emit: (event: string, data?: any) => {
        this.emit(`plugin:${pluginName}:${event}`, data);
      },
      off: (event: string, handler: (...args: any[]) => void) => {
        this.off(`plugin:${pluginName}:${event}`, handler);
      },
    };
  }

  /**
   * Load plugin module in sandbox
   */
  private async loadPluginModule(
    entryPath: string,
    context: PluginContext,
    sandboxConfig: PluginSandboxConfig
  ): Promise<any> {
    const code = await fs.readFile(entryPath, 'utf-8');

    // Create sandbox
    const sandbox = {
      console,
      require: (moduleName: string) => {
        // Whitelist of allowed modules
        const allowedModules = ['axios', 'lodash', 'dayjs', 'crypto'];
        if (allowedModules.includes(moduleName)) {
          return require(moduleName);
        }
        throw new Error(`Module not allowed: ${moduleName}`);
      },
      module: { exports: {} },
      exports: {},
      context,
      setTimeout,
      setInterval,
      clearTimeout,
      clearInterval,
      Promise,
    };

    // Run code in sandbox
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, {
      timeout: (sandboxConfig.timeout || 30) * 1000,
      displayErrors: true,
    });

    return sandbox.module.exports;
  }

  /**
   * Create router for plugin routes
   */
  private createPluginRouter(manifest: PluginManifest, pluginModule: any): Router | undefined {
    if (!manifest.capabilities?.routes || manifest.capabilities.routes.length === 0) {
      return undefined;
    }

    const router = Router();

    for (const routeDef of manifest.capabilities.routes) {
      const method = routeDef.method.toLowerCase() as 'get' | 'post' | 'put' | 'delete' | 'patch';
      const handler = pluginModule[routeDef.handler];

      if (!handler || typeof handler !== 'function') {
        console.warn(`Handler ${routeDef.handler} not found in plugin ${manifest.name}`);
        continue;
      }

      // Apply middleware if specified
      const middleware: any[] = [];
      if (routeDef.middleware) {
        for (const mw of routeDef.middleware) {
          if (pluginModule[mw] && typeof pluginModule[mw] === 'function') {
            middleware.push(pluginModule[mw]);
          }
        }
      }

      // Register route
      router[method](routeDef.path, ...middleware, handler);
    }

    return router;
  }

  /**
   * Emit hook event
   */
  async emitHook(hookName: string, data: any): Promise<void> {
    this.emit(`hook:${hookName}`, data);
  }
}
