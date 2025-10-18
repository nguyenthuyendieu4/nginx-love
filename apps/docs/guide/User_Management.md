# User Management - User Guide

## Overview

User Management is the core system for managing user accounts, roles, and permissions within the Nginx WAF Management Platform. This feature allows administrators to control who can access the platform and what they can do.

### Key Features

- 👥 **User Account Management**: Invite, edit, and delete user accounts
- 🔐 **Role-Based Access Control (RBAC)**: Three distinct roles with predefined permissions
- 🔑 **Password Management**: Secure password handling with bcrypt hashing
- ⚡ **User Status Control**: Enable/disable accounts without deletion
- 📊 **User Statistics**: Track total users, active users, and administrators
- 🔄 **Password Reset**: Admin can reset user passwords

### User Roles

The system has **3 roles** with different levels of access:

| Role | Access Level | Description |
|------|--------------|-------------|
| **Admin** | Full system access | Platform administrator with complete control including user management and domain deletion |
| **Moderator** | Technical operations | Can manage domains, SSL, ModSecurity, and backups but cannot delete domains or manage users |
| **Viewer** | Read-only access | Can view all features but cannot modify anything |

---

## User Management Dashboard

### Accessing User Management

1. Log in to the Nginx WAF Management Platform
2. Navigate to **User Management** from the sidebar menu
3. You will see the User Management dashboard

**Permission Required**: Only **Admin** or **Moderator** role can access this page.
- **Admin**: Full access (can invite, edit, delete users)
- **Moderator**: View-only access (can see user list and statistics)

### Dashboard Overview

The dashboard displays:

#### Statistics Cards (Top Section)

1. **Total Users**
   - Shows total number of users in the system
   - Displays count of active users below

2. **Administrators**
   - Number of users with Admin role
   - Shows "Full access users" label

3. **Recent Logins**
   - Number of users who logged in within last 24 hours

#### User List Table

The table displays all users with the following columns:

- **Username**: Unique username for login
- **Email**: User's email address
- **Full Name**: User's display name
- **Role**: Badge showing role (Admin/Moderator/Viewer)
  - Admin: Purple badge
  - Moderator: Blue badge
  - Viewer: Gray badge
- **Status**: Badge showing account status
  - Active: Green badge
  - Inactive: Gray badge
- **Last Login**: Timestamp of last successful login (or "Never" if not logged in yet)
- **Actions**: Buttons for Edit, Reset Password, Delete

---

## Inviting a New User

**Permission Required**: Admin only

### Step-by-Step Process

#### Step 1: Open Invite Dialog

1. Click the **"Invite User"** button (top-right corner of User Management page)
2. The "Invite New User" dialog opens
3. Dialog description shows: "Send an invitation to a new user"

#### Step 2: Fill Required Information

All fields below are **required** except where noted:

##### 1. Username
- **Field Type**: Text input
- **Placeholder**: `john.doe`
- **Requirements**:
  - Must be unique across all users
  - Minimum 3 characters
  - Cannot be changed after user creation
- **Cannot be modified** when editing existing user
- **Examples**: `john.doe`, `admin_user`, `security-team`

##### 2. Email Address
- **Field Type**: Email input
- **Placeholder**: `john.doe@example.com`
- **Requirements**:
  - Must be valid email format
  - Must be unique across all users
- **Can be modified** when editing user

##### 3. Full Name
- **Field Type**: Text input
- **Placeholder**: `John Doe`
- **Requirements**:
  - User's complete name
  - Minimum 2 characters
- **Can be modified** when editing user

##### 4. Password
- **Field Type**: Password input (hidden text)
- **Placeholder**: `••••••••`
- **Requirements**:
  - Minimum 6 characters
  - Will be hashed using bcrypt before storage
- **Only shown when inviting new user** (not shown when editing)
- **Note**: There is NO password generator or strength indicator in current UI

##### 5. Role
- **Field Type**: Dropdown select
- **Options**:
  - **Viewer - Read-only access** (Default)
  - **Moderator - Can manage configurations**
  - **Admin - Full access**
- **Can be modified** when editing user
- **Important**: Choose carefully based on user's responsibilities

##### 6. Status
- **Field Type**: Dropdown select
- **Options**:
  - **Active**: User can log in
  - **Inactive**: User cannot log in (account disabled)
- **Default**: Active
- **Can be modified** when editing user

#### Step 3: Submit

1. Review all information for accuracy
2. Click **"Invite User"** button
3. System will:
   - Validate all inputs
   - Check username and email uniqueness
   - Hash password with bcrypt
   - Create user account in database
   - Display success notification
   - Close dialog automatically
4. New user appears in user list immediately

#### Validation Errors

If validation fails, you'll see error messages:

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Username is required" | Username field is empty | Enter a username |
| "Email is required" | Email field is empty | Enter an email address |
| "Invalid email format" | Email format is incorrect | Use format: user@domain.com |
| "Password is required and must be at least 6 characters" | Password too short | Use at least 6 characters |
| "Full name is required" | Full name field is empty | Enter user's full name |
| "Username already exists" | Username is taken | Choose a different username |
| "Email already exists" | Email is already registered | Use a different email |

---

## Editing User Accounts

**Permission Required**: Admin only

### How to Edit a User

1. Find the user in the user list
2. Click the **"Edit"** button (pencil icon) in the Actions column
3. The "Edit User" dialog opens
4. Dialog description shows: "Update user information and permissions"
5. Make your changes
6. Click **"Update User"** button

### What You Can Edit

| Field | Can Edit? | Notes |
|-------|-----------|-------|
| Username | ❌ No | Username is locked after creation |
| Email | ✅ Yes | Must remain unique |
| Full Name | ✅ Yes | |
| Password | ❌ No | Password field not shown in edit mode. Use "Reset Password" instead |
| Role | ✅ Yes | Changes take effect immediately |
| Status | ✅ Yes | Can toggle Active/Inactive |

### Changing User Role

**To Promote a User**:
1. Edit user
2. Select higher role from dropdown (e.g., Viewer → Moderator)
3. Click "Update User"
4. User gains new permissions on next login or page refresh

**To Demote a User**:
1. Edit user
2. Select lower role from dropdown (e.g., Moderator → Viewer)
3. Click "Update User"
4. User loses higher permissions on next login or page refresh

**Restrictions**:
- ⚠️ You cannot edit your own user account
- ⚠️ You cannot demote yourself

### Enabling/Disabling Users

**To Disable a User**:
1. Edit user
2. Change Status dropdown to **"Inactive"**
3. Click "Update User"
4. User is immediately logged out from all sessions
5. User cannot log in until re-enabled

**To Enable a User**:
1. Edit user
2. Change Status dropdown to **"Active"**
3. Click "Update User"
4. User can now log in again

**Why Disable Instead of Delete?**
- Preserves user's historical data and actions
- Can be re-enabled easily if needed
- Maintains audit trail and logs
- No data loss

---

## Resetting User Password

**Permission Required**: Admin only

### How to Reset Password

1. Find the user in user list
2. Click the **"Reset Password"** button (key icon) in Actions column
3. Confirmation dialog appears:
   - **Title**: "Reset Password Confirmation"
   - **Message**: "Are you sure you want to reset the password for user **[username]**?"
   - **Note**: "A new secure password will be generated. The user will need to use this temporary password to log in."
4. Click **"Reset Password"** to confirm
5. System generates new random secure password
6. Success dialog appears showing:
   - **Title**: "Password Reset Successful"
   - **Message**: "Password has been reset for user **[username]**"
   - **New password** displayed in a copy-able text box
   - **Copy button** to copy password to clipboard
7. Click **"Copy Password"** to copy the new password
8. Share the password with user through secure channel
9. Click **"Close"** to finish

### Important Notes

- ✅ New password is **randomly generated** and secure
- ✅ Password is only shown **once** - make sure to copy it
- ✅ Password is **immediately active** - user can log in right away
- ⚠️ There is **no email notification** - admin must share password manually
- 🔐 Share password through **secure channel** (not email or public chat)

---

## Deleting User Accounts

**Permission Required**: Admin only

### How to Delete a User

1. Find the user in user list
2. Click the **"Delete"** button (trash icon) in Actions column
3. Confirmation dialog appears:
   - **Title**: "Delete User"
   - **Message**: "Are you sure you want to delete **[username]**?"
   - **Warning**: "This action cannot be undone"
4. Click **"Delete"** to confirm (or "Cancel" to abort)
5. System will:
   - Remove user account from database
   - Log the deletion action
   - Display success notification
   - Remove user from list immediately

### What Happens When Deleting?

**Immediate Effects**:
- ❌ User account is permanently removed
- ❌ User is immediately logged out from all sessions
- ❌ User can no longer log in
- ✅ User's created resources (domains, SSL certs, etc.) remain active
- ✅ Audit logs preserve user's historical actions

### Restrictions

You **CANNOT** delete:
- ⚠️ Yourself (current logged-in user)
- ⚠️ Users with active sessions (system may prevent this)

### Best Practices

**Before Deleting**:
- ✅ Consider disabling instead (change status to Inactive)
- ✅ Review user's created resources
- ✅ Document reason for deletion
- ✅ Notify relevant team members

**When to Delete**:
- ✅ Duplicate or test accounts
- ✅ Compromised accounts (after security investigation)
- ✅ Former employees (after transition period)
- ✅ Accounts that were created by mistake

**When to Disable Instead**:
- ✅ Temporary suspension needed
- ✅ User on leave or vacation
- ✅ Under investigation
- ✅ May need to restore access later

---

## User Role Permissions

### Detailed Permission Matrix

This table shows exactly what each role can do based on **actual backend authorization**:

| Feature/Action | Admin | Moderator | Viewer |
|----------------|-------|-----------|--------|
| **User Management** ||||
| View user list | ✅ Full | 👁️ View Only | ❌ No Access |
| View user statistics | ✅ Full | 👁️ View Only | ❌ No Access |
| Invite new users | ✅ Yes | ❌ No | ❌ No |
| Edit users | ✅ Yes | ❌ No | ❌ No |
| Delete users | ✅ Yes | ❌ No | ❌ No |
| Reset passwords | ✅ Yes | ❌ No | ❌ No |
| Change user status | ✅ Yes | ❌ No | ❌ No |
| **Domain Management** ||||
| View domains | ✅ Full | ✅ Full | 👁️ View Only |
| Create domains | ✅ Yes | ✅ Yes | ❌ No |
| Update domains | ✅ Yes | ✅ Yes | ❌ No |
| **Delete domains** | ✅ Yes | ❌ No | ❌ No |
| Toggle SSL | ✅ Yes | ✅ Yes | ❌ No |
| **SSL Certificate Management** ||||
| View SSL certificates | ✅ Full | ✅ Full | 👁️ View Only |
| Issue auto SSL (Let's Encrypt) | ✅ Yes | ✅ Yes | ❌ No |
| Upload manual SSL | ✅ Yes | ✅ Yes | ❌ No |
| Update SSL | ✅ Yes | ✅ Yes | ❌ No |
| Delete SSL | ✅ Yes | ✅ Yes | ❌ No |
| Renew SSL | ✅ Yes | ✅ Yes | ❌ No |
| **ModSecurity (WAF) Rules** ||||
| View rules | ✅ Full | ✅ Full | 👁️ View Only |
| Create custom rules | ✅ Yes | ✅ Yes | ❌ No |
| Update rules | ✅ Yes | ✅ Yes | ❌ No |
| Delete rules | ✅ Yes | ✅ Yes | ❌ No |
| Toggle CRS rules | ✅ Yes | ✅ Yes | ❌ No |
| **Access Lists (IP Whitelisting/Blacklisting)** ||||
| View access lists | ✅ Full | ✅ Full | 👁️ View Only |
| Create access lists | ✅ Yes | ✅ Yes | ❌ No |
| Update access lists | ✅ Yes | ✅ Yes | ❌ No |
| Delete access lists | ✅ Yes | ✅ Yes | ❌ No |
| **ACL (Access Control Lists)** ||||
| View ACL | ✅ Full | ✅ Full | 👁️ View Only |
| Manage ACL | ✅ Yes | ✅ Yes | ❌ No |
| **Backup & Restore** ||||
| View backup history | ✅ Full | ✅ Full | 👁️ View Only |
| Create backup schedule | ✅ Yes | ✅ Yes | ❌ No |
| Update backup schedule | ✅ Yes | ✅ Yes | ❌ No |
| Delete backup schedule | ✅ Yes | ✅ Yes | ❌ No |
| Run backup manually | ✅ Yes | ✅ Yes | ❌ No |
| Export configuration | ✅ Yes | ✅ Yes | ❌ No |
| Import configuration | ✅ Yes | ✅ Yes | ❌ No |
| **Performance Monitoring** ||||
| View performance metrics | ✅ Full | ✅ Full | 👁️ View Only |
| View statistics | ✅ Full | ✅ Full | 👁️ View Only |
| View history | ✅ Full | ✅ Full | 👁️ View Only |
| **Cleanup old metrics** | ✅ Yes | ❌ No | ❌ No |
| **Logs & Analytics** ||||
| View access logs | ✅ Full | 👁️ View Only | 👁️ View Only |
| View error logs | ✅ Full | 👁️ View Only | 👁️ View Only |
| Export logs | ✅ Yes | 👁️ View Only | ❌ No |
| **System Operations** ||||
| **Reload Nginx** | ✅ Yes | ❌ No | ❌ No |
| System settings | ✅ Yes | ❌ No | ❌ No |
| **Own Profile** ||||
| Edit own profile | ✅ Yes | ✅ Yes | ✅ Yes |

**Legend**:
- ✅ **Full** / **Yes**: Complete access - can perform action
- 👁️ **View Only**: Read-only access - can see but cannot modify
- ❌ **No** / **No Access**: Cannot access or view feature

### Key Differences Between Roles

#### Admin vs Moderator

**Only Admin can**:
- ✅ Manage users (invite, edit, delete, reset passwords)
- ✅ Delete domains
- ✅ Reload Nginx configuration
- ✅ Delete old performance metrics
- ✅ Access system settings

**Both Admin and Moderator can**:
- ✅ Manage domains (create, update, enable/disable SSL)
- ✅ Manage SSL certificates
- ✅ Manage ModSecurity rules
- ✅ Manage Access Lists and ACL
- ✅ Manage backups

#### Moderator vs Viewer

**Only Moderator can**:
- ✅ Create and modify all resources (except users and domains deletion)
- ✅ Manage SSL, ModSecurity, Access Lists, ACL
- ✅ Perform backup operations

**Both Moderator and Viewer can**:
- 👁️ View all features and resources
- 👁️ Monitor system performance
- 👁️ Access logs and dashboards

**Viewer cannot**:
- ❌ Create, update, or delete ANY resources
- ❌ Modify configurations
- ❌ Perform any administrative actions

---

## Common Use Cases

### Use Case 1: Onboarding a New Team Member

**Scenario**: New DevOps engineer joining the team

**Steps**:
1. **Invite User** (Admin)
   - Username: `devops_john`
   - Email: `john@company.com`
   - Full Name: `John Doe`
   - Role: `Viewer` (start with read-only)
   - Status: `Active`
   - Password: Create secure password

2. **Training Period** (Week 1-2)
   - User logs in with Viewer role
   - Can see all configurations and dashboards
   - Learns system without risk of breaking anything
   - Shadows experienced team members

3. **Promote to Moderator** (After Training)
   - Admin edits user
   - Changes role to `Moderator`
   - User can now manage domains, SSL, security rules

4. **Monitor Activity** (First Month)
   - Review user's actions in audit logs
   - Provide feedback and guidance
   - Ensure proper use of permissions

### Use Case 2: Temporary Contractor Access

**Scenario**: External security consultant needs temporary read-only access

**Steps**:
1. **Invite User** (Admin)
   - Username: `contractor_security`
   - Email: `consultant@securityfirm.com`
   - Full Name: `Security Consulting Firm`
   - Role: `Viewer` (read-only)
   - Status: `Active`

2. **During Contract Period**
   - Contractor can view all configurations
   - Can generate reports
   - Cannot modify anything

3. **End of Contract**
   - Admin changes Status to `Inactive` (disable account)
   - Or Admin deletes the account if no longer needed
   - Review contractor's activity in audit logs

### Use Case 3: Employee Leaving Company

**Scenario**: Team member leaving organization

**Immediate Actions** (Day 1):
1. Admin changes user Status to `Inactive`
2. User is immediately logged out
3. User cannot log in anymore

**Transition Period** (1-30 days):
- Account remains disabled
- Historical data preserved
- Resources created by user remain active
- Can re-enable if needed for knowledge transfer

**Final Cleanup** (After 30 days):
- Admin deletes the account
- Audit logs preserve history
- Resources remain in system

### Use Case 4: Managing Multiple Administrators

**Scenario**: Company has 3 administrators

**Best Practices**:
1. **Separate Admin Accounts**
   - Each admin has own username
   - No shared accounts
   - Individual accountability

2. **Role Assignment**
   - Primary Admin: Full system control
   - Secondary Admins: Full backup admins
   - Clear communication protocol

3. **Protection**
   - ⚠️ Never delete all admin accounts
   - System requires at least one admin
   - Cannot delete yourself

4. **Regular Review**
   - Quarterly audit of admin accounts
   - Remove unnecessary admin privileges
   - Follow principle of least privilege

---

## Troubleshooting

### Issue 1: Cannot Invite New User

**Symptoms**: Invite User button not visible or grayed out

**Possible Causes**:
1. Insufficient permissions (not Admin role)
2. Not logged in
3. Session expired

**Solutions**:
- ✅ Verify you have Admin role (check your profile)
- ✅ Log out and log back in
- ✅ Contact another admin if you don't have permissions

---

### Issue 2: "Username already exists" Error

**Symptoms**: Cannot invite user due to duplicate username

**Solutions**:
1. Search existing users to find conflicting username
2. Choose a different username
3. Check if account was previously created and deleted (may still exist as inactive)

---

### Issue 3: User Cannot Login After Creation

**Symptoms**: Newly invited user gets "Invalid credentials"

**Possible Causes**:
1. **Status is Inactive**: Account was created as inactive
2. **Wrong password**: User typing password incorrectly
3. **Wrong username**: User typing username incorrectly

**Solutions**:

**Check Account Status**:
1. Admin views user in user list
2. Verify Status badge shows "Active" (green)
3. If Inactive, edit user and change to Active

**Reset Password**:
1. Admin clicks "Reset Password" button
2. Copy new generated password
3. Share with user through secure channel
4. User tries again

**Verify Username**:
- Username is case-sensitive
- Check for extra spaces
- Confirm exact spelling

---

### Issue 4: Cannot Delete User

**Symptoms**: Delete button doesn't work or shows error

**Possible Causes**:
1. **Trying to delete yourself**: System prevents self-deletion
2. **Last admin account**: Cannot delete last admin
3. **Insufficient permissions**: Only Admin can delete users

**Solutions**:
- ✅ Another admin must delete your account
- ✅ Create another admin before deleting last admin
- ✅ Disable user instead of deleting

---

### Issue 5: Role Change Not Taking Effect

**Symptoms**: User still has old permissions after role change

**Possible Causes**:
1. User hasn't logged out and back in
2. Browser cache showing old data
3. Change not saved properly

**Solutions**:
1. **User must log out and log back in**
2. Clear browser cache and cookies
3. Admin verifies role change was saved in user list
4. Try editing user again to confirm role

---

## Security Best Practices

### Password Management

**Strong Passwords**:
- ✅ Minimum 6 characters (system requirement)
- ✅ Recommended: 12+ characters
- ✅ Mix of uppercase, lowercase, numbers, symbols
- ✅ Avoid common words or patterns
- ✅ Don't reuse passwords from other systems

**Password Sharing**:
- ✅ Share through secure channel (encrypted messaging, password manager)
- ❌ Don't share via email, Slack, Teams, SMS
- ✅ User should change password after first login
- ✅ Delete temporary passwords after sharing

**Password Reset**:
- ✅ Only reset when necessary
- ✅ Copy password immediately (shown only once)
- ✅ Verify user identity before resetting
- ✅ Log all password resets for audit

### Account Security

**Principle of Least Privilege**:
- ✅ Start with Viewer role
- ✅ Promote only when needed
- ✅ Regular review of user roles
- ✅ Demote when responsibilities change

**Account Lifecycle**:
- ✅ Disable accounts immediately when user leaves
- ✅ Review inactive accounts monthly
- ✅ Delete old test/temporary accounts
- ✅ Maintain audit trail

**Access Review**:
- ✅ Quarterly review of all user accounts
- ✅ Verify each user still needs access
- ✅ Check if roles are still appropriate
- ✅ Remove unnecessary admin privileges

### Monitoring

**Regular Checks**:
- 👁️ Review "Last Login" column for inactive accounts
- 👁️ Monitor "Recent Logins" statistics
- 👁️ Check audit logs for suspicious activity
- 👁️ Verify number of admin accounts is appropriate

**Red Flags**:
- 🚨 Multiple failed login attempts
- 🚨 Logins from unusual locations
- 🚨 Accounts that haven't logged in for 90+ days
- 🚨 Unusual number of admin accounts
- 🚨 Shared accounts (multiple people using same login)

---

## Related Documentation

- [Access Lists Guide](./Access_Lists.md) - IP-based access control
- [Access Control List (ACL)](./Access_Control_List.md) - Advanced access policies  
- [Domain Management](./domains.md) - Managing domains and sites
- [SSL Certificates](./ssl.md) - SSL/TLS certificate management
- [ModSecurity](./modsecurity.md) - Web application firewall rules
- [Performance Monitoring](./performance.md) - System performance tracking
- [API Documentation](../api/users.md) - User Management API reference

---

## Quick Reference

### User Form Fields

| Field | Required | Editable After Creation | Notes |
|-------|----------|------------------------|-------|
| Username | ✅ Yes | ❌ No | Locked after creation |
| Email | ✅ Yes | ✅ Yes | Must be unique |
| Full Name | ✅ Yes | ✅ Yes | Display name |
| Password | ✅ Yes (create only) | ❌ No | Use "Reset Password" instead |
| Role | ✅ Yes | ✅ Yes | Viewer/Moderator/Admin |
| Status | ✅ Yes | ✅ Yes | Active/Inactive |

### Button Actions

| Button | Icon | Permission | Action |
|--------|------|------------|--------|
| Invite User | UserPlus | Admin only | Open invite dialog |
| Edit | Pencil | Admin only | Open edit dialog |
| Reset Password | Key | Admin only | Generate new password |
| Delete | Trash | Admin only | Delete user account |

### Status Values

| Status | Badge Color | Meaning | Can Login? |
|--------|-------------|---------|------------|
| Active | Green | Account enabled | ✅ Yes |
| Inactive | Gray | Account disabled | ❌ No |

### Role Hierarchy

```
Admin (Full Access)
  ├── User Management: ✅ Full
  ├── Domain Deletion: ✅ Yes
  ├── Nginx Reload: ✅ Yes
  └── All other features: ✅ Full

Moderator (Technical Operations)
  ├── User Management: ❌ View only
  ├── Domain Deletion: ❌ No
  ├── Nginx Reload: ❌ No
  └── Domain/SSL/Security/Backup: ✅ Full

Viewer (Read-Only)
  ├── User Management: ❌ No access
  └── All features: 👁️ View only
```

---

## Support

If you encounter issues not covered in this guide:

1. **Check Permissions**: Verify you have Admin role for user management
2. **Review Error Messages**: Read validation errors carefully
3. **Check Audit Logs**: Review system logs for details
4. **Contact Administrator**: Reach out to your system admin
5. **Technical Support**: Contact platform support with:
   - Screenshot of error
   - Steps to reproduce
   - Your username and role
   - Browser and OS version

---

**Last Updated**: January 18, 2025  
**Documentation Version**: 2.0.0  
**System Version**: Based on actual implementation
