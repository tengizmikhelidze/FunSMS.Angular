# 📝 Changelog - Admin System (v3.0.0)

## What Changed - January 15, 2026

### 🆕 New Features

#### Admin Role System
- **Added `role` field to users** (`user` or `admin`)
- **Role-based permissions** for SMS operations
- **Admin-only endpoints** for user and SMS management

#### Permission Controls
- **Send SMS** - Now requires admin role
- **View All Messages** - Admins see all users' messages
- **User Management** - Promote/demote admin roles

---

## 🔐 Breaking Changes

### ⚠️ Send SMS by ID Now Requires Admin
**Endpoint**: `POST /api/sms/send/:id`

**Before**: Any authenticated user could send SMS  
**After**: Only users with admin role can send SMS

**Impact**: Regular users will get 403 Forbidden

**Migration**: Promote necessary users to admin role

---

### ⚠️ Get Unsent Messages - Role-Based Filtering
**Endpoint**: `GET /api/sms/unsent`

**Before**: All users saw only their messages  
**After**: 
- **Regular users**: See only their own messages (unchanged)
- **Admins**: See ALL unsent messages from ALL users

**Impact**: Admins now have visibility into all unsent messages

---

## 🗄️ Database Changes

### New Column: `role`
```sql
ALTER TABLE users 
ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user';

ALTER TABLE users
ADD CONSTRAINT valid_role CHECK (role IN ('user', 'admin'));

CREATE INDEX idx_users_role ON users(role);
```

**Default Value**: All existing users get `role = 'user'`

**Migration Required**: Run `npm run migrate:user-role`

---

## 📡 New API Endpoints

### Admin User Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/users/:userId/promote` | POST | Promote user to admin |
| `/api/admin/users/:userId/demote` | POST | Demote admin to user |
| `/api/admin/users` | GET | Get all users (filterable) |

### Admin SMS Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/sms` | GET | Get ALL SMS from ALL users |
| `/api/admin/sms/send/:id` | POST | Send ANY unsent message |
| `/api/admin/sms/:id` | DELETE | Delete ANY message |
| `/api/admin/sms/stats` | GET | Get stats for all users |

**All admin endpoints require**:
1. Valid JWT token (authentication)
2. Admin role (authorization)

---

## 📦 New Files Created

### Source Code
```
src/
├── middleware/requireAdmin.ts       # Admin permission check
├── controllers/adminController.ts   # Admin endpoints
├── routes/admin.ts                  # Admin route definitions
└── migrations/addUserRole.ts        # Database migration
```

### Documentation
```
documentations/
├── ADMIN_SYSTEM_PLAN.md            # Implementation plan
├── ADMIN_API_REFERENCE.md          # API documentation
└── CHANGELOG.md                     # This file
```

---

## 🔧 Modified Files

### Models
- **`src/models/User.ts`**
  - Added `role` to `IUser` interface
  - Added `updateRole()` method
  - Added `countByRole()` method
  - Added `findAll()` method
  - Added `countAll()` method

### Middleware
- **`src/middleware/auth.ts`**
  - Added `role` property to `AuthRequest` interface

### Controllers
- **`src/controllers/smsController.ts`**
  - Updated `getUnsentMessages()` for role-based filtering
  - Admins see all messages, users see only theirs

### Routes
- **`src/routes/sms.ts`**
  - Added `requireAdmin` middleware to `/send/:id`

- **`src/index.ts`**
  - Registered admin routes at `/api/admin`

---

## 🔑 Initial Setup Required

### Creating First Admin

**Option 1: Environment Variable** (Recommended)

Add to `.env`:
```env
ADMIN_EMAILS=admin@example.com,another@example.com
```

Then run migration:
```bash
npm run migrate:user-role
```

Users with these emails will automatically get admin role.

**Option 2: Direct Database Update**

After creating a user, run SQL:
```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

---

## 🧪 Testing the Changes

### 1. Run Migration
```bash
npm run migrate:user-role
```

### 2. Create Admin User
Set `ADMIN_EMAILS` in `.env` or update database directly

### 3. Test Admin Endpoints
```bash
# Get all users (admin only)
curl -H "Authorization: Bearer {adminToken}" \
  http://localhost:3000/api/admin/users

# Promote user to admin
curl -X POST -H "Authorization: Bearer {adminToken}" \
  http://localhost:3000/api/admin/users/{userId}/promote

# Send SMS (admin only)
curl -X POST -H "Authorization: Bearer {adminToken}" \
  http://localhost:3000/api/sms/send/{smsId}
```

### 4. Test Regular User Restrictions
```bash
# Try to send SMS as regular user (should get 403)
curl -X POST -H "Authorization: Bearer {userToken}" \
  http://localhost:3000/api/sms/send/{smsId}
```

Expected response:
```json
{
  "success": false,
  "message": "Access denied. Administrator privileges required.",
  "requiredRole": "admin",
  "yourRole": "user"
}
```

---

## 🛡️ Security Features

### 1. Admin Lock-out Prevention
- Cannot demote the last admin
- System requires at least one admin user

### 2. Role Verification
- All admin endpoints check role before execution
- Uses dedicated `requireAdmin` middleware

### 3. Data Isolation
- Regular users can only see/modify their own data
- Admins have full visibility and control

---

## 📊 Migration Summary

### What the Migration Does
1. ✅ Adds `role` column to `users` table
2. ✅ Sets default value to `'user'`
3. ✅ Adds constraint to allow only `'user'` or `'admin'`
4. ✅ Creates index for performance
5. ✅ Auto-assigns admin role to emails in `ADMIN_EMAILS`

### Rollback (if needed)
```sql
DROP INDEX IF EXISTS idx_users_role;
ALTER TABLE users DROP CONSTRAINT IF EXISTS valid_role;
ALTER TABLE users DROP COLUMN IF EXISTS role;
```

---

## 📈 Version History

### v3.0.0 - Admin System (January 15, 2026)
- ✅ Added admin role system
- ✅ Permission-based SMS sending
- ✅ Admin user management endpoints
- ✅ Admin SMS management endpoints
- ✅ Role-based data visibility

### v2.0.0 - SMS Workflow (January 15, 2026)
- ✅ Added `sent_status` field
- ✅ Separate save/send workflow
- ✅ Comprehensive filtering

### v1.0.0 - Initial Release
- ✅ JWT authentication
- ✅ OAuth providers (Google, Facebook, Apple)
- ✅ SMS sending functionality
- ✅ PostgreSQL database

---

## 🎯 Next Steps

1. **Run Migration**: `npm run migrate:user-role`
2. **Create Admin User**: Set ADMIN_EMAILS or update database
3. **Test Endpoints**: Verify admin and user permissions
4. **Update Frontend**: Handle admin role in UI
5. **Deploy**: Update production environment

---

## 🅰️ Angular Integration

### Quick Start for Angular Developers

#### 1. Update Environment Files

**`src/environments/environment.ts`**:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  adminApiUrl: 'http://localhost:3000/api/admin'
};
```

#### 2. Add TypeScript Interfaces

```typescript
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}
```

#### 3. Create Admin Service

```typescript
@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {}

  getAllUsers(params?: any): Observable<UserListResponse> {
    return this.http.get<UserListResponse>(
      `${environment.adminApiUrl}/users`,
      { params }
    );
  }

  promoteToAdmin(userId: string): Observable<any> {
    return this.http.post(
      `${environment.adminApiUrl}/users/${userId}/promote`,
      {}
    );
  }

  getSmsStats(): Observable<any> {
    return this.http.get(
      `${environment.adminApiUrl}/sms/stats`
    );
  }
}
```

#### 4. Create Admin Guard

```typescript
@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  canActivate(): Observable<boolean> {
    return this.authService.getCurrentUser().pipe(
      map(user => user.role === 'admin')
    );
  }
}
```

#### 5. Protect Admin Routes

```typescript
{
  path: 'admin',
  canActivate: [AdminGuard],
  children: [
    { path: 'users', component: AdminUsersComponent },
    { path: 'sms', component: AdminSmsComponent }
  ]
}
```

### Features for Angular UI

✅ **User Management Panel**
- List all users with pagination
- Search and filter by role
- Promote/demote users with one click
- Real-time role updates

✅ **SMS Management Panel**
- View all SMS from all users
- Filter by status, user, date range
- Send any unsent message
- Delete any message

✅ **Admin Dashboard**
- Total messages statistics
- Success/failure rates
- Cost tracking
- Recent activity

✅ **Role-Based UI**
- Show/hide admin menu based on user role
- Display admin badge for admin users
- Different SMS list for admins (see all) vs users (see own)

### Example Components

**Admin Dashboard Component**:
```typescript
export class AdminDashboardComponent implements OnInit {
  stats$ = this.adminService.getSmsStats().pipe(
    map(response => response.stats)
  );
}
```

**Admin Users Component**:
```typescript
export class AdminUsersComponent {
  users$ = this.adminService.getAllUsers({ page: 1, limit: 50 });

  promoteUser(userId: string) {
    this.adminService.promoteToAdmin(userId).subscribe(() => {
      this.users$ = this.adminService.getAllUsers();
    });
  }
}
```

### Complete Documentation

For complete Angular integration with examples, see:
- **`ADMIN_API_REFERENCE.md`** - Full API documentation with Angular examples
- **`TESTING_GUIDE.md`** - Testing endpoints and workflows

---

## 📞 Support

For questions or issues:
- Review **`ADMIN_API_REFERENCE.md`** for complete Angular integration guide
- Check **`ADMIN_IMPLEMENTATION_SUMMARY.md`** for implementation details
- Review code in `src/controllers/adminController.ts`

---

## 📚 Documentation Files

- **`ADMIN_API_REFERENCE.md`** - Complete API reference with Angular examples
- **`ADMIN_IMPLEMENTATION_SUMMARY.md`** - Implementation overview
- **`CHANGELOG.md`** - This file (changes and upgrade guide)
- **`TESTING_GUIDE.md`** - Complete testing procedures

---

**Migration Required**: ✅ Yes - Run `npm run migrate:user-role`  
**Breaking Changes**: ✅ Yes - SMS sending now requires admin role  
**Frontend Integration**: ✅ Ready - See ADMIN_API_REFERENCE.md  
**Version**: 3.0.0  
**Date**: January 15, 2026

