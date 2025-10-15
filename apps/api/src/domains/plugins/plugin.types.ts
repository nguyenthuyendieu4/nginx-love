import { PluginStatus, PluginAction, LogStatus } from '@prisma/client';
import { Router } from 'express';

/**
 * Plugin Manifest Structure
 * Defines the structure of manifest.json file in each plugin
 */
export interface PluginManifest {
  name: string;
  displayName: string;
  version: string;
  description: string;
  author: {
    name: string;
    email: string;
    url?: string;
  };

  // Requirements
  requires: {
    minAppVersion: string;
    maxAppVersion?: string;
    dependencies?: string[]; // Other plugin names
  };

  // Capabilities
  capabilities: {
    routes?: RouteDefinition[];
    menuItems?: MenuItem[];
    permissions?: string[];
    hooks?: HookDefinition[];
  };

  // Security
  security: {
    permissions: string[];
    sandbox: boolean;
  };

  // Files
  entry: string; // Main entry file (e.g., index.js)
  assets?: string; // Assets directory

  // Marketplace
  category?: string;
  tags?: string[];
  homepage?: string;
  repository?: string;
}

/**
 * Route Definition
 * Defines an API route that the plugin wants to register
 */
export interface RouteDefinition {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  handler: string; // Function name in plugin
  middleware?: string[]; // Middleware function names
  permissions?: string[]; // Required permissions
  description?: string;
}

/**
 * Menu Item
 * Defines a menu item that the plugin wants to add
 */
export interface MenuItem {
  label: string;
  icon?: string;
  path: string;
  position: 'header' | 'sidebar' | 'both';
  order?: number;
  permissions?: string[];
}

/**
 * Hook Definition
 * Defines lifecycle hooks that the plugin can listen to
 */
export interface HookDefinition {
  name: string; // Hook name (e.g., 'domain.created', 'ssl.installed')
  handler: string; // Function name in plugin
}

/**
 * Plugin Context
 * Provided to each plugin for interacting with the system
 */
export interface PluginContext {
  app: {
    version: string;
    rootPath: string;
  };
  plugin: {
    id: string;
    name: string;
    version: string;
    dataPath: string;
  };
  logger: PluginLogger;
  db: PluginDatabaseAccess;
  http: PluginHttpClient;
  storage: PluginStorage;
  events: PluginEventEmitter;
}

/**
 * Plugin Logger
 * Logging interface for plugins
 */
export interface PluginLogger {
  info(message: string, meta?: any): void;
  warn(message: string, meta?: any): void;
  error(message: string, meta?: any): void;
  debug(message: string, meta?: any): void;
}

/**
 * Plugin Database Access
 * Limited database access for plugins
 */
export interface PluginDatabaseAccess {
  query(sql: string, params?: any[]): Promise<any>;
  table(name: string): any; // Prisma-like query builder
}

/**
 * Plugin HTTP Client
 * HTTP client for making external requests
 */
export interface PluginHttpClient {
  get(url: string, config?: any): Promise<any>;
  post(url: string, data?: any, config?: any): Promise<any>;
  put(url: string, data?: any, config?: any): Promise<any>;
  delete(url: string, config?: any): Promise<any>;
}

/**
 * Plugin Storage
 * File storage interface for plugins
 */
export interface PluginStorage {
  read(key: string): Promise<string | null>;
  write(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  list(): Promise<string[]>;
}

/**
 * Plugin Event Emitter
 * Event system for inter-plugin communication
 */
export interface PluginEventEmitter {
  on(event: string, handler: Function): void;
  emit(event: string, data?: any): void;
  off(event: string, handler: Function): void;
}

/**
 * Plugin Instance
 * Represents a loaded plugin instance
 */
export interface PluginInstance {
  manifest: PluginManifest;
  module: any; // The loaded module
  context: PluginContext;
  router?: Router;
  active: boolean;
}

/**
 * Plugin Installation Package
 * Represents a downloadable plugin package
 */
export interface PluginPackage {
  manifest: PluginManifest;
  files: {
    [path: string]: Buffer | string;
  };
  checksum: string;
  signature?: string;
}

/**
 * Marketplace Plugin Info
 * Information about a plugin in the marketplace
 */
export interface MarketplacePlugin {
  id: string;
  name: string;
  displayName: string;
  description: string;
  version: string;
  author: {
    name: string;
    email: string;
    url?: string;
  };
  category: string;
  tags: string[];
  rating: number;
  downloads: number;
  homepage?: string;
  repository?: string;
  screenshots?: string[];
  changelog?: string;
  verified: boolean;
  requires: {
    minAppVersion: string;
    maxAppVersion?: string;
  };
  downloadUrl: string;
  checksum: string;
  signature?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Plugin Validation Result
 */
export interface PluginValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  code: string;
  message: string;
  field?: string;
  severity: 'error';
}

export interface ValidationWarning {
  code: string;
  message: string;
  field?: string;
  severity: 'warning';
}

/**
 * Plugin Conflict
 */
export interface PluginConflictInfo {
  plugin1: string;
  plugin2: string;
  type: 'route' | 'permission' | 'dependency' | 'resource';
  description: string;
  severity: 'warning' | 'error' | 'critical';
  resolution?: string;
}

/**
 * Plugin Update Info
 */
export interface PluginUpdateInfo {
  pluginId: string;
  currentVersion: string;
  latestVersion: string;
  changelog: string;
  downloadUrl: string;
  checksum: string;
  breaking: boolean;
}

/**
 * Plugin Statistics
 */
export interface PluginStats {
  totalPlugins: number;
  activePlugins: number;
  inactivePlugins: number;
  errorPlugins: number;
  totalRoutes: number;
  totalMenuItems: number;
  averageRating: number;
  totalDownloads: number;
}

/**
 * Plugin Filter Options
 */
export interface PluginFilterOptions {
  status?: PluginStatus;
  category?: string;
  tags?: string[];
  author?: string;
  verified?: boolean;
  search?: string;
}

/**
 * Plugin Sort Options
 */
export interface PluginSortOptions {
  field: 'name' | 'displayName' | 'installedAt' | 'updatedAt' | 'rating' | 'downloads';
  order: 'asc' | 'desc';
}

/**
 * Plugin Log Entry
 */
export interface PluginLogEntry {
  id: string;
  pluginId: string;
  action: PluginAction;
  status: LogStatus;
  message: string;
  details?: any;
  errorStack?: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

/**
 * Plugin Installation Options
 */
export interface PluginInstallOptions {
  marketplaceId?: string;
  downloadUrl?: string;
  localPath?: string;
  verify?: boolean;
  activate?: boolean;
  overwrite?: boolean;
}

/**
 * Plugin Hook Context
 * Context passed to hook handlers
 */
export interface PluginHookContext {
  hookName: string;
  data: any;
  plugin: {
    id: string;
    name: string;
  };
  timestamp: Date;
}

/**
 * Plugin Permission Check
 */
export interface PluginPermissionCheck {
  permission: string;
  granted: boolean;
  reason?: string;
}

/**
 * Plugin Sandbox Config
 */
export interface PluginSandboxConfig {
  allowFileSystem: boolean;
  allowedPaths?: string[];
  allowNetwork: boolean;
  allowedHosts?: string[];
  allowDatabase: boolean;
  allowedTables?: string[];
  memoryLimit?: number; // MB
  cpuLimit?: number; // percentage
  timeout?: number; // seconds
}

/**
 * Plugin Health Check
 */
export interface PluginHealthCheck {
  pluginId: string;
  healthy: boolean;
  checks: {
    manifest: boolean;
    files: boolean;
    dependencies: boolean;
    routes: boolean;
    permissions: boolean;
  };
  errors: string[];
  lastCheck: Date;
}

/**
 * Plugin Backup
 */
export interface PluginBackup {
  pluginId: string;
  version: string;
  backupPath: string;
  createdAt: Date;
}
