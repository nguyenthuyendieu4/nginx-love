import crypto from 'crypto';
import fs from 'fs-extra';
import path from 'path';
import semver from 'semver';
import {
  PluginManifest,
  PluginValidationResult,
  ValidationError,
  ValidationWarning,
  PluginSandboxConfig,
} from './plugin.types';

export class PluginValidator {
  private readonly APP_VERSION: string;
  private readonly REQUIRED_MANIFEST_FIELDS = [
    'name',
    'displayName',
    'version',
    'description',
    'author',
    'requires',
    'security',
    'entry',
  ];

  constructor() {
    this.APP_VERSION = process.env.APP_VERSION || '1.0.0';
  }

  /**
   * Validate plugin manifest
   */
  async validateManifest(manifest: any): Promise<PluginValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Check required fields
    for (const field of this.REQUIRED_MANIFEST_FIELDS) {
      if (!manifest[field]) {
        errors.push({
          code: 'MISSING_FIELD',
          message: `Missing required field: ${field}`,
          field,
          severity: 'error',
        });
      }
    }

    if (errors.length > 0) {
      return { valid: false, errors, warnings };
    }

    // Validate name format
    if (!/^[a-z0-9-]+$/.test(manifest.name)) {
      errors.push({
        code: 'INVALID_NAME',
        message: 'Plugin name must be lowercase alphanumeric with hyphens only',
        field: 'name',
        severity: 'error',
      });
    }

    // Validate version format
    if (!semver.valid(manifest.version)) {
      errors.push({
        code: 'INVALID_VERSION',
        message: 'Plugin version must be a valid semver version',
        field: 'version',
        severity: 'error',
      });
    }

    // Validate author
    if (!manifest.author?.name || !manifest.author?.email) {
      errors.push({
        code: 'INVALID_AUTHOR',
        message: 'Author must have name and email',
        field: 'author',
        severity: 'error',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (manifest.author?.email && !emailRegex.test(manifest.author.email)) {
      errors.push({
        code: 'INVALID_EMAIL',
        message: 'Invalid author email format',
        field: 'author.email',
        severity: 'error',
      });
    }

    // Validate app version compatibility
    const { minAppVersion, maxAppVersion } = manifest.requires;
    if (!semver.valid(minAppVersion)) {
      errors.push({
        code: 'INVALID_MIN_VERSION',
        message: 'minAppVersion must be a valid semver version',
        field: 'requires.minAppVersion',
        severity: 'error',
      });
    }

    if (maxAppVersion && !semver.valid(maxAppVersion)) {
      errors.push({
        code: 'INVALID_MAX_VERSION',
        message: 'maxAppVersion must be a valid semver version',
        field: 'requires.maxAppVersion',
        severity: 'error',
      });
    }

    // Check compatibility with current app version
    if (semver.valid(minAppVersion) && !semver.gte(this.APP_VERSION, minAppVersion)) {
      errors.push({
        code: 'INCOMPATIBLE_VERSION',
        message: `Plugin requires app version >= ${minAppVersion}, current version is ${this.APP_VERSION}`,
        field: 'requires.minAppVersion',
        severity: 'error',
      });
    }

    if (maxAppVersion && semver.valid(maxAppVersion) && !semver.lte(this.APP_VERSION, maxAppVersion)) {
      errors.push({
        code: 'INCOMPATIBLE_VERSION',
        message: `Plugin requires app version <= ${maxAppVersion}, current version is ${this.APP_VERSION}`,
        field: 'requires.maxAppVersion',
        severity: 'error',
      });
    }

    // Validate routes
    if (manifest.capabilities?.routes) {
      for (const route of manifest.capabilities.routes) {
        if (!route.path || !route.method || !route.handler) {
          errors.push({
            code: 'INVALID_ROUTE',
            message: 'Route must have path, method, and handler',
            field: 'capabilities.routes',
            severity: 'error',
          });
        }

        const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
        if (route.method && !validMethods.includes(route.method)) {
          errors.push({
            code: 'INVALID_METHOD',
            message: `Invalid HTTP method: ${route.method}`,
            field: 'capabilities.routes',
            severity: 'error',
          });
        }

        // Check for potentially dangerous paths
        if (route.path && (route.path.startsWith('/api/auth') || route.path.startsWith('/api/users'))) {
          warnings.push({
            code: 'DANGEROUS_PATH',
            message: `Route path ${route.path} may conflict with core system routes`,
            field: 'capabilities.routes',
            severity: 'warning',
          });
        }
      }
    }

    // Validate menu items
    if (manifest.capabilities?.menuItems) {
      for (const item of manifest.capabilities.menuItems) {
        if (!item.label || !item.path) {
          errors.push({
            code: 'INVALID_MENU_ITEM',
            message: 'Menu item must have label and path',
            field: 'capabilities.menuItems',
            severity: 'error',
          });
        }

        const validPositions = ['header', 'sidebar', 'both'];
        if (item.position && !validPositions.includes(item.position)) {
          errors.push({
            code: 'INVALID_POSITION',
            message: `Invalid menu position: ${item.position}`,
            field: 'capabilities.menuItems',
            severity: 'error',
          });
        }
      }
    }

    // Validate permissions
    if (!manifest.security?.permissions || !Array.isArray(manifest.security.permissions)) {
      warnings.push({
        code: 'NO_PERMISSIONS',
        message: 'Plugin should declare required permissions',
        field: 'security.permissions',
        severity: 'warning',
      });
    }

    // Check for dangerous permissions
    const dangerousPermissions = ['*', 'admin', 'root', 'system'];
    const requestedPermissions = manifest.security?.permissions || [];
    for (const perm of requestedPermissions) {
      if (dangerousPermissions.includes(perm)) {
        warnings.push({
          code: 'DANGEROUS_PERMISSION',
          message: `Plugin requests dangerous permission: ${perm}`,
          field: 'security.permissions',
          severity: 'warning',
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate plugin checksum
   */
  async validateChecksum(filePath: string, expectedChecksum: string): Promise<boolean> {
    try {
      const fileBuffer = await fs.readFile(filePath);
      const hash = crypto.createHash('sha256');
      hash.update(fileBuffer);
      const actualChecksum = hash.digest('hex');
      return actualChecksum === expectedChecksum;
    } catch (error) {
      return false;
    }
  }

  /**
   * Validate plugin signature (GPG/PGP)
   */
  async validateSignature(filePath: string, signature: string): Promise<boolean> {
    // TODO: Implement GPG signature validation
    // This would require integrating with a GPG library
    // For now, return true if signature exists
    return !!signature;
  }

  /**
   * Scan plugin files for malicious patterns
   */
  async scanForMaliciousCode(pluginPath: string): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];
    const dangerousPatterns = [
      /require\s*\(\s*['"]child_process['"]\s*\)/g,
      /eval\s*\(/g,
      /Function\s*\(/g,
      /process\.exit/g,
      /fs\.unlink/g,
      /fs\.rmdir/g,
      /rm\s+-rf/g,
      /exec\s*\(/g,
    ];

    const patternNames = [
      'child_process usage',
      'eval() usage',
      'Function() constructor',
      'process.exit()',
      'file deletion',
      'directory deletion',
      'rm -rf command',
      'exec() usage',
    ];

    try {
      const files = await this.getAllFiles(pluginPath);

      for (const file of files) {
        if (!file.endsWith('.js') && !file.endsWith('.ts')) continue;

        const content = await fs.readFile(file, 'utf-8');

        for (let i = 0; i < dangerousPatterns.length; i++) {
          if (dangerousPatterns[i].test(content)) {
            errors.push({
              code: 'MALICIOUS_CODE',
              message: `Potentially dangerous pattern detected: ${patternNames[i]} in ${path.basename(file)}`,
              field: 'files',
              severity: 'error',
            });
          }
        }
      }
    } catch (error) {
      errors.push({
        code: 'SCAN_ERROR',
        message: `Failed to scan plugin files: ${error}`,
        field: 'files',
        severity: 'error',
      });
    }

    return errors;
  }

  /**
   * Validate plugin dependencies
   */
  async validateDependencies(
    dependencies: string[],
    installedPlugins: Map<string, PluginManifest>
  ): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];

    for (const dep of dependencies) {
      if (!installedPlugins.has(dep)) {
        errors.push({
          code: 'MISSING_DEPENDENCY',
          message: `Required plugin dependency not installed: ${dep}`,
          field: 'requires.dependencies',
          severity: 'error',
        });
      }
    }

    return errors;
  }

  /**
   * Validate plugin files structure
   */
  async validateFileStructure(pluginPath: string, manifest: PluginManifest): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];

    // Check if entry file exists
    const entryPath = path.join(pluginPath, manifest.entry);
    if (!(await fs.pathExists(entryPath))) {
      errors.push({
        code: 'MISSING_ENTRY',
        message: `Entry file not found: ${manifest.entry}`,
        field: 'entry',
        severity: 'error',
      });
    }

    // Check if manifest.json exists
    const manifestPath = path.join(pluginPath, 'manifest.json');
    if (!(await fs.pathExists(manifestPath))) {
      errors.push({
        code: 'MISSING_MANIFEST',
        message: 'manifest.json not found',
        field: 'manifest',
        severity: 'error',
      });
    }

    // Check assets directory if specified
    if (manifest.assets) {
      const assetsPath = path.join(pluginPath, manifest.assets);
      if (!(await fs.pathExists(assetsPath))) {
        errors.push({
          code: 'MISSING_ASSETS',
          message: `Assets directory not found: ${manifest.assets}`,
          field: 'assets',
          severity: 'error',
        });
      }
    }

    return errors;
  }

  /**
   * Get all files recursively
   */
  private async getAllFiles(dirPath: string, fileList: string[] = []): Promise<string[]> {
    const files = await fs.readdir(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = await fs.stat(filePath);

      if (stat.isDirectory()) {
        if (file !== 'node_modules' && file !== '.git') {
          await this.getAllFiles(filePath, fileList);
        }
      } else {
        fileList.push(filePath);
      }
    }

    return fileList;
  }

  /**
   * Get sandbox configuration based on plugin permissions
   */
  getSandboxConfig(manifest: PluginManifest): PluginSandboxConfig {
    const permissions = manifest.security?.permissions || [];

    return {
      allowFileSystem: permissions.includes('filesystem'),
      allowedPaths: permissions.includes('filesystem') ? [`/data/plugins/${manifest.name}`] : [],
      allowNetwork: permissions.includes('network'),
      allowedHosts: permissions.includes('network') ? ['*'] : [],
      allowDatabase: permissions.includes('database'),
      allowedTables: permissions.includes('database') ? [`plugin_${manifest.name}_*`] : [],
      memoryLimit: 512, // 512MB
      cpuLimit: 50, // 50%
      timeout: 30, // 30 seconds
    };
  }

  /**
   * Calculate plugin package checksum
   */
  async calculateChecksum(filePath: string): Promise<string> {
    const fileBuffer = await fs.readFile(filePath);
    const hash = crypto.createHash('sha256');
    hash.update(fileBuffer);
    return hash.digest('hex');
  }
}
