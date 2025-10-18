# SSL Certificate Management - User Guide

## Overview

The SSL Certificate Management system provides automated and manual SSL/TLS certificate management for your domains. Secure your websites with free Let's Encrypt certificates or upload custom certificates from your own Certificate Authority.

### Key Features

- ✅ **Let's Encrypt Integration**: Free automated SSL certificates from Let's Encrypt
- ✅ **Manual Certificate Upload**: Support for custom certificates (commercial CA, internal CA, self-signed)
- ✅ **Automatic Renewal**: Optional auto-renewal for Let's Encrypt certificates
- ✅ **Certificate Monitoring**: Real-time status tracking (valid, expiring, expired)
- ✅ **Expiry Tracking**: Visual indicators for certificates expiring within 30 days
- ✅ **One-Click Renewal**: Manual renewal for Let's Encrypt certificates
- ✅ **Certificate Chain Support**: Full certificate chain handling for proper SSL validation
- ✅ **Domain Integration**: Seamless integration with domain management

### How SSL Works in the Platform

```
┌─────────────────────────────────────┐
│   SSL Certificate Management Page  │
│  - View all certificates            │
│  - Add new certificate              │
│  - Renew/Delete certificates        │
└─────────────────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│      Certificate Storage            │
│  /etc/nginx/ssl/                    │
│  - domain.com.crt                   │
│  - domain.com.key                   │
│  - domain.com.chain.pem             │
└─────────────────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│    Nginx Configuration              │
│  listen 443 ssl http2;              │
│  ssl_certificate ...                │
│  ssl_certificate_key ...            │
└─────────────────────────────────────┘
```

---

## Getting Started

### Accessing SSL Management

1. Log in to the Nginx WAF Management Platform
2. Click **SSL** in the sidebar navigation
3. You will see the SSL Certificate Management page

**Permission Required**:
- **Admin** and **Moderator**: Can add, renew, and delete certificates
- **Viewer**: Read-only access (view certificates only)

### Dashboard Overview

The SSL Management page displays three main sections:

#### Statistics Cards (Top Section)

Three cards showing certificate overview:

| Card | Description | Icon |
|------|-------------|------|
| **Total Certificates** | Total number of SSL certificates | Lock icon |
| **Valid** | Certificates with valid status (green checkmark) | CheckCircle2 icon |
| **Expiring Soon** | Certificates expiring within 30 days (yellow warning) | AlertTriangle icon |

**Example Display**:
```
┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐
│ Total Certificates │  │      Valid         │  │   Expiring Soon    │
│        5           │  │        4           │  │         1          │
└────────────────────┘  └────────────────────┘  └────────────────────┘
```

#### Toolbar

- **Add Certificate** button (top-right, Plus icon)
- Opens dialog to add new certificate (Let's Encrypt or Manual Upload)

#### Certificates Table

Displays all SSL certificates with the following columns:

| Column | Description |
|--------|-------------|
| **Domain** | Domain name with status icon (checkmark for valid, warning for expiring) |
| **Issuer** | Certificate issuer ("Let's Encrypt" or "Manual Upload") |
| **Valid From** | Certificate start date (formatted: "Jan 15, 2025") |
| **Valid To** | Certificate expiry date (formatted: "Apr 15, 2025") |
| **Auto Renew** | Badge: "Enabled" (blue) or "Disabled" (gray) |
| **Status** | Badge: "valid" (default), "expiring" (default), "expired" (destructive/red) |
| **Actions** | Renew button (Let's Encrypt only), Delete button |

**Empty State**:
When no certificates exist:
- Message: "No SSL certificates found. Add one to get started."
- Subtext: "You can issue a free Let's Encrypt certificate or upload a manual certificate for your domains."

---

## Adding an SSL Certificate

**Permission Required**: Admin or Moderator

### Step 1: Open Add Certificate Dialog

1. Click **"Add Certificate"** button (top-right, Plus icon)
2. Dialog opens with title "Add SSL Certificate"
3. Description: "Configure SSL/TLS certificate for your domain"

### Step 2: Select Domain

**Field**: Dropdown select  
**Label**: "Domain *"  
**Required**: Yes

**Behavior**:
- Shows only domains **without SSL certificate** (sslEnabled = false)
- If all domains have SSL: "No domains available without SSL"
- If loading: "Loading domains..."

**Note**: Each domain can only have one SSL certificate. To change certificate, delete existing one first.

### Step 3: Choose Certificate Method

Two tabs available:

---

## Method 1: Auto (Let's Encrypt)

Free automated SSL certificates from Let's Encrypt. Recommended for most use cases.

### Tab: Auto (Let's Encrypt)

Click **"Auto (Let's Encrypt)"** tab to configure Let's Encrypt certificate.

#### Information Panel

Blue panel with title "Let's Encrypt Auto-SSL":

> Automatically obtain and renew SSL certificates from Let's Encrypt.
> Certificates will be issued within minutes and auto-renewed before expiry.

#### Configuration Fields

##### 1. Email (Optional)

**Field**: Text input (email type)  
**Label**: "Email (Optional)"  
**Placeholder**: `admin@example.com`  
**Required**: No

**Purpose**: Email for expiry notifications from Let's Encrypt  
**Recommendation**: Provide email for certificate recovery and notifications

**Valid Examples**:
```
admin@example.com
ssl@company.com
webmaster@domain.com
```

##### 2. Auto-Renewal

**Field**: Toggle switch  
**Label**: "Auto-Renewal"  
**Description**: "Automatically renew before expiration"  
**Default**: ON (enabled)

**What it does**:
- ✅ When ON: Certificate automatically renews before expiry (recommended)
- ❌ When OFF: Must manually renew using "Renew" button

**Recommendation**: Keep enabled for production domains

**How Auto-Renewal Works**:
1. System checks certificate expiry daily
2. When certificate is within 30 days of expiry
3. Automatic renewal process starts
4. New certificate requested from Let's Encrypt
5. Domain validation performed
6. New certificate installed and Nginx reloaded

#### Requirements Panel

Gray panel listing requirements:

**Requirements**:
- ✅ **Domain must point to this server's IP**: DNS A record must resolve to server IP
- ✅ **Port 80 must be accessible for validation**: Let's Encrypt validates via HTTP-01 challenge
- ✅ **Valid domain name (no wildcards)**: Wildcard certificates not supported

**Important Notes**:
- ⚠️ Wildcard certificates (*.example.com) are **NOT supported**
- ⚠️ Only single domain certificates (example.com)
- ⚠️ Ensure firewall allows incoming connections on port 80

### Validation Process

Let's Encrypt uses **HTTP-01 challenge** to verify domain ownership:

```
1. Challenge Request
   ↓
2. Create challenge file in /.well-known/acme-challenge/
   ↓
3. Let's Encrypt attempts to access:
   http://example.com/.well-known/acme-challenge/TOKEN
   ↓
4. If accessible and valid → Issue certificate
   ↓
5. Install certificate files:
   - /etc/nginx/ssl/example.com.crt
   - /etc/nginx/ssl/example.com.key
   - /etc/nginx/ssl/example.com.chain.pem
   ↓
6. Update nginx configuration
   ↓
7. Reload nginx
   ↓
8. Certificate active (status: valid)
```

### Step 4: Issue Certificate

1. Review configuration
2. Click **"Add Certificate"** button (bottom-right)
3. System validates inputs
4. If valid:
   - Button shows "Adding..." (disabled)
   - Let's Encrypt certificate request sent
   - Domain validation performed
   - Certificate files saved
   - Nginx configuration updated
   - Success toast: "Let's Encrypt certificate issued successfully"
   - Dialog closes
   - Certificate appears in table with status "valid"
5. If validation fails:
   - Error toast with specific message
   - Dialog remains open
   - Fix issues and try again

**Common Errors**:
- "Domain must point to this server's IP" → Check DNS
- "Port 80 is not accessible" → Check firewall
- "Domain validation failed" → Check nginx is running, port 80 accessible
- "Failed to add certificate" → Check logs for details

---

## Method 2: Manual Upload

Upload custom SSL certificates from commercial Certificate Authorities, internal CA, or self-signed certificates.

### Tab: Manual Upload

Click **"Manual Upload"** tab to upload custom certificate.

### When to Use Manual Upload

- ✅ **Wildcard Certificates**: *.example.com certificates
- ✅ **Internal Domains**: Private/internal domain names (e.g., internal.local)
- ✅ **Commercial Certificates**: Purchased SSL certificates (DigiCert, Sectigo, etc.)
- ✅ **Extended Validation (EV)**: EV certificates requiring manual process
- ✅ **Self-Signed Certificates**: For development/testing
- ✅ **Corporate PKI**: Organization-specific certificate infrastructure

### Configuration Fields

#### 1. Certificate (PEM) (Required)

**Field**: Textarea (monospace font)  
**Label**: "Certificate (PEM) *"  
**Placeholder**:
```
-----BEGIN CERTIFICATE-----
...
-----END CERTIFICATE-----
```
**Rows**: 6  
**Required**: Yes (when using Manual Upload)  
**Format**: PEM-encoded certificate

**What to paste**:
- Your domain certificate in PEM format
- Single certificate block
- Include `-----BEGIN CERTIFICATE-----` and `-----END CERTIFICATE-----`

**Example**:
```
-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAKoKHHqH1+5cMA0GCSqGSIb3DQEBBQUAMEUxCzAJBgNV
BAYTAlVTMRMwEQYDVQQIEwpTb21lLVN0YXRlMSEwHwYDVQQKExhJbnRlcm5ldCBX
aWRnaXRzIFB0eSBMdGQwHhcNMjUwMTE1MDAwMDAwWhcNMjYwMTE1MDAwMDAwWjBF
MQswCQYDVQQGEwJVUzETMBEGA1UECBMKU29tZS1TdGF0ZTEhMB8GA1UEChMYSW50
ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
... (more lines) ...
-----END CERTIFICATE-----
```

**File Sources**:
- `.crt` file from Certificate Authority
- `.pem` file
- `.cer` file (convert to PEM format if needed)

**Conversion from other formats**:
```bash
# Convert DER to PEM
openssl x509 -inform DER -in certificate.cer -out certificate.pem

# Convert P7B to PEM
openssl pkcs7 -print_certs -in certificate.p7b -out certificate.pem

# Convert PFX to PEM (certificate)
openssl pkcs12 -in certificate.pfx -clcerts -nokeys -out certificate.pem
```

#### 2. Private Key (PEM) (Required)

**Field**: Textarea (monospace font)  
**Label**: "Private Key (PEM) *"  
**Placeholder**:
```
-----BEGIN PRIVATE KEY-----
...
-----END PRIVATE KEY-----
```
**Rows**: 6  
**Required**: Yes (when using Manual Upload)  
**Format**: PEM-encoded private key

**What to paste**:
- Private key that matches the certificate
- RSA or ECDSA key
- Include `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- **IMPORTANT**: Keep this secure, never share

**Example**:
```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC5cW8VJZ1p+VQJ
qKhHGHj3FZv8qTxKKLHQPGDPCHHNZ/7QKJhJGHKLHJKHLKJHLKJHLKJHLKJHLKJH
... (more lines) ...
-----END PRIVATE KEY-----
```

**Key Types Supported**:
- RSA keys (2048-bit or 4096-bit recommended)
- ECDSA keys (P-256, P-384, P-521)

**Formats Accepted**:
- `-----BEGIN PRIVATE KEY-----` (PKCS#8)
- `-----BEGIN RSA PRIVATE KEY-----` (PKCS#1)
- `-----BEGIN EC PRIVATE KEY-----` (EC keys)

**Conversion**:
```bash
# Convert PFX to PEM (private key)
openssl pkcs12 -in certificate.pfx -nocerts -out privatekey.pem

# Remove passphrase from private key
openssl rsa -in privatekey.pem -out privatekey_nopass.pem
```

#### 3. Certificate Chain (Optional)

**Field**: Textarea (monospace font)  
**Label**: "Certificate Chain (Optional)"  
**Placeholder**:
```
-----BEGIN CERTIFICATE-----
...
-----END CERTIFICATE-----
```
**Rows**: 4  
**Required**: No  
**Format**: PEM-encoded intermediate and root certificates

**What to paste**:
- Intermediate CA certificate(s)
- Root CA certificate (optional)
- Multiple certificate blocks
- In order from intermediate to root

**Purpose**:
- Completes certificate chain for proper SSL validation
- Prevents "Certificate chain incomplete" browser warnings
- Required for most browsers to trust the certificate

**Example (with 2 intermediate certificates)**:
```
-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAKoKHHqH1... (Intermediate CA 1)
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJABbKHLpQ2... (Intermediate CA 2)
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJARoot123... (Root CA - optional)
-----END CERTIFICATE-----
```

**When to include**:
- ✅ Always recommended for commercial certificates
- ✅ Required if browser shows "Certificate chain incomplete"
- ✅ Provided by CA as `.ca-bundle`, `.chain.pem`, or `.intermediate.crt`
- ❌ Not needed for self-signed certificates (usually)

**How to obtain**:
- Download from Certificate Authority (usually provided)
- Check CA documentation for intermediate certificates
- Common CA intermediate certificate URLs:
  - DigiCert: https://www.digicert.com/kb/digicert-root-certificates.htm
  - Sectigo: https://support.sectigo.com/articles/Knowledge/Sectigo-Intermediate-Certificates
  - GlobalSign: https://support.globalsign.com/ca-certificates/intermediate-certificates

### Step 4: Upload Certificate

1. Paste certificate, private key, and chain (if available)
2. Review all fields
3. Click **"Add Certificate"** button (bottom-right)
4. System validates inputs
5. If valid:
   - Button shows "Adding..." (disabled)
   - Certificate files parsed and validated
   - Files saved to `/etc/nginx/ssl/`
   - Database record created with issuer "Manual Upload"
   - Nginx configuration updated
   - Success toast: "SSL certificate uploaded successfully"
   - Dialog closes
   - Certificate appears in table
6. If validation fails:
   - Error toast with specific message
   - Common errors: "Invalid certificate format", "Private key doesn't match certificate"
   - Fix and try again

**Validation Checks**:
- ✅ Certificate is valid PEM format
- ✅ Private key is valid PEM format
- ✅ Private key matches certificate (cryptographic validation)
- ✅ Certificate is not expired
- ✅ Certificate chain is valid (if provided)

---

## Managing SSL Certificates

### Viewing Certificate Details

The certificates table shows all important information:

#### Domain Column

- **Icon**: 
  - Green checkmark (CheckCircle2) = Valid certificate
  - Yellow warning (AlertTriangle) = Expiring soon (< 30 days)
- **Domain Name**: Domain name from certificate or database

#### Issuer Column

Shows certificate source:
- **"Let's Encrypt"**: Auto-issued certificates
- **"Manual Upload"**: Manually uploaded certificates

#### Valid From / Valid To Columns

Date format: `Month Day, Year`

**Examples**:
- Valid From: `Jan 15, 2025`
- Valid To: `Apr 15, 2025`

**Visual Indicators**:
- Normal text: Valid certificate
- Bold/highlighted: Expiring soon (< 30 days)

#### Auto Renew Column

Badge showing auto-renewal status:
- **"Enabled"** (blue badge): Auto-renewal is ON
- **"Disabled"** (gray badge): Auto-renewal is OFF

**Note**: 
- Only applies to Let's Encrypt certificates
- Manual certificates show "Disabled" (cannot auto-renew)

#### Status Column

Badge showing certificate status:

| Status | Badge Color | Meaning |
|--------|-------------|---------|
| **valid** | Default (blue) | Certificate is valid and expires in > 30 days |
| **expiring** | Default (blue) | Certificate expires within 30 days |
| **expired** | Destructive (red) | Certificate has expired |

**Status Computation**:
```javascript
const daysUntilExpiry = (validTo - today) / (1000 * 60 * 60 * 24);

if (daysUntilExpiry < 0) {
  status = 'expired';
} else if (daysUntilExpiry <= 30) {
  status = 'expiring';
} else {
  status = 'valid';
}
```

**Threshold**: 30 days before expiry triggers "expiring" status

#### Actions Column

Two buttons available:

##### 1. Renew Button

- **Icon**: RefreshCw icon
- **Label**: "Renew"
- **Visibility**: Only for **Let's Encrypt** certificates
- **Permission**: Admin or Moderator
- **Behavior**: 
  - Click to manually renew certificate
  - Button shows spinning icon while renewing
  - Success toast: "Certificate renewed successfully"
  - New certificate issued and installed
  - Table refreshes with new Valid To date

**When to use**:
- Certificate is expiring soon
- Auto-renewal failed
- Testing renewal process
- Forcing renewal before automatic trigger

**Note**: Manual certificates do NOT have Renew button (must re-upload new certificate)

##### 2. Delete Button

- **Icon**: Trash2 icon (trash can)
- **Color**: Red (destructive)
- **Permission**: Admin or Moderator
- **Behavior**: 
  - Click to delete certificate
  - Confirmation dialog appears
  - Must confirm to proceed
  - Certificate files deleted
  - Database record removed
  - Domain's sslEnabled set to false
  - Nginx reloaded
  - Success toast: "Certificate deleted successfully"

---

## Renewing Certificates

### Automatic Renewal (Let's Encrypt Only)

**Requirements**:
- Certificate issuer is "Let's Encrypt"
- Auto Renew is "Enabled"

**How It Works**:

1. **Daily Check**: System checks all certificates daily for expiry
2. **Renewal Trigger**: When certificate is within 30 days of expiry
3. **Renewal Process**:
   - New certificate requested from Let's Encrypt
   - Domain validation performed (HTTP-01 challenge)
   - New certificate issued
   - Old certificate files replaced
   - Nginx configuration updated
   - Nginx reloaded
   - Status updated in database
4. **Success**: Certificate Valid To date updated, status remains "valid"
5. **Failure**: Status may show "expiring", admin should manually renew

**Renewal Timeline**:
```
Day 0: Certificate issued (Valid To: Day 90)
  ↓
Day 60: Certificate still valid
  ↓
Day 61: Auto-renewal triggers (30 days before expiry)
  ↓
Renewal successful → Valid To: Day 151 (new 90-day cert)
  ↓
Day 121: Next auto-renewal triggers
```

**Note**: Let's Encrypt certificates are valid for **90 days**

### Manual Renewal (Let's Encrypt)

**Permission Required**: Admin or Moderator

**When to use**:
- Auto-renewal failed
- Certificate is expiring soon
- Testing renewal process
- Want to renew before 30-day threshold

**How to Renew Manually**:

1. Find certificate in table
2. Locate **Renew** button in Actions column
3. Click **"Renew"** button
4. Button shows spinning icon: "Renewing..."
5. System performs renewal:
   - Requests new certificate from Let's Encrypt
   - Domain validation (HTTP-01 challenge)
   - Certificate issued and installed
   - Nginx reloaded
6. Success toast: "Certificate renewed successfully"
7. Table refreshes with new Valid To date
8. Status updates to "valid"

**Renewal Process** (same as auto-renewal):
```
1. Click Renew button
   ↓
2. Let's Encrypt ACME request
   ↓
3. Create validation challenge
   ↓
4. Let's Encrypt validates domain
   ↓
5. New certificate issued
   ↓
6. Install new certificate files
   ↓
7. Update nginx config
   ↓
8. Reload nginx
   ↓
9. Update database (new Valid To date)
   ↓
10. Success notification
```

**Errors**:
- "Domain validation failed" → Check DNS, port 80 accessibility
- "Failed to renew certificate" → Check nginx logs, Let's Encrypt rate limits
- Rate limit error → Let's Encrypt has limits (50 certs/week per domain)

### Renewing Manual Certificates

**Manual certificates CANNOT be auto-renewed or manually renewed via UI.**

**To "renew" a manual certificate**:

1. Obtain new certificate from your CA
2. **Delete** existing certificate (Trash icon)
3. **Add** new certificate via "Add Certificate" → "Manual Upload"
4. Upload new certificate, private key, and chain

**Why no renewal**:
- Manual certificates come from external CAs
- Platform cannot request new certificates from external CAs
- Must obtain new certificate through CA's process
- Then upload new certificate manually

---

## Deleting Certificates

**Permission Required**: Admin or Moderator

### How to Delete

1. Find certificate in table
2. Click **Delete** button (Trash icon, red) in Actions column
3. Confirmation dialog appears:
   - **Title**: "Delete SSL Certificate"
   - **Description**: "Are you sure you want to delete the SSL certificate for **domain.com**? This action cannot be undone."
   - **Buttons**: "Cancel" (gray) and "Delete" (red)
4. Click **"Delete"** to confirm (or "Cancel" to abort)
5. System performs deletion:
   - Certificate files removed from `/etc/nginx/ssl/`
   - Database record deleted
   - Domain's `sslEnabled` set to false
   - Nginx configuration updated (HTTPS removed)
   - Nginx reloaded
6. Success toast: "Certificate deleted successfully"
7. Certificate removed from table
8. Domain now available in "Add Certificate" domain dropdown

### What Gets Deleted

- ✅ Certificate file (`.crt`)
- ✅ Private key file (`.key`)
- ✅ Chain file (`.chain.pem`)
- ✅ Database record
- ✅ HTTPS configuration in nginx

### What Happens to Domain

- ✅ Domain `sslEnabled` changes to `false`
- ✅ Domain only accessible via HTTP (port 80)
- ✅ HTTPS (port 443) no longer configured
- ✅ Can add new certificate anytime

### Before Deleting

**Recommended steps**:
1. ✅ Verify you're deleting correct certificate
2. ✅ Check if domain still needs SSL
3. ✅ Prepare replacement certificate if renewing
4. ✅ Notify users about potential downtime
5. ✅ Backup certificate files if needed (for records)

**⚠️ Warning**: Deletion is permanent and cannot be undone. Domain will immediately lose HTTPS access.

---

## Certificate Status Reference

### Status Types

#### Valid

**Badge**: Default (blue)  
**Meaning**: Certificate is valid and expires in more than 30 days  
**Icon**: Green checkmark (CheckCircle2)

**Conditions**:
- Certificate is not expired
- Expiry date is more than 30 days in the future
- Certificate is properly installed

**Action Required**: None (monitor normally)

#### Expiring

**Badge**: Default (blue)  
**Meaning**: Certificate expires within 30 days  
**Icon**: Yellow warning triangle (AlertTriangle)

**Conditions**:
- Certificate is not expired
- Expiry date is 30 days or less in the future
- Auto-renewal may have failed (if Let's Encrypt with auto-renew enabled)

**Action Required**:
- **Let's Encrypt with auto-renew ON**: Wait for automatic renewal, or manually renew
- **Let's Encrypt with auto-renew OFF**: Click "Renew" button immediately
- **Manual certificates**: Delete and upload new certificate

#### Expired

**Badge**: Destructive (red)  
**Meaning**: Certificate has expired  
**Icon**: Red X or warning

**Conditions**:
- Certificate expiry date has passed
- Domain HTTPS may not work properly
- Browsers will show security warnings

**Action Required**:
- **URGENT**: Renew or replace certificate immediately
- **Let's Encrypt**: Click "Renew" button (if not too long expired)
- **Manual**: Delete and upload new certificate
- Check why auto-renewal failed (if applicable)

### Expiry Threshold

**30 days** before expiry:
- Status changes from "valid" to "expiring"
- Visual indicator (yellow warning triangle) appears
- Auto-renewal triggers for Let's Encrypt certificates (if enabled)

**Calculation**:
```
Days Until Expiry = (Valid To Date - Current Date) in days

If Days Until Expiry <= 30:
  Status = "expiring"
If Days Until Expiry < 0:
  Status = "expired"
Else:
  Status = "valid"
```

---

## Troubleshooting

### Issue 1: Let's Encrypt Certificate Issuance Failed

**Symptoms**: Error toast "Failed to add certificate", certificate not issued

**Common Causes**:

1. **DNS not pointing to server**
   - Domain doesn't resolve to server IP
   - DNS propagation not complete
   
   **Solution**:
   ```bash
   # Check DNS resolution
   nslookup example.com
   dig example.com
   
   # Should return this server's IP address
   # If not, update DNS A record and wait for propagation
   ```

2. **Port 80 not accessible**
   - Firewall blocking port 80
   - Nginx not listening on port 80
   
   **Solution**:
   ```bash
   # Check if nginx is listening on port 80
   netstat -tlnp | grep :80
   
   # Test external access
   curl -I http://example.com
   
   # Check firewall rules
   sudo ufw status
   sudo iptables -L -n | grep 80
   
   # Allow port 80
   sudo ufw allow 80/tcp
   ```

3. **Domain validation failed**
   - Challenge file not accessible
   - Nginx not serving `.well-known/acme-challenge/`
   
   **Solution**:
   ```bash
   # Check nginx error logs
   tail -f /var/log/nginx/error.log
   
   # Test challenge path
   curl http://example.com/.well-known/acme-challenge/test
   
   # Should be accessible (404 is OK, connection refused is not)
   ```

4. **Let's Encrypt rate limits**
   - Too many certificate requests for same domain
   - Limit: 50 certificates per week per domain
   
   **Solution**:
   - Wait 7 days before retrying
   - Check rate limit status: https://crt.sh/?q=example.com
   - Use Let's Encrypt staging environment for testing

5. **Invalid domain name**
   - Wildcard domain (*.example.com) not supported
   - Invalid characters in domain name
   
   **Solution**:
   - Use only single domain names (no wildcards)
   - Use only valid characters (a-z, 0-9, hyphen, period)

---

### Issue 2: Auto-Renewal Not Working

**Symptoms**: Certificate shows "expiring" status, auto-renewal didn't trigger

**Possible Causes**:

1. **Auto-Renew disabled**
   
   **Solution**:
   - Check Auto Renew column in table
   - If "Disabled", auto-renewal won't happen
   - Delete and re-add certificate with auto-renew enabled

2. **Renewal process failed**
   - Domain validation failed during renewal
   - Port 80 became inaccessible
   
   **Solution**:
   ```bash
   # Check nginx logs for renewal errors
   grep -i "acme\|letsencrypt" /var/log/nginx/error.log
   
   # Manually renew
   Click "Renew" button in Actions column
   ```

3. **Cron job or scheduler not running**
   - System task scheduler not executing renewal checks
   
   **Solution**:
   ```bash
   # Check if renewal service is running
   systemctl status nginx-ssl-renewal
   
   # Check cron logs
   grep -i "ssl\|renewal" /var/log/syslog
   ```

4. **Let's Encrypt API issues**
   - Temporary API outage
   - Network connectivity issues
   
   **Solution**:
   - Check Let's Encrypt status: https://letsencrypt.status.io/
   - Wait and retry
   - Manually renew when service restored

---

### Issue 3: Manual Certificate Upload Failed

**Symptoms**: Error "Invalid certificate format" or "Private key doesn't match certificate"

**Solutions**:

**Problem: Invalid certificate format**
```bash
# Verify certificate is valid PEM
openssl x509 -in certificate.crt -text -noout

# Should display certificate details
# If error, certificate is invalid or wrong format

# Convert from DER to PEM
openssl x509 -inform DER -in certificate.cer -out certificate.pem
```

**Problem: Private key doesn't match certificate**
```bash
# Check certificate modulus
openssl x509 -noout -modulus -in certificate.crt | openssl md5

# Check private key modulus
openssl rsa -noout -modulus -in privatekey.key | openssl md5

# Modulus hashes MUST match
# If different, you have wrong private key
```

**Problem: Certificate expired**
```bash
# Check certificate validity dates
openssl x509 -in certificate.crt -noout -dates

# Shows:
# notBefore=Jan 15 00:00:00 2025 GMT
# notAfter=Apr 15 23:59:59 2025 GMT

# If notAfter is in past, certificate is expired
# Obtain new certificate from CA
```

**Problem: Private key has passphrase**
```bash
# Remove passphrase from private key
openssl rsa -in privatekey.key -out privatekey_nopass.key

# Enter passphrase when prompted
# Use privatekey_nopass.key for upload
```

---

### Issue 4: Certificate Shows "Expiring" but Auto-Renew is Enabled

**Symptoms**: Certificate within 30 days of expiry, auto-renew enabled, but not renewed

**Possible Causes**:

1. **Renewal recently failed**
   - Check logs for failure reason
   
2. **Still within grace period**
   - Auto-renewal may run overnight
   - Wait 24 hours and check again

3. **Manual intervention needed**
   - Click "Renew" button to force renewal
   - Check error message if renewal fails

**Solution**:
```bash
# Force manual renewal
Click "Renew" button in UI

# If fails, check logs
tail -f /var/log/nginx/error.log
grep -i "renewal" /var/log/syslog

# Common fixes:
# - Ensure port 80 accessible
# - Check DNS still points to server
# - Verify nginx is running
```

---

### Issue 5: HTTPS Not Working After Adding Certificate

**Symptoms**: Certificate shows "valid" in table, but HTTPS doesn't work

**Possible Causes**:

1. **Port 443 not open**
   
   **Solution**:
   ```bash
   # Check firewall
   sudo ufw status
   sudo ufw allow 443/tcp
   
   # Check nginx listening on 443
   netstat -tlnp | grep :443
   ```

2. **Nginx not reloaded**
   
   **Solution**:
   ```bash
   # Reload nginx manually
   sudo nginx -t  # Test config first
   sudo nginx -s reload
   ```

3. **Domain's sslEnabled not updated**
   
   **Solution**:
   - Check domain in Domains page
   - SSL column should show "Enabled" badge
   - If not, try toggling SSL in domain settings

4. **Browser cache**
   
   **Solution**:
   - Clear browser cache
   - Try incognito/private mode
   - Try different browser

**Testing**:
```bash
# Test HTTPS connection
curl -I https://example.com

# Should return HTTP 200
# If connection refused, port 443 blocked

# Check certificate
openssl s_client -connect example.com:443 -servername example.com

# Should show certificate details
```

---

### Issue 6: Certificate Deleted but Still Shows in Nginx

**Symptoms**: Certificate deleted from UI, but nginx still uses old certificate

**Solution**:
```bash
# Check if certificate files exist
ls -la /etc/nginx/ssl/

# If old files still exist, remove manually
sudo rm /etc/nginx/ssl/old-domain.*

# Check nginx config
cat /etc/nginx/sites-available/domain.conf

# If still references old certificate, edit and remove

# Test and reload
sudo nginx -t
sudo nginx -s reload
```

---

### Issue 7: Cannot Add Certificate - No Domains Available

**Symptoms**: Dropdown shows "No domains available without SSL"

**Causes**:
- All domains already have SSL certificates
- No domains created yet

**Solutions**:

1. **Create new domain first**:
   - Go to Domains page
   - Click "Create Domain"
   - Add domain without SSL
   - Return to SSL page and add certificate

2. **Delete existing certificate to re-add**:
   - Find domain's certificate in SSL table
   - Click Delete button
   - Domain becomes available for new certificate

3. **Replace certificate**:
   - To change certificate type (Let's Encrypt ↔ Manual)
   - Must delete old certificate first
   - Then add new certificate

**Note**: Each domain can only have **one SSL certificate at a time**.

---

## API Reference

For programmatic SSL management, use the REST API.

### Authentication

All SSL API endpoints require authentication:

```bash
# Include JWT token in Authorization header
-H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### API Endpoints

#### 1. List All SSL Certificates

**Endpoint**: `GET /api/ssl`  
**Permission**: All roles (Admin, Moderator, Viewer)

**Request**:
```bash
curl -X GET http://localhost:3001/api/ssl \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response**:
```json
{
  "data": [
    {
      "id": "cert-123",
      "domainId": "domain-456",
      "commonName": "example.com",
      "issuer": "Let's Encrypt",
      "validFrom": "2025-01-15T00:00:00.000Z",
      "validTo": "2025-04-15T23:59:59.000Z",
      "autoRenew": true,
      "status": "valid",
      "daysUntilExpiry": 45,
      "domain": {
        "id": "domain-456",
        "name": "example.com",
        "status": "active"
      },
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

---

#### 2. Get Single SSL Certificate

**Endpoint**: `GET /api/ssl/:id`  
**Permission**: All roles

**Request**:
```bash
curl -X GET http://localhost:3001/api/ssl/cert-123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response**:
```json
{
  "data": {
    "id": "cert-123",
    "domainId": "domain-456",
    "commonName": "example.com",
    "issuer": "Let's Encrypt",
    "validFrom": "2025-01-15T00:00:00.000Z",
    "validTo": "2025-04-15T23:59:59.000Z",
    "autoRenew": true,
    "status": "valid",
    "domain": {
      "id": "domain-456",
      "name": "example.com"
    }
  }
}
```

---

#### 3. Issue Let's Encrypt Certificate (Auto)

**Endpoint**: `POST /api/ssl/auto`  
**Permission**: Admin, Moderator

**Request**:
```bash
curl -X POST http://localhost:3001/api/ssl/auto \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "domainId": "domain-456",
    "email": "admin@example.com",
    "autoRenew": true
  }'
```

**Request Body**:
```typescript
{
  domainId: string;      // Required
  email?: string;        // Optional
  autoRenew?: boolean;   // Optional, default: true
}
```

**Response**:
```json
{
  "message": "Let's Encrypt certificate issued successfully",
  "data": {
    "id": "cert-789",
    "domainId": "domain-456",
    "commonName": "example.com",
    "issuer": "Let's Encrypt",
    "validFrom": "2025-01-18T00:00:00.000Z",
    "validTo": "2025-04-18T23:59:59.000Z",
    "autoRenew": true,
    "status": "valid"
  }
}
```

**Validation Rules**:
- `domainId`: Required, must exist, must not have existing certificate
- `email`: Optional, must be valid email format
- `autoRenew`: Optional, must be boolean

**Errors**:
- `400`: Domain ID is required
- `400`: Valid email is required (if email provided but invalid)
- `400`: Domain already has SSL certificate
- `404`: Domain not found
- `500`: Certificate issuance failed (check domain DNS, port 80 accessibility)

---

#### 4. Upload Manual SSL Certificate

**Endpoint**: `POST /api/ssl/manual`  
**Permission**: Admin, Moderator

**Request**:
```bash
curl -X POST http://localhost:3001/api/ssl/manual \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "domainId": "domain-456",
    "certificate": "-----BEGIN CERTIFICATE-----\nMIID...\n-----END CERTIFICATE-----",
    "privateKey": "-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----",
    "chain": "-----BEGIN CERTIFICATE-----\nMIID...\n-----END CERTIFICATE-----"
  }'
```

**Request Body**:
```typescript
{
  domainId: string;      // Required
  certificate: string;   // Required (PEM format)
  privateKey: string;    // Required (PEM format)
  chain?: string;        // Optional (PEM format)
  issuer?: string;       // Optional, default: "Manual Upload"
}
```

**Response**:
```json
{
  "message": "SSL certificate uploaded successfully",
  "data": {
    "id": "cert-999",
    "domainId": "domain-456",
    "commonName": "example.com",
    "issuer": "Manual Upload",
    "validFrom": "2025-01-01T00:00:00.000Z",
    "validTo": "2026-01-01T23:59:59.000Z",
    "autoRenew": false,
    "status": "valid"
  }
}
```

**Validation Rules**:
- `domainId`: Required
- `certificate`: Required, must be valid PEM format
- `privateKey`: Required, must be valid PEM format, must match certificate
- `chain`: Optional, must be valid PEM format if provided

**Errors**:
- `400`: Domain ID is required
- `400`: Certificate is required
- `400`: Private key is required
- `400`: Invalid certificate format
- `400`: Private key doesn't match certificate
- `400`: Domain already has SSL certificate

---

#### 5. Update SSL Certificate

**Endpoint**: `PUT /api/ssl/:id`  
**Permission**: Admin, Moderator

**Request**:
```bash
curl -X PUT http://localhost:3001/api/ssl/cert-123 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "autoRenew": true
  }'
```

**Request Body**:
```typescript
{
  certificate?: string;   // Optional (PEM format)
  privateKey?: string;    // Optional (PEM format)
  chain?: string;         // Optional (PEM format)
  autoRenew?: boolean;    // Optional
}
```

**Response**:
```json
{
  "message": "SSL certificate updated successfully",
  "data": {
    "id": "cert-123",
    "autoRenew": true
  }
}
```

**Note**: Typically used to update autoRenew setting. Updating certificate files is rare (better to delete and re-add).

---

#### 6. Delete SSL Certificate

**Endpoint**: `DELETE /api/ssl/:id`  
**Permission**: Admin, Moderator

**Request**:
```bash
curl -X DELETE http://localhost:3001/api/ssl/cert-123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response**:
```json
{
  "message": "SSL certificate deleted successfully"
}
```

**What happens**:
- Certificate files removed from `/etc/nginx/ssl/`
- Database record deleted
- Domain's `sslEnabled` set to false
- Nginx configuration updated
- Nginx reloaded

**Errors**:
- `404`: Certificate not found
- `500`: Failed to delete certificate files

---

#### 7. Renew SSL Certificate

**Endpoint**: `POST /api/ssl/:id/renew`  
**Permission**: Admin, Moderator

**Request**:
```bash
curl -X POST http://localhost:3001/api/ssl/cert-123/renew \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response**:
```json
{
  "message": "Certificate renewed successfully",
  "data": {
    "id": "cert-123",
    "commonName": "example.com",
    "issuer": "Let's Encrypt",
    "validFrom": "2025-01-18T00:00:00.000Z",
    "validTo": "2025-04-18T23:59:59.000Z",
    "status": "valid"
  }
}
```

**Note**: Only works for Let's Encrypt certificates. Manual certificates cannot be renewed via API.

**Errors**:
- `400`: Certificate is not from Let's Encrypt (cannot renew manual certificates)
- `404`: Certificate not found
- `500`: Renewal failed (check domain DNS, port 80, Let's Encrypt API status)

---

## Permissions Summary

| Action | Admin | Moderator | Viewer |
|--------|-------|-----------|--------|
| View SSL certificates | ✅ | ✅ | ✅ |
| View certificate details | ✅ | ✅ | ✅ |
| Add certificate (Auto/Manual) | ✅ | ✅ | ❌ |
| Renew certificate | ✅ | ✅ | ❌ |
| Delete certificate | ✅ | ✅ | ❌ |
| Update certificate settings | ✅ | ✅ | ❌ |

**Note**: Viewers have read-only access to SSL certificates.

---

## Quick Reference

### Certificate Types

| Type | Issuer | Cost | Auto-Renew | Renewal Method | Use Case |
|------|--------|------|------------|----------------|----------|
| **Let's Encrypt** | Let's Encrypt | Free | Yes (optional) | Automatic or manual click | Most websites |
| **Manual Upload** | Various | Varies | No | Re-upload new cert | Wildcard, EV, internal CA |

### File Locations

```
/etc/nginx/ssl/
├── example.com.crt         # Certificate
├── example.com.key         # Private key
└── example.com.chain.pem   # Certificate chain
```

### Default Values

| Setting | Default Value |
|---------|---------------|
| Auto-Renew (Let's Encrypt) | ON (enabled) |
| Expiring Threshold | 30 days |
| Certificate Validity (Let's Encrypt) | 90 days |
| Renewal Trigger | 30 days before expiry |

### Status Indicators

| Status | Color | Days Until Expiry | Action Required |
|--------|-------|-------------------|-----------------|
| valid | Blue | > 30 days | None |
| expiring | Blue | ≤ 30 days | Renew soon |
| expired | Red | < 0 days (past expiry) | Renew immediately |

### Common Commands

```bash
# Test certificate
openssl x509 -in certificate.crt -text -noout

# Check certificate expiry
openssl x509 -in certificate.crt -noout -dates

# Verify private key matches certificate
openssl x509 -noout -modulus -in certificate.crt | openssl md5
openssl rsa -noout -modulus -in privatekey.key | openssl md5

# Test HTTPS connection
curl -I https://example.com

# Check certificate from browser
openssl s_client -connect example.com:443 -servername example.com
```

---

## Related Documentation

- [Domain Management](./domains.md) - Configure domains before adding SSL
- [Access Lists](./Access_Lists.md) - Combine SSL with IP whitelisting and HTTP Basic Auth
- [ModSecurity](./modsecurity.md) - Web Application Firewall protection
- [Performance Monitoring](./performance.md) - Monitor SSL/TLS performance
- [Logs](./logs.md) - View SSL-related access and error logs

---

## Support

If you encounter SSL-related issues:

1. **Check Certificate Status**: View status in SSL table
2. **Check Nginx Logs**: `tail -f /var/log/nginx/error.log`
3. **Test Certificate**: Use `openssl` commands above
4. **Verify DNS**: Ensure domain points to server
5. **Check Firewall**: Ports 80 and 443 must be open
6. **Review Documentation**: Re-read relevant troubleshooting sections
7. **Contact Support**: Provide logs, error messages, domain name

---

**Last Updated**: January 18, 2025  
**Documentation Version**: 2.0.0  
**System Version**: Based on actual implementation
