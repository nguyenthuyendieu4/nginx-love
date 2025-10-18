# Backup & Restore - User Guide

## Overview

The Backup & Restore feature provides essential data protection for your Nginx WAF Management Platform. Export your complete system configuration to a JSON file and restore it when needed, ensuring business continuity and disaster recovery capabilities.

### Key Features

- 📦 **Export Configuration**: Download complete system state as JSON file
- 📥 **Import Configuration**: Restore from previously exported backup files
- ⏰ **Scheduled Backups**: Automate backups using cron syntax
- 🔄 **Manual Backup**: Run backup on-demand anytime
- ✅ **Complete Restore**: All configurations restored automatically
- 🔄 **Nginx Auto-Reload**: System automatically reloads Nginx after restore

### What Gets Backed Up

When you export configuration, the system backs up **ALL** of the following:

| Component | What's Included | Importance |
|-----------|----------------|------------|
| **Domains** | Domain configurations, upstream servers, load balancer settings | ✅ Critical |
| **Nginx Vhost Files** | Virtual host configuration files in `/etc/nginx/sites-available/` | ✅ Critical |
| **SSL Certificates** | Certificate files (.crt), private keys (.key), and chain files | ✅ Critical |
| **ModSecurity Rules** | CRS (Core Rule Set) rules and custom security rules | ✅ High |
| **ACL Rules** | All access control list configurations | ✅ High |
| **Alert Settings** | Notification channels and alert rules | ✅ Medium |
| **Users** | User accounts with roles and permissions (passwords included) | ✅ High |
| **System Configurations** | Global nginx configurations | ✅ Medium |

**Important Notes**:
- ✅ Export creates a **complete snapshot** of your system
- ✅ All data is exported as a single JSON file
- ✅ Passwords are included (encrypted) - users can login immediately after restore
- ✅ SSL certificate files are included and will be restored to `/etc/nginx/ssl/`

---

## Getting Started

### Accessing Backup & Restore

1. Log in to the Nginx WAF Management Platform
2. Navigate to **Backup & Restore** from the sidebar menu
3. You will see the Backup & Restore dashboard

**Permission Required**: 
- **Admin** or **Moderator** can export configuration
- **Admin only** can import/restore configuration
- **Viewer** has no access to backup features

### Dashboard Overview

The Backup & Restore page displays three main sections:

#### 1. Export Configuration Card (Left)
- Download current system configuration
- Creates JSON backup file
- Includes all system data

#### 2. Import Configuration Card (Right)
- Upload and restore from backup file
- Replaces ALL existing data
- Only Admin can perform this action

#### 3. Scheduled Backups Table (Bottom)
- List of automated backup schedules
- View schedule details and status
- Run manual backups or delete schedules

---

## Exporting Configuration (Creating Backup)

### How to Export

**Permission Required**: Admin or Moderator

1. Click **"Export Configuration"** button in the Export Configuration card
2. System will:
   - Gather all configuration data from database
   - Include all domain configs, SSL certs, ModSec rules, ACL, alerts, users
   - Generate a JSON file
3. Browser automatically downloads the file
4. Filename format: `nginx-config-YYYY-MM-DDTHH-MM-SS.json`
5. Success notification appears

**Example filename**: `nginx-config-2025-01-18T14-30-45.json`

### What's Included in Export

The exported JSON file contains:

```json
{
  "timestamp": "2025-01-18T14:30:45.123Z",
  "version": "1.0",
  "data": {
    "domains": [...],           // All domain configurations
    "upstreams": [...],          // Upstream server configurations
    "loadBalancers": [...],      // Load balancer settings
    "vhostConfigs": [...],       // Nginx vhost files content
    "ssl": [...],                // SSL certificate records
    "sslFiles": [...],           // SSL certificate file contents
    "modsecCRS": [...],          // ModSecurity CRS rules
    "modsecCustom": [...],       // Custom ModSecurity rules
    "acl": [...],                // ACL access rules
    "alertChannels": [...],      // Notification channels
    "alertRules": [...],         // Alert rules
    "users": [...],              // User accounts (with passwords)
    "nginxConfigs": [...]        // Global nginx configurations
  }
}
```

### Export Use Cases

**When to Export**:
- ✅ Before major system changes or updates
- ✅ Before applying new security rules
- ✅ Before adding/removing domains
- ✅ Regular backups (weekly, monthly)
- ✅ Before migrating to new server
- ✅ Compliance and audit requirements

**Best Practices**:
- ✅ Export regularly (at least weekly)
- ✅ Store backups in secure, off-site location
- ✅ Keep multiple backup versions (don't overwrite old backups)
- ✅ Test restore process periodically
- ✅ Label backup files with meaningful names
- ✅ Encrypt backup files when storing externally

### Where to Store Backups

**Recommended Storage Locations**:
- ✅ External hard drive or NAS
- ✅ Cloud storage (Google Drive, Dropbox, S3)
- ✅ Company file server
- ✅ Version control system (Git - for configuration tracking)
- ⚠️ **Not recommended**: Same server as the application

---

## Importing Configuration (Restoring Backup)

### ⚠️ CRITICAL WARNING

**Importing a backup will COMPLETELY REPLACE ALL existing data on the server.**

This action is **IRREVERSIBLE** without a prior backup. 

**What will be REPLACED**:
- ❌ All domain configurations
- ❌ Load balancer settings
- ❌ SSL certificates & files
- ❌ ModSecurity rules
- ❌ ACL access rules
- ❌ Alert configurations
- ❌ User accounts
- ❌ Nginx vhost files

**Permission Required**: Admin only

### Before You Import

**CRITICAL - Do This First**:
1. ✅ **Export your current configuration** as a safety backup
2. ✅ Verify the backup file is from a trusted source
3. ✅ Check the backup file is not corrupted
4. ✅ Notify other administrators about the restore
5. ✅ Confirm you have the correct backup file

### Step-by-Step Import Process

#### Step 1: Initiate Import

1. Click **"Import Configuration"** button in the Import Configuration card
2. Warning dialog opens with critical information

#### Step 2: Read the Warnings

The warning dialog shows:

**CRITICAL WARNING - ALL DATA WILL BE REPLACED**
- Importing will **COMPLETELY REPLACE** all configurations
- Action is **IRREVERSIBLE** without prior backup
- Lists all components that will be replaced

**What will be replaced**:
- All domain configurations
- Load balancer settings
- SSL certificates & files
- ModSecurity rules
- ACL access rules
- Alert configurations
- User accounts
- Nginx vhost files

**Before you proceed checklist**:
- Export your current configuration as safety backup
- Ensure backup file is from trusted source
- Verify backup file is not corrupted
- Notify other administrators

#### Step 3: Select Backup File

Two ways to select file:

**Option 1: Click to Browse**
1. Click anywhere in the file upload zone
2. File browser opens
3. Select `.json` backup file
4. Click "Open"

**Option 2: Drag & Drop**
1. Drag backup file from your computer
2. Drop it onto the upload zone
3. File will be automatically selected

**File Requirements**:
- ✅ Must be `.json` file
- ✅ Maximum file size: 50MB
- ✅ Must be valid backup format

#### Step 4: Confirm Restore

After selecting file, confirmation dialog appears:

**⚠️ Confirm Configuration Restore**

Shows:
- **CRITICAL WARNING**: Data replacement notice
- **Detailed list** of what will be replaced
- **After Restore** information:
  - Nginx will be automatically reloaded
  - Domains immediately accessible
  - SSL certificates active
  - Users can login with original passwords

**Action Buttons**:
- **Cancel - Keep Current Data**: Abort restore
- **Confirm - Restore Backup**: Proceed with restore

#### Step 5: Restoration Process

1. Click **"Confirm - Restore Backup"**
2. Button shows "Restoring..." with spinner
3. System performs:
   - Parse JSON file
   - Validate backup format
   - Delete existing data
   - Import domains and upstreams
   - Write nginx vhost files to disk
   - Restore SSL certificate files
   - Import ModSecurity rules
   - Import ACL rules
   - Restore alert settings
   - Create user accounts
   - Test nginx configuration
   - Reload nginx service
4. Progress takes 10-60 seconds depending on data size

#### Step 6: Completion

**Success notification shows**:
```
✅ Restore successful!

Restored: 
- 15 domains
- 20 vhost configs
- 30 upstreams
- 5 LB configs
- 15 SSL certs (45 files)
- 250 ModSec rules
- 10 ACL rules
- 3 channels
- 8 alerts
- 5 users
- 2 configs

Nginx has been reloaded.
```

**If restore fails**:
```
❌ Restore failed

Failed to restore configuration. 
Please check the file format.
```

### After Restore

**Immediate Effects**:
- ✅ All configurations are active
- ✅ Nginx is running with restored config
- ✅ Domains are accessible
- ✅ SSL certificates are working
- ✅ Users can login with their passwords from backup
- ✅ ModSecurity rules are enforced
- ✅ ACL rules are active

**Verification Steps**:
1. Check domain list - verify all domains restored
2. Test domain access - visit domains in browser
3. Check SSL certificates - verify HTTPS working
4. Check ModSecurity rules - confirm rules active
5. Test user login - confirm users can authenticate
6. Review ACL rules - verify access controls active

**If Issues Occur**:
1. Check nginx status: `systemctl status nginx`
2. Check nginx error logs: `/var/log/nginx/error.log`
3. Verify file permissions in `/etc/nginx/`
4. Try reloading nginx manually: `nginx -s reload`
5. Restore from your safety backup if needed

---

## Scheduled Backups (Automated)

### Overview

Scheduled backups automate the export process using cron syntax. The system runs backups at specified times automatically.

**Permission Required**: Admin or Moderator

### Creating a Backup Schedule

#### Step 1: Open Schedule Dialog

1. In the "Scheduled Backups" section
2. Click **"Add Schedule"** button
3. "Create Backup Schedule" dialog opens

#### Step 2: Configure Schedule

Fill in the following fields:

##### 1. Backup Name
- **Field Type**: Text input
- **Placeholder**: `e.g., Daily Full Backup`
- **Purpose**: Descriptive name for this schedule
- **Examples**:
  - `Daily Full Backup`
  - `Weekly Sunday Backup`
  - `Monthly End of Month`
  - `Hourly Backup`

##### 2. Cron Schedule
- **Field Type**: Text input (cron syntax)
- **Placeholder**: `0 2 * * *`
- **Format**: Standard cron format (minute hour day month weekday)
- **Examples**:
  - `0 2 * * *` - Daily at 2:00 AM
  - `0 */6 * * *` - Every 6 hours
  - `0 0 * * 0` - Weekly on Sunday at midnight
  - `0 3 1 * *` - Monthly on 1st day at 3:00 AM
  - `*/30 * * * *` - Every 30 minutes

**Cron Syntax Explanation**:
```
* * * * *
│ │ │ │ │
│ │ │ │ └─── Day of week (0-7) (Sunday=0 or 7)
│ │ │ └───── Month (1-12)
│ │ └─────── Day of month (1-31)
│ └───────── Hour (0-23)
└─────────── Minute (0-59)
```

**Common Patterns**:
- `0 2 * * *` - Daily at 2 AM
- `0 */4 * * *` - Every 4 hours
- `0 0 * * 0` - Weekly (Sunday midnight)
- `0 3 1 * *` - Monthly (1st of month, 3 AM)
- `0 2 * * 1-5` - Weekdays only (Mon-Fri) at 2 AM

##### 3. Enable Schedule
- **Field Type**: Toggle switch
- **Default**: ON (enabled)
- **Purpose**: Enable or disable this schedule
- **Note**: Can be toggled later from the schedule list

#### Step 3: Create Schedule

1. Click **"Create Schedule"** button
2. System validates inputs
3. Schedule is created and added to list
4. Success notification appears
5. Dialog closes

### Viewing Backup Schedules

The Scheduled Backups table shows:

| Column | Description |
|--------|-------------|
| **Name** | Schedule name |
| **Schedule** | Cron expression (e.g., `0 2 * * *`) |
| **Last Run** | Date/time of last execution (or `-` if never run) |
| **Next Run** | Date/time of next scheduled execution |
| **Status** | Current status badge (success, failed, running, pending) |
| **Size** | Size of last backup file (or `-` if no backup yet) |
| **Enabled** | Toggle switch to enable/disable schedule |
| **Actions** | Run Now (▶) and Delete (🗑️) buttons |

**Status Badge Colors**:
- **Success** (Default/Green): Last backup completed successfully
- **Failed** (Red/Destructive): Last backup failed
- **Running** (Gray/Secondary): Backup currently in progress
- **Pending** (Gray/Secondary): Waiting to run

### Managing Backup Schedules

#### Running Backup Manually

**Purpose**: Execute backup immediately without waiting for schedule

1. Find schedule in table
2. Click **Run Now** button (▶ play icon)
3. Toast notification: "Backup started - Manual backup is running..."
4. System performs backup
5. Success notification shows:
   - "Backup completed"
   - Filename and size
6. Table updates with new status and size

**Example Success Message**:
```
Backup completed
Backup file created: backup-2025-01-18-143045.json (2.5 MB)
```

#### Enabling/Disabling Schedule

**Purpose**: Temporarily stop or resume automatic backups

1. Find schedule in table
2. Click the **Enabled** toggle switch
3. Schedule is enabled/disabled immediately
4. Success notification: "Backup schedule updated"
5. When disabled:
   - Backup will not run automatically
   - Can still run manually
   - Can re-enable anytime

#### Deleting Backup Schedule

**Purpose**: Permanently remove backup schedule

⚠️ **Warning**: This deletes the schedule only. Existing backup files are not deleted.

1. Find schedule in table
2. Click **Delete** button (🗑️ trash icon)
3. Confirmation dialog appears:
   - **Title**: "Delete Backup Schedule"
   - **Message**: "Are you sure you want to delete this backup schedule? This action cannot be undone."
4. Click **Delete** to confirm (or "Cancel" to abort)
5. Schedule is removed from table
6. Success notification: "Backup schedule deleted"

---

## Backup Information & Best Practices

### What Gets Backed Up?

**Complete System State**:
- ✅ All domain configurations, upstreams, load balancers
- ✅ SSL certificates with private keys and files
- ✅ ModSecurity rules (CRS and custom)
- ✅ ACL rules (access control)
- ✅ Alert settings (channels and rules)
- ✅ User accounts with roles and permissions
- ✅ System preferences

### Restore Process

**How Restore Works**:
- Import merges configurations
- Existing items with same ID are updated
- New items are created
- Missing items from backup are not deleted (data is merged, not wiped)
- Nginx is automatically reloaded

**Data Integrity**:
- Backup includes checksums for validation
- System verifies data before import
- Nginx config tested before reload

### Best Practices

#### Backup Strategy

**Frequency**:
- 📅 **Daily**: For production systems with frequent changes
- 📅 **Weekly**: For stable systems with minimal changes
- 📅 **Before Changes**: Always before major updates or configuration changes
- 📅 **Monthly**: Long-term archival backups

**Retention**:
- Keep last 7 daily backups
- Keep last 4 weekly backups
- Keep last 12 monthly backups
- Delete older backups to save space

**Storage**:
- ✅ Store in multiple locations (3-2-1 rule)
- ✅ 3 copies: Original + 2 backups
- ✅ 2 different media types
- ✅ 1 off-site location

#### Testing Restore

**Regular Testing**:
- Test restore procedure quarterly
- Use test environment (not production)
- Verify all components restore correctly
- Document restore time

**Test Environment**:
1. Set up separate test server
2. Restore backup to test server
3. Verify domains, SSL, rules work correctly
4. Time the restoration process
5. Document any issues

#### Security

**Protect Backup Files**:
- 🔐 Store in secure location
- 🔐 Encrypt if storing externally
- 🔐 Restrict file access (chmod 600)
- 🔐 Use secure transfer methods (SFTP, SCP)
- 🔐 Don't share via email or public links

**Sensitive Data**:
- ⚠️ Backups include user passwords (encrypted)
- ⚠️ SSL private keys included
- ⚠️ Treat backup files as highly sensitive
- ⚠️ Follow company data protection policies

---

## Troubleshooting

### Issue 1: Export Failed

**Symptoms**: Export button doesn't work or shows error

**Possible Causes**:
1. Insufficient permissions (Viewer role)
2. Database connection error
3. Large dataset causing timeout

**Solutions**:
- ✅ Verify you have Admin or Moderator role
- ✅ Check database is running: `systemctl status postgresql`
- ✅ Check browser console for errors (F12)
- ✅ Try again after a few minutes

---

### Issue 2: Cannot Import Backup

**Symptoms**: Import fails with error message

**Possible Causes**:
1. Not Admin role (only Admin can import)
2. Invalid JSON file format
3. Corrupted backup file
4. Wrong file type (not .json)

**Solutions**:

**Check Permissions**:
- Must be Admin role
- Moderator cannot import (only export)

**Validate Backup File**:
```bash
# Check if valid JSON
cat backup-file.json | jq . > /dev/null && echo "Valid JSON" || echo "Invalid JSON"

# Check file size
ls -lh backup-file.json
```

**Try Different File**:
- Use a different backup file
- Export new backup and test import immediately

---

### Issue 3: Restore Partially Failed

**Symptoms**: Some items restored, others failed

**Possible Causes**:
1. Disk space full (SSL files)
2. Permission issues on `/etc/nginx/`
3. Invalid data in backup

**Solutions**:

**Check Disk Space**:
```bash
df -h
# Ensure sufficient space on root partition
```

**Check Nginx Directory Permissions**:
```bash
ls -la /etc/nginx/
ls -la /etc/nginx/sites-available/
ls -la /etc/nginx/ssl/

# Fix if needed
sudo chown -R www-data:www-data /etc/nginx/
sudo chmod -R 755 /etc/nginx/
```

**Verify Nginx Configuration**:
```bash
sudo nginx -t
# Should show "syntax is ok" and "test is successful"

# If errors, check logs
sudo tail -f /var/log/nginx/error.log
```

---

### Issue 4: Backup Schedule Not Running

**Symptoms**: Scheduled backup doesn't execute at scheduled time

**Possible Causes**:
1. Schedule disabled
2. Cron service not running
3. Invalid cron syntax

**Solutions**:

**Check Schedule Status**:
- Verify "Enabled" toggle is ON
- Check cron syntax is valid
- Review "Next Run" time

**Check Cron Service**:
```bash
systemctl status cron
# or
systemctl status crond

# Start if not running
sudo systemctl start cron
```

**Validate Cron Syntax**:
Use online cron validator: https://crontab.guru/

**Check Application Logs**:
```bash
# Check application logs for backup scheduler
sudo journalctl -u nginx-waf-api -f | grep backup
```

---

### Issue 5: Backup File Too Large

**Symptoms**: Export creates very large backup file (>50MB)

**Possible Causes**:
1. Many domains with large configurations
2. Many SSL certificates
3. Large ModSecurity rulesets
4. Many users and ACL rules

**Solutions**:

**Compress Backup File**:
```bash
# Compress with gzip
gzip nginx-config-2025-01-18.json
# Creates nginx-config-2025-01-18.json.gz (much smaller)

# Decompress before import
gunzip nginx-config-2025-01-18.json.gz
```

**Clean Up Old Data**:
- Delete unused domains
- Remove expired SSL certificates
- Clean up old ModSecurity rules
- Remove inactive users

---

## Related Documentation

- [User Management](./User_Management.md) - Manage user accounts
- [Domain Management](./domains.md) - Domain and site configuration
- [SSL Certificates](./ssl.md) - SSL/TLS management
- [ModSecurity](./modsecurity.md) - Web application firewall
- [ACL](./Access_Control_List.md) - Access control policies

---

## Quick Reference

### Export Configuration

**Steps**:
1. Click "Export Configuration" button
2. File downloads automatically
3. Save file securely

**File Format**: `nginx-config-YYYY-MM-DDTHH-MM-SS.json`

**Permission**: Admin or Moderator

---

### Import Configuration

**Steps**:
1. Export current config (safety backup)
2. Click "Import Configuration" button
3. Read warnings carefully
4. Select backup file (.json)
5. Confirm restore
6. Wait for completion

**Permission**: Admin only

**⚠️ WARNING**: Replaces ALL existing data

---

### Backup Schedule

**Create**:
- Click "Add Schedule"
- Enter name, cron schedule
- Enable/disable
- Click "Create Schedule"

**Manage**:
- **Run Now**: ▶ button - Execute immediately
- **Toggle**: Switch - Enable/disable
- **Delete**: 🗑️ button - Remove schedule

**Permission**: Admin or Moderator (create, run, delete)

---

### Cron Examples

| Schedule | Cron Expression | Description |
|----------|----------------|-------------|
| Daily 2 AM | `0 2 * * *` | Every day at 2:00 AM |
| Every 6 hours | `0 */6 * * *` | At 00:00, 06:00, 12:00, 18:00 |
| Weekly Sunday | `0 0 * * 0` | Sunday at midnight |
| Monthly | `0 3 1 * *` | 1st day of month at 3:00 AM |
| Weekdays only | `0 2 * * 1-5` | Mon-Fri at 2:00 AM |
| Every 30 min | `*/30 * * * *` | Every 30 minutes |
| Hourly | `0 * * * *` | Every hour at minute 0 |

---

## Support

If you encounter issues:

1. **Check Permissions**: Verify your role (Admin/Moderator)
2. **Review Logs**: Check application and nginx logs
3. **Validate File**: Ensure backup file is valid JSON
4. **Test Environment**: Try restore in test environment first
5. **Contact Admin**: Reach out to system administrator
6. **Technical Support**: Contact support with:
   - Error message or screenshot
   - Backup file size
   - Your username and role
   - Browser and OS version

---

**Last Updated**: January 18, 2025  
**Documentation Version**: 2.0.0  
**System Version**: Based on actual implementation
