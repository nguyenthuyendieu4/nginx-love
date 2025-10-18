# Network Load Balancer (NLB) - User Guide

##  Overview

Network Load Balancer (NLB) is a Layer 4 (Transport Layer) load balancing feature in the Nginx WAF Management Platform. NLB allows you to distribute TCP/UDP traffic across multiple backend servers, ensuring high availability and scalability for your applications.

### Key Features

- ✅ **Layer 4 Load Balancing**: Supports TCP, UDP, and TCP/UDP protocols
- ✅ **Multiple Algorithms**: Round Robin, Least Connections, IP Hash, Hash
- ✅ **Automatic Health Checks**: Periodic backend server health monitoring
- ✅ **High Port Range**: Uses ports from 10000 and above to avoid conflicts
- ✅ **Flexible Configuration**: Timeout, retry, connection limits
- ✅ **Easy Management**: Intuitive web interface
- ✅ **Real-time Monitoring**: Track upstream server status in real-time

### Architecture

```
Client (Port 10000+)
      ↓
[Network Load Balancer]
   ↓      ↓      ↓
Backend1 Backend2 Backend3
(TCP/UDP Servers)
```

---

## Getting Started

### Accessing Network Load Balancer

1. Log in to the Nginx WAF Management Platform
2. From the left menu, select **Network Load Balancer**
3. You will see the dashboard with statistics and NLB list

### Dashboard Overview

The dashboard displays 4 main statistics cards:

- **Total NLBs**: Total number of load balancers (active + inactive)
- **Active NLBs**: Number of currently running load balancers
- **Total Upstreams**: Total number of backend servers
- **Healthy Upstreams**: Number of healthy backend servers

---

## Creating a New Network Load Balancer

### Step 1: Open Create Form

1. Click the **"Create NLB"** button in the top right corner
2. The create form will appear with multiple configuration tabs

### Step 2: Basic Configuration (Basic Tab)

#### General Information

- **Name**: Identifier name for the NLB
  - Only contains letters, numbers, hyphens (-) and underscores (_)
  - Examples: `app-server-lb`, `mysql-cluster`, `game-server-nlb`
  
- **Description**: Purpose description (optional)
  - Example: "Load balancer for MySQL Master-Slave cluster"

#### Network Configuration

- **Port**: Port that NLB will listen on (10000-65535)
  - ⚠️ **Important**: Port must be 10000 or higher
  - Examples: `10080` for web app, `13306` for MySQL, `15432` for PostgreSQL

- **Protocol**: Select protocol
  - **TCP**: For TCP services (HTTP, MySQL, PostgreSQL, Redis, etc.)
  - **UDP**: For UDP services (DNS, VoIP, Game servers)
  - **TCP/UDP**: Listen on both (for multi-protocol services)

- **Algorithm**: Load balancing algorithm
  - **Round Robin** (Default): Sequential distribution to each server
  - **Least Connections**: Select server with fewest connections
  - **IP Hash**: Pin client to a server based on IP
  - **Hash**: Hash based on remote address

### Step 3: Configure Upstream Servers (Upstreams Tab)

Upstreams are backend servers that will receive traffic from the load balancer.

#### Add Upstream Server

Click the **"Add Upstream"** button to add a new backend server.

#### Detailed Upstream Configuration

Each upstream server has the following options:

**Connection Information**
- **Host**: IP address or hostname of the backend server
  - Examples: `192.168.1.10`, `db-server-1.local`, `10.0.0.5`
  
- **Port**: Port of the service on the backend server
  - Examples: `3306` (MySQL), `5432` (PostgreSQL), `6379` (Redis)

**Load Balancing Parameters**
- **Weight**: Weight value (1-100)
  - Default: `1`
  - Servers with higher weight receive more traffic
  - Example: Stronger server uses weight=3, weaker server uses weight=1

- **Max Fails**: Number of failures before marking server as down
  - Default: `3`
  - Value range: 0-100
  - If set to 0: server is never marked as unavailable

- **Fail Timeout**: Wait time after server is marked down (seconds)
  - Default: `10` seconds
  - Value range: 1-3600 seconds
  - After this timeout, the server will be retried

**Connection Limits**
- **Max Connections**: Maximum connections to this server
  - Default: `0` (unlimited)
  - Useful to protect server from overload

**Special Flags**
- **Backup**: Mark server as backup
  - ✅ Enabled: Server only receives traffic when all primary servers are down
  - ❌ Disabled: Server operates as a primary server
  
- **Down**: Temporarily disable server
  - ✅ Enabled: Server doesn't receive traffic but remains in configuration
  - ❌ Disabled: Server operates normally

#### Upstream Configuration Examples

**Example 1: MySQL Read Replicas/Cluster**
```
Upstream 1:
  Host: 192.168.1.10 (Master)
  Port: 3306
  Weight: 2
  Max Fails: 3
  Fail Timeout: 10
  Backup: No
  Down: No

Upstream 2:
  Host: 192.168.1.11 (Slave 1)
  Port: 3306
  Weight: 1
  Max Fails: 3
  Fail Timeout: 10
  Backup: Yes
  Down: No
```

**Example 2: Web Application Cluster**
```
Upstream 1:
  Host: app-server-1.local
  Port: 8080
  Weight: 3 (Stronger server)
  Max Fails: 2
  Fail Timeout: 5
  Max Connections: 100
  
Upstream 2:
  Host: app-server-2.local
  Port: 8080
  Weight: 1 (Weaker server)
  Max Fails: 2
  Fail Timeout: 5
  Max Connections: 50
```

### Step 4: Advanced Configuration (Advanced Tab)

#### Proxy Settings

- **Proxy Timeout**: Timeout for upstream connection (1-600 seconds)
  - Default: `3` seconds
  - Wait time when there's no data transfer
  - Increase for long-running operations

- **Proxy Connect Timeout**: Timeout when connecting to upstream (1-60 seconds)
  - Default: `1` second
  - Wait time to establish initial connection

#### Upstream Retry Settings

- **Proxy Next Upstream**: Try next upstream when current one fails
  - ✅ Enabled: Automatic failover to another server
  - ❌ Disabled: No retry, return error to client immediately

- **Proxy Next Upstream Timeout**: Maximum time for all retry attempts (seconds)
  - Default: `0` (unlimited)
  - Value 0: no timeout
  - Example: `10` seconds for all retries

- **Proxy Next Upstream Tries**: Maximum number of retries
  - Default: `0` (unlimited)
  - Value 0: try all available upstreams
  - Example: `3` to try maximum 3 different servers

#### Health Check Settings

- **Health Check Enabled**: Enable/disable automatic health checks
  - ✅ Enabled: Automatically check upstreams periodically
  - ❌ Disabled: No automatic health checks

- **Health Check Interval**: Time between checks (1-3600 seconds)
  - Default: `10` seconds
  - Example: `30` seconds for low-frequency checks

- **Health Check Timeout**: Timeout for each health check (1-60 seconds)
  - Default: `5` seconds
  - If no response within this time → mark as failed

- **Health Check Rises**: Number of successful checks to mark server as "up"
  - Default: `2`
  - Server needs to pass 2 consecutive times to be considered healthy

- **Health Check Falls**: Number of failed checks to mark server as "down"
  - Default: `3`
  - Server needs to fail 3 consecutive times to be marked unhealthy

### Step 5: Create NLB

1. Review all configurations
2. Click the **"Create"** button
3. The system will:
   - Create Nginx stream configuration
   - Test Nginx configuration
   - Reload Nginx
   - Perform initial health check (if enabled)
   - Display success notification

---

##  Editing Network Load Balancer

### How to Edit

1. In the NLB list, click the **3-dot** (⋮) icon on the right
2. Select **"Edit"**
3. The edit form displays with current data
4. Change the necessary information
5. Click **"Update"**

### Important Notes When Editing

- ⚠️ **Changing port or protocol**: Will reload Nginx configuration
- ⚠️ **Changing upstreams**: Traffic may be briefly interrupted
- ✅ **Best Practice**: Edit during maintenance window if in production

---

## Managing NLB Status

### Enable/Disable NLB

#### How to Enable/Disable

1. Click the **3-dot** (⋮) icon on the right of the NLB
2. Select **"Enable"** or **"Disable"**
3. Confirm the change

#### When Enabling
- Create symlink from `streams-enabled` to `streams-available`
- Test and reload Nginx
- Status changes to **Active**
- NLB starts receiving traffic

#### When Disabling
- Remove symlink in `streams-enabled`
- Test and reload Nginx
- Status changes to **Inactive**
- NLB stops receiving traffic but configuration is preserved

### Status Types

| Status | Icon | Description |
|--------|------|-------------|
| **Active** | 🟢 | NLB is running, receiving and distributing traffic |
| **Inactive** | ⚪ | NLB is disabled, not receiving traffic |
| **Error** | 🔴 | Configuration error or Nginx reload failed |

---

##  Health Check

### Automatic Health Check

The system automatically checks upstream server health according to configuration:
- TCP connection to each upstream server
- Record response time
- Update server status (up/down)
- Save health check history

### Manual Health Check

1. Click the **3-dot** (⋮) icon on the right of the NLB
2. Select **"Health Check"** (if available - version dependent)
3. The system will:
   - Check all upstreams immediately
   - Display real-time results
   - Update server status

### Upstream Status

| Status | Icon | Description |
|--------|------|-------------|
| **Up** | ✅ | Server is healthy, receiving traffic |
| **Down** | ❌ | Server is unavailable or not responding |
| **Checking** | 🔄 | Currently checking server status |

### View Upstream Details

In the NLB list table, the **Upstreams** column displays:
```
3 (2 up)
```
- `3`: Total number of upstream servers
- `2 up`: Number of healthy servers

---

##  Deleting Network Load Balancer

### How to Delete

1. Click the **3-dot** (⋮) icon on the right of the NLB
2. Select **"Delete"** (red color)
3. Confirm deletion in the popup dialog

### What Happens When Deleting?

- ❌ Remove Nginx configuration in `streams-available`
- ❌ Remove symlink in `streams-enabled` (if exists)
- ❌ Test and reload Nginx
- ❌ Delete record in database
- ❌ Delete all related upstream servers
- ❌ Delete health check history

### ⚠️ Warning

- **Cannot be undone**: Once deleted, cannot be recovered
- **Traffic interrupted**: Clients connected to NLB will lose connection
- **Best Practice**: Disable first, test, then delete

---

##  Search and Filter

### Search

Use the search box above the list table:
- Search by **NLB name**
- Search by **description**
- Real-time search (automatic when typing)

### Filter by Status

Use filter dropdown (if available):
- **All**: Display all
- **Active**: Only display running NLBs
- **Inactive**: Only display disabled NLBs
- **Error**: Only display NLBs with errors

### Pagination

- Default: 10 items per page
- Navigation: **Previous** and **Next** buttons
- Display: "Showing 1 to 10 of 25 results"

---

##  Use Cases & Best Practices

### Use Case 1: MySQL Master-Slave Load Balancing

**Objective**: Load balance read queries between master and slave servers

**Recommended Configuration**:
```yaml
Name: mysql-cluster-lb
Port: 13306
Protocol: TCP
Algorithm: Least Connections

Upstreams:
  - Master:
      Host: 192.168.1.10
      Port: 3306
      Weight: 2
      Max Fails: 3
      Fail Timeout: 10
      
  - Slave 1:
      Host: 192.168.1.11
      Port: 3306
      Weight: 1
      Max Fails: 3
      Backup: Yes
      
  - Slave 2:
      Host: 192.168.1.12
      Port: 3306
      Weight: 1
      Max Fails: 3
      Backup: Yes

Advanced Settings:
  Proxy Timeout: 60s
  Proxy Connect Timeout: 5s
  Health Check Enabled: Yes
  Health Check Interval: 30s
```

**Connect from application**:
```
mysql -h <nlb-server-ip> -P 13306 -u user -p
```

### Use Case 2: Redis Cluster Load Balancing

**Objective**: Distribute Redis connections with session persistence

**Recommended Configuration**:
```yaml
Name: redis-cluster-lb
Port: 16379
Protocol: TCP
Algorithm: IP Hash  # Session persistence

Upstreams:
  - Redis Node 1:
      Host: 10.0.1.10
      Port: 6379
      Weight: 1
      Max Connections: 500
      
  - Redis Node 2:
      Host: 10.0.1.11
      Port: 6379
      Weight: 1
      Max Connections: 500
      
  - Redis Node 3:
      Host: 10.0.1.12
      Port: 6379
      Weight: 1
      Max Connections: 500

Advanced Settings:
  Proxy Timeout: 120s
  Health Check Enabled: Yes
  Health Check Interval: 10s
```

### Use Case 3: Game Server Load Balancing (UDP)

**Objective**: Load balance game servers using UDP

**Recommended Configuration**:
```yaml
Name: game-server-lb
Port: 17777
Protocol: UDP
Algorithm: IP Hash  # Keep player pinned to one server

Upstreams:
  - Game Server 1:
      Host: game1.internal
      Port: 7777
      Weight: 1
      
  - Game Server 2:
      Host: game2.internal
      Port: 7777
      Weight: 1
      
  - Game Server 3 (Backup):
      Host: game3.internal
      Port: 7777
      Weight: 1
      Backup: Yes

Advanced Settings:
  Proxy Timeout: 300s  # 5 minutes for long game sessions
  Health Check Enabled: Yes
  Health Check Interval: 30s
```

### Use Case 4: PostgreSQL Read Replicas

**Objective**: Distribute read queries to replicas

**Recommended Configuration**:
```yaml
Name: postgres-read-lb
Port: 15432
Protocol: TCP
Algorithm: Least Connections

Upstreams:
  - Replica 1:
      Host: pg-replica-1.local
      Port: 5432
      Weight: 1
      Max Fails: 2
      
  - Replica 2:
      Host: pg-replica-2.local
      Port: 5432
      Weight: 1
      Max Fails: 2

Advanced Settings:
  Proxy Timeout: 120s
  Proxy Next Upstream: Yes
  Proxy Next Upstream Tries: 2
  Health Check Enabled: Yes
  Health Check Interval: 15s
```

---

## Best Practices

### 1. Port Planning

- ✅ **Use port >= 10000**: Avoid conflicts with system ports
- ✅ **Port naming convention**:
  - `10xxx`: Web applications (HTTP/HTTPS proxies)
  - `13xxx`: Database services (MySQL, PostgreSQL)
  - `15xxx`: Cache services (Redis, Memcached)
  - `17xxx`: Game/UDP services
  - `19xxx`: Custom applications

### 2. Algorithm Selection

| Algorithm | When to Use | Use Case |
|-----------|-------------|----------|
| **Round Robin** | Even traffic, stateless apps | Web APIs, microservices |
| **Least Connections** | Requests with varying processing time | Database connections, long-polling |
| **IP Hash** | Need session persistence | Shopping carts, gaming, WebSockets |
| **Hash** | Custom load distribution | Sharding, distributed caching |

### 3. Upstream Configuration

- ✅ **Weight**: 
  - Stronger server → higher weight
  - Common ratios: 3:2:1 or 2:1:1

- ✅ **Max Fails & Fail Timeout**:
  - Production: `max_fails=3`, `fail_timeout=10s`
  - High availability: `max_fails=2`, `fail_timeout=5s`
  - Staging/Dev: `max_fails=5`, `fail_timeout=30s`

- ✅ **Max Connections**:
  - Set based on backend server capacity
  - Avoid overloading weaker servers

- ✅ **Backup Servers**:
  - Always have at least 1 backup server
  - Backup server should have equivalent configuration to primary

### 4. Health Check Tuning

| Environment | Interval | Timeout | Rises | Falls |
|-------------|----------|---------|-------|-------|
| **Production** | 10s | 5s | 2 | 3 |
| **High Traffic** | 5s | 3s | 2 | 2 |
| **Low Traffic** | 30s | 10s | 3 | 5 |
| **Development** | 60s | 15s | 1 | 3 |

### 5. Timeout Settings

- ✅ **Short-lived connections** (APIs):
  - `proxy_timeout`: 3-10s
  - `proxy_connect_timeout`: 1-2s

- ✅ **Long-lived connections** (WebSocket, Streaming):
  - `proxy_timeout`: 300-600s
  - `proxy_connect_timeout`: 5-10s

- ✅ **Database connections**:
  - `proxy_timeout`: 60-120s
  - `proxy_connect_timeout`: 5s

### 6. High Availability Setup

**Recommended HA configuration**:

```yaml
Upstreams: 3+ servers
  - 2 Primary (weight=2 or 1)
  - 1+ Backup (backup=yes)

Advanced Settings:
  proxy_next_upstream: true
  proxy_next_upstream_tries: 2
  health_check_enabled: true
  health_check_interval: 10s
  health_check_falls: 2  # Quickly detect failure
```

### 7. Monitoring & Maintenance

- 📊 **Monitor metrics**:
  - Number of active/inactive NLBs
  - Healthy vs Unhealthy upstreams
  - Health check history

- 🔍 **Regular checks**:
  - Check health check logs
  - Review upstream status
  - Monitor Nginx error logs

- 🛠️ **Maintenance**:
  - Test before applying major changes
  - Disable NLB before editing in production
  - Have a rollback plan

### 8. Security Considerations

- 🔒 **Network isolation**:
  - NLB and upstreams should be in private network
  - Only expose NLB port to internet if necessary

- 🔒 **Firewall rules**:
  - Only allow traffic from NLB to upstreams
  - Block direct access to upstream servers

- 🔒 **Access control**:
  - Only admin/moderator can create/edit/delete NLBs
  - Viewer has read-only access

---

## Troubleshooting

### Issue 1: NLB in Error Status

**Symptoms**: Red "Error" badge appears

**Causes**:
- Invalid Nginx configuration
- Port conflict with another service
- Cannot reload Nginx

**Solutions**:
1. Check Nginx error log:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

2. Test Nginx configuration:
   ```bash
   sudo nginx -t
   ```

3. Check for port conflicts:
   ```bash
   sudo netstat -tulpn | grep <port>
   ```

4. Fix errors and update NLB

### Issue 2: Upstream Always Down

**Symptoms**: Health check always fails, upstream status is "down"

**Causes**:
- Backend server is actually down
- Firewall blocking connection
- Network unreachable
- Health check timeout too short

**Solutions**:
1. Test connection manually:
   ```bash
   telnet <upstream-host> <upstream-port>
   # Or
   nc -zv <upstream-host> <upstream-port>
   ```

2. Check firewall:
   ```bash
   sudo iptables -L -n
   ```

3. Increase health check timeout in Advanced settings

4. Check backend service logs

### Issue 3: Cannot Create NLB

**Symptoms**: Error when clicking Create

**Causes**:
- Name already exists
- Port already in use
- Port < 10000
- Validation errors

**Solutions**:
1. Read error message carefully
2. Check:
   - NLB name is unique
   - Port >= 10000 and not in use
   - At least 1 upstream server
   - All required fields are filled

### Issue 4: Traffic Not Evenly Distributed

**Symptoms**: One server receives too much traffic

**Causes**:
- Inappropriate weight settings
- Wrong algorithm
- Some servers marked as down

**Solutions**:
1. Check upstream status
2. Review weight configuration
3. Try changing algorithm (e.g., from IP Hash to Round Robin)
4. Check health check results

### Issue 5: Connection Timeout

**Symptoms**: Client timeout when connecting

**Causes**:
- Proxy timeout too short
- Backend server slow
- High network latency

**Solutions**:
1. Increase `proxy_timeout` in Advanced settings
2. Increase `proxy_connect_timeout`
3. Optimize backend server performance
4. Enable `proxy_next_upstream` for automatic failover

---

##  Glossary

| Term | Definition |
|------|------------|
| **NLB** | Network Load Balancer - Layer 4 network load balancer |
| **Upstream** | Backend server receiving traffic from load balancer |
| **Weight** | Value determining the proportion of traffic a server receives |
| **Health Check** | Periodic check to determine if server is operational |
| **Failover** | Automatic switch to another server when current server fails |
| **Round Robin** | Algorithm that distributes sequentially to each server |
| **Least Connections** | Algorithm that selects server with fewest connections |
| **IP Hash** | Algorithm that pins client to a server based on IP |
| **Proxy Timeout** | Maximum wait time for upstream connection |
| **Max Fails** | Number of failures before marking server as down |
| **Backup Server** | Standby server, only active when primary servers are down |

---

## Related Documentation

- [Nginx Stream Module Documentation](http://nginx.org/en/docs/stream/ngx_stream_core_module.html)
- [Nginx Upstream Module](http://nginx.org/en/docs/stream/ngx_stream_upstream_module.html)
- [Domain Management Guide](./domains.md)
- [Performance Monitoring](./performance.md)
- [SSL Certificate Management](./ssl.md)

---

**Last Updated**: 2025-10-18  
**Version**: 1.0.0
