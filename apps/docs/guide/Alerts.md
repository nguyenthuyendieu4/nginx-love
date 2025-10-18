# Alerts & Notifications - User Guide

## Overview

The Alerts & Notifications system provides real-time monitoring and alerting for critical system events. Configure notification channels (Email, Telegram) and define alert rules to receive notifications when specific conditions are met.

### Key Features

- ✅ **Notification Channels**: Configure Email and Telegram delivery channels
- ✅ **Alert Rules**: Define conditions and thresholds for 5 alert types
- ✅ **Real-Time Monitoring**: Continuous system health monitoring
- ✅ **Flexible Severity Levels**: Info, Warning, Critical severity classification
- ✅ **Test Notifications**: Verify channel configuration before use
- ✅ **Multiple Channels**: Send alerts to multiple channels simultaneously
- ✅ **Configurable Intervals**: Customize check frequency per alert rule
- ✅ **Enable/Disable Controls**: Toggle channels and rules without deletion

### Alert Types Supported

| Alert Type | Monitors | Trigger Condition |
|------------|----------|-------------------|
| **CPU Usage** | System CPU percentage | CPU usage > threshold |
| **Memory Usage** | System RAM percentage | Memory usage > threshold |
| **Disk Usage** | Disk space percentage | Disk usage > threshold |
| **Upstream Health** | Backend server status | Any upstream/backend is down |
| **SSL Certificate** | Certificate expiry | Certificate expires within N days |

### How It Works

```
┌─────────────────────────────┐
│   System Monitoring         │
│  - CPU, Memory, Disk        │
│  - Upstream Health Checks   │
│  - SSL Certificate Expiry   │
└─────────────────────────────┘
              ↓
┌─────────────────────────────┐
│   Alert Rules Evaluation    │
│  - Check conditions         │
│  - Compare against threshold│
│  - Determine severity       │
└─────────────────────────────┘
              ↓
┌─────────────────────────────┐
│   Notification Delivery     │
│  - Send via configured      │
│    channels (Email/Telegram)│
│  - Log alert history        │
└─────────────────────────────┘
```

---

## Getting Started

### Accessing Alerts & Notifications

1. Log in to the Nginx WAF Management Platform
2. Click **Alerts** in the sidebar navigation
3. You will see the Alerts & Notifications page with 2 tabs

**Permission Required**:
- **Admin** and **Moderator**: Can create, update, and delete channels and rules
- **Viewer**: Read-only access (view channels and rules only)

### Dashboard Overview

The Alerts page has two main tabs:

#### Tab 1: Notification Channels

Configure delivery channels for alert notifications.

**Features**:
- Create Email and Telegram channels
- Test channel configuration
- Enable/disable channels
- Delete channels

#### Tab 2: Alert Rules

Define monitoring rules and conditions.

**Features**:
- Create rules for 5 alert types
- Set thresholds and severity
- Select notification channels
- Configure check intervals
- Enable/disable rules

---

## Notification Channels

Configure where alerts will be sent.

### Tab: Notification Channels

Click **"Notification Channels"** tab to manage delivery channels.

#### Channel Table

Displays all notification channels with columns:

| Column | Description |
|--------|-------------|
| **Name** | Channel name (e.g., "Admin Email", "Telegram Ops") |
| **Type** | Badge with icon: Email (envelope) or Telegram (message) |
| **Configuration** | Email address or Telegram Chat ID (monospace font) |
| **Status** | Toggle switch: ON (enabled) / OFF (disabled) |
| **Actions** | Test button (Send icon), Delete button (Trash icon) |

**Empty State**: When no channels exist, table shows "No channels configured"

---

## Creating a Notification Channel

**Permission Required**: Admin or Moderator

### Step 1: Open Add Channel Dialog

1. Click **"Add Channel"** button (top-right, Plus icon)
2. Dialog opens with title "Add Notification Channel"
3. Description: "Configure a new notification channel"

### Step 2: Configure Channel

#### 1. Channel Name (Required)

**Field**: Text input  
**Label**: "Channel Name"  
**Placeholder**: `e.g., Admin Email`  
**Required**: Yes

**Purpose**: Friendly name to identify this channel

**Valid Examples**:
```
Admin Email
Telegram Ops Team
Critical Alerts
DevOps Notifications
Security Team
```

#### 2. Type (Required)

**Field**: Dropdown select  
**Label**: "Type"  
**Options**:
- **Email**: Send notifications via email
- **Telegram**: Send notifications via Telegram bot

**Default**: Email

**Behavior**: Changing type shows different configuration fields

---

### Email Channel Configuration

When Type = "Email", the following field appears:

#### Email Address (Required)

**Field**: Text input (email type)  
**Label**: "Email Address"  
**Placeholder**: `admin@example.com`  
**Required**: Yes (when Type = Email)  
**Validation**: Must be valid email format

**Valid Examples**:
```
admin@example.com
alerts@company.com
ops-team@example.com
security@company.com
```

**Invalid Examples**:
```
admin               # Missing @domain
@example.com        # Missing username
admin@              # Missing domain
admin example.com   # Missing @
```

---

### Telegram Channel Configuration

When Type = "Telegram", the following fields appear:

#### Chat ID (Required)

**Field**: Text input  
**Label**: "Chat ID"  
**Placeholder**: `-1001234567890`  
**Required**: Yes (when Type = Telegram)  
**Format**: Numeric, can be negative for groups/channels

**What is Chat ID**:
- Unique identifier for Telegram chat/group/channel
- Usually starts with `-100` for groups and channels
- Can be obtained from bot commands or services

**Valid Examples**:
```
-1001234567890      # Group/Channel ID
123456789           # Private chat ID
-100987654321       # Another channel
```

**How to get Chat ID**:
1. Add your bot to the group/channel
2. Send a message to the bot
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Look for `"chat":{"id":-1001234567890}`

#### Bot Token (Required)

**Field**: Text input (password type - hidden)  
**Label**: "Bot Token"  
**Placeholder**: `1234567890:ABCdefGHI...`  
**Required**: Yes (when Type = Telegram)  
**Format**: `<bot_id>:<token>` (usually 45+ characters)

**What is Bot Token**:
- Authentication token for Telegram bot
- Obtained from @BotFather when creating bot
- Keep secret - never share publicly

**Valid Format**:
```
1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ123456789
```

**How to create Telegram Bot**:
1. Message @BotFather on Telegram
2. Send `/newbot` command
3. Follow instructions (name and username)
4. Receive bot token
5. Add bot to your group/channel
6. Make bot admin (to send messages)

**Important**:
- Bot must be admin in the channel/group
- Bot must have permission to send messages
- Token is hidden after creation (password field)

---

### Step 3: Enable Channel

#### Enable channel

**Field**: Toggle switch  
**Label**: "Enable channel"  
**Default**: ON (enabled)

**When ON**:
- ✅ Channel is active and can receive notifications
- ✅ Can be selected in Alert Rules

**When OFF**:
- ❌ Channel is disabled and won't receive notifications
- ❌ Not available in Alert Rule channel selection

**Use Cases**:
- Temporarily disable notifications without deleting channel
- Keep configuration but pause alerts
- Re-enable later without re-entering credentials

---

### Step 4: Add Channel

1. Review all configuration
2. Click **"Add Channel"** button (bottom-right)
3. System validates inputs
4. If valid:
   - Button shows "Adding..." with spinner (disabled)
   - Channel created in database
   - Success toast: "Notification channel added successfully"
   - Dialog closes
   - Channel appears in table
5. If validation fails:
   - Error toast with specific message
   - Dialog remains open
   - Fix errors and try again

**Validation Checks**:
- ✅ Channel name is required
- ✅ Type is required
- ✅ Email is required and valid (if Email type)
- ✅ Chat ID and Bot Token are required (if Telegram type)

**Common Errors**:
- "Name, type, and config are required"
- "Email is required for email channel"
- "Chat ID and Bot Token are required for Telegram channel"
- "Valid email is required" (invalid email format)

---

## Testing Notification Channels

**Permission Required**: Admin or Moderator

Before using a channel in alert rules, test it to verify configuration.

### How to Test a Channel

1. Find channel in table
2. Click **Test** button (Send icon) in Actions column
3. System sends test notification
4. Wait for confirmation toast

### Test Notification Behavior

**For Email Channels**:
- Test email sent to configured email address
- Subject: "Test Notification from Nginx WAF Platform"
- Body: "This is a test notification. Your email channel is working correctly."
- Check spam folder if not received

**For Telegram Channels**:
- Test message sent to configured Chat ID
- Message: "🔔 Test Notification\n\nThis is a test notification from Nginx WAF Management Platform.\n\nYour Telegram channel is working correctly."
- Message appears in chat/group/channel

### Test Results

**Success**:
- Toast: "Test notification sent"
- Description: "Test message sent to [Channel Name]"
- Channel is working correctly

**Failure**:
- Toast: "Error testing notification" (red/destructive)
- Description: Specific error message
- Common errors:
  - **Email**: SMTP connection failed, invalid email address
  - **Telegram**: Invalid bot token, bot not in chat, insufficient permissions

**If Test Fails**:
1. **Email**:
   - Verify email address is correct
   - Check SMTP server configuration
   - Check firewall/network connectivity
2. **Telegram**:
   - Verify bot token is correct
   - Ensure bot is added to chat/group/channel
   - Make bot admin with send message permission
   - Check Chat ID is correct (use getUpdates API)

---

## Managing Notification Channels

### Enabling/Disabling Channels

Toggle channel status without deletion:

1. Find channel in table
2. Click **Status** toggle switch
3. Channel immediately enables/disables
4. No confirmation required

**When Disabled**:
- ❌ Channel won't send notifications
- ❌ Not selectable in Alert Rules
- ✅ Configuration preserved
- ✅ Can re-enable anytime

**Use Cases**:
- Temporary maintenance
- Vacation/off-hours
- Testing with subset of channels

---

### Deleting Channels

**Permission Required**: Admin or Moderator

Permanently remove a notification channel.

#### How to Delete

1. Find channel in table
2. Click **Delete** button (Trash icon) in Actions column
3. Confirmation dialog appears:
   - **Title**: "Delete Notification Channel"
   - **Description**: "Are you sure you want to delete the channel **[Channel Name]**? This action cannot be undone and all associated alert rules will be affected."
   - **Buttons**: "Cancel" (gray) and "Delete Channel" (red)
4. Click **"Delete Channel"** to confirm (or "Cancel" to abort)
5. System performs deletion:
   - Channel removed from database
   - Alert rules using this channel are updated (channel removed from their lists)
6. Success toast: "Channel deleted successfully"
7. Channel removed from table

**What Gets Deleted**:
- ✅ Channel record
- ✅ Channel configuration (email/Chat ID/token)
- ⚠️ **Alert rules NOT deleted** but channel is removed from their channel lists

**⚠️ Warning**: Deletion is permanent. Alert rules using this channel will lose this notification destination.

**Before Deleting**:
1. ✅ Check which alert rules use this channel
2. ✅ Configure alternative channels for those rules
3. ✅ Verify you're deleting correct channel
4. ✅ Consider disabling instead of deleting (if temporary)

---

## Alert Rules

Define monitoring conditions and thresholds.

### Tab: Alert Rules

Click **"Alert Rules"** tab to manage alert rules.

#### Rules Table

Displays all alert rules with columns:

| Column | Description |
|--------|-------------|
| **Name** | Rule name (e.g., "High CPU Alert") |
| **Condition** | Condition expression with threshold (monospace font) |
| **Severity** | Badge: Critical (red), Warning (gray), Info (blue) |
| **Channels** | Icons for assigned channels (Email/Telegram badges) |
| **Status** | Toggle switch: ON (enabled) / OFF (disabled) |
| **Actions** | Delete button (Trash icon) |

**Condition Display Format**: `condition (threshold)`

**Examples**:
```
cpu > threshold (80)
memory > threshold (85)
disk > threshold (90)
upstream_status == down (1)
ssl_days_remaining < threshold (30)
```

---

## Creating an Alert Rule

**Permission Required**: Admin or Moderator

### Step 1: Open Add Rule Dialog

1. Click **"Add Rule"** button (top-right, Plus icon)
2. Dialog opens with title "Add Alert Rule"
3. Description: "Configure a new alert rule"

### Step 2: Select Alert Type

#### Alert Type (Required)

**Field**: Dropdown select  
**Label**: "Alert Type"  
**Options**:

1. **CPU Usage**
2. **Memory Usage**
3. **Disk Usage**
4. **Upstream Health**
5. **SSL Certificate**

**Required**: Yes

**Behavior**: Changing alert type automatically updates:
- Condition field
- Default threshold
- Default check interval
- Suggested rule name

**Descriptions** (shown below dropdown):
- **CPU Usage**: "Alert when CPU usage exceeds threshold"
- **Memory Usage**: "Alert when memory usage exceeds threshold"
- **Disk Usage**: "Alert when disk usage exceeds threshold"
- **Upstream Health**: "Alert when any upstream/backend is down"
- **SSL Certificate**: "Alert when SSL certificate expires soon"

---

### Alert Type: CPU Usage

**Condition**: `cpu > threshold`  
**Default Threshold**: 80%  
**Default Check Interval**: 30 seconds  
**Suggested Name**: "High CPU Usage"

**What it monitors**:
- System CPU usage percentage
- Alerts when CPU exceeds threshold

**Recommended Settings**:
- **Threshold**: 80-90%
- **Interval**: 30 seconds
- **Severity**: Warning (80-90%), Critical (>90%)

**Use Cases**:
- High load detection
- Performance degradation alerts
- Resource exhaustion prevention

---

### Alert Type: Memory Usage

**Condition**: `memory > threshold`  
**Default Threshold**: 85%  
**Default Check Interval**: 30 seconds  
**Suggested Name**: "High Memory Usage"

**What it monitors**:
- System RAM usage percentage
- Alerts when memory exceeds threshold

**Recommended Settings**:
- **Threshold**: 85-95%
- **Interval**: 30 seconds
- **Severity**: Warning (85-90%), Critical (>90%)

**Use Cases**:
- Memory leak detection
- OOM (Out of Memory) prevention
- Application memory usage monitoring

---

### Alert Type: Disk Usage

**Condition**: `disk > threshold`  
**Default Threshold**: 90%  
**Default Check Interval**: 300 seconds (5 minutes)  
**Suggested Name**: "High Disk Usage"

**What it monitors**:
- Disk space usage percentage
- Alerts when disk space exceeds threshold

**Recommended Settings**:
- **Threshold**: 90-95%
- **Interval**: 300 seconds (5 minutes)
- **Severity**: Warning (90%), Critical (>95%)

**Use Cases**:
- Disk space exhaustion prevention
- Log file growth monitoring
- Storage capacity planning

---

### Alert Type: Upstream Health

**Condition**: `upstream_status == down`  
**Default Threshold**: 1  
**Default Check Interval**: 60 seconds  
**Suggested Name**: "Upstream Down"

**What it monitors**:
- Backend server health status
- Alerts when any upstream/backend is marked as down

**Threshold Meaning**:
- `1` = Alert when 1 or more upstreams are down
- Not percentage-based (different from CPU/Memory/Disk)

**Recommended Settings**:
- **Threshold**: 1
- **Interval**: 60 seconds
- **Severity**: Critical (backend down = service impact)

**Use Cases**:
- Backend failure detection
- Service availability monitoring
- Load balancer health checks

---

### Alert Type: SSL Certificate

**Condition**: `ssl_days_remaining < threshold`  
**Default Threshold**: 30 days  
**Default Check Interval**: 86400 seconds (1 day)  
**Suggested Name**: "SSL Certificate Expiring"

**What it monitors**:
- SSL certificate expiry dates
- Alerts when certificate expires within N days

**Threshold Meaning**:
- Number of days before expiry
- `30` = Alert when certificate expires in 30 days or less

**Recommended Settings**:
- **Threshold**: 30 days (or 7 days for critical)
- **Interval**: 86400 seconds (1 day)
- **Severity**: Warning (30 days), Critical (7 days)

**Use Cases**:
- Certificate renewal reminders
- Prevent HTTPS downtime
- Compliance monitoring

---

### Step 3: Configure Rule Details

#### 1. Rule Name (Required)

**Field**: Text input  
**Label**: "Rule Name"  
**Placeholder**: `e.g., High CPU Alert`  
**Required**: Yes

**Behavior**: Auto-filled with suggested name when alert type changes, but can be customized

**Valid Examples**:
```
High CPU Usage
Production Memory Alert
Disk Space Warning
Backend Health Check
SSL Expiring Soon
Critical CPU - Production
```

#### 2. Condition (Auto-filled, Disabled)

**Field**: Text input (disabled/read-only)  
**Label**: "Condition"  
**Placeholder**: `e.g., cpu > threshold`  
**Behavior**: Auto-filled based on alert type, cannot be edited

**Subtext**: "Auto-filled based on alert type"

**Purpose**: Shows the condition expression used for evaluation

**Conditions by Type**:
```
CPU:      cpu > threshold
Memory:   memory > threshold
Disk:     disk > threshold
Upstream: upstream_status == down
SSL:      ssl_days_remaining < threshold
```

**Note**: Cannot edit condition - it's determined by alert type

---

#### 3. Threshold (Required)

**Field**: Number input  
**Label**: 
- For CPU/Memory/Disk: "Threshold (%)"
- For SSL: "Days Remaining"
- For Upstream: "Threshold (%)" (but uses count)

**Required**: Yes  
**Type**: Number  
**Default**: Varies by alert type (see Alert Type sections)

**For CPU/Memory/Disk**:
- Unit: Percentage (%)
- Range: 0-100
- Example: `80` = Alert when usage > 80%

**For SSL**:
- Unit: Days
- Range: 1-365
- Example: `30` = Alert when certificate expires in ≤30 days

**For Upstream**:
- Unit: Count
- Range: 1+
- Example: `1` = Alert when ≥1 upstream is down

**Subtext** (only for SSL): Shown below input explaining units

---

#### 4. Severity (Required)

**Field**: Dropdown select  
**Label**: "Severity"  
**Options**:

1. **Info** - Informational alerts (blue badge)
2. **Warning** - Warning alerts (gray badge)
3. **Critical** - Critical alerts (red badge)

**Default**: Warning

**Recommended Severity by Threshold**:

**CPU/Memory**:
- Info: < 70%
- Warning: 70-90%
- Critical: > 90%

**Disk**:
- Info: < 80%
- Warning: 80-95%
- Critical: > 95%

**Upstream**:
- Critical: Backend down (service impact)

**SSL**:
- Info: > 60 days
- Warning: 30-60 days
- Critical: < 7 days

---

#### 5. Check Interval (Required)

**Field**: Number input  
**Label**: "Check Interval (seconds)"  
**Placeholder**: `60`  
**Required**: Yes  
**Type**: Number  
**Range**: 10 - 86400 seconds (10 seconds to 1 day)

**Default Values by Type**:
- **CPU**: 30 seconds
- **Memory**: 30 seconds
- **Disk**: 300 seconds (5 minutes)
- **Upstream**: 60 seconds
- **SSL**: 86400 seconds (1 day)

**Purpose**: How often to check the condition

**Subtext**:
- For SSL: "SSL checks: 86400s (1 day) recommended"
- For others: "How often to check (10-3600s). CPU/Memory: 30s, Disk: 300s"

**Recommendations**:
- **Frequent checks** (10-60s): CPU, Memory, Upstream
- **Moderate checks** (60-300s): Disk, custom resources
- **Infrequent checks** (3600-86400s): SSL, daily reports

**Examples**:
```
10 seconds   = Every 10 seconds (very frequent, high load)
30 seconds   = Every 30 seconds (CPU/Memory default)
60 seconds   = Every 1 minute (Upstream default)
300 seconds  = Every 5 minutes (Disk default)
3600 seconds = Every 1 hour
86400 seconds = Every 1 day (SSL default)
```

---

#### 6. Notification Channels (Required)

**Field**: Checkbox list  
**Label**: "Notification Channels"  
**Required**: At least 1 channel must be selected

**Behavior**:
- Lists all **enabled** notification channels
- Disabled channels are not shown
- Multiple channels can be selected
- Alerts will be sent to all selected channels

**Display Format**:
```
☐ Admin Email
☐ Telegram Ops Team
☑ Critical Alerts
☐ Security Team
```

**Channel Display**:
- Checkbox with channel name
- Only enabled channels shown
- Can select multiple

**If No Channels Available**:
- Message: "No enabled notification channels available"
- Action: Create and enable channels first in Notification Channels tab

**Validation**: Must select at least 1 channel

---

#### 7. Enable rule

**Field**: Toggle switch  
**Label**: "Enable rule"  
**Default**: ON (enabled)

**When ON**:
- ✅ Rule is active and monitoring
- ✅ Notifications will be sent when condition triggered
- ✅ Check interval is running

**When OFF**:
- ❌ Rule is disabled and not monitoring
- ❌ No notifications sent
- ✅ Configuration preserved

**Use Cases**:
- Temporarily disable alerts during maintenance
- Testing without triggering alerts
- Pause specific rules without deletion

---

### Step 4: Add Rule

1. Review all configuration
2. Click **"Add Rule"** button (bottom-right)
3. System validates inputs
4. If valid:
   - Button shows "Adding..." with spinner (disabled)
   - Alert rule created in database
   - Monitoring starts (if enabled)
   - Success toast: "Alert rule added successfully"
   - Dialog closes
   - Rule appears in table
5. If validation fails:
   - Error toast with specific message
   - Dialog remains open
   - Fix errors and try again

**Validation Checks**:
- ✅ Rule name is required
- ✅ Alert type is required
- ✅ Threshold is required and valid number
- ✅ Severity is required
- ✅ Check interval is required (10-86400 seconds)
- ✅ At least 1 notification channel selected

**Common Errors**:
- "Name is required"
- "At least one notification channel must be selected"
- "Check interval must be between 10 and 86400 seconds"

---

## Managing Alert Rules

### Enabling/Disabling Rules

Toggle rule status without deletion:

1. Find rule in table
2. Click **Status** toggle switch
3. Rule immediately enables/disables
4. No confirmation required

**When Disabled**:
- ❌ Rule stops monitoring
- ❌ No notifications sent
- ✅ Configuration preserved
- ✅ Can re-enable anytime

**When Enabled**:
- ✅ Rule starts monitoring
- ✅ Checks condition every interval
- ✅ Sends notifications when triggered

**Use Cases**:
- Temporary disable during maintenance
- Scheduled maintenance windows
- Testing with subset of rules
- Gradual rollout of new rules

---

### Deleting Rules

**Permission Required**: Admin or Moderator

Permanently remove an alert rule.

#### How to Delete

1. Find rule in table
2. Click **Delete** button (Trash icon) in Actions column
3. Confirmation dialog appears:
   - **Title**: "Delete Alert Rule"
   - **Description**: "Are you sure you want to delete the rule **[Rule Name]**? This action cannot be undone and you will stop receiving alerts for this condition."
   - **Buttons**: "Cancel" (gray) and "Delete Rule" (red)
4. Click **"Delete Rule"** to confirm (or "Cancel" to abort)
5. System performs deletion:
   - Rule removed from database
   - Monitoring stops
6. Success toast: "Rule deleted successfully"
7. Rule removed from table

**What Gets Deleted**:
- ✅ Alert rule record
- ✅ Monitoring stops
- ✅ All configuration

**⚠️ Warning**: Deletion is permanent. You will stop receiving alerts for this condition.

**Before Deleting**:
1. ✅ Verify you're deleting correct rule
2. ✅ Consider disabling instead of deleting (if temporary)
3. ✅ Ensure alternative monitoring exists
4. ✅ Notify team about alert removal

---

## Alert Rule Examples

### Example 1: High CPU Alert

```
Alert Type: CPU Usage
Rule Name: High CPU Alert
Condition: cpu > threshold (auto-filled)
Threshold: 80%
Severity: Warning
Check Interval: 30 seconds
Channels: [✓] Admin Email, [✓] Telegram Ops
Enable: ON
```

**Behavior**: Checks CPU every 30 seconds. If CPU > 80%, sends warning notification to Admin Email and Telegram Ops.

---

### Example 2: Critical Memory Alert

```
Alert Type: Memory Usage
Rule Name: Critical Memory - Production
Condition: memory > threshold (auto-filled)
Threshold: 95%
Severity: Critical
Check Interval: 30 seconds
Channels: [✓] Critical Alerts, [✓] Telegram Ops
Enable: ON
```

**Behavior**: Checks memory every 30 seconds. If memory > 95%, sends critical notification to Critical Alerts channel and Telegram Ops.

---

### Example 3: Disk Space Warning

```
Alert Type: Disk Usage
Rule Name: Disk Space Warning
Condition: disk > threshold (auto-filled)
Threshold: 90%
Severity: Warning
Check Interval: 300 seconds (5 minutes)
Channels: [✓] Admin Email
Enable: ON
```

**Behavior**: Checks disk space every 5 minutes. If disk > 90%, sends warning notification to Admin Email.

---

### Example 4: Backend Health Monitor

```
Alert Type: Upstream Health
Rule Name: Backend Down Alert
Condition: upstream_status == down (auto-filled)
Threshold: 1
Severity: Critical
Check Interval: 60 seconds
Channels: [✓] Critical Alerts, [✓] Telegram Ops, [✓] Admin Email
Enable: ON
```

**Behavior**: Checks upstream health every 60 seconds. If any backend is down, sends critical notification to all 3 channels.

---

### Example 5: SSL Certificate Expiry

```
Alert Type: SSL Certificate
Rule Name: SSL Expiring Soon
Condition: ssl_days_remaining < threshold (auto-filled)
Threshold: 30 days
Severity: Warning
Check Interval: 86400 seconds (1 day)
Channels: [✓] Admin Email
Enable: ON
```

**Behavior**: Checks SSL certificates daily. If any certificate expires within 30 days, sends warning notification to Admin Email.

---

### Example 6: Critical SSL Alert

```
Alert Type: SSL Certificate
Rule Name: SSL Critical - 7 Days
Condition: ssl_days_remaining < threshold (auto-filled)
Threshold: 7 days
Severity: Critical
Check Interval: 86400 seconds (1 day)
Channels: [✓] Critical Alerts, [✓] Telegram Ops
Enable: ON
```

**Behavior**: Checks SSL certificates daily. If any certificate expires within 7 days, sends critical notification to 2 channels.

**Note**: Can combine with Example 5 for two-tier SSL alerting (30 days warning + 7 days critical).

---

## Notification Examples

### Email Notification Format

**Subject**: `[SEVERITY] Alert: [Rule Name]`

**Body**:
```
Alert Rule: [Rule Name]
Severity: [Severity Level]
Condition: [Condition]
Triggered At: [Timestamp]

Details:
[Condition-specific details]

Current Value: [Value]
Threshold: [Threshold]

---
Nginx WAF Management Platform
```

**Example Email**:
```
Subject: [WARNING] Alert: High CPU Alert

Alert Rule: High CPU Alert
Severity: Warning
Condition: cpu > threshold
Triggered At: 2025-01-18 14:30:25 UTC

Details:
CPU usage has exceeded the configured threshold.

Current Value: 85%
Threshold: 80%

---
Nginx WAF Management Platform
```

---

### Telegram Notification Format

```
🚨 **[SEVERITY]** Alert

**Rule**: [Rule Name]
**Severity**: [Severity Icon + Text]
**Condition**: `[Condition]`

**Details**:
[Condition-specific details]

📊 **Current**: [Value]
⚠️ **Threshold**: [Threshold]

⏰ [Timestamp]
```

**Example Telegram Message**:
```
🚨 **WARNING** Alert

**Rule**: High CPU Alert
**Severity**: ⚠️ Warning
**Condition**: `cpu > threshold`

**Details**:
CPU usage has exceeded the configured threshold.

📊 **Current**: 85%
⚠️ **Threshold**: 80%

⏰ 2025-01-18 14:30:25 UTC
```

**Severity Icons**:
- ℹ️ Info
- ⚠️ Warning
- 🔴 Critical

---

## Troubleshooting

### Issue 1: Email Notifications Not Received

**Symptoms**: Channel test succeeds, but alert emails not received

**Possible Causes**:

1. **Spam folder**
   - Solution: Check spam/junk folder, whitelist sender

2. **Email server configuration**
   - Solution: Check SMTP settings, authentication

3. **Network/firewall blocking SMTP**
   - Solution: Check firewall rules, allow SMTP port (25/465/587)

4. **Email address typo**
   - Solution: Verify email address in channel configuration

**Testing**:
```bash
# Test SMTP connection
telnet smtp.example.com 587

# Check email server logs
tail -f /var/log/mail.log
```

---

### Issue 2: Telegram Notifications Not Received

**Symptoms**: Test notification fails or alerts not sent

**Possible Causes**:

1. **Bot not in chat/group**
   - Solution: Add bot to chat/group/channel

2. **Bot not admin**
   - Solution: Make bot admin with "Send Messages" permission

3. **Invalid bot token**
   - Solution: Verify token from @BotFather, regenerate if needed

4. **Wrong Chat ID**
   - Solution: Use getUpdates API to get correct Chat ID

5. **Bot token exposed/revoked**
   - Solution: Regenerate token from @BotFather

**Testing**:
```bash
# Test bot token
curl "https://api.telegram.org/bot<BOT_TOKEN>/getMe"

# Get Chat ID
curl "https://api.telegram.org/bot<BOT_TOKEN>/getUpdates"

# Send test message
curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/sendMessage" \
  -d "chat_id=<CHAT_ID>&text=Test"
```

**Common Errors**:
- `Unauthorized`: Invalid bot token
- `Forbidden: bot was kicked`: Bot removed from chat
- `Forbidden: bot is not a member`: Bot not in chat
- `Bad Request: chat not found`: Invalid Chat ID

---

### Issue 3: Alert Rule Not Triggering

**Symptoms**: Rule enabled but notifications not sent when condition met

**Possible Causes**:

1. **Rule disabled**
   - Solution: Check Status toggle is ON

2. **No channels selected**
   - Solution: Edit rule, select at least 1 notification channel

3. **Channels disabled**
   - Solution: Enable notification channels in Channels tab

4. **Check interval too long**
   - Solution: Reduce check interval for faster detection

5. **Threshold not reached**
   - Solution: Verify actual value vs threshold (check monitoring data)

**Debugging**:
```bash
# Check alert service logs
tail -f /var/log/nginx-waf/alerts.log

# Check system metrics
htop                    # CPU, Memory
df -h                   # Disk usage
curl http://localhost:8080/metrics  # Metrics endpoint
```

---

### Issue 4: Too Many Notifications (Alert Spam)

**Symptoms**: Receiving constant/duplicate notifications

**Possible Causes**:

1. **Threshold too low**
   - Solution: Increase threshold to reduce false positives

2. **Check interval too short**
   - Solution: Increase check interval

3. **Flapping condition**
   - Solution: Add cooldown/debounce logic (future feature)

4. **Multiple rules for same condition**
   - Solution: Consolidate rules, delete duplicates

**Solutions**:
- **Adjust thresholds**: Set appropriate thresholds
- **Increase intervals**: Longer intervals for non-critical alerts
- **Disable during maintenance**: Temporarily disable rules
- **Use severity wisely**: Critical only for urgent issues

---

### Issue 5: Channel Deleted But Rule Still References It

**Symptoms**: Error when rule tries to send to deleted channel

**Behavior**:
- Alert rule continues to work
- Notification sent to remaining channels only
- Deleted channel silently skipped
- No error shown to user

**Solution**:
1. Edit alert rule
2. Remove deleted channel from selection
3. Add new/alternative channel
4. Save rule

**Prevention**: Before deleting channel, check and update all rules using it

---

### Issue 6: Test Notification Works But Real Alerts Don't

**Symptoms**: Test button sends notification successfully, but alert rules don't trigger notifications

**Possible Causes**:

1. **Rule not enabled**
   - Solution: Enable rule with Status toggle

2. **Condition never met**
   - Solution: Verify threshold is appropriate for actual system state

3. **Alert service not running**
   - Solution: Check alert monitoring service status

4. **Database connection issue**
   - Solution: Check database connectivity, logs

**Debugging**:
```bash
# Check service status
systemctl status nginx-waf-alerts

# Check database connection
psql -U nginx_waf -d nginx_waf_db -c "SELECT * FROM alert_rules WHERE enabled = true;"

# Check recent alerts
psql -U nginx_waf -d nginx_waf_db -c "SELECT * FROM alert_history ORDER BY created_at DESC LIMIT 10;"
```

---

### Issue 7: Cannot Create Channel - Validation Error

**Symptoms**: "Name, type, and config are required" or similar error

**Solutions**:

**For Email Channels**:
- ✅ Enter channel name
- ✅ Select "Email" type
- ✅ Enter valid email address
- ✅ Email must include @ and domain

**For Telegram Channels**:
- ✅ Enter channel name
- ✅ Select "Telegram" type
- ✅ Enter Chat ID (numeric, can be negative)
- ✅ Enter Bot Token (45+ characters, format: `ID:TOKEN`)

**Validation Checklist**:
```
Channel Name: ✓ Not empty
Type: ✓ Selected (Email or Telegram)
Email (if Email): ✓ Valid format (user@domain.com)
Chat ID (if Telegram): ✓ Not empty, numeric
Bot Token (if Telegram): ✓ Not empty, correct format
```

---

### Issue 8: SSL Alert Not Working

**Symptoms**: SSL certificates expiring but no alerts received

**Possible Causes**:

1. **Check interval too long**
   - Solution: Ensure interval is 86400s (1 day) or less

2. **Threshold too low**
   - Solution: Set threshold higher (e.g., 30 days instead of 7)

3. **No SSL certificates in system**
   - Solution: Add SSL certificates first

4. **Certificate auto-renewal working**
   - Solution: Certificates may be renewing before alert triggers (expected behavior)

**Testing**:
- Create test certificate with short expiry
- Set low threshold (e.g., 60 days)
- Enable rule and wait for check

---

## API Reference

For programmatic alerts management, use the REST API.

### Authentication

All Alerts API endpoints require authentication:

```bash
# Include JWT token in Authorization header
-H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### API Endpoints Summary

#### Notification Channels

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| GET | `/api/alerts/channels` | All roles | List all channels |
| GET | `/api/alerts/channels/:id` | All roles | Get single channel |
| POST | `/api/alerts/channels` | Admin, Moderator | Create channel |
| PUT | `/api/alerts/channels/:id` | Admin, Moderator | Update channel |
| DELETE | `/api/alerts/channels/:id` | Admin, Moderator | Delete channel |
| POST | `/api/alerts/channels/:id/test` | Admin, Moderator | Test channel |

#### Alert Rules

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| GET | `/api/alerts/rules` | All roles | List all rules |
| GET | `/api/alerts/rules/:id` | All roles | Get single rule |
| POST | `/api/alerts/rules` | Admin, Moderator | Create rule |
| PUT | `/api/alerts/rules/:id` | Admin, Moderator | Update rule |
| DELETE | `/api/alerts/rules/:id` | Admin, Moderator | Delete rule |

---

### Example API Calls

#### Create Email Channel

```bash
curl -X POST http://localhost:3001/api/alerts/channels \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin Email",
    "type": "email",
    "enabled": true,
    "config": {
      "email": "admin@example.com"
    }
  }'
```

#### Create Telegram Channel

```bash
curl -X POST http://localhost:3001/api/alerts/channels \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Telegram Ops",
    "type": "telegram",
    "enabled": true,
    "config": {
      "chatId": "-1001234567890",
      "botToken": "1234567890:ABCdefGHI..."
    }
  }'
```

#### Create Alert Rule

```bash
curl -X POST http://localhost:3001/api/alerts/rules \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "High CPU Alert",
    "condition": "cpu > threshold",
    "threshold": 80,
    "severity": "warning",
    "enabled": true,
    "channels": ["channel-id-1", "channel-id-2"]
  }'
```

#### Test Notification Channel

```bash
curl -X POST http://localhost:3001/api/alerts/channels/CHANNEL_ID/test \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Permissions Summary

| Action | Admin | Moderator | Viewer |
|--------|-------|-----------|--------|
| View channels | ✅ | ✅ | ✅ |
| Create channel | ✅ | ✅ | ❌ |
| Update channel | ✅ | ✅ | ❌ |
| Delete channel | ✅ | ✅ | ❌ |
| Test channel | ✅ | ✅ | ❌ |
| View rules | ✅ | ✅ | ✅ |
| Create rule | ✅ | ✅ | ❌ |
| Update rule | ✅ | ✅ | ❌ |
| Delete rule | ✅ | ✅ | ❌ |

---

## Quick Reference

### Alert Types Summary

| Type | Condition | Default Threshold | Default Interval | Unit |
|------|-----------|-------------------|------------------|------|
| CPU | `cpu > threshold` | 80 | 30s | % |
| Memory | `memory > threshold` | 85 | 30s | % |
| Disk | `disk > threshold` | 90 | 300s | % |
| Upstream | `upstream_status == down` | 1 | 60s | count |
| SSL | `ssl_days_remaining < threshold` | 30 | 86400s | days |

### Severity Levels

| Severity | Badge Color | Use Case |
|----------|-------------|----------|
| Info | Blue | Informational, low priority |
| Warning | Gray | Attention needed, not urgent |
| Critical | Red | Urgent, immediate action required |

### Recommended Check Intervals

| Resource | Interval | Reason |
|----------|----------|--------|
| CPU/Memory | 30-60s | Frequent checks for rapid changes |
| Disk | 300s (5min) | Slower changes, less frequent checks |
| Upstream | 60s | Balance between detection and load |
| SSL | 86400s (1 day) | Daily checks sufficient |

---

## Related Documentation

- [Performance Monitoring](./performance.md) - View system metrics and trends
- [Logs](./logs.md) - Access and error logs
- [Domains](./domains.md) - Domain and upstream management
- [SSL Certificates](./ssl.md) - SSL certificate management

---

## Support

If you encounter alert-related issues:

1. **Test Channels**: Use Test button to verify configuration
2. **Check Logs**: Review alert service logs
3. **Verify Permissions**: Ensure bot/SMTP permissions are correct
4. **Check System Metrics**: Verify actual values vs thresholds
5. **Review Documentation**: Re-read relevant sections
6. **Contact Support**: Provide logs, error messages, configuration details

---

**Last Updated**: January 18, 2025  
**Documentation Version**: 2.0.0  
**System Version**: Based on actual implementation
