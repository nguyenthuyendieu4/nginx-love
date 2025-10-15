import { Router } from 'express';
import express from 'express';
import path from 'path';
import { pluginController } from './plugin.controller';
import { authenticate, authorize } from '../../middleware/auth';
import { uploadPlugin } from '../../middleware/upload';

const router = Router();

/**
 * Plugin Management Routes
 * All routes require authentication and admin/superadmin role
 */

// List installed plugins
router.get(
  '/',
  authenticate,
  authorize('admin', 'superadmin'),
  (req, res) => pluginController.listInstalledPlugins(req, res)
);

// Serve plugin static files (MUST be before /:id to avoid conflict)
// Route pattern: /api/plugins/:pluginName/static/*
router.use(
  '/:pluginName/static',
  (req, res, next) => {
    const pluginName = req.params.pluginName;
    const pluginDataPath = process.env.PLUGIN_DATA_PATH || '/data/plugins';
    const publicPath = path.join(pluginDataPath, 'installed', pluginName, 'public');
    
    // Serve static files from plugin's public folder
    express.static(publicPath)(req, res, next);
  }
);

// Check for updates (đặt trước /:id để tránh conflict)
router.get(
  '/check-updates',
  authenticate,
  authorize('admin', 'superadmin'),
  (req, res) => pluginController.checkUpdates(req, res)
);

// Install plugin from server path
router.post(
  '/install',
  authenticate,
  authorize('admin', 'superadmin'),
  (req, res) => pluginController.installFromPath(req, res)
);

// Install plugin from file upload
router.post(
  '/install-file',
  authenticate,
  authorize('admin', 'superadmin'),
  uploadPlugin.single('package'),
  (req, res) => pluginController.installFromFile(req, res)
);

// Get plugin details
router.get(
  '/:id',
  authenticate,
  authorize('admin', 'superadmin'),
  (req, res) => pluginController.getPluginDetails(req, res)
);

// Activate plugin
router.post(
  '/:id/activate',
  authenticate,
  authorize('admin', 'superadmin'),
  (req, res) => pluginController.activatePlugin(req, res)
);

// Deactivate plugin
router.post(
  '/:id/deactivate',
  authenticate,
  authorize('admin', 'superadmin'),
  (req, res) => pluginController.deactivatePlugin(req, res)
);

// Update plugin
router.post(
  '/:id/update',
  authenticate,
  authorize('admin', 'superadmin'),
  (req, res) => pluginController.updatePlugin(req, res)
);

// Uninstall plugin (chỉ superadmin)
router.delete(
  '/:id',
  authenticate,
  authorize('superadmin'),
  (req, res) => pluginController.uninstallPlugin(req, res)
);

// Get plugin logs
router.get(
  '/:id/logs',
  authenticate,
  authorize('admin', 'superadmin'),
  (req, res) => pluginController.getPluginLogs(req, res)
);

export default router;
