/**
 * Cloudflare DNS Manager Plugin
 * Manages DNS records for domains via Cloudflare API
 */

const axios = require('axios');

// Plugin state
let cloudflareApiKey = null;
let cloudflareEmail = null;
let isActivated = false;

/**
 * Initialize the plugin
 */
async function init(context) {
  const { logger, storage, http, events } = context;
  
  logger.info('Cloudflare DNS Manager Plugin initializing...');
  
  // Load saved settings
  const settings = await storage.get('cloudflare_settings');
  if (settings) {
    cloudflareApiKey = settings.apiKey;
    cloudflareEmail = settings.email;
  }
  
  logger.info('Cloudflare DNS Manager Plugin initialized successfully');
  
  return {
    // Route handlers
    getZones,
    getDNSRecords,
    createDNSRecord,
    updateDNSRecord,
    deleteDNSRecord,
    getSettings,
    saveSettings,
    
    // Hook handlers
    onActivate,
    onDeactivate,
  };
}

/**
 * Create Cloudflare API client
 */
function createCloudflareClient() {
  if (!cloudflareApiKey || !cloudflareEmail) {
    throw new Error('Cloudflare API credentials not configured');
  }
  
  return axios.create({
    baseURL: 'https://api.cloudflare.com/client/v4',
    headers: {
      'X-Auth-Email': cloudflareEmail,
      'X-Auth-Key': cloudflareApiKey,
      'Content-Type': 'application/json',
    },
  });
}

/**
 * GET /api/plugins/cloudflare/zones
 * Get all Cloudflare zones (domains)
 */
async function getZones(req, res, context) {
  const { logger } = context;
  
  try {
    const client = createCloudflareClient();
    
    const response = await client.get('/zones', {
      params: {
        per_page: 50,
        page: req.query.page || 1,
      },
    });
    
    logger.info(`Retrieved ${response.data.result.length} Cloudflare zones`);
    
    res.json({
      success: true,
      zones: response.data.result.map(zone => ({
        id: zone.id,
        name: zone.name,
        status: zone.status,
        nameServers: zone.name_servers,
        createdOn: zone.created_on,
        modifiedOn: zone.modified_on,
      })),
      pagination: response.data.result_info,
    });
  } catch (error) {
    logger.error('Failed to get Cloudflare zones', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.response?.data?.errors?.[0]?.message || error.message,
    });
  }
}

/**
 * GET /api/plugins/cloudflare/zones/:zoneId/records
 * Get DNS records for a zone
 */
async function getDNSRecords(req, res, context) {
  const { logger } = context;
  const { zoneId } = req.params;
  
  try {
    const client = createCloudflareClient();
    
    const response = await client.get(`/zones/${zoneId}/dns_records`, {
      params: {
        per_page: 100,
        page: req.query.page || 1,
        type: req.query.type,
        name: req.query.name,
      },
    });
    
    logger.info(`Retrieved ${response.data.result.length} DNS records for zone ${zoneId}`);
    
    res.json({
      success: true,
      records: response.data.result.map(record => ({
        id: record.id,
        type: record.type,
        name: record.name,
        content: record.content,
        ttl: record.ttl,
        proxied: record.proxied,
        priority: record.priority,
        createdOn: record.created_on,
        modifiedOn: record.modified_on,
      })),
      pagination: response.data.result_info,
    });
  } catch (error) {
    logger.error('Failed to get DNS records', { error: error.message, zoneId });
    res.status(500).json({
      success: false,
      error: error.response?.data?.errors?.[0]?.message || error.message,
    });
  }
}

/**
 * POST /api/plugins/cloudflare/zones/:zoneId/records
 * Create a new DNS record
 */
async function createDNSRecord(req, res, context) {
  const { logger } = context;
  const { zoneId } = req.params;
  const { type, name, content, ttl, proxied, priority } = req.body;
  
  try {
    // Validate required fields
    if (!type || !name || !content) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: type, name, content',
      });
    }
    
    const client = createCloudflareClient();
    
    const recordData = {
      type,
      name,
      content,
      ttl: ttl || 1, // 1 = automatic
      proxied: proxied !== undefined ? proxied : false,
    };
    
    // Add priority for MX records
    if (type === 'MX' && priority) {
      recordData.priority = priority;
    }
    
    const response = await client.post(`/zones/${zoneId}/dns_records`, recordData);
    
    logger.info('DNS record created successfully', { 
      zoneId, 
      type, 
      name,
      recordId: response.data.result.id,
    });
    
    res.status(201).json({
      success: true,
      message: 'DNS record created successfully',
      record: {
        id: response.data.result.id,
        type: response.data.result.type,
        name: response.data.result.name,
        content: response.data.result.content,
        ttl: response.data.result.ttl,
        proxied: response.data.result.proxied,
        createdOn: response.data.result.created_on,
      },
    });
  } catch (error) {
    logger.error('Failed to create DNS record', { 
      error: error.message, 
      zoneId,
      requestBody: req.body,
    });
    res.status(500).json({
      success: false,
      error: error.response?.data?.errors?.[0]?.message || error.message,
    });
  }
}

/**
 * PUT /api/plugins/cloudflare/zones/:zoneId/records/:recordId
 * Update a DNS record
 */
async function updateDNSRecord(req, res, context) {
  const { logger } = context;
  const { zoneId, recordId } = req.params;
  const { type, name, content, ttl, proxied, priority } = req.body;
  
  try {
    const client = createCloudflareClient();
    
    const recordData = {
      type,
      name,
      content,
      ttl: ttl || 1,
      proxied: proxied !== undefined ? proxied : false,
    };
    
    if (type === 'MX' && priority) {
      recordData.priority = priority;
    }
    
    const response = await client.put(`/zones/${zoneId}/dns_records/${recordId}`, recordData);
    
    logger.info('DNS record updated successfully', { 
      zoneId, 
      recordId,
      type, 
      name,
    });
    
    res.json({
      success: true,
      message: 'DNS record updated successfully',
      record: {
        id: response.data.result.id,
        type: response.data.result.type,
        name: response.data.result.name,
        content: response.data.result.content,
        ttl: response.data.result.ttl,
        proxied: response.data.result.proxied,
        modifiedOn: response.data.result.modified_on,
      },
    });
  } catch (error) {
    logger.error('Failed to update DNS record', { 
      error: error.message, 
      zoneId,
      recordId,
    });
    res.status(500).json({
      success: false,
      error: error.response?.data?.errors?.[0]?.message || error.message,
    });
  }
}

/**
 * DELETE /api/plugins/cloudflare/zones/:zoneId/records/:recordId
 * Delete a DNS record
 */
async function deleteDNSRecord(req, res, context) {
  const { logger } = context;
  const { zoneId, recordId } = req.params;
  
  try {
    const client = createCloudflareClient();
    
    await client.delete(`/zones/${zoneId}/dns_records/${recordId}`);
    
    logger.info('DNS record deleted successfully', { zoneId, recordId });
    
    res.json({
      success: true,
      message: 'DNS record deleted successfully',
    });
  } catch (error) {
    logger.error('Failed to delete DNS record', { 
      error: error.message, 
      zoneId,
      recordId,
    });
    res.status(500).json({
      success: false,
      error: error.response?.data?.errors?.[0]?.message || error.message,
    });
  }
}

/**
 * GET /api/plugins/cloudflare/settings
 * Get plugin settings (without sensitive data)
 */
async function getSettings(req, res, context) {
  const { storage } = context;
  
  try {
    const settings = await storage.get('cloudflare_settings');
    
    res.json({
      success: true,
      settings: {
        configured: !!(settings?.apiKey && settings?.email),
        email: settings?.email || null,
        // Don't expose API key
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * POST /api/plugins/cloudflare/settings
 * Save plugin settings
 */
async function saveSettings(req, res, context) {
  const { logger, storage } = context;
  const { apiKey, email } = req.body;
  
  try {
    if (!apiKey || !email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: apiKey, email',
      });
    }
    
    // Validate credentials by testing API
    const testClient = axios.create({
      baseURL: 'https://api.cloudflare.com/client/v4',
      headers: {
        'X-Auth-Email': email,
        'X-Auth-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });
    
    // Test the credentials
    await testClient.get('/user/tokens/verify');
    
    // Save settings
    await storage.set('cloudflare_settings', { apiKey, email });
    
    // Update plugin state
    cloudflareApiKey = apiKey;
    cloudflareEmail = email;
    
    logger.info('Cloudflare API credentials saved and validated');
    
    res.json({
      success: true,
      message: 'Settings saved successfully',
    });
  } catch (error) {
    logger.error('Failed to save settings', { error: error.message });
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Cloudflare API credentials',
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Hook: Plugin activated
 */
async function onActivate(context) {
  const { logger } = context;
  logger.info('Cloudflare DNS Manager Plugin activated');
  isActivated = true;
}

/**
 * Hook: Plugin deactivated
 */
async function onDeactivate(context) {
  const { logger } = context;
  logger.info('Cloudflare DNS Manager Plugin deactivated');
  isActivated = false;
}

module.exports = {
  init,
};
