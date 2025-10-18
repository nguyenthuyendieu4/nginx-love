# Introduction to Nginx WAF Management Platform

Welcome to the **Nginx WAF Management Platform** - a comprehensive, enterprise-grade solution for managing Nginx web servers with ModSecurity Web Application Firewall, designed to make advanced security and traffic management accessible to everyone.

## 🎯 What is Nginx WAF Management Platform?

Nginx WAF Management Platform is an **all-in-one web-based management system** that transforms complex Nginx and ModSecurity configurations into intuitive, point-and-click operations. Born from real-world production needs, this platform bridges the gap between powerful enterprise security features and ease of use.

### The Problem We Solve

Traditional Nginx and ModSecurity management requires:
- ❌ Deep knowledge of Nginx configuration syntax
- ❌ Manual editing of complex configuration files
- ❌ Command-line expertise for SSL certificate management
- ❌ Understanding of ModSecurity rule syntax
- ❌ Custom scripts for monitoring and alerts
- ❌ Time-consuming manual security updates

### Our Solution

Nginx WAF Management Platform provides:
- ✅ **Intuitive Web Interface**: Manage everything through a modern, user-friendly dashboard
- ✅ **Zero Configuration Syntax**: No need to learn Nginx or ModSecurity syntax
- ✅ **Automated Operations**: SSL certificates, health checks, and security updates handled automatically
- ✅ **Real-time Monitoring**: Instant visibility into your infrastructure's health and security
- ✅ **Enterprise Security**: OWASP Core Rule Set + custom WAF rules out of the box
- ✅ **Team Collaboration**: Multi-user support with role-based access control

## 🚀 Key Features

### 1. **Domain Management (Reverse Proxy & Load Balancing)**
Manage unlimited domains with advanced reverse proxy capabilities:
- **Multiple Backend Servers**: Configure multiple upstream servers per domain
- **Load Balancing Algorithms**: Round Robin, Least Connections, IP Hash
- **Health Checks**: Automatic backend health monitoring with failover
- **HTTPS Backends**: Support for SSL/TLS backend servers with verification
- **WebSocket Support**: Automatic WebSocket connection upgrade
- **gRPC Support**: Native support for gRPC applications
- **Custom Locations**: Define different backends for different URL paths
- **Real IP Detection**: Extract real client IP from Cloudflare and other proxies

**Use Cases**:
- High-availability web applications
- Microservices architectures
- API gateways
- Multi-region deployments

📖 [Learn More: Domain Management Guide](./domains.md)

### 2. **SSL/TLS Certificate Management**
Simplified SSL certificate management with automation:
- **Let's Encrypt Integration**: Free automated SSL certificates
- **Auto-Renewal**: Certificates renewed automatically before expiry
- **Manual Upload**: Support for commercial SSL certificates
- **Wildcard Certificates**: Support for `*.example.com` certificates
- **Multi-Domain Certificates**: Single certificate for multiple domains (SAN)
- **Certificate Monitoring**: Expiry alerts and notifications
- **HTTP to HTTPS Redirect**: Automatic HTTPS enforcement

**Use Cases**:
- Secure customer data in transit
- Meet compliance requirements (PCI DSS, HIPAA, GDPR)
- Improve SEO rankings
- Build customer trust

📖 [Learn More: SSL Certificate Guide](./ssl.md)

### 3. **ModSecurity Web Application Firewall (WAF)**
Enterprise-grade web application firewall protection:
- **OWASP Core Rule Set (CRS)**: Industry-standard security rules
- **Custom Rules**: Create your own WAF rules for specific threats
- **Rule Management**: Enable/disable rules per domain
- **Attack Detection**: SQL injection, XSS, CSRF, RCE protection
- **Logging & Alerts**: Detailed attack logs with notifications
- **False Positive Tuning**: Fine-tune rules to reduce false alarms
- **Per-Domain Configuration**: Different security levels per application

**Protected Against**:
- SQL Injection attacks
- Cross-Site Scripting (XSS)
- Cross-Site Request Forgery (CSRF)
- Remote Code Execution (RCE)
- Local File Inclusion (LFI)
- Remote File Inclusion (RFI)
- Session hijacking
- Protocol attacks

📖 [Learn More: ModSecurity WAF Guide](./modsecurity.md)

### 4. **Access Control Lists (ACL)**
Advanced request filtering and access control:
- **IP Whitelisting/Blacklisting**: Allow or deny specific IPs or CIDR ranges
- **GeoIP Filtering**: Block or allow traffic by country
- **User-Agent Filtering**: Control access based on browser/bot identification
- **Custom Conditions**: Complex rules with multiple conditions
- **Action Types**: Allow, Deny, Rate Limit, Challenge (CAPTCHA)
- **Per-Domain Rules**: Apply different rules to different domains

**Use Cases**:
- Block malicious IPs and bot networks
- Restrict admin panels to office IPs
- Comply with data residency regulations
- Prevent DDoS attacks

📖 [Learn More: Access Control Lists Guide](./Access_Control_List.md)

### 5. **Access Lists (IP Whitelist & HTTP Basic Auth)**
Simple and effective access restriction:
- **IP Whitelisting**: Allow access only from trusted IP addresses
- **HTTP Basic Authentication**: Password-protected access
- **Combined Mode**: Require both IP whitelist AND password
- **Multi-User Support**: Multiple user accounts per access list
- **Flexible Assignment**: Apply to multiple domains

**Use Cases**:
- Protect staging environments
- Secure admin dashboards
- Restrict API access to partners
- Lock down sensitive applications

📖 [Learn More: Access Lists Guide](./Access_Lists.md)

### 6. **Network Load Balancer (Layer 4 TCP/UDP)**
Hardware-grade Layer 4 load balancing:
- **TCP/UDP Load Balancing**: Balance any TCP or UDP service
- **Multiple Algorithms**: Round Robin, Least Connections, IP Hash
- **Health Checks**: TCP connection-based health monitoring
- **High Port Range**: Use ports 10000-65535
- **Stream Protocol**: Nginx stream module for maximum performance
- **Low Latency**: Direct packet forwarding with minimal overhead

**Supported Services**:
- Database servers (MySQL, PostgreSQL, MongoDB)
- Message queues (RabbitMQ, Redis, Kafka)
- Game servers
- VoIP services
- Custom TCP/UDP applications

📖 [Learn More: Network Load Balancer Guide](./Network_Manager.md)

### 7. **Real-time Performance Monitoring**
Comprehensive visibility into your infrastructure:
- **Domain Metrics**: Requests per second, response times, error rates
- **Upstream Health**: Backend server status and performance
- **System Resources**: CPU, memory, disk, network usage
- **Traffic Analysis**: Top domains, geographic distribution, user agents
- **Historical Data**: Trend analysis and capacity planning
- **Visual Dashboards**: Charts and graphs for easy interpretation

**Metrics Tracked**:
- HTTP request/response metrics
- SSL/TLS handshake times
- Backend response times
- Error rates (4xx, 5xx)
- Bandwidth usage
- Connection counts

📖 [Learn More: Performance Monitoring Guide](./performance.md)

### 8. **Smart Alerts & Notifications**
Proactive issue detection and notification:
- **Multiple Channels**: Email, Telegram, Webhooks
- **Flexible Conditions**: Create custom alert rules
- **Alert Types**: Security events, performance issues, system health, SSL expiry
- **Severity Levels**: Info, Warning, Critical
- **Alert Aggregation**: Group related alerts to reduce noise
- **Scheduled Reports**: Daily/weekly summary reports

**Common Alerts**:
- WAF attack detected
- Backend server down
- SSL certificate expiring
- High error rate
- Unusual traffic spike
- Disk space low

📖 [Learn More: Alerts Guide](./alerts.md)

### 9. **Comprehensive Logging**
Detailed logs for debugging and compliance:
- **Access Logs**: All HTTP requests with full details
- **Error Logs**: Application and server errors
- **Security Logs**: WAF events and blocked requests
- **Activity Logs**: User actions and configuration changes
- **Search & Filter**: Find specific events quickly
- **Log Retention**: Configurable retention periods
- **Export**: Download logs for external analysis

📖 [Learn More: Log Analysis Guide](./logs.md)

### 10. **Backup & Restore**
Protect your configuration and enable disaster recovery:
- **Full System Backup**: All domains, SSL certificates, rules, settings
- **Scheduled Backups**: Automatic backups on custom schedules
- **One-Click Restore**: Restore entire system or individual components
- **Export/Import**: Move configurations between servers
- **Version History**: Keep multiple backup versions
- **Selective Restore**: Choose what to restore

**Backed Up Data**:
- Domain configurations
- SSL certificates
- ModSecurity rules
- ACL rules
- Access lists
- Alert settings
- User accounts

📖 [Learn More: Backup & Restore Guide](./backup.md)

### 11. **Multi-User Management**
Team collaboration with security:
- **Role-Based Access Control (RBAC)**: Admin, Moderator, Viewer roles
- **User Profiles**: Personalized settings and preferences
- **Two-Factor Authentication (2FA)**: Enhanced account security
- **Activity Tracking**: Audit trail of all user actions
- **Session Management**: Active session monitoring
- **Password Policies**: Enforce strong passwords

**Roles**:
- **Admin**: Full system access and configuration
- **Moderator**: Manage domains, SSL, and WAF (no user management)
- **Viewer**: Read-only access for monitoring

📖 [Learn More: User Management Guide](./users.md)

### 12. **Cluster Management (Master-Slave)**
Centralized management of multiple Nginx servers:
- **Master-Slave Architecture**: Manage multiple Nginx instances from one interface
- **Configuration Sync**: Automatic configuration distribution
- **Centralized Monitoring**: View all slaves from master dashboard
- **High Availability**: Slave failover capabilities
- **Selective Sync**: Choose what to sync per slave

📖 [Learn More: Cluster Management Guide](./cluster.md)

## 🎯 Who Is This For?

### System Administrators
- Manage multiple Nginx instances from one interface
- Automate SSL certificate management
- Implement enterprise security without complexity
- Monitor infrastructure health in real-time

### DevOps Engineers
- Standardize Nginx configurations across environments
- Integrate with CI/CD pipelines via REST API
- Automate deployments and updates
- Implement infrastructure as code

### Security Professionals
- Deploy and manage Web Application Firewall
- Fine-tune OWASP CRS rules
- Create custom security rules
- Monitor and respond to security events

### Web Developers
- Manage their own Nginx configurations without DevOps
- Quick SSL certificate setup for HTTPS
- Easy load balancer configuration
- Focus on application development, not infrastructure

### Small Business Owners
- Enterprise-grade security without enterprise costs
- Simple interface - no technical expertise required
- Automated operations reduce maintenance time
- Free and open-source

## 🏗️ Architecture Overview

### Technology Stack

**Backend**:
- **Node.js + Express**: RESTful API server
- **TypeScript**: Type-safe development
- **Prisma ORM**: Database management
- **PostgreSQL**: Relational database
- **JWT Authentication**: Secure user authentication

**Frontend**:
- **React 18**: Modern UI framework
- **TypeScript**: Type-safe frontend development
- **TanStack Router**: Type-safe routing
- **TanStack Query**: Server state management
- **ShadCN UI**: Beautiful component library
- **Tailwind CSS**: Utility-first styling

**Infrastructure**:
- **Nginx**: High-performance web server and reverse proxy
- **ModSecurity**: Web Application Firewall engine
- **OWASP CRS**: Core Rule Set for WAF
- **Docker**: Containerized deployments
- **Systemd**: Service management

### How It Works

```
                    ┌─────────────────────┐
                    │   Web Interface     │
                    │  (React + TypeScript)│
                    └──────────┬──────────┘
                               │
                               │ HTTPS/API
                               ▼
                    ┌─────────────────────┐
                    │   Backend API       │
                    │ (Node.js + Express) │
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
        ┌──────────┐  ┌──────────────┐  ┌──────────┐
        │PostgreSQL│  │Nginx + ModSec│  │  File    │
        │ Database │  │Configuration │  │ System   │
        └──────────┘  └──────────────┘  └──────────┘
                               │
                               │ Proxies traffic
                               ▼
                    ┌─────────────────────┐
                    │  Backend Servers    │
                    │  (Your Applications)│
                    └─────────────────────┘
```

**Request Flow**:
1. User accesses web interface or API
2. Backend API processes requests
3. Configuration changes written to database and Nginx config files
4. Nginx reloaded to apply changes (graceful, zero-downtime)
5. Nginx proxies traffic to backend servers with WAF protection

## 🌟 Key Concepts

### Domains (Virtual Hosts)
A **domain** represents a website or application served through Nginx. Each domain is a reverse proxy configuration that forwards traffic to one or more backend servers (upstreams). Domains can have individual SSL certificates, ModSecurity rules, and access controls.

**Example**: `api.example.com` → proxies to backend servers at `192.168.1.100:8080` and `192.168.1.101:8080`

### Upstream Servers (Backends)
**Upstream servers** are the actual application servers that handle requests. Nginx acts as a reverse proxy, forwarding client requests to these backend servers and returning responses.

**Example**: Your Node.js app running on `192.168.1.100:3000`

### Load Balancing
**Load balancing** distributes incoming traffic across multiple backend servers to:
- Improve reliability (high availability)
- Increase capacity (horizontal scaling)
- Enable zero-downtime deployments
- Provide automatic failover

**Algorithms**: Round Robin, Least Connections, IP Hash

### SSL/TLS Termination
**SSL termination** means Nginx handles HTTPS encryption/decryption, forwarding plain HTTP to backends. This:
- Reduces backend server load
- Centralizes certificate management
- Enables SSL offloading for legacy applications

### Web Application Firewall (WAF)
A **WAF** inspects HTTP traffic for malicious patterns and blocks attacks before they reach your application. ModSecurity uses rule-based detection to identify:
- SQL injection attempts
- Cross-site scripting (XSS)
- Path traversal attacks
- Protocol violations
- And 100+ other attack types

### Access Control Lists (ACL)
**ACLs** are rules that control who can access your applications based on:
- IP address (whitelist/blacklist)
- Geographic location (country)
- User agent (browser/bot)
- Custom request properties

### Health Checks
**Health checks** are periodic tests that verify backend servers are operational. Failed health checks automatically remove servers from the load balancer pool, ensuring traffic only goes to healthy backends.

### Real IP Detection
When behind proxies or CDNs (like Cloudflare), Nginx sees the proxy's IP instead of the real client IP. **Real IP detection** extracts the actual client IP from headers like `X-Forwarded-For` for accurate logging and access control.

## 🎨 Platform Benefits

### For Individuals & Small Teams

**Ease of Use**:
- No Nginx configuration syntax to learn
- Point-and-click domain setup
- Automated SSL certificates
- One-click security features

**Cost Savings**:
- 100% free and open-source
- No per-server licensing fees
- Reduce DevOps hiring needs
- Community support

**Time Savings**:
- Setup in minutes, not hours
- Automated maintenance tasks
- Self-service for team members
- No manual config file editing

### For Enterprises

**Security**:
- Enterprise-grade WAF (OWASP CRS)
- Centralized security policy management
- Compliance-ready logging
- Regular security updates

**Scalability**:
- Manage hundreds of domains
- Multi-server cluster management
- High-availability configurations
- Load balancing built-in

**Reliability**:
- Zero-downtime configuration changes
- Automatic backup and restore
- Health monitoring and alerting
- Configuration validation

**Team Collaboration**:
- Role-based access control
- Activity audit trails
- Multi-user support
- 2FA security

## 🚀 Getting Started

### Installation Options

**Option 1: Production Deployment (Recommended)**
```bash
# Clone repository
git clone https://github.com/TinyActive/nginx-love.git
cd nginx-love

# Run deployment script (requires root)
bash scripts/deploy.sh
```

**Option 2: Docker Deployment**
```bash
# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Start with Docker Compose
docker-compose build && docker-compose up -d
```

**Option 3: Development Mode**
```bash
# Quick start for testing (no root required)
./scripts/quickstart.sh
```

### System Requirements

**Minimum**:
- Ubuntu/Debian 22.04+ (or compatible Linux)
- 2GB RAM
- 10GB free disk space
- Internet connection

**Recommended**:
- 4GB+ RAM
- 20GB+ SSD storage
- Multi-core CPU
- Dedicated server or VPS

### First Steps After Installation

1. **Access Web Interface**: Navigate to `http://YOUR_SERVER_IP:8080`
2. **Login**: Use credentials from `/root/.nginx-love-credentials`
3. **Create First Domain**: Add your first reverse proxy domain
4. **Issue SSL Certificate**: Enable HTTPS with Let's Encrypt
5. **Enable WAF**: Turn on ModSecurity protection
6. **Configure Alerts**: Set up email/Telegram notifications

## 📚 Documentation Structure

- **[Installation Guide](./installation.md)**: Step-by-step installation instructions
- **[Quick Start Guide](./quick-start.md)**: Get up and running in 10 minutes
- **[Domain Management](./domains.md)**: Reverse proxy and load balancing
- **[SSL Certificates](./ssl.md)**: HTTPS and certificate management
- **[ModSecurity WAF](./modsecurity.md)**: Web Application Firewall configuration
- **[Access Control Lists](./Access_Control_List.md)**: Advanced access control
- **[Access Lists](./Access_Lists.md)**: IP whitelist and HTTP Basic Auth
- **[Network Load Balancer](./Network_Manager.md)**: Layer 4 TCP/UDP load balancing
- **[Performance Monitoring](./performance.md)**: Metrics and monitoring
- **[Alerts](./alerts.md)**: Notification configuration
- **[Logs](./logs.md)**: Log analysis and troubleshooting
- **[User Management](./users.md)**: Team and access control
- **[API Reference](../api/)**: RESTful API documentation

## 🤝 Support & Community

### Getting Help

- **Documentation**: Comprehensive guides and tutorials (you're here!)
- **GitHub Issues**: [Report bugs or request features](https://github.com/TinyActive/nginx-love/issues)
- **Community Forum**: Ask questions and share knowledge
- **FAQ**: [Frequently Asked Questions](../reference/faq.md)

### Contributing

We welcome contributions! This project is open-source and community-driven.

- Fork the repository
- Create a feature branch
- Submit a pull request
- Join our community

## 🎯 Project Philosophy

### Our Mission

Make enterprise-grade Nginx and ModSecurity management accessible to everyone - from individuals to large organizations - without requiring deep technical expertise.

### Core Values

1. **Simplicity**: Complex operations should feel simple
2. **Security**: Security by default, not as an afterthought
3. **Reliability**: Zero-downtime operations and automatic failover
4. **Transparency**: Open-source, auditable, community-driven
5. **Flexibility**: Works for personal projects and enterprise deployments

### Design Principles

- **Progressive Disclosure**: Show simple options first, advanced options on demand
- **Validation & Safety**: Validate configurations before applying
- **Automation**: Automate repetitive tasks (SSL renewal, backups, health checks)
- **Observability**: Make system state visible and understandable
- **Recoverability**: Always provide undo and rollback options

## 🌍 Real-World Use Cases

### E-Commerce Platform
- Load balance across multiple application servers
- SSL/TLS for secure transactions
- WAF protection against payment fraud
- GeoIP blocking for compliance
- Performance monitoring for Black Friday traffic

### SaaS Application
- Multi-tenant domain management
- Automated SSL for custom domains
- Rate limiting per tenant
- Security monitoring and alerts
- API gateway with authentication

### Corporate Intranet
- IP whitelist for office networks
- SSO integration (HTTP Basic Auth)
- Staging and production environments
- Compliance logging and audit trails
- VPN access control

### Mobile App API
- High-availability API gateway
- SSL pinning support
- Real-time performance metrics

### Microservices Architecture
- Service mesh gateway
- Custom location blocks per service
- Health check and auto-failover
- Distributed tracing support
- Centralized logging

## 🔮 What's Next?

Now that you understand what Nginx WAF Management Platform is and what it can do, here's your recommended learning path:

1. **[Installation Guide](./installation.md)**: Install the platform on your server
2. **[Quick Start Guide](./quick-start.md)**: Create your first domain in 10 minutes
3. **[Domain Management](./domains.md)**: Master reverse proxy and load balancing
4. **[SSL Certificates](./ssl.md)**: Secure your domains with HTTPS
5. **[ModSecurity WAF](./modsecurity.md)**: Protect against web attacks
6. **[Performance Monitoring](./performance.md)**: Monitor and optimize your infrastructure

Ready to get started? Let's begin with installation!

👉 **[Continue to Installation Guide →](./installation.md)**

---

**Last Updated**: 2025-10-18  
**Version**: 1.0.0  
**License**: Open Source