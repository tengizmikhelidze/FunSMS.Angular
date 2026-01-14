# Authentication Interfaces & Features Reference

Complete reference documentation for all TypeScript interfaces and authentication features available in the backend API.

---

## TypeScript Interfaces

### User Interface

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  profile_picture?: string;
  provider: 'local' | 'google' | 'facebook' | 'apple';
  provider_id?: string;
  is_email_verified: boolean;
  created_at: Date;
  updated_at: Date;
}
```

**Description**: Represents a user in the system. Supports multiple authentication providers.

**Fields**:
- `id` - Unique user identifier (UUID)
- `email` - User's email address (unique)
- `name` - User's display name
- `profile_picture` - Optional URL to user's profile picture
- `provider` - Authentication method used ('local' for email/password, or OAuth provider)
- `provider_id` - Optional ID from OAuth provider
- `is_email_verified` - Boolean indicating if email is verified
- `created_at` - Timestamp when user was created
- `updated_at` - Timestamp when user was last updated

---

### AuthResponse Interface

```typescript
interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}
```

**Description**: Response structure returned after successful login or registration.

**Fields**:
- `success` - Boolean indicating if the operation succeeded
- `message` - Human-readable message about the operation
- `data.user` - User object with profile information
- `data.accessToken` - JWT access token (short-lived, typically 15 minutes)
- `data.refreshToken` - JWT refresh token (long-lived, typically 7 days)

**Used By**: 
- `POST /api/auth/register`
- `POST /api/auth/login`

---

### RefreshTokenResponse Interface

```typescript
interface RefreshTokenResponse {
  success: boolean;
  data: {
    accessToken: string;
  };
}
```

**Description**: Response structure returned when refreshing an access token.

**Fields**:
- `success` - Boolean indicating if token refresh succeeded
- `data.accessToken` - New JWT access token

**Used By**: 
- `POST /api/auth/refresh`

---

### LoginCredentials Interface

```typescript
interface LoginCredentials {
  email: string;
  password: string;
}
```

**Description**: Request payload for email/password login.

**Fields**:
- `email` - User's email address
- `password` - User's password (minimum 6 characters)

**Used By**: 
- `POST /api/auth/login`

**Validation**:
- Email must be valid email format
- Password must be at least 6 characters

---

### RegisterData Interface

```typescript
interface RegisterData {
  email: string;
  password: string;
  name: string;
}
```

**Description**: Request payload for user registration.

**Fields**:
- `email` - User's email address (must be unique)
- `password` - User's password (minimum 6 characters, will be hashed)
- `name` - User's display name

**Used By**: 
- `POST /api/auth/register`

**Validation**:
- Email must be valid and not already registered
- Password must be at least 6 characters
- Name cannot be empty

---

### ProfileResponse Interface

```typescript
interface ProfileResponse {
  success: boolean;
  data: {
    user: User;
  };
}
```

**Description**: Response structure for user profile requests.

**Fields**:
- `success` - Boolean indicating if the operation succeeded
- `data.user` - Complete user profile information

**Used By**: 
- `GET /api/auth/profile`

---

### ErrorResponse Interface

```typescript
interface ErrorResponse {
  success: false;
  message: string;
  errors?: Array<{
    msg: string;
    param: string;
    location: string;
  }>;
}
```

**Description**: Standard error response structure from the API.

**Fields**:
- `success` - Always `false` for errors
- `message` - General error message
- `errors` - Optional array of validation errors with details

**Example**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Invalid email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

---

### OAuthCallbackParams Interface

```typescript
interface OAuthCallbackParams {
  accessToken: string;
  refreshToken: string;
}
```

**Description**: Query parameters returned in OAuth callback URL.

**Fields**:
- `accessToken` - JWT access token
- `refreshToken` - JWT refresh token

**Used By**: OAuth callback redirects (Google, Facebook, Apple)

---

## Authentication Features

### 1. Email/Password Registration

**Endpoint**: `POST /api/auth/register`

**Description**: Create a new user account with email and password.

**Request Body**:
```typescript
{
  email: string;      // Valid email address
  password: string;   // Minimum 6 characters
  name: string;       // Display name
}
```

**Response**: `AuthResponse`

**Features**:
- Email uniqueness validation
- Password hashing with bcrypt
- Automatic JWT token generation
- Refresh token stored in database

**Example**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

---

### 2. Email/Password Login

**Endpoint**: `POST /api/auth/login`

**Description**: Authenticate user with email and password.

**Request Body**:
```typescript
{
  email: string;      // Registered email
  password: string;   // User's password
}
```

**Response**: `AuthResponse`

**Features**:
- Email validation
- Password verification with bcrypt
- JWT token generation
- Multiple refresh tokens support (multi-device login)

**Error Cases**:
- Invalid email format
- User not found
- Incorrect password
- Account locked/disabled

---

### 3. Google OAuth Login

**Endpoint**: `GET /api/auth/google`

**Description**: Initiate Google OAuth 2.0 authentication flow.

**Flow**:
1. User clicks "Login with Google"
2. Redirected to Google consent screen
3. User approves permissions
4. Redirected to `/api/auth/google/callback`
5. Frontend receives tokens via redirect to `FRONTEND_URL/auth/callback?accessToken=...&refreshToken=...`

**Permissions Requested**:
- Profile information
- Email address

**Features**:
- Auto-creates user account if not exists
- Links to existing account by email
- Retrieves profile picture from Google

---

### 4. Facebook OAuth Login

**Endpoint**: `GET /api/auth/facebook`

**Description**: Initiate Facebook OAuth authentication flow.

**Flow**:
1. User clicks "Login with Facebook"
2. Redirected to Facebook login dialog
3. User approves permissions
4. Redirected to `/api/auth/facebook/callback`
5. Frontend receives tokens via redirect

**Permissions Requested**:
- Email
- Public profile

**Features**:
- Auto-creates user account if not exists
- Links to existing account by email
- Retrieves profile picture from Facebook

---

### 5. Apple OAuth Login

**Endpoint**: `GET /api/auth/apple`

**Description**: Initiate Apple Sign In authentication flow.

**Flow**:
1. User clicks "Sign in with Apple"
2. Redirected to Apple authentication
3. User approves permissions
4. Redirected to `/api/auth/apple/callback`
5. Frontend receives tokens via redirect

**Permissions Requested**:
- Email
- Name (optional, only on first sign-in)

**Features**:
- Privacy-focused (can hide real email)
- Auto-creates user account if not exists
- Supports Apple's private relay emails

---

### 6. Token Refresh

**Endpoint**: `POST /api/auth/refresh`

**Description**: Get a new access token using a refresh token.

**Request Body**:
```typescript
{
  refreshToken: string;  // Valid refresh token
}
```

**Response**: `RefreshTokenResponse`

**Features**:
- Validates refresh token exists in database
- Checks token hasn't expired
- Generates new access token
- Old access token becomes invalid

**Security**:
- Refresh token must match database record
- Tokens are user-specific
- Automatic cleanup of expired tokens

---

### 7. User Logout

**Endpoint**: `POST /api/auth/logout`

**Description**: Invalidate current refresh token and log out user.

**Headers Required**:
```
Authorization: Bearer <access_token>
```

**Response**:
```typescript
{
  success: boolean;
  message: string;
}
```

**Features**:
- Removes refresh token from database
- Invalidates current session
- Access token becomes unusable after expiry

**Note**: To log out from all devices, delete all refresh tokens for the user.

---

### 8. Get User Profile

**Endpoint**: `GET /api/auth/profile`

**Description**: Retrieve authenticated user's profile information.

**Headers Required**:
```
Authorization: Bearer <access_token>
```

**Response**: `ProfileResponse`

**Features**:
- Returns complete user profile
- Includes OAuth provider information
- Shows email verification status

**Use Cases**:
- Display user information
- Check authentication status
- Sync user data with frontend

---

## JWT Token Structure

### Access Token Payload

```typescript
{
  userId: string;      // User's unique ID
  email: string;       // User's email
  iat: number;        // Issued at (timestamp)
  exp: number;        // Expiration (timestamp)
}
```

**Lifetime**: 15 minutes (configurable via `JWT_ACCESS_EXPIRY`)

**Purpose**: Short-lived token for API authorization

---

### Refresh Token Payload

```typescript
{
  userId: string;      // User's unique ID
  email: string;       // User's email
  iat: number;        // Issued at (timestamp)
  exp: number;        // Expiration (timestamp)
}
```

**Lifetime**: 7 days (configurable via `JWT_REFRESH_EXPIRY`)

**Purpose**: Long-lived token to obtain new access tokens

**Storage**: Stored in database `user_refresh_tokens` table

---

## Security Features

### Password Security
- **Hashing**: bcrypt with salt rounds (configurable)
- **Minimum Length**: 6 characters (enforced)
- **Storage**: Never stored in plain text
- **Validation**: Backend validation before hashing

### Token Security
- **Access Token**: Short-lived (15 minutes)
- **Refresh Token**: Long-lived (7 days), stored in database
- **Signature**: HMAC SHA256 with secret keys
- **Validation**: Verified on every protected route
- **Invalidation**: Refresh tokens deleted on logout

### OAuth Security
- **State Parameter**: CSRF protection (if implemented)
- **Secure Callbacks**: Server-side token exchange
- **Provider Verification**: Tokens verified with OAuth provider
- **Email Matching**: Links accounts by verified email

### Database Security
- **Unique Constraints**: Email uniqueness enforced
- **Foreign Keys**: Referential integrity maintained
- **Indexes**: Optimized for query performance
- **Connection Pooling**: Prevents connection exhaustion

---

## Error Codes & Messages

### 400 Bad Request
- Invalid email format
- Password too short
- Missing required fields
- User already exists

### 401 Unauthorized
- Invalid credentials
- Token expired
- Token invalid
- No token provided

### 403 Forbidden
- Account disabled
- Email not verified (if enforced)

### 404 Not Found
- User not found
- Refresh token not found

### 500 Internal Server Error
- Database connection error
- Token generation failed
- OAuth provider error

---

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  profile_picture TEXT,
  provider VARCHAR(50) DEFAULT 'local',
  provider_id VARCHAR(255),
  is_email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Refresh Tokens Table

```sql
CREATE TABLE user_refresh_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  refresh_token TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL
);
```

---

## Environment Variables Required

```env
# JWT Configuration
JWT_ACCESS_SECRET=your_access_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Frontend URL (for OAuth redirects)
FRONTEND_URL=http://localhost:4200

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Facebook OAuth
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:3000/api/auth/facebook/callback

# Apple OAuth
APPLE_CLIENT_ID=your_apple_client_id
APPLE_TEAM_ID=your_apple_team_id
APPLE_KEY_ID=your_apple_key_id
APPLE_PRIVATE_KEY_PATH=./path/to/AuthKey.p8
APPLE_CALLBACK_URL=http://localhost:3000/api/auth/apple/callback
```

---

## Quick Reference: API Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login with email/password |
| POST | `/api/auth/refresh` | No | Refresh access token |
| POST | `/api/auth/logout` | Yes | Logout current session |
| GET | `/api/auth/profile` | Yes | Get user profile |
| GET | `/api/auth/google` | No | Initiate Google OAuth |
| GET | `/api/auth/google/callback` | No | Google OAuth callback |
| GET | `/api/auth/facebook` | No | Initiate Facebook OAuth |
| GET | `/api/auth/facebook/callback` | No | Facebook OAuth callback |
| GET | `/api/auth/apple` | No | Initiate Apple OAuth |
| GET | `/api/auth/apple/callback` | No | Apple OAuth callback |

---

## Authentication Flow Diagrams

### Email/Password Registration Flow
```
Client                          Server                      Database
  |                               |                             |
  |-- POST /auth/register ------->|                             |
  |    (email, password, name)    |                             |
  |                               |-- Validate data ----------->|
  |                               |                             |
  |                               |<-- Check email exists ------|
  |                               |                             |
  |                               |-- Hash password ----------->|
  |                               |                             |
  |                               |-- Create user ------------->|
  |                               |                             |
  |                               |<-- User created ------------|
  |                               |                             |
  |                               |-- Generate tokens --------->|
  |                               |                             |
  |                               |-- Save refresh token ------>|
  |                               |                             |
  |<-- AuthResponse --------------|                             |
  |    (user, accessToken,        |                             |
  |     refreshToken)             |                             |
```

### OAuth Login Flow
```
Client                          Server                   OAuth Provider
  |                               |                             |
  |-- GET /auth/google ---------->|                             |
  |                               |                             |
  |<-- Redirect -----------------|                             |
  |                               |                             |
  |-- Redirect to Google --------------------------------->|
  |                                                         |
  |<-- User approves ----------------------------------------|
  |                                                         |
  |-- Callback redirect ---------------------------------->|
  |                               |                             |
  |                               |<-- User data ---------------|
  |                               |                             |
  |                               |-- Find/Create user -------->DB
  |                               |                             |
  |                               |-- Generate tokens --------->DB
  |                               |                             |
  |<-- Redirect to frontend ------|                             |
  |    with tokens                |                             |
```

### Token Refresh Flow
```
Client                          Server                      Database
  |                               |                             |
  |-- POST /auth/refresh -------->|                             |
  |    (refreshToken)             |                             |
  |                               |-- Verify token signature -->|
  |                               |                             |
  |                               |-- Check token in DB ------->|
  |                               |                             |
  |                               |<-- Token valid -------------|
  |                               |                             |
  |                               |-- Generate new access ----->|
  |                               |    token                    |
  |                               |                             |
  |<-- RefreshTokenResponse ------|                             |
  |    (new accessToken)          |                             |
```

---

## TypeScript Type Definitions Summary

Use these in your Angular/Frontend application:

```typescript
// Core interfaces
interface User { /* ... */ }
interface AuthResponse { /* ... */ }
interface RefreshTokenResponse { /* ... */ }
interface LoginCredentials { /* ... */ }
interface RegisterData { /* ... */ }
interface ProfileResponse { /* ... */ }
interface ErrorResponse { /* ... */ }
interface OAuthCallbackParams { /* ... */ }

// Helper types
type AuthProvider = 'local' | 'google' | 'facebook' | 'apple';
type TokenType = 'access' | 'refresh';

// API response wrapper
type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<ValidationError>;
};
```

---

**Last Updated**: January 2026  
**Backend Version**: Node.js + TypeScript + PostgreSQL  
**Authentication**: JWT (Access + Refresh Tokens)  
**OAuth Providers**: Google, Facebook, Apple

