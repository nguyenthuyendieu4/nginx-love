// Plugin Types for Frontend
export enum PluginStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ERROR = 'ERROR',
  UPDATING = 'UPDATING',
}

export enum PluginAction {
  INSTALL = 'INSTALL',
  UNINSTALL = 'UNINSTALL',
  ACTIVATE = 'ACTIVATE',
  DEACTIVATE = 'DEACTIVATE',
  UPDATE = 'UPDATE',
  ERROR = 'ERROR',
}

export enum LogStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  WARNING = 'WARNING',
}

export interface Plugin {
  id: string;
  name: string;
  displayName: string;
  description: string;
  version: string;
  author: string;
  authorEmail?: string;
  homepage?: string;
  repository?: string;
  status: PluginStatus;
  isSystem: boolean;
  minAppVersion: string;
  maxAppVersion?: string;
  dependencies: string[];
  permissions: string[];
  manifestPath: string;
  mainEntry: string;
  assetsPath?: string;
  marketplaceId?: string;
  downloads: number;
  rating?: number;
  installedAt: string;
  updatedAt: string;
  lastActivated?: string;
  hasUpdate?: boolean;
  manifest: PluginManifest;
  routes?: PluginRoute[];
  menuItems?: PluginMenuItem[];
  logs?: PluginLog[];
}

export interface PluginRoute {
  id: string;
  pluginId: string;
  path: string;
  method: string;
  handler: string;
  middleware: string[];
  permissions: string[];
  createdAt: string;
}

export interface PluginLog {
  id: string;
  pluginId: string;
  action: PluginAction;
  status: LogStatus;
  message: string;
  details?: any;
  userId?: string;
  level?: 'error' | 'warning' | 'info';
  createdAt: string;
}

export interface PluginMenuItem {
  id: string;
  pluginId: string;
  label: string;
  path: string;
  position: 'header' | 'sidebar';
  icon?: string;
  order: number;
  permissions: string[];
  createdAt: string;
}

export interface MarketplacePlugin {
  id: string;
  name: string;
  displayName: string;
  description: string;
  version: string;
  author: {
    name: string;
    email?: string;
    url?: string;
  };
  category: string;
  tags: string[];
  homepage?: string;
  repository?: string;
  screenshots?: string[];
  icon?: string;
  downloads: number;
  rating?: number;
  ratingCount?: number;
  verified?: boolean;
  latestVersion: string;
  versions: PluginVersion[];
  requires: {
    minAppVersion: string;
    maxAppVersion?: string;
    dependencies?: string[];
  };
  changelog?: string;
  updatedAt: string;
  createdAt: string;
}

export interface PluginVersion {
  version: string;
  releaseDate: string;
  changelog: string;
  downloads: number;
}

export interface PluginListResponse {
  plugins: Plugin[];
  total: number;
  page: number;
  totalPages: number;
}

export interface MarketplaceListResponse {
  plugins: MarketplacePlugin[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PluginLogsResponse {
  logs: PluginLog[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PluginUpdateInfo {
  pluginId: string;
  currentVersion: string;
  latestVersion: string;
  hasUpdate: boolean;
  changelog?: string;
  releaseDate?: string;
}

export interface InstallPluginRequest {
  version?: string;
}

export interface UpdatePluginRequest {
  version: string;
}

export interface SubmitRatingRequest {
  rating: number;
  review?: string;
}

// Plugin Manifest
export interface PluginManifest {
  name: string;
  displayName: string;
  version: string;
  description: string;
  author: string;
  authorEmail?: string;
  homepage?: string;
  repository?: string;
  requires: {
    minAppVersion: string;
    maxAppVersion?: string;
    dependencies?: string[];
  };
  capabilities: {
    routes?: RouteDefinition[];
    menuItems?: MenuItem[];
    permissions?: string[];
    hooks?: HookDefinition[];
  };
  security: {
    permissions: string[];
    sandbox: boolean;
  };
  permissions: string[];
  entry: string;
  assets?: string;
}

export interface RouteDefinition {
  path: string;
  method: string;
  handler: string;
  middleware?: string[];
  permissions?: string[];
}

export interface MenuItem {
  type: 'header' | 'sidebar';
  label: string;
  icon?: string;
  path: string;
  order?: number;
  permissions?: string[];
}

export interface HookDefinition {
  name: string;
  handler: string;
  priority?: number;
}
