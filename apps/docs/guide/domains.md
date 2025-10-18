# Domain Management - User Guide

## Overview

Domain Management is the core feature of the Nginx WAF Management Platform, allowing you to configure and manage multiple domains (websites/applications) through a web interface. Each domain acts as a reverse proxy, forwarding traffic to one or more backend servers (upstreams) with advanced features like load balancing, SSL/TLS support, ModSecurity WAF protection, and health monitoring.

### Key Features

- ✅ **Multiple Domain Support**: Manage unlimited domains from a single interface
- ✅ **Reverse Proxy**: Forward HTTP/HTTPS traffic to backend servers
- ✅ **Load Balancing**: Distribute traffic across multiple backends with Round Robin, Least Connections, or IP Hash
- ✅ **HTTPS Backend Support**: Proxy to HTTPS upstream servers with SSL verification options
- ✅ **ModSecurity WAF**: Web Application Firewall protection per domain
- ✅ **Health Checks**: Automatic backend health monitoring and failover
- ✅ **Real IP Detection**: Extract real client IP from Cloudflare or custom proxies
- ✅ **HTTP/2 Support**: Enable HTTP/2 protocol for better performance
- ✅ **WebSocket Support**: Automatic WebSocket connection upgrade (enabled by default)
- ✅ **gRPC Support**: Native support for gRPC applications (grpc_pass/grpcs_pass)
- ✅ **HSTS**: HTTP Strict Transport Security header enforcement
- ✅ **Custom Locations**: Define custom location blocks with different backends and configurations
- ✅ **Real-time Management**: Changes apply immediately with automatic Nginx reload

### How It Works

```
            Internet
               ↓
      [Nginx Reverse Proxy]
        (Load Balancer)
              ↓
  ┌────────┬───────┬───────┐
  ↓        ↓       ↓       ↓
Backend Backend Backend Backend
Server1 Server2 Server3 Server4
```

**Request Flow**:
1. Client sends request to domain (e.g., `example.com`)
2. Nginx receives request on port 80 (HTTP) or 443 (HTTPS)
3. SSL/TLS termination if HTTPS enabled
4. ModSecurity WAF checks for threats (if enabled)
5. Health check validates backend availability
6. Load balancer selects healthy backend server
7. Request forwarded to backend server
8. Response returned to client

---

## Getting Started

### Accessing Domain Management

1. Log in to the Nginx WAF Management Platform
2. From the sidebar menu, click **Domains**
3. You will see the Domain Management dashboard

**Permission Required**:
- **Admin** and **Moderator**: Can create, edit, toggle SSL, view domains
- **Admin only**: Can delete domains
- **Viewer**: Read-only access (can view domain list and details)

### Dashboard Overview

The Domain Management page displays:

#### Statistics (Top Section)
- **Total Domains**: Number of all domains
- **Active Domains**: Domains with status "active"
- **SSL Enabled**: Domains with SSL/HTTPS enabled

#### Toolbar
- **Search Bar**: Quick search by domain name
- **Filters**:
  - Status: All / Active / Inactive
  - SSL Enabled: All / True / False
  - ModSecurity Enabled: All / True / False
- **Sorting**: Sort by name, creation date, last modified
- **Pagination**: Navigate through domain lists (10, 25, 50 per page)
- **Create Domain** button (top-right)

#### Domain Table

Columns displayed:

| Column | Description |
|--------|-------------|
| **Name** | Domain name (e.g., example.com) |
| **Status** | Badge: Active (green) / Inactive (gray) / Error (red) |
| **SSL** | Badge: Enabled (green) / Disabled (gray) |
| **ModSec** | Badge: Enabled (green) / Disabled (gray) |
| **Upstreams** | Number of backend servers (e.g., "3 backends") |
| **Enabled** | Toggle switch to enable/disable domain |
| **Actions** | SSL toggle, Edit, Delete buttons |

**Table Features**:
- Click column headers to sort
- Use search to filter by domain name
- Toggle switches update status immediately
- Pagination at bottom

---

## Creating a Domain

**Permission Required**: Admin or Moderator

### Step 1: Open Create Dialog

1. Click **"Create Domain"** button (top-right, Plus icon)
2. Dialog opens with 3 tabs: **Basic**, **Security**, **Advanced**

### Step 2: Basic Configuration Tab

The Basic tab contains essential domain settings.

#### Domain Name (Required)

**Field**: Text input  
**Placeholder**: `example.com`  
**Validation**: Must be valid domain name format

**Valid Format**:
- Letters (a-z, A-Z), numbers (0-9), hyphens (-), periods (.)
- Cannot start/end with hyphen or period
- Must be unique (no duplicate domains)

**Valid Examples**:
```
example.com
www.example.com
api.example.com
staging-app.example.org
my-app123.example.com
```

**Invalid Examples**:
```
-example.com      # Cannot start with hyphen
example.com-      # Cannot end with hyphen
.example.com      # Cannot start with period
example..com      # Cannot have consecutive periods
example com       # Cannot have spaces
example_com       # Underscores not allowed
```

#### Status

**Field**: Dropdown select  
**Options**:
- **Active**: Domain is enabled and accessible
- **Inactive**: Domain is disabled

**Default**: Active

**Note**: Status can also be toggled from the table view using the Enable/Disable switch.

#### Load Balancer Algorithm

**Field**: Dropdown select  
**Options**:

1. **Round Robin** (Default)
   - Distributes requests evenly across all backends
   - Each backend gets requests in turn
   - Simple and effective for most cases
   - **Best for**: Equal backend capacity

2. **Least Connections**
   - Routes to backend with fewest active connections
   - Better for long-lived connections
   - Automatic load balancing based on current load
   - **Best for**: Mixed request durations

3. **IP Hash**
   - Same client IP always goes to same backend
   - Maintains session affinity
   - Based on client IP address hash
   - **Best for**: Session-based applications without shared storage

**Default**: Round Robin

#### Upstream Backends (Required)

Configure one or more backend servers that will handle requests.

**Add Backend Button**: Click "Add Backend" to add more upstream servers  
**Remove Button**: Trash icon removes a backend (minimum 1 required)

**Each backend has the following fields**:

##### 1. Host (Required)

**Field**: Text input  
**Placeholder**: `10.0.1.10`  
**Format**: IP address or hostname

**Examples**:
```
# IP addresses
192.168.1.100
10.0.0.50
172.16.0.10

# Hostnames
backend.internal
app-server-1.local
api.myapp.com

# Cloud services
ec2-instance.amazonaws.com
myapp.azurewebsites.net
```

##### 2. Port

**Field**: Number input  
**Placeholder**: `80`  
**Range**: 1 - 65535  
**Default**: 80

**Common Ports**:
- `80` - HTTP
- `443` - HTTPS
- `3000` - Node.js default
- `5000` - Flask/Python default
- `8000` - Django/alternate HTTP
- `8080` - Alternate HTTP
- `8443` - Alternate HTTPS
- `9000` - PHP-FPM

##### 3. Protocol

**Field**: Dropdown select  
**Options**:
- **HTTP** - Standard HTTP connection to backend
- **HTTPS** - Encrypted HTTPS connection to backend

**Default**: HTTP

**Note**: Choose HTTPS if your backend server uses HTTPS/SSL.

##### 4. Disable SSL Verification (HTTPS only)

**Field**: Toggle switch  
**Visibility**: Only shown when Protocol = HTTPS  
**Label**: "Disable SSL Verification"  
**Description**: "Skip backend certificate validation"

**Options**:
- **OFF** (Default): Verify backend SSL certificate (sslVerify = true)
- **ON**: Skip certificate verification (sslVerify = false)

**When to disable**:
- ✅ Backend uses self-signed certificate
- ✅ Internal testing environment
- ✅ Backend certificate is expired/invalid
- ⚠️ **Not recommended for production** - security risk

##### 5. Weight

**Field**: Number input  
**Range**: 1 - 100  
**Default**: 1

**Purpose**: Proportional load distribution  
**Example**:
- Backend A: weight = 3
- Backend B: weight = 1
- Result: Backend A gets 75% traffic, Backend B gets 25%

**Use Cases**:
- Backends with different capacity (powerful server = higher weight)
- Gradual traffic migration (increase weight slowly)
- Blue-green deployment testing

##### 6. Max Fails

**Field**: Number input  
**Range**: 1 - 10  
**Default**: 3

**Purpose**: Number of failed attempts before marking backend as unavailable  
**Behavior**: After N failed requests, backend is temporarily disabled

**Examples**:
- `1` = Very sensitive, disable after first failure
- `3` = Balanced (recommended)
- `10` = Very tolerant, requires many failures

##### 7. Fail Timeout (seconds)

**Field**: Number input  
**Range**: 1 - 300  
**Default**: 30

**Purpose**: How long to wait before retrying a failed backend  
**Behavior**: After backend fails, it's disabled for N seconds before retry

**Examples**:
- `10` = Quick retry (10 seconds)
- `30` = Balanced (recommended)
- `60` = Conservative (1 minute)
- `300` = Very conservative (5 minutes)

#### Example Upstream Configuration

**Single Backend**:
```
Backend #1:
  Host: 192.168.1.100
  Port: 8080
  Protocol: HTTP
  Weight: 1
  Max Fails: 3
  Fail Timeout: 30s
```

**Multiple Backends (Load Balanced)**:
```
Backend #1:
  Host: 192.168.1.100
  Port: 8080
  Protocol: HTTP
  Weight: 2
  Max Fails: 3
  Fail Timeout: 30s

Backend #2:
  Host: 192.168.1.101
  Port: 8080
  Protocol: HTTP
  Weight: 1
  Max Fails: 3
  Fail Timeout: 30s

Backend #3 (HTTPS backend):
  Host: secure-backend.internal
  Port: 443
  Protocol: HTTPS
  Disable SSL Verification: ON
  Weight: 1
  Max Fails: 3
  Fail Timeout: 30s
```

---

### Step 3: Security Configuration Tab

The Security tab configures ModSecurity WAF, Real IP detection, and Health Checks.

#### Enable ModSecurity WAF

**Field**: Toggle switch  
**Label**: "Enable ModSecurity WAF"  
**Description**: "Activate Web Application Firewall protection"  
**Default**: ON (enabled)

**What it does**:
- ✅ Enables OWASP ModSecurity Core Rule Set (CRS)
- ✅ Protects against SQL injection, XSS, RCE attacks
- ✅ Blocks malicious requests based on security rules
- ✅ Logs security events

**When to enable**: All production domains (strongly recommended)  
**When to disable**: Development/testing only (not recommended for production)

**Note**: You can manage ModSecurity rules separately in the ModSecurity section.

#### Get Real Client IP from Proxy Headers

**Field**: Toggle switch  
**Label**: "Get Real Client IP from Proxy Headers"  
**Description**: "Enable real IP detection (for Cloudflare/CDN)"  
**Default**: OFF (disabled)

**What it does**:
- Extracts real client IP from `X-Forwarded-For` or `X-Real-IP` headers
- Necessary when behind CDN/proxy (Cloudflare, CloudFront, etc.)
- Without this, all requests appear to come from CDN IP

**When to enable**:
- ✅ Using Cloudflare
- ✅ Using any CDN (CloudFront, Akamai, Fastly)
- ✅ Behind load balancer
- ✅ Behind another reverse proxy

**When to disable**:
- ✅ Direct connection to internet (no proxy)
- ✅ Internal services

##### Use Cloudflare IP Ranges

**Field**: Toggle switch (nested under Real IP)  
**Visibility**: Only shown when "Get Real Client IP" is enabled  
**Label**: "Use Cloudflare IP Ranges"  
**Description**: "Automatically trust all Cloudflare IPs"  
**Default**: OFF

**What it does**:
- Automatically adds all official Cloudflare IP ranges to trusted proxies
- Uses Cloudflare's published IP list
- Updates automatically

**When to enable**:
- ✅ Using Cloudflare as CDN
- ✅ All traffic comes through Cloudflare

**When to disable**:
- ✅ Not using Cloudflare
- ✅ Using custom CDN/proxy

#### Monitor Backend Availability

**Field**: Toggle switch  
**Label**: "Monitor Backend Availability"  
**Description**: "Enable health checks for upstream backends"  
**Default**: ON (enabled)

**What it does**:
- Periodically checks backend server availability
- Automatically removes failed backends from load balancer
- Restores backends when they recover

**When to enable**: Production environments (strongly recommended)  
**When to disable**: Development/testing (optional)

##### Health Check Path

**Field**: Text input  
**Visibility**: Only shown when health checks enabled  
**Placeholder**: `/health`  
**Default**: `/health`

**Purpose**: HTTP path to check for backend availability  
**Format**: Must start with `/`

**Common Examples**:
```
/health          # Standard health check endpoint
/status          # Status endpoint
/api/health      # API health check
/ping            # Simple ping endpoint
/              # Root path (home page)
```

**Backend Response**: Should return HTTP 200 OK when healthy

##### Health Check Interval

**Field**: Number input  
**Visibility**: Only shown when health checks enabled  
**Unit**: Seconds  
**Default**: 30  
**Range**: 1 - 300

**Purpose**: How often to check backend health  
**Recommendation**: 30-60 seconds for most applications

**Examples**:
- `10` = Very frequent (high load on backends)
- `30` = Balanced (recommended)
- `60` = Less frequent (lower load)

##### Health Check Timeout

**Field**: Number input  
**Visibility**: Only shown when health checks enabled  
**Unit**: Seconds  
**Default**: 5  
**Range**: 1 - 60

**Purpose**: Maximum time to wait for health check response  
**Recommendation**: 5-10 seconds

**Examples**:
- `5` = Fast timeout (recommended)
- `10` = Moderate timeout
- `30` = Long timeout (slow backends)

**Note**: Timeout should be less than Interval.

---

### Step 4: Advanced Configuration Tab

The Advanced tab contains HTTP/2, HSTS, gRPC, and Custom Location settings.

#### Enable HSTS Header

**Field**: Toggle switch  
**Label**: "Enable HSTS (HTTP Strict Transport Security)"  
**Description**: "Force browsers to use HTTPS only"  
**Default**: OFF (disabled)

**What it does**:
- Adds `Strict-Transport-Security` header to responses
- Browsers remember to always use HTTPS for this domain
- Prevents downgrade attacks

**Header Added**: `Strict-Transport-Security: max-age=31536000; includeSubDomains`

**When to enable**:
- ✅ Domain has valid SSL certificate
- ✅ All content is available over HTTPS
- ✅ Production sites with HTTPS

**When to disable**:
- ✅ Development/testing
- ✅ SSL not yet configured
- ⚠️ **Warning**: Once enabled, browsers cache this for 1 year

#### Enable HTTP/2

**Field**: Toggle switch  
**Label**: "Enable HTTP/2 Protocol"  
**Description**: "Improve performance with HTTP/2 (requires SSL)"  
**Default**: ON (enabled)

**What it does**:
- Enables HTTP/2 protocol for better performance
- Multiplexing, server push, header compression
- Faster page load times

**Requirements**:
- ⚠️ Requires SSL/TLS to be enabled
- Only works with HTTPS

**When to enable**: Always (recommended) - improves performance  
**When to disable**: Rarely needed (compatibility issues with very old clients)

#### WebSocket Support

**Type**: Automatic (always enabled)  
**No configuration needed**: WebSocket support is enabled by default for all domains

**What it does**:
- Automatically upgrades HTTP connections to WebSocket protocol
- Adds `Upgrade: websocket` and `Connection: upgrade` headers
- Sets long timeouts for WebSocket connections (24 hours read/send timeout)
- Uses nginx map directive for connection upgrade handling

**How it works**:
```nginx
# Automatically configured by system
map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}

# Applied to all proxy locations
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection $connection_upgrade;
proxy_read_timeout 86400s;  # 24 hours
proxy_send_timeout 86400s;  # 24 hours
```

**Supported WebSocket Applications**:
- ✅ Socket.io servers
- ✅ Real-time chat applications
- ✅ Live data streaming
- ✅ WebSocket APIs
- ✅ Server-sent events (SSE)
- ✅ SignalR applications

**No configuration needed** - just deploy your WebSocket application and it works automatically.

#### Enable gRPC Support

**Field**: Toggle switch  
**Label**: "Enable gRPC Support"  
**Description**: "Use gRPC protocol instead of standard HTTP proxy"  
**Default**: OFF (disabled)

**What it does**:
- Changes default proxy from `proxy_pass` to `grpc_pass`
- Enables gRPC protocol support
- Uses HTTP/2 for gRPC communication

**When to enable**:
- ✅ Backend is a gRPC service
- ✅ Using Protocol Buffers
- ✅ Microservices with gRPC

**When to disable**:
- ✅ Standard HTTP/HTTPS applications (most common)

**Note**: If enabled, main location uses `grpc://` instead of `http://`

#### Custom Location Blocks

Define custom location blocks with different backends and configurations.

**Purpose**: Route different URL paths to different backends

**Use Cases**:
- `/api/*` → API backend server
- `/admin/*` → Admin panel backend
- `/static/*` → Static file server
- `/grpc/*` → gRPC service

##### Adding Custom Locations

1. Click **"Add Custom Location"** button
2. Configure location settings
3. Add multiple locations as needed
4. Remove with trash icon button

##### Custom Location Fields

###### 1. Path (Required)

**Field**: Text input  
**Placeholder**: `/api`  
**Format**: Must start with `/`

**Purpose**: URL path to match

**Examples**:
```
/api              # Matches /api, /api/users, /api/products
/admin            # Matches /admin, /admin/dashboard
/static           # Matches /static/css, /static/js
/v1               # API versioning
/grpc             # gRPC services
```

**Nginx Matching**:
- `/api` matches `/api/anything`
- Use `location /api { ... }` in nginx config

###### 2. Use Upstream Backend Servers

**Field**: Toggle switch  
**Label**: "Use Upstream Backend Servers"  
**Description**: "Auto-generate proxy configuration or write custom nginx config"  
**Default**: ON (enabled)

**Options**:

**When ON (Upstream Enabled)**:
- System auto-generates `proxy_pass` or `grpc_pass` configuration
- Must configure at least 1 backend server
- Easier and recommended

**When OFF (Custom Config)**:
- Must write complete nginx configuration manually
- For advanced users only
- Full control over nginx directives

###### 3. Upstream Type (When Upstream Enabled)

**Field**: Dropdown select  
**Visibility**: Only shown when "Use Upstream Backend Servers" is ON

**Options**:

1. **HTTP/HTTPS Proxy** (`proxy_pass`)
   - Standard HTTP/HTTPS reverse proxy
   - Most common option
   - **Use for**: Web applications, APIs, REST services

2. **gRPC (HTTP/2)** (`grpc_pass`)
   - gRPC over HTTP/2 without TLS
   - **Use for**: gRPC services (grpc://)

3. **gRPC (TLS)** (`grpcs_pass`)
   - gRPC over HTTP/2 with TLS
   - **Use for**: Secure gRPC services (grpcs://)

**Default**: HTTP/HTTPS Proxy

###### 4. Backend Servers (When Upstream Enabled)

**Field**: Multiple backend configurations (required)  
**Visibility**: Only shown when "Use Upstream Backend Servers" is ON  
**Label**: "Backend Servers * (Required)"

**Requirements**:
- At least 1 backend server required
- Each backend must have valid host and port

**Backend Fields** (same as main upstreams):
- **Host** (Required): IP or hostname
- **Port** (Required): 1-65535
- **Protocol**: HTTP or HTTPS
- **Disable SSL Verification**: Toggle (HTTPS only)
- **Weight**: 1-100
- **Max Fails**: 1-10
- **Timeout**: 1-300 seconds

**Add Server Button**: Click to add more backends  
**Remove Button**: Trash icon (minimum 1 required)

###### 5. Additional Config (When Upstream Enabled)

**Field**: Textarea (optional)  
**Visibility**: Only shown when "Use Upstream Backend Servers" is ON  
**Placeholder**: `# Add custom nginx directives (do NOT include proxy_pass/grpc_pass)`  
**Rows**: 3

**Purpose**: Add custom nginx directives to this location

**Example**:
```nginx
# Custom headers
proxy_set_header X-Custom-Header "value";
add_header X-Frame-Options "SAMEORIGIN";

# Timeouts
proxy_read_timeout 120s;
proxy_connect_timeout 10s;

# Cache
proxy_cache my_cache;
proxy_cache_valid 200 10m;
```

**Note**: Do NOT include `proxy_pass` or `grpc_pass` - system generates this automatically.

###### 6. Custom Nginx Configuration (When Upstream Disabled)

**Field**: Textarea (required)  
**Visibility**: Only shown when "Use Upstream Backend Servers" is OFF  
**Label**: "Custom Nginx Configuration * (Required)"  
**Placeholder**: Example nginx config  
**Rows**: 6

**Purpose**: Write complete nginx configuration for this location

**Example**:
```nginx
# Static file serving
root /var/www/static;
autoindex on;

# OR proxy to specific backend
proxy_pass http://192.168.1.100:8080/;
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
```

**Requirements**:
- Must include complete nginx directives
- Must include `proxy_pass`, `grpc_pass`, `root`, or other directive
- Advanced users only

#### Example Custom Location Configurations

**Example 1: API Backend**
```
Path: /api
Use Upstream: ON
Upstream Type: HTTP/HTTPS Proxy
Backend #1:
  Host: 192.168.1.100
  Port: 3000
  Protocol: HTTP
  Weight: 1
Additional Config:
  proxy_read_timeout 60s;
  add_header X-API-Version "v1";
```

**Example 2: gRPC Service**
```
Path: /grpc
Use Upstream: ON
Upstream Type: gRPC (HTTP/2)
Backend #1:
  Host: grpc-server.internal
  Port: 50051
  Protocol: HTTP
  Weight: 1
```

**Example 3: Static Files (Custom Config)**
```
Path: /static
Use Upstream: OFF
Custom Nginx Configuration:
  root /var/www/static;
  expires 30d;
  add_header Cache-Control "public, immutable";
```

**Example 4: Admin Panel with Authentication**
```
Path: /admin
Use Upstream: ON
Upstream Type: HTTP/HTTPS Proxy
Backend #1:
  Host: admin-backend.internal
  Port: 8080
  Protocol: HTTPS
  Disable SSL Verification: ON
Additional Config:
  auth_basic "Admin Area";
  auth_basic_user_file /etc/nginx/.htpasswd;
```

---

### Step 5: Save Domain

1. Review all configuration in all tabs
2. Click **"Create Domain"** button (bottom-right)
3. System validates all inputs
4. If validation passes:
   - Domain record created in database
   - Nginx vhost configuration file generated (`/etc/nginx/sites-available/domain-name.conf`)
   - Nginx configuration tested (`nginx -t`)
   - Nginx reloaded (`nginx -s reload`)
   - Success notification appears
   - Dialog closes
   - Domain appears in table
5. If validation fails:
   - Error messages shown
   - Dialog remains open
   - Fix errors and try again

**Validation Checks**:
- ✅ Domain name is valid format
- ✅ Domain name is unique (not duplicate)
- ✅ At least 1 upstream backend configured
- ✅ All upstream backends have valid host and port
- ✅ Custom locations (if any) have required fields
- ✅ Nginx configuration syntax is valid

**What Happens After Creation**:
- ✅ Nginx vhost file created
- ✅ Domain is active and accessible (if status = active)
- ✅ Load balancing is working
- ✅ ModSecurity is active (if enabled)
- ✅ Health checks running (if enabled)

---

## Editing a Domain

**Permission Required**: Admin or Moderator

### How to Edit

1. Find domain in table
2. Click **Edit** button (pencil icon) in Actions column
3. Dialog opens with current settings loaded
4. All 3 tabs available: Basic, Security, Advanced
5. Make changes as needed
6. Click **"Update Domain"** button

### What You Can Edit

| Field | Can Edit? | Notes |
|-------|-----------|-------|
| Domain Name | ❌ No | Domain name cannot be changed after creation |
| Status | ✅ Yes | Change Active/Inactive |
| LB Algorithm | ✅ Yes | Change load balancing method |
| Upstreams | ✅ Yes | Add, remove, or modify backends |
| ModSecurity | ✅ Yes | Enable/disable WAF |
| Real IP Config | ✅ Yes | Enable/disable, configure Cloudflare |
| Health Checks | ✅ Yes | Enable/disable, change settings |
| HSTS | ✅ Yes | Enable/disable |
| HTTP/2 | ✅ Yes | Enable/disable |
| gRPC | ✅ Yes | Enable/disable |
| Custom Locations | ✅ Yes | Add, remove, or modify |

**Note**: Cannot change domain name. To rename, create new domain and delete old one.

### After Editing

1. Click "Update Domain"
2. System validates changes
3. Nginx vhost file regenerated
4. Nginx configuration tested
5. Nginx reloaded
6. Changes take effect immediately

---

## Toggling SSL

**Permission Required**: Admin or Moderator

### How to Toggle SSL

**Method 1: From Table (Quick Toggle)**
1. Find domain in table
2. Click **SSL toggle button** (Shield icon) in Actions column
3. Confirmation dialog may appear
4. SSL is enabled or disabled
5. Nginx reloaded

**Method 2: From Domain Details**
- SSL management is separate feature
- See [SSL Certificates Guide](./ssl.md) for details

### What Happens When Enabling SSL

- ✅ System checks for valid SSL certificate
- ✅ Nginx configured to listen on port 443 (HTTPS)
- ✅ HTTP to HTTPS redirect enabled (optional)
- ✅ SSL certificate files referenced in nginx config
- ✅ Nginx reloaded

### What Happens When Disabling SSL

- ✅ HTTPS disabled (port 443 removed)
- ✅ Only HTTP available (port 80)
- ✅ SSL certificate remains in system (not deleted)
- ✅ Can re-enable anytime

---

## Toggling Domain Status

**Permission Required**: Admin or Moderator

### Using Enable/Disable Switch

1. Find domain in table
2. Click **Enabled** toggle switch
3. Status changes immediately
4. Nginx reloaded

### Status Meanings

**Active** (Switch ON):
- ✅ Domain is accessible
- ✅ Nginx serves traffic
- ✅ All features working

**Inactive** (Switch OFF):
- ❌ Domain is disabled
- ❌ Nginx returns 503 Service Unavailable
- ❌ No traffic forwarded to backends

**Use Cases**:
- Temporarily disable domain during maintenance
- Stop traffic while investigating issues
- Disable before making major backend changes

---

## Deleting a Domain

**Permission Required**: Admin only

### How to Delete

1. Find domain in table
2. Click **Delete** button (trash icon) in Actions column
3. Confirmation dialog appears:
   - Title: "Delete Domain"
   - Message: "Are you sure you want to delete **domain-name**?"
   - Warning: "This action cannot be undone"
4. Click "Delete" to confirm (or "Cancel" to abort)
5. System performs deletion
6. Success notification
7. Domain removed from table

### What Gets Deleted

- ✅ Domain record in database
- ✅ All upstream configurations
- ✅ Load balancer settings
- ✅ Nginx vhost configuration file
- ⚠️ **SSL certificate NOT deleted** (remains in system)
- ⚠️ **ModSecurity rules NOT deleted** (can be reused)

### After Deletion

- ✅ Nginx vhost file removed from `/etc/nginx/sites-available/`
- ✅ Nginx reloaded
- ✅ Domain no longer accessible
- ✅ Audit log entry created

**Restrictions**:
- ⚠️ Cannot restore after deletion
- ⚠️ Must re-create domain manually if needed

### Before Deleting

**Recommended Steps**:
1. ✅ Export domain configuration (backup)
2. ✅ Verify you're deleting correct domain
3. ✅ Check if SSL certificate is used by other domains
4. ✅ Notify team members
5. ✅ Update DNS if needed

---

## Domain Table Features

### Search

**Location**: Top toolbar  
**Field**: Search input with icon  
**Functionality**: Filter domains by name

**Example**:
- Type "api" → Shows api.example.com, api-staging.com, etc.
- Case-insensitive
- Real-time filtering

### Filters

#### Status Filter

**Options**:
- All
- Active
- Inactive

**Effect**: Shows only domains matching selected status

#### SSL Enabled Filter

**Options**:
- All
- True (SSL enabled)
- False (SSL disabled)

**Effect**: Shows only domains with/without SSL

#### ModSecurity Enabled Filter

**Options**:
- All
- True (ModSec enabled)
- False (ModSec disabled)

**Effect**: Shows only domains with/without ModSecurity

### Sorting

Click column headers to sort:
- **Name**: A-Z or Z-A
- **Created At**: Newest or Oldest
- **Updated At**: Recently modified first

Default sort: Newest first (by Created At)

### Pagination

**Location**: Bottom of table

**Controls**:
- **Page Size**: 10, 25, 50 items per page
- **Previous/Next**: Navigate pages
- **Page Info**: "Showing 1-10 of 45"

---

## Common Scenarios

### Scenario 1: Simple Single Backend Website

**Use Case**: Personal blog or simple application

**Configuration**:
```
Basic Tab:
  Domain Name: blog.example.com
  Status: Active
  LB Algorithm: Round Robin
  
  Upstream #1:
    Host: 192.168.1.100
    Port: 8080
    Protocol: HTTP
    Weight: 1
    Max Fails: 3
    Fail Timeout: 30

Security Tab:
  ModSecurity: ON
  Real IP: OFF
  Health Checks: ON
    Path: /
    Interval: 30s
    Timeout: 5s

Advanced Tab:
  HSTS: OFF (until SSL configured)
  HTTP/2: ON
  gRPC: OFF
  Custom Locations: None
```

### Scenario 2: Load Balanced Application

**Use Case**: Production application with 3 backend servers

**Configuration**:
```
Basic Tab:
  Domain Name: app.example.com
  Status: Active
  LB Algorithm: Least Connections
  
  Upstream #1:
    Host: 192.168.1.101
    Port: 3000
    Weight: 2
    
  Upstream #2:
    Host: 192.168.1.102
    Port: 3000
    Weight: 2
    
  Upstream #3:
    Host: 192.168.1.103
    Port: 3000
    Weight: 1

Security Tab:
  ModSecurity: ON
  Real IP: ON
  Cloudflare: ON
  Health Checks: ON
    Path: /health
    Interval: 30s

Advanced Tab:
  HSTS: ON
  HTTP/2: ON
```

**WebSocket Support**: Automatically enabled - Socket.io and real-time features work out of the box

### Scenario 3: Microservices with Custom Locations

**Use Case**: Microservices architecture with different backends per path

**Configuration**:
```
Basic Tab:
  Domain Name: services.example.com
  Status: Active
  LB Algorithm: Round Robin
  
  Main Upstream #1:
    Host: frontend.internal
    Port: 80

Security Tab:
  ModSecurity: ON
  Health Checks: ON

Advanced Tab:
  Custom Location #1:
    Path: /api
    Upstream Type: HTTP/HTTPS Proxy
    Backend: api-service.internal:8080
    
  Custom Location #2:
    Path: /auth
    Upstream Type: HTTP/HTTPS Proxy
    Backend: auth-service.internal:9000
    
  Custom Location #3:
    Path: /grpc
    Upstream Type: gRPC (HTTP/2)
    Backend: grpc-service.internal:50051
```

### Scenario 4: HTTPS Backend with Self-Signed Certificate

**Use Case**: Backend uses HTTPS with self-signed cert

**Configuration**:
```
Basic Tab:
  Upstream #1:
    Host: secure-backend.internal
    Port: 443
    Protocol: HTTPS
    Disable SSL Verification: ON
    
Security Tab:
  ModSecurity: ON
  Health Checks: ON
```

### Scenario 5: Cloudflare CDN with Real IP

**Use Case**: Domain behind Cloudflare CDN

**Configuration**:
```
Security Tab:
  ModSecurity: ON
  Real IP: ON
  Cloudflare: ON

Advanced Tab:
  HSTS: ON
  HTTP/2: ON
```

### Scenario 6: WebSocket Real-Time Application

**Use Case**: Chat application or real-time dashboard with Socket.io

**Configuration**:
```
Basic Tab:
  Domain Name: chat.example.com
  Status: Active
  LB Algorithm: IP Hash  # Important for WebSocket session persistence
  
  Upstream #1:
    Host: 192.168.1.100
    Port: 3000
    
  Upstream #2:
    Host: 192.168.1.101
    Port: 3000

Security Tab:
  ModSecurity: ON
  Real IP: ON (if behind CDN)
  Health Checks: ON
    Path: /health
    Interval: 30s

Advanced Tab:
  HTTP/2: ON
```

**Notes**:
- ✅ WebSocket support is automatic - no configuration needed
- ✅ Use IP Hash algorithm for sticky sessions (same client always to same server)
- ✅ Long connection timeouts (24 hours) are set automatically
- ✅ Upgrade and Connection headers configured automatically
- ✅ Works with Socket.io, WS library, SignalR, etc.

---

## Troubleshooting

### Issue 1: Domain Not Accessible

**Symptoms**: Domain returns 502 Bad Gateway or connection refused

**Possible Causes**:
1. Backend server is down
2. Incorrect backend host/port
3. Firewall blocking connection
4. Backend not listening on specified port

**Solutions**:

**Check Backend Availability**:
```bash
# Test backend connectivity
curl http://backend-ip:port

# Check if backend is listening
netstat -tlnp | grep :8080

# Test from nginx server
curl -v http://192.168.1.100:8080
```

**Check Nginx Logs**:
```bash
# Error log
tail -f /var/log/nginx/error.log

# Access log
tail -f /var/log/nginx/access.log

# Domain-specific log
tail -f /var/log/nginx/domain-name.error.log
```

**Verify Configuration**:
1. Edit domain in UI
2. Check upstream host/port are correct
3. Try toggling domain status OFF then ON

---

### Issue 2: SSL Not Working

**Symptoms**: HTTPS returns certificate error or not accessible

**Possible Causes**:
1. SSL certificate not installed
2. SSL toggle not enabled
3. Certificate expired
4. Wrong certificate for domain

**Solutions**:

**Check SSL Status**:
1. Look at domain table - SSL column should show "Enabled"
2. Click SSL toggle button to enable if disabled

**Install/Renew Certificate**:
- See [SSL Certificates Guide](./ssl.md)
- Use Let's Encrypt for automatic certificates

**Test SSL**:
```bash
# Check certificate
openssl s_client -connect domain.com:443 -servername domain.com

# Online tool
https://www.ssllabs.com/ssltest/
```

---

### Issue 3: Load Balancing Not Working

**Symptoms**: All requests go to same backend

**Possible Causes**:
1. Only one backend configured
2. Wrong load balancer algorithm
3. IP Hash used (sticky sessions)
4. Other backends marked as down

**Solutions**:

**Check Backend Count**:
1. Edit domain
2. Verify multiple upstreams configured
3. Check all backends are healthy

**Check Algorithm**:
1. If using IP Hash, same client always goes to same backend (expected)
2. Try Round Robin or Least Connections

**Check Health Status**:
```bash
# Check nginx upstream status (if status module enabled)
curl http://localhost/nginx_status

# Check logs for backend failures
grep -i "upstream" /var/log/nginx/error.log
```

---

### Issue 4: Health Checks Failing

**Symptoms**: Backends marked as down, 502/503 errors

**Possible Causes**:
1. Health check path doesn't exist
2. Backend too slow to respond
3. Backend returns non-200 status

**Solutions**:

**Verify Health Check Path**:
1. Edit domain → Security tab
2. Check Health Check Path (e.g., `/health`)
3. Test path directly:
```bash
curl http://backend-ip:port/health
# Should return HTTP 200 OK
```

**Adjust Timeouts**:
1. Edit domain → Security tab
2. Increase Health Check Timeout (e.g., from 5s to 10s)
3. Increase Health Check Interval if needed

**Create Health Endpoint**:
```javascript
// Node.js example
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});
```

---

### Issue 5: ModSecurity Blocking Legitimate Requests

**Symptoms**: Legitimate requests return 403 Forbidden

**Possible Causes**:
1. ModSecurity rules too strict
2. False positive detection
3. Custom application triggers rules

**Solutions**:

**Check ModSecurity Logs**:
```bash
# Check audit log
tail -f /var/log/modsec_audit.log

# Look for blocked requests
grep -i "denied" /var/log/modsec_audit.log
```

**Temporary Disable**:
1. Edit domain → Security tab
2. Toggle ModSecurity OFF
3. Test if requests work
4. Re-enable and configure rules

**Configure Rules**:
- See [ModSecurity Guide](./modsecurity.md)
- Whitelist specific rules
- Add custom exceptions

---

### Issue 6: Real IP Not Working

**Symptoms**: ModSecurity/logs show Cloudflare IP instead of client IP

**Possible Causes**:
1. Real IP not enabled
2. Wrong header configuration
3. Not using Cloudflare when Cloudflare toggle is ON

**Solutions**:

**Enable Real IP**:
1. Edit domain → Security tab
2. Toggle "Get Real Client IP" ON
3. If using Cloudflare, toggle "Use Cloudflare IP Ranges" ON
4. Save and test

**Verify**:
```bash
# Check access logs for real IPs
tail -f /var/log/nginx/access.log

# Should show client IPs, not CDN IPs
```

---

### Issue 7: Custom Location Not Working

**Symptoms**: Custom location returns 404 or routes incorrectly

**Possible Causes**:
1. Path doesn't start with `/`
2. Upstream backend not configured
3. Conflicting location blocks
4. Nginx config syntax error

**Solutions**:

**Check Path Format**:
```
✅ Correct: /api, /admin, /static
❌ Wrong: api, /api/, api/
```

**Verify Backend**:
1. Edit domain → Advanced tab
2. Find custom location
3. Check backend host/port are correct
4. Test backend directly

**Check Nginx Config**:
```bash
# Test nginx configuration
nginx -t

# View generated config
cat /etc/nginx/sites-available/domain-name.conf
```

---

### Issue 8: WebSocket Connection Fails

**Symptoms**: WebSocket connections fail to upgrade, disconnect immediately, or return 400/426 errors

**Possible Causes**:
1. Using IP Hash with stateless backends (session mismatch)
2. Backend not supporting WebSocket protocol
3. ModSecurity blocking WebSocket upgrade
4. Cloudflare proxy settings

**Solutions**:

**Verify Backend WebSocket Support**:
```bash
# Test WebSocket endpoint directly
wscat -c ws://backend-ip:port/socket.io/

# Check backend logs for connection attempts
```

**Check Load Balancer Algorithm**:
1. Edit domain → Basic tab
2. Change algorithm to **IP Hash** for session persistence
3. Same client IP always routes to same backend server
4. Critical for stateful WebSocket applications

**Check Nginx Logs**:
```bash
# Look for WebSocket upgrade errors
grep -i "websocket\|upgrade" /var/log/nginx/error.log

# Check successful upgrades
grep "101" /var/log/nginx/access.log
```

**Verify Auto-Configuration**:
```bash
# Check generated nginx config has WebSocket headers
cat /etc/nginx/sites-available/domain-name.conf | grep -A 5 "Upgrade"

# Should see:
# proxy_set_header Upgrade $http_upgrade;
# proxy_set_header Connection $connection_upgrade;
# proxy_read_timeout 86400s;
```

**ModSecurity Exceptions**:
If ModSecurity blocks WebSocket upgrade:
1. Check ModSecurity audit log
2. Whitelist WebSocket upgrade requests
3. See [ModSecurity Guide](./modsecurity.md)

**Cloudflare Settings**:
If using Cloudflare:
1. Enable WebSocket support in Cloudflare dashboard (Network tab)
2. Ensure Real IP detection is enabled in domain settings

**Test WebSocket Connection**:
```javascript
// Browser console test
const ws = new WebSocket('wss://your-domain.com/socket.io/');
ws.onopen = () => console.log('Connected');
ws.onerror = (err) => console.error('Error:', err);
```

---

## Related Documentation

- [SSL Certificates](./ssl.md) - SSL/TLS certificate management
- [ModSecurity](./modsecurity.md) - Web Application Firewall configuration
- [Access Lists](./Access_Lists.md) - IP whitelisting and HTTP Basic Auth
- [Performance Monitoring](./performance.md) - Monitor domain performance
- [Logs](./logs.md) - View access and error logs

---

## Quick Reference

### Required Fields

| Field | Required | Tab |
|-------|----------|-----|
| Domain Name | ✅ Yes | Basic |
| At least 1 Upstream | ✅ Yes | Basic |
| Upstream Host | ✅ Yes | Basic |
| Upstream Port | ✅ Yes | Basic |

### Default Values

| Setting | Default Value |
|---------|---------------|
| Status | Active |
| LB Algorithm | Round Robin |
| Protocol | HTTP |
| Port | 80 |
| SSL Verify | ON (verify enabled) |
| Weight | 1 |
| Max Fails | 3 |
| Fail Timeout | 30 seconds |
| ModSecurity | ON (enabled) |
| Real IP | OFF (disabled) |
| Health Checks | ON (enabled) |
| Health Path | /health |
| Health Interval | 30 seconds |
| Health Timeout | 5 seconds |
| HSTS | OFF (disabled) |
| HTTP/2 | ON (enabled) |
| gRPC | OFF (disabled) |
| **WebSocket** | **ON (always enabled, automatic)** |

### Permissions

| Action | Admin | Moderator | Viewer |
|--------|-------|-----------|--------|
| View domains | ✅ | ✅ | ✅ |
| Create domain | ✅ | ✅ | ❌ |
| Edit domain | ✅ | ✅ | ❌ |
| Delete domain | ✅ | ❌ | ❌ |
| Toggle SSL | ✅ | ✅ | ❌ |
| Toggle status | ✅ | ✅ | ❌ |

### Load Balancer Algorithms

| Algorithm | Behavior | Best For |
|-----------|----------|----------|
| Round Robin | Equal distribution, sequential | Equal capacity backends |
| Least Connections | Route to least busy | Mixed request durations |
| IP Hash | Same client → same backend | Session-based apps |

---

## Support

If you encounter issues:

1. **Check Nginx Logs**: `/var/log/nginx/error.log`
2. **Test Nginx Config**: `nginx -t`
3. **Reload Nginx**: `nginx -s reload`
4. **Test Backend**: `curl http://backend-ip:port`
5. **Check Firewall**: Verify ports are open
6. **Review Documentation**: Re-read relevant sections
7. **Contact Support**: Provide logs, config, error messages

---

**Last Updated**: January 18, 2025  
**Documentation Version**: 2.0.0  
**System Version**: Based on actual implementation
