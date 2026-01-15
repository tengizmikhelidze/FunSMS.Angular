# 🎉 FunSMS - Georgian SMS Gateway Backend

Complete Node.js/TypeScript backend for sending SMS messages to Georgian phone numbers with custom sender names.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-green)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://www.postgresql.org/)
[![Status](https://img.shields.io/badge/Status-Ready-success)](https://github.com)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [SMS Providers](#sms-providers)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Admin System](#admin-system)
- [Angular Integration](#angular-integration)
- [Environment Configuration](#environment-configuration)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Documentation](#documentation)
- [Contributing](#contributing)

---

## 🎯 Overview

FunSMS is a production-ready backend API that enables sending SMS messages to Georgian mobile phone numbers with customizable sender names. Built with TypeScript and PostgreSQL, it supports multiple SMS providers and includes comprehensive authentication.

### Target Audience
- Georgian mobile phone numbers (+995XXXXXXXXX)
- Magticom, Beeline, Geocell operators
- Custom alphanumeric sender IDs (via Vonage)

### Key Capabilities
- ✅ Send SMS to Georgian numbers
- ✅ Custom sender names (3-11 characters)
- ✅ Multiple SMS provider support
- ✅ Complete authentication system (JWT + OAuth)
- ✅ SMS history and analytics
- ✅ Cost tracking
- ✅ Scheduled sending

---

## ✨ Features

### 🔐 Authentication System
- **Email/Password Authentication**
  - Secure registration with bcrypt hashing
  - Login with JWT access + refresh tokens
  - Token-based session management
  
- **OAuth 2.0 Integration**
  - Google OAuth
  - Facebook OAuth
  - Apple Sign In (iCloud)
  
- **Security Features**
  - JWT access tokens (15min expiry)
  - JWT refresh tokens (7 days expiry)
  - Protected route middleware
  - Input validation with express-validator

### 👑 Admin System (v3.0.0) **NEW**
- **Role-Based Access Control**
  - User and Admin roles
  - Permission-based SMS sending
  - Admin-only endpoints
  
- **User Management**
  - Promote users to admin
  - Demote admins to users
  - View all users with filtering
  
- **Admin SMS Management**
  - View ALL SMS from ALL users
  - Send any unsent message
  - Delete any message
  - Complete system statistics
  
- **Security**
  - Admin lock-out prevention
  - Role verification middleware
  - Audit-ready structure

### 📱 SMS Functionality
- **Send SMS Messages**
  - To Georgian mobile numbers (+995XXXXXXXXX)
  - Custom sender names (3-11 alphanumeric)
  - Message validation (up to 1000 characters)
  - Scheduled sending support
  
- **Phone Number Management**
  - Auto-formatting (+995 prefix)
  - Georgian number validation
  - Operator detection (Magticom, Beeline, Geocell)
  
- **SMS Tracking**
  - Complete SMS history per user
  - Real-time status tracking (pending/sent/failed/delivered)
  - Cost tracking per message
  - Delivery confirmation
  - Error logging

- **Analytics**
  - Total messages sent
  - Success/failure rates
  - Cost summaries
  - Message statistics

### 🔌 SMS Provider Support
- **Mock Provider** - Development & testing (FREE, unlimited)
- **Twilio** - Production-ready ($15 free credit)
- **Vonage (Nexmo)** - Best for Georgian custom sender IDs (€2 free)
- **TextBelt** - Free testing (1 SMS/day)

### 💾 Database
- PostgreSQL 16
- Fully typed models
- Proper indexing for performance
- Foreign key constraints
- Automatic timestamps
- Migration system

---

## 🛠️ Tech Stack

### Core
- **Runtime**: Node.js 24.x
- **Language**: TypeScript 5.9
- **Framework**: Express.js 4.18
- **Database**: PostgreSQL 16

### Authentication
- **JWT**: jsonwebtoken 9.0
- **OAuth**: Passport.js with strategies
- **Password Hashing**: bcryptjs 2.4

### SMS Providers
- **Twilio**: twilio 4.20
- **Vonage**: Built-in HTTP client
- **HTTP Client**: axios 1.6

### Development
- **Runtime**: ts-node 10.9
- **Validation**: express-validator 7.0
- **CORS**: cors 2.8

---

## 📁 Project Structure

```
smsjoke.nodeTs/
├── src/
│   ├── config/
│   │   ├── database.ts              # PostgreSQL connection & pooling
│   │   └── passport.ts              # OAuth strategies configuration
│   │
│   ├── controllers/
│   │   ├── authController.ts        # Authentication endpoints logic
│   │   ├── smsController.ts         # SMS endpoints logic
│   │   └── adminController.ts       # Admin endpoints logic (v3.0)
│   │
│   ├── middleware/
│   │   ├── auth.ts                  # JWT authentication middleware
│   │   └── requireAdmin.ts          # Admin role verification (v3.0)
│   │
│   ├── migrations/
│   │   ├── createTables.ts          # Database schema migrations
│   │   ├── addSentStatus.ts         # SMS sent status migration
│   │   └── addUserRole.ts           # User role migration (v3.0)
│   │
│   ├── models/
│   │   ├── User.ts                  # User database model
│   │   └── Sms.ts                   # SMS message database model
│   │
│   ├── routes/
│   │   ├── auth.ts                  # Authentication routes
│   │   ├── sms.ts                   # SMS routes
│   │   └── admin.ts                 # Admin routes (v3.0)
│   │
│   ├── services/
│   │   └── smsService.ts            # SMS provider integrations
│   │
│   ├── utils/
│   │   └── auth.ts                  # JWT utilities & helpers
│   │
│   └── index.ts                     # Express app & server entry
│
├── documentations/
│   ├── README.md                    # This file (main documentation)
│   ├── ADMIN_API_REFERENCE.md       # Admin API with Angular examples (v3.0)
│   ├── ADMIN_IMPLEMENTATION_SUMMARY.md  # Admin system technical details (v3.0)
│   ├── CHANGELOG.md                 # Version history and migrations (v3.0)
│   ├── TESTING_GUIDE.md             # Complete testing procedures (v3.0)
│   ├── SMS_PROVIDER_GUIDE.md        # SMS provider comparison
│   ├── SMS_API_DOCUMENTATION.md     # Complete API reference
│   ├── AUTH_INTERFACES_REFERENCE.md # Auth interfaces
│   ├── ANGULAR_SETUP.md             # Frontend integration
│   ├── IMPLEMENTATION_SUMMARY.md    # Feature summary
│   └── ALL_ERRORS_FIXED.md          # Recent fixes
│
├── .env                             # Environment variables
├── .env.example                     # Environment template
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript configuration
└── proxy.conf.json                  # Angular proxy config
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 24.x or higher
- PostgreSQL 16 or higher
- npm or yarn

### Installation

**1. Clone the repository**
```bash
git clone <your-repo-url>
cd smsjoke.nodeTs
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure environment**

Copy `.env.example` to `.env` and update:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smsjoke
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_ACCESS_SECRET=your_access_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Frontend URL
FRONTEND_URL=http://localhost:4200

# Admin Configuration (v3.0)
ADMIN_EMAILS=admin@example.com

# SMS Provider (start with mock)
SMS_PROVIDER=mock
```

**4. Run database migrations**
```bash
npm run migrate
npm run migrate:user-role  # For admin system (v3.0)
```

Expected output:
```
✅ Database tables created successfully
Migration completed successfully
```

**5. Start development server**
```bash
npm run dev
```

Expected output:
```
🔗 New PostgreSQL client connected
✅ PostgreSQL connected successfully
🚀 Server is running on http://localhost:3000
📝 Environment: development
```

**6. Verify server is running**
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2026-01-15T..."
}
```

---

## 📱 SMS Providers

### Comparison Table

| Provider | Free Credit | Cost/SMS (Georgia) | Custom Sender | Best For |
|----------|-------------|-------------------|---------------|----------|
| **Mock** | ♾️ Unlimited | $0 | ✅ Yes | Development |
| **Twilio** | $15 (~2000 SMS) | $0.0075 | ⚠️ Limited | Testing |
| **Vonage** | €2 (~215 SMS) | €0.0093 | ✅ **Yes** | **Production** |
| **TextBelt** | 1 SMS/day | $0.01 | ❌ No | Basic Testing |

### Provider Setup

#### Mock Provider (Recommended for Development)

Already configured! No setup needed.

```env
SMS_PROVIDER=mock
```

**Features:**
- ✅ FREE & unlimited
- ✅ Logs SMS to console
- ✅ Perfect for development
- ✅ No credentials required

**Console Output:**
```
📱 [MOCK SMS] =====================
To: +995555123456
From: FunSMS
Message: Hello from Georgia!
=====================================
```

#### Twilio (Best for Testing)

**Signup:** https://www.twilio.com/try-twilio

**Setup:**
```env
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

**Pros:**
- ✅ $15 free credit
- ✅ Most reliable delivery
- ✅ Excellent documentation
- ✅ Real-time delivery status

**Cons:**
- ❌ Limited custom sender ID support for Georgia

#### Vonage (Best for Production)

**Signup:** https://dashboard.nexmo.com/sign-up

**Setup:**
```env
SMS_PROVIDER=vonage
VONAGE_API_KEY=your_api_key
VONAGE_API_SECRET=your_api_secret
```

**Pros:**
- ✅ €2 free credit
- ✅ **Custom alphanumeric sender IDs work in Georgia** ⭐
- ✅ Better pricing for Europe/Asia
- ✅ Professional API

**Recommended for:** Production deployment in Georgia

#### TextBelt (Free Testing)

**Website:** https://textbelt.com/

**Setup:**
```env
SMS_PROVIDER=textbelt
TEXTBELT_API_KEY=textbelt  # or paid API key
```

**Free Tier:**
- 1 SMS per day per phone number
- No signup required

**Paid Tier:**
- $0.01 per SMS
- API key required

---

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### OAuth Login
```http
GET /api/auth/google           # Google OAuth
GET /api/auth/facebook         # Facebook OAuth
GET /api/auth/apple            # Apple Sign In
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {accessToken}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer {accessToken}
```

### SMS Endpoints

All SMS endpoints require authentication.

#### Send SMS
```http
POST /api/sms/send
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "phone": "+995555123456",
  "senderName": "FunSMS",
  "message": "Hello from Georgia!",
  "scheduledAt": "2026-01-20T10:00:00Z"  // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "SMS sent successfully",
  "data": {
    "sms": {
      "id": "uuid",
      "recipient_phone": "+995555123456",
      "sender_name": "FunSMS",
      "message_text": "Hello from Georgia!",
      "status": "sent",
      "cost": 0.0075,
      "sent_at": "2026-01-15T..."
    },
    "messageInfo": {
      "valid": true,
      "length": 21,
      "parts": 1
    }
  }
}
```

#### Get SMS History
```http
GET /api/sms/history?limit=50&offset=0
Authorization: Bearer {accessToken}
```

#### Get SMS Statistics
```http
GET /api/sms/stats
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total": 150,
      "sent": 140,
      "failed": 5,
      "pending": 3,
      "delivered": 135
    }
  }
}
```

#### Get SMS by ID
```http
GET /api/sms/{id}
Authorization: Bearer {accessToken}
```

#### Delete Pending SMS
```http
DELETE /api/sms/{id}
Authorization: Bearer {accessToken}
```

#### Get Provider Balance
```http
GET /api/sms/balance
Authorization: Bearer {accessToken}
```

#### Validate Phone Number
```http
POST /api/sms/validate-phone
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "phone": "555123456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isValid": true,
    "formatted": "+995555123456",
    "original": "555123456"
  }
}
```

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  profile_picture TEXT,
  provider VARCHAR(50) NOT NULL DEFAULT 'local',
  provider_id VARCHAR(255),
  is_email_verified BOOLEAN DEFAULT FALSE,
  refresh_tokens TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_provider ON users(provider, provider_id);
```

### SMS Messages Table
```sql
CREATE TABLE sms_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_phone VARCHAR(20) NOT NULL,
  sender_name VARCHAR(11) NOT NULL,
  message_text TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  provider VARCHAR(50) NOT NULL,
  provider_message_id VARCHAR(255),
  cost DECIMAL(10, 4),
  error_message TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_status CHECK (status IN ('pending', 'sent', 'failed', 'delivered'))
);

-- Indexes
CREATE INDEX idx_sms_user_id ON sms_messages(user_id);
CREATE INDEX idx_sms_status ON sms_messages(status);
CREATE INDEX idx_sms_created_at ON sms_messages(created_at DESC);
CREATE INDEX idx_sms_scheduled_at ON sms_messages(scheduled_at) 
  WHERE scheduled_at IS NOT NULL;
```

---

## 🔐 Authentication

### JWT Token System

#### Access Token
- **Lifetime**: 15 minutes
- **Use**: API authorization
- **Payload**: `{ userId, email, iat, exp }`

#### Refresh Token
- **Lifetime**: 7 days
- **Use**: Get new access tokens
- **Storage**: Database (user_refresh_tokens array)
- **Payload**: `{ userId, email, iat, exp }`

### Authentication Flow

```
1. User registers/logs in
   ↓
2. Server generates access + refresh tokens
   ↓
3. Refresh token stored in database
   ↓
4. Client receives both tokens
   ↓
5. Client uses access token for API calls
   ↓
6. When access token expires:
   - Client sends refresh token
   - Server validates against database
   - New access token issued
   ↓
7. On logout:
   - Refresh token removed from database
   - Access token expires naturally
```

### Protected Routes

Add `authenticate` middleware to any route:

```typescript
import { authenticate } from './middleware/auth';

router.get('/protected', authenticate, (req: AuthRequest, res) => {
  const userId = req.userId;  // Available after authentication
  // ...
});
```

---

## 👑 Admin System

### Overview (v3.0.0)

The admin system provides role-based access control with two roles:
- **User**: Can manage their own SMS messages
- **Admin**: Can manage all users and all SMS messages

### Key Features

#### 🔐 Role-Based Access Control
- Every user has a `role` field ('user' or 'admin')
- Admin-only endpoints protected by `requireAdmin` middleware
- Automatic admin assignment via `ADMIN_EMAILS` environment variable

#### 👥 User Management (Admin Only)
- **View All Users**: Paginated list with search and filtering
- **Promote Users**: Grant admin privileges to any user
- **Demote Admins**: Remove admin privileges (with lock-out prevention)
- **Search & Filter**: By role, email, name, creation date

#### 📱 SMS Management (Admin Only)
- **View All Messages**: See SMS from all users (not just own)
- **Send Any Message**: Send any unsent SMS regardless of owner
- **Delete Any Message**: Remove any SMS message
- **Advanced Filtering**: By user, status, date range, phone number

#### 📊 Statistics (Admin Only)
- Total messages and users
- Messages by status (pending/sent/failed)
- Cost tracking across all users
- Time-based analytics (24h, 7d, 30d)

### Admin Endpoints

All admin endpoints require authentication + admin role:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/users` | GET | Get all users (paginated) |
| `/api/admin/users/:userId/promote` | POST | Promote user to admin |
| `/api/admin/users/:userId/demote` | POST | Demote admin to user |
| `/api/admin/sms` | GET | Get all SMS messages |
| `/api/admin/sms/send/:id` | POST | Send any unsent SMS |
| `/api/admin/sms/:id` | DELETE | Delete any SMS |
| `/api/admin/sms/stats` | GET | Get system statistics |

### Setup Admin User

#### Method 1: Environment Variable (Recommended)

Add to `.env`:
```env
ADMIN_EMAILS=admin@example.com,another-admin@example.com
```

Users who register with these emails automatically get admin role.

#### Method 2: Database Update

After user registration:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

#### Method 3: API Promotion

An existing admin can promote another user:
```bash
POST /api/admin/users/{userId}/promote
```

### Security Features

#### 🛡️ Admin Lock-out Prevention
- Cannot demote the last admin in the system
- Ensures at least one admin always exists

#### 🔒 Role Verification
- All admin endpoints check role before execution
- Dedicated `requireAdmin` middleware
- Clear error messages for unauthorized access

#### 📝 Audit-Ready Structure
- All admin actions log user ID
- Timestamp tracking on all operations
- Easy to extend with audit logging

### Breaking Changes (v3.0.0)

#### ⚠️ Send SMS Now Requires Admin Role

**Before**: Any authenticated user could send SMS  
**After**: Only admins can send SMS

**Impact**: Regular users get 403 Forbidden

**Migration**: Promote necessary users to admin

#### ⚠️ Get Unsent Messages - Role-Based Filtering

**Before**: All users saw only their messages  
**After**: 
- Regular users: See only their own messages
- Admins: See ALL unsent messages from ALL users

### Complete Admin Documentation

For detailed API reference and Angular integration:
- **`ADMIN_API_REFERENCE.md`** - Complete API docs with Angular examples
- **`ADMIN_IMPLEMENTATION_SUMMARY.md`** - Technical implementation details
- **`CHANGELOG.md`** - Version history and migration guide
- **`TESTING_GUIDE.md`** - Testing procedures

---

## ⚙️ Environment Configuration

### Required Variables

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# PostgreSQL Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smsjoke
DB_USER=postgres
DB_PASSWORD=your_secure_password

# JWT Secrets (generate strong random strings)
JWT_ACCESS_SECRET=your_access_secret_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Frontend URL (for OAuth callbacks)
FRONTEND_URL=http://localhost:4200

# SMS Provider
SMS_PROVIDER=mock  # Options: mock, twilio, vonage, textbelt
```

### Optional Variables (SMS Providers)

```env
# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Vonage
VONAGE_API_KEY=your_api_key
VONAGE_API_SECRET=your_api_secret

# TextBelt
TEXTBELT_API_KEY=textbelt  # or paid API key

# OAuth Providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:3000/api/auth/facebook/callback

APPLE_CLIENT_ID=your_apple_client_id
APPLE_TEAM_ID=your_apple_team_id
APPLE_KEY_ID=your_apple_key_id
APPLE_PRIVATE_KEY_PATH=./certs/AuthKey.p8
APPLE_CALLBACK_URL=http://localhost:3000/api/auth/apple/callback
```

### Generating Secure Secrets

```bash
# Generate JWT secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🧪 Testing

### Manual Testing

#### 1. Test Server Health
```bash
curl http://localhost:3000/health
```

#### 2. Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

#### 3. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Save the `accessToken` from response.

#### 4. Send SMS
```bash
curl -X POST http://localhost:3000/api/sms/send \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"phone":"+995555123456","senderName":"TestApp","message":"Hello World!"}'
```

#### 5. View SMS History
```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost:3000/api/sms/history
```

#### 6. Get Statistics
```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost:3000/api/sms/stats
```

### PowerShell Testing

```powershell
# Register
$body = @{
    email = "test@example.com"
    password = "password123"
    name = "Test User"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" `
  -Method POST -Body $body -ContentType "application/json"

# Login
$loginBody = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
  -Method POST -Body $loginBody -ContentType "application/json"

$token = $response.data.accessToken

# Send SMS
$smsBody = @{
    phone = "+995555123456"
    senderName = "TestApp"
    message = "Hello from PowerShell!"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/sms/send" `
  -Method POST -Body $smsBody -Headers $headers
```

---

## 🚀 Deployment

### Build for Production

```bash
# Compile TypeScript
npm run build

# Run production build
npm start
```

### Environment Setup

Create `.env` for production with:
- Secure database credentials
- Production database URL
- Strong JWT secrets (min 32 chars)
- Real SMS provider credentials
- HTTPS frontend URL

### Recommended Platforms

#### Heroku
```bash
heroku create your-app-name
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

#### DigitalOcean App Platform
1. Connect GitHub repository
2. Add PostgreSQL database
3. Configure environment variables
4. Deploy

#### AWS (EC2 + RDS)
1. Launch EC2 instance
2. Set up RDS PostgreSQL
3. Configure security groups
4. Deploy with PM2

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Enable error logging
- [ ] Implement rate limiting
- [ ] Set up monitoring (uptime, costs)
- [ ] Configure CORS for production domain
- [ ] Use environment variables (never hardcode secrets)

---

## 🐛 Troubleshooting

### Common Issues

#### "Cannot find module" errors
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### "Password authentication failed for user postgres"
```bash
# Solution: Update .env with correct password
DB_PASSWORD=your_correct_password

# Or reset PostgreSQL password
psql -U postgres
ALTER USER postgres PASSWORD 'new_password';
```

#### "Port 3000 already in use"
```bash
# Solution: Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

#### "Migration failed"
```bash
# Solution: Drop and recreate database
psql -U postgres
DROP DATABASE smsjoke;
CREATE DATABASE smsjoke;
\q

# Run migration again
npm run migrate
```

#### "Invalid phone number"
```
Phone must be Georgian format:
✅ +995555123456
✅ 995555123456 (auto-formatted)
✅ 555123456 (auto-formatted)
❌ +1234567890 (not Georgian)
```

#### "Unauthorized" errors
```
Ensure you include the JWT token:
Authorization: Bearer YOUR_ACCESS_TOKEN
```

#### Mock SMS not logging
```bash
# Check SMS provider in .env
SMS_PROVIDER=mock

# Restart server
npm run dev
```

### TypeScript Errors

All TypeScript compilation errors have been fixed. If you encounter any:

1. Check `src/controllers/smsController.ts` - uses `req.userId`
2. Check `src/services/smsService.ts` - Twilio balance simplified
3. Ensure all imports are correct

See `ALL_ERRORS_FIXED.md` for detailed fixes.

---

## 📚 Documentation

Comprehensive guides available in `/documentations`:

- **SMS_PROVIDER_GUIDE.md** - Detailed SMS provider comparison and setup
- **SMS_API_DOCUMENTATION.md** - Complete API reference with examples
- **AUTH_INTERFACES_REFERENCE.md** - Authentication interfaces and types
- **IMPLEMENTATION_SUMMARY.md** - Feature implementation summary
- **ALL_ERRORS_FIXED.md** - Recent fixes and solutions
- **ANGULAR_SETUP.md** - Frontend integration guide
- **TESTING_GUIDE.md** - Testing examples and Postman collection

---

## 🤝 Contributing

### Development Workflow

1. Create feature branch
```bash
git checkout -b feature/your-feature
```

2. Make changes with proper TypeScript types

3. Test locally
```bash
npm run dev
```

4. Commit with descriptive message
```bash
git commit -m "feat: add feature description"
```

5. Push and create pull request
```bash
git push origin feature/your-feature
```

### Code Style

- Use TypeScript (no `any` types)
- Follow existing patterns
- Add JSDoc comments
- Validate inputs
- Handle errors properly

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🌟 Acknowledgments

- **Twilio** - SMS provider API
- **Vonage** - Georgian SMS support
- **PostgreSQL** - Database
- **Express.js** - Web framework
- **TypeScript** - Type safety

---

## 🅰️ Angular Integration

### Quick Setup for Angular Projects

This backend is fully compatible with Angular applications. Here's how to integrate:

#### 1. Install Dependencies

```bash
npm install @angular/common @angular/http
```

#### 2. Configure Proxy (Development)

**`proxy.conf.json`** (already included):
```json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true
  }
}
```

**Run Angular with proxy**:
```bash
ng serve --proxy-config proxy.conf.json
```

#### 3. Environment Configuration

**`src/environments/environment.ts`**:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  adminApiUrl: 'http://localhost:3000/api/admin'
};
```

#### 4. Create Services

**Auth Service**:
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, data);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/login`, credentials);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/auth/me`);
  }
}
```

**SMS Service**:
```typescript
@Injectable({ providedIn: 'root' })
export class SmsService {
  constructor(private http: HttpClient) {}

  createSms(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/sms`, data);
  }

  getMySms(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/sms`);
  }

  sendSms(id: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/sms/send/${id}`, {});
  }
}
```

**Admin Service** (for admin features):
```typescript
@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {}

  getAllUsers(params?: any): Observable<any> {
    return this.http.get(`${environment.adminApiUrl}/users`, { params });
  }

  promoteToAdmin(userId: string): Observable<any> {
    return this.http.post(`${environment.adminApiUrl}/users/${userId}/promote`, {});
  }

  getSmsStats(): Observable<any> {
    return this.http.get(`${environment.adminApiUrl}/sms/stats`);
  }
}
```

#### 5. Create Auth Interceptor

**`src/app/interceptors/auth.interceptor.ts`**:
```typescript
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req);
};
```

#### 6. Create Admin Guard

**`src/app/guards/admin.guard.ts`**:
```typescript
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.getCurrentUser().pipe(
      map(response => {
        if (response.user.role === 'admin') {
          return true;
        }
        this.router.navigate(['/']);
        return false;
      })
    );
  }
}
```

#### 7. Setup Routes

```typescript
import { Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'sms', component: SmsComponent, canActivate: [AuthGuard] },
  {
    path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'sms', component: AdminSmsComponent }
    ]
  }
];
```

### Complete Angular Documentation

For complete integration guide with all endpoints and examples:
- **`ADMIN_API_REFERENCE.md`** - Full API reference with Angular TypeScript examples
- **`TESTING_GUIDE.md`** - Testing procedures and example requests
- **`CHANGELOG.md`** - Latest changes and Angular migration guide

### TypeScript Interfaces

**User Interface**:
```typescript
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
}
```

**SMS Interface**:
```typescript
export type SmsStatus = 'pending' | 'sent' | 'failed' | 'delivered';

export interface Sms {
  id: string;
  user_id: string;
  phone_number: string;
  sender_name: string;
  message: string;
  status: SmsStatus;
  sent: boolean;
  cost?: number;
  sent_at?: string;
  created_at: string;
}
```

### Angular Features Available

✅ **Authentication**
- Email/password registration and login
- Google OAuth integration
- Facebook OAuth integration
- Apple Sign In integration
- JWT token management
- Auto token refresh

✅ **SMS Management**
- Create SMS messages
- View user's SMS history
- Send SMS messages (admin only)
- Delete SMS messages
- Filter and search
- Pagination support

✅ **Admin Panel** (v3.0.0)
- User management (list, promote, demote)
- View all users' SMS messages
- Send any unsent SMS
- Delete any SMS
- System-wide statistics
- Role-based access control

✅ **Real-time Updates**
- SMS status tracking
- Cost calculation
- Delivery confirmations
- Error handling

### Example Components

**Login Component**:
```typescript
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(email: string, password: string) {
    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        localStorage.setItem('access_token', response.tokens.accessToken);
        localStorage.setItem('refresh_token', response.tokens.refreshToken);
        this.router.navigate(['/sms']);
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }
}
```

**SMS List Component**:
```typescript
export class SmsListComponent implements OnInit {
  sms: Sms[] = [];

  constructor(private smsService: SmsService) {}

  ngOnInit() {
    this.smsService.getMySms().subscribe({
      next: (response) => {
        this.sms = response.data;
      }
    });
  }
}
```

**Admin Dashboard Component**:
```typescript
export class AdminDashboardComponent implements OnInit {
  stats$ = this.adminService.getSmsStats().pipe(
    map(response => response.stats)
  );

  constructor(private adminService: AdminService) {}
}
```

---

## 📞 Support

For issues or questions:
- Check documentation in `/documentations`
- Review **`ADMIN_API_REFERENCE.md`** for Angular integration
- Review troubleshooting section
- Open GitHub issue

---

## ✅ Status

**Current Version**: 3.0.0  
**Status**: ✅ Production Ready  
**Last Updated**: January 15, 2026

### Feature Checklist
- [x] ✅ User authentication (email + OAuth)
- [x] ✅ JWT token system
- [x] ✅ PostgreSQL database
- [x] ✅ SMS sending (Georgian numbers)
- [x] ✅ Custom sender names
- [x] ✅ Phone validation
- [x] ✅ SMS history
- [x] ✅ Statistics
- [x] ✅ Cost tracking
- [x] ✅ Multiple providers
- [x] ✅ Mock provider
- [x] ✅ **Admin system (v3.0.0)**
- [x] ✅ **Role-based access control**
- [x] ✅ **Angular integration ready**
- [x] ✅ Complete documentation
- [ ] 🔲 Rate limiting
- [ ] 🔲 Frontend application
- [ ] 🔲 Production deployment

---

**Built with ❤️ for Georgian SMS communication**

🇬🇪 **Target**: Georgia  
📱 **Operators**: Magticom, Beeline, Geocell  
✉️ **Format**: +995 5XX XXX XXX

