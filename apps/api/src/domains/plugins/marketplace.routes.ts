import { Router } from 'express';
import { pluginController } from './plugin.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

/**
 * Plugin Marketplace Routes
 * All routes require authentication
 */

// List marketplace plugins
router.get(
  '/',
  authenticate,
  (req, res) => pluginController.listMarketplacePlugins(req, res)
);

// Get featured plugins
router.get(
  '/featured',
  authenticate,
  (req, res) => pluginController.getFeaturedPlugins(req, res)
);

// Get categories
router.get(
  '/categories',
  authenticate,
  (req, res) => pluginController.getCategories(req, res)
);

// Search marketplace
router.get(
  '/search',
  authenticate,
  (req, res) => pluginController.searchMarketplace(req, res)
);

// Check marketplace health
router.get(
  '/health',
  authenticate,
  (req, res) => pluginController.checkMarketplaceHealth(req, res)
);

// Get marketplace plugin details
router.get(
  '/:id',
  authenticate,
  (req, res) => pluginController.getMarketplacePluginDetails(req, res)
);

// Install plugin from marketplace
router.post(
  '/:id/install',
  authenticate,
  authorize('admin', 'superadmin'),
  (req, res) => pluginController.installFromMarketplace(req, res)
);

// Submit rating
router.post(
  '/:id/rating',
  authenticate,
  (req, res) => pluginController.submitRating(req, res)
);

export default router;
