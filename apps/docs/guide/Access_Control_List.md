# Access Control List (ACL)

The Access Control List (ACL) system in Nginx Love provides powerful, granular control over who can access your domains. It supports multiple layers of security including IP-based filtering, geographic restrictions, user-agent blocking, URL-based access control, and HTTP method filtering.

## 🎯 Overview

ACL rules allow you to:
- **Control access** based on various conditions (IP, GeoIP, User-Agent, URL, HTTP Method, Headers)
- **Create whitelists** to allow only specific sources
- **Create blacklists** to deny specific sources
- **Combine multiple rules** for comprehensive security
- **Apply rules automatically** to Nginx configuration
- **Monitor and manage** access control in real-time

## 🔑 Key Features

### 1. **Multi-Condition Support**
- **IP-based**: Control access based on IPv4 addresses, IPv6, or CIDR ranges
- **GeoIP**: Restrict or allow access from specific countries/regions
- **User-Agent**: Block malicious bots or specific browsers
- **URL-based**: Control access to specific paths or endpoints
- **HTTP Method**: Restrict HTTP methods (GET, POST, PUT, DELETE, etc.)
- **Header-based**: Filter based on custom HTTP headers

### 2. **Rule Types**
- **Whitelist**: Only allow specified conditions (deny all others)
- **Blacklist**: Block specific conditions (allow all others)

### 3. **Actions**
- **Allow**: Permit access
- **Deny**: Block access with 403 Forbidden
- **Challenge**: Implement rate limiting or CAPTCHA (429 Too Many Requests)

### 4. **Operators**
- **Equals**: Exact match
- **Contains**: Partial match
- **Regex**: Pattern matching with regular expressions

### 5. **Automatic Nginx Integration**
- Rules are automatically converted to Nginx configuration
- Configuration is tested before application
- Nginx is automatically reloaded when rules change
- All changes are logged for audit purposes

## 📊 Access Control Dashboard

The ACL dashboard provides a comprehensive view of all your access control rules:

![Access Lists Screen](/reference/screenshots/acl_homepage.png)

**Dashboard Features:**
- View all active and inactive ACL rules
- Quick enable/disable toggle for each rule
- Search and filter rules by type, field, or status
- Real-time rule status monitoring
- Quick actions: Edit, Delete, Clone rules

## ➕ Creating ACL Rules

### Basic Information

When creating a new ACL rule, you will configure:

**1. Name** (Required)
- A descriptive name for the rule
- Must be unique
- Example: `Block_Malicious_IPs`, `Allow_Internal_Network`

**2. Type** (Required)
- **Whitelist**: Allow only specified conditions
- **Blacklist**: Block specified conditions

**3. Condition Field** (Required)
- **IP**: IPv4/IPv6 address or CIDR range
- **GeoIP**: Geographic location
- **User-Agent**: Browser or bot user agent string
- **URL**: Request URI path
- **Method**: HTTP request method
- **Header**: Custom HTTP header

**4. Condition Operator** (Required)
- **Equals**: Exact match
- **Contains**: Partial match
- **Regex**: Regular expression pattern

**5. Condition Value** (Required)
- The value to match against the condition field

**6. Action** (Required)
- **Allow**: Permit the request
- **Deny**: Block with 403 Forbidden
- **Challenge**: Return 429 for rate limiting

**7. Enable Rule** (Optional)
- Toggle to activate the rule immediately upon creation

![Access Lists Screen](/reference/screenshots/Create_Access_List_done.png)


## 📚 API Reference

### List All ACL Rules
```
GET /api/acl
Authorization: Bearer <token>
```

### Create ACL Rule
```
POST /api/acl
Authorization: Bearer <token>
```

### Update ACL Rule
```
PUT /api/acl/:id
Authorization: Bearer <token>
```

### Delete ACL Rule
```
DELETE /api/acl/:id
Authorization: Bearer <token>
```

### Toggle ACL Rule
```
PATCH /api/acl/:id/toggle
Authorization: Bearer <token>
```

### Apply ACL Rules to Nginx
```
POST /api/acl/apply
Authorization: Bearer <token>
```
