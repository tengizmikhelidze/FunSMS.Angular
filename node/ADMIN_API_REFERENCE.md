# 👑 Admin API Reference - Angular Integration Guide

Complete API reference for the Admin System with Angular/TypeScript integration examples.

**Version**: 3.0.0  
**Date**: January 15, 2026  
**Frontend**: Angular 17+

---

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Base Configuration](#base-configuration)
- [User Management APIs](#user-management-apis)
- [SMS Management APIs](#sms-management-apis)
- [Statistics APIs](#statistics-apis)
- [Angular Service Examples](#angular-service-examples)
- [Error Handling](#error-handling)
- [Role Guards](#role-guards)

---

## 🎯 Overview

The Admin System provides role-based access control with dedicated endpoints for user and SMS management. All admin endpoints require:

1. **Authentication**: Valid JWT access token
2. **Authorization**: User must have `role = 'admin'`

### Base URL
```
http://localhost:3000/api/admin
```

### Headers Required
```typescript
{
  'Authorization': 'Bearer <access_token>',
  'Content-Type': 'application/json'
}
```

---

## 🔐 Authentication

### Check User Role

**Endpoint**: `GET /api/auth/me`  
**Purpose**: Get current user info including role  
**Auth Required**: Yes

**Angular Request**:
```typescript
interface UserResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
    profile_picture?: string;
    created_at: string;
  };
}

// In your auth service
getCurrentUser(): Observable<UserResponse> {
  return this.http.get<UserResponse>(`${this.apiUrl}/auth/me`);
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin",
    "created_at": "2026-01-15T10:30:00.000Z"
  }
}
```

---

## ⚙️ Base Configuration

### Angular Environment Setup

**`src/environments/environment.ts`**:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  adminApiUrl: 'http://localhost:3000/api/admin'
};
```

**`src/environments/environment.prod.ts`**:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api.com/api',
  adminApiUrl: 'https://your-api.com/api/admin'
};
```

### TypeScript Interfaces

**`src/app/models/user.model.ts`**:
```typescript
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profile_picture?: string;
  provider?: string;
  is_email_verified?: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserListResponse {
  success: boolean;
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

**`src/app/models/sms.model.ts`**:
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
  provider?: string;
  provider_response?: any;
  error_message?: string;
  sent_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SmsListResponse {
  success: boolean;
  data: Sms[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SmsStats {
  total_messages: number;
  sent_messages: number;
  unsent_messages: number;
  total_users: number;
  messages_by_status: {
    pending: number;
    sent: number;
    failed: number;
    delivered?: number;
  };
  total_cost: string;
  messages_last_24h: number;
  messages_last_7d: number;
  messages_last_30d: number;
}
```

---

## 👥 User Management APIs

### 1. Get All Users

**Endpoint**: `GET /api/admin/users`  
**Purpose**: Retrieve all users with pagination and filtering

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 50 | Items per page (max 100) |
| `role` | string | No | - | Filter by role ('user' or 'admin') |
| `search` | string | No | - | Search in email and name |
| `sortBy` | string | No | created_at | Sort field |
| `sortOrder` | string | No | DESC | 'ASC' or 'DESC' |

#### Angular Request

```typescript
interface GetUsersParams {
  page?: number;
  limit?: number;
  role?: 'user' | 'admin';
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

getAllUsers(params: GetUsersParams = {}): Observable<UserListResponse> {
  const httpParams = new HttpParams({ fromObject: params as any });
  return this.http.get<UserListResponse>(
    `${environment.adminApiUrl}/users`,
    { params: httpParams }
  );
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "admin@example.com",
      "name": "Admin User",
      "role": "admin",
      "is_email_verified": true,
      "created_at": "2026-01-15T10:00:00.000Z",
      "updated_at": "2026-01-15T10:00:00.000Z"
    },
    {
      "id": "223e4567-e89b-12d3-a456-426614174001",
      "email": "user@example.com",
      "name": "Regular User",
      "role": "user",
      "is_email_verified": false,
      "created_at": "2026-01-15T11:00:00.000Z",
      "updated_at": "2026-01-15T11:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 2,
    "totalPages": 1
  }
}
```

#### Usage in Component

```typescript
export class UsersListComponent implements OnInit {
  users: User[] = [];
  pagination: any;
  loading = false;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(page: number = 1) {
    this.loading = true;
    this.adminService.getAllUsers({ page, limit: 20 }).subscribe({
      next: (response) => {
        this.users = response.data;
        this.pagination = response.pagination;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  searchUsers(searchTerm: string) {
    this.adminService.getAllUsers({ search: searchTerm }).subscribe({
      next: (response) => this.users = response.data
    });
  }

  filterByRole(role: 'user' | 'admin') {
    this.adminService.getAllUsers({ role }).subscribe({
      next: (response) => this.users = response.data
    });
  }
}
```

---

### 2. Promote User to Admin

**Endpoint**: `POST /api/admin/users/:userId/promote`  
**Purpose**: Grant admin privileges to a user

#### Angular Request

```typescript
promoteToAdmin(userId: string): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${environment.adminApiUrl}/users/${userId}/promote`,
    {}
  );
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "User promoted to admin successfully",
  "user": {
    "id": "223e4567-e89b-12d3-a456-426614174001",
    "email": "user@example.com",
    "name": "Regular User",
    "role": "admin",
    "updated_at": "2026-01-15T12:00:00.000Z"
  }
}
```

#### Error Responses

**User Not Found** (404):
```json
{
  "success": false,
  "message": "User not found"
}
```

**Already Admin** (400):
```json
{
  "success": false,
  "message": "User is already an administrator"
}
```

#### Usage in Component

```typescript
promoteUser(user: User) {
  if (confirm(`Promote ${user.name} to admin?`)) {
    this.adminService.promoteToAdmin(user.id).subscribe({
      next: (response) => {
        this.snackBar.open('User promoted successfully', 'Close', {
          duration: 3000
        });
        this.loadUsers(); // Refresh list
      },
      error: (error) => {
        this.snackBar.open(error.error.message, 'Close', {
          duration: 5000
        });
      }
    });
  }
}
```

---

### 3. Demote Admin to User

**Endpoint**: `POST /api/admin/users/:userId/demote`  
**Purpose**: Remove admin privileges from a user

#### Angular Request

```typescript
demoteToUser(userId: string): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${environment.adminApiUrl}/users/${userId}/demote`,
    {}
  );
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "User demoted to regular user successfully",
  "user": {
    "id": "223e4567-e89b-12d3-a456-426614174001",
    "email": "user@example.com",
    "name": "Regular User",
    "role": "user",
    "updated_at": "2026-01-15T12:30:00.000Z"
  }
}
```

#### Error Responses

**Last Admin** (400):
```json
{
  "success": false,
  "message": "Cannot demote the last admin. At least one admin must exist."
}
```

**Already Regular User** (400):
```json
{
  "success": false,
  "message": "User is already a regular user"
}
```

---

## 📱 SMS Management APIs

### 1. Get All SMS Messages

**Endpoint**: `GET /api/admin/sms`  
**Purpose**: View all SMS messages from all users

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 50 | Items per page |
| `status` | string | No | - | Filter by status |
| `sent` | boolean | No | - | Filter by sent status |
| `userId` | string | No | - | Filter by user ID |
| `phoneNumber` | string | No | - | Search by phone |
| `dateFrom` | string | No | - | From date (ISO 8601) |
| `dateTo` | string | No | - | To date (ISO 8601) |
| `sortBy` | string | No | created_at | Sort field |
| `sortOrder` | string | No | DESC | 'ASC' or 'DESC' |

#### Angular Request

```typescript
interface GetSmsParams {
  page?: number;
  limit?: number;
  status?: SmsStatus;
  sent?: boolean;
  userId?: string;
  phoneNumber?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

getAllSms(params: GetSmsParams = {}): Observable<SmsListResponse> {
  const httpParams = new HttpParams({ fromObject: params as any });
  return this.http.get<SmsListResponse>(
    `${environment.adminApiUrl}/sms`,
    { params: httpParams }
  );
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": "sms-123",
      "user_id": "user-456",
      "phone_number": "+995555123456",
      "sender_name": "MyBusiness",
      "message": "Hello from admin panel!",
      "status": "sent",
      "sent": true,
      "cost": 0.08,
      "provider": "twilio",
      "sent_at": "2026-01-15T13:00:00.000Z",
      "created_at": "2026-01-15T12:55:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1,
    "totalPages": 1
  }
}
```

---

### 2. Send Any SMS

**Endpoint**: `POST /api/admin/sms/send/:id`  
**Purpose**: Send any unsent SMS message (regardless of owner)

#### Angular Request

```typescript
sendAnySms(smsId: string): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${environment.adminApiUrl}/sms/send/${smsId}`,
    {}
  );
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "SMS sent successfully",
  "sms": {
    "id": "sms-123",
    "phone_number": "+995555123456",
    "status": "sent",
    "sent": true,
    "cost": 0.08,
    "provider": "twilio",
    "sent_at": "2026-01-15T14:00:00.000Z"
  }
}
```

#### Error Responses

**Already Sent** (400):
```json
{
  "success": false,
  "message": "This message has already been sent"
}
```

**SMS Not Found** (404):
```json
{
  "success": false,
  "message": "SMS message not found"
}
```

---

### 3. Delete Any SMS

**Endpoint**: `DELETE /api/admin/sms/:id`  
**Purpose**: Delete any SMS message (sent or unsent)

#### Angular Request

```typescript
deleteAnySms(smsId: string): Observable<ApiResponse> {
  return this.http.delete<ApiResponse>(
    `${environment.adminApiUrl}/sms/${smsId}`
  );
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "SMS message deleted successfully"
}
```

#### Usage in Component

```typescript
deleteSms(sms: Sms) {
  if (confirm(`Delete SMS to ${sms.phone_number}?`)) {
    this.adminService.deleteAnySms(sms.id).subscribe({
      next: () => {
        this.snackBar.open('SMS deleted', 'Close', { duration: 3000 });
        this.loadSms(); // Refresh list
      },
      error: (error) => {
        this.snackBar.open('Error deleting SMS', 'Close', { duration: 3000 });
      }
    });
  }
}
```

---

## 📊 Statistics APIs

### Get SMS Statistics

**Endpoint**: `GET /api/admin/sms/stats`  
**Purpose**: Get comprehensive SMS statistics for all users

#### Angular Request

```typescript
getSmsStats(): Observable<{ success: boolean; stats: SmsStats }> {
  return this.http.get<{ success: boolean; stats: SmsStats }>(
    `${environment.adminApiUrl}/sms/stats`
  );
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "stats": {
    "total_messages": 1542,
    "sent_messages": 1389,
    "unsent_messages": 153,
    "total_users": 87,
    "messages_by_status": {
      "pending": 153,
      "sent": 1312,
      "failed": 77,
      "delivered": 1298
    },
    "total_cost": "123.36",
    "messages_last_24h": 42,
    "messages_last_7d": 289,
    "messages_last_30d": 1542
  }
}
```

#### Usage in Dashboard Component

```typescript
export class AdminDashboardComponent implements OnInit {
  stats: SmsStats | null = null;
  loading = false;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.loading = true;
    this.adminService.getSmsStats().subscribe({
      next: (response) => {
        this.stats = response.stats;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.loading = false;
      }
    });
  }
}
```

---

## 🛠️ Angular Service Examples

### Complete Admin Service

**`src/app/services/admin.service.ts`**:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, UserListResponse } from '../models/user.model';
import { Sms, SmsListResponse, SmsStats } from '../models/sms.model';

interface ApiResponse {
  success: boolean;
  message: string;
  user?: User;
  sms?: Sms;
}

interface GetUsersParams {
  page?: number;
  limit?: number;
  role?: 'user' | 'admin';
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

interface GetSmsParams {
  page?: number;
  limit?: number;
  status?: string;
  sent?: boolean;
  userId?: string;
  phoneNumber?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private adminApiUrl = environment.adminApiUrl;

  constructor(private http: HttpClient) {}

  // User Management
  getAllUsers(params: GetUsersParams = {}): Observable<UserListResponse> {
    const httpParams = new HttpParams({ fromObject: params as any });
    return this.http.get<UserListResponse>(
      `${this.adminApiUrl}/users`,
      { params: httpParams }
    );
  }

  promoteToAdmin(userId: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.adminApiUrl}/users/${userId}/promote`,
      {}
    );
  }

  demoteToUser(userId: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.adminApiUrl}/users/${userId}/demote`,
      {}
    );
  }

  // SMS Management
  getAllSms(params: GetSmsParams = {}): Observable<SmsListResponse> {
    const httpParams = new HttpParams({ fromObject: params as any });
    return this.http.get<SmsListResponse>(
      `${this.adminApiUrl}/sms`,
      { params: httpParams }
    );
  }

  sendAnySms(smsId: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.adminApiUrl}/sms/send/${smsId}`,
      {}
    );
  }

  deleteAnySms(smsId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.adminApiUrl}/sms/${smsId}`
    );
  }

  // Statistics
  getSmsStats(): Observable<{ success: boolean; stats: SmsStats }> {
    return this.http.get<{ success: boolean; stats: SmsStats }>(
      `${this.adminApiUrl}/sms/stats`
    );
  }
}
```

---

## 🔒 Role Guards

### Admin Guard

**`src/app/guards/admin.guard.ts`**:

```typescript
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.getCurrentUser().pipe(
      map(response => {
        if (response.success && response.user.role === 'admin') {
          return true;
        }
        // Redirect to home if not admin
        return this.router.createUrlTree(['/']);
      })
    );
  }
}
```

### Usage in Routes

**`src/app/app.routes.ts`**:

```typescript
import { Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./admin/dashboard/dashboard.component')
      },
      {
        path: 'users',
        loadComponent: () => import('./admin/users/users.component')
      },
      {
        path: 'sms',
        loadComponent: () => import('./admin/sms/sms.component')
      }
    ]
  }
];
```

---

## ❌ Error Handling

### Common Error Responses

#### 401 Unauthorized
```json
{
  "success": false,
  "message": "No token provided"
}
```

**Cause**: Missing or invalid JWT token  
**Solution**: User needs to login again

#### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

**Cause**: User is authenticated but not an admin  
**Solution**: User needs admin role

#### 404 Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

**Cause**: Resource doesn't exist  
**Solution**: Check ID/parameters

#### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid request parameters",
  "errors": [...]
}
```

**Cause**: Validation error  
**Solution**: Fix request data

### Error Interceptor

**`src/app/interceptors/error.interceptor.ts`**:

```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = error.error.message;
        } else {
          // Server-side error
          errorMessage = error.error?.message || error.message;

          // Handle specific status codes
          switch (error.status) {
            case 401:
              // Unauthorized - redirect to login
              this.router.navigate(['/login']);
              errorMessage = 'Session expired. Please login again.';
              break;
            case 403:
              // Forbidden - not admin
              this.router.navigate(['/']);
              errorMessage = 'Access denied. Admin privileges required.';
              break;
            case 404:
              errorMessage = 'Resource not found';
              break;
            case 500:
              errorMessage = 'Server error. Please try again later.';
              break;
          }
        }

        // Show error message
        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });

        return throwError(() => error);
      })
    );
  }
}
```

---

## 📝 Complete Example: Admin Users Component

**`src/app/admin/users/users.component.ts`**:

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  loading = false;
  searchTerm = '';
  selectedRole: '' | 'user' | 'admin' = '';
  currentPage = 1;
  totalPages = 1;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    const params: any = { page: this.currentPage, limit: 20 };
    
    if (this.searchTerm) params.search = this.searchTerm;
    if (this.selectedRole) params.role = this.selectedRole;

    this.adminService.getAllUsers(params).subscribe({
      next: (response) => {
        this.users = response.data;
        this.totalPages = response.pagination.totalPages;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  promoteUser(user: User) {
    if (confirm(`Promote ${user.name} to admin?`)) {
      this.adminService.promoteToAdmin(user.id).subscribe({
        next: () => this.loadUsers()
      });
    }
  }

  demoteUser(user: User) {
    if (confirm(`Demote ${user.name} to regular user?`)) {
      this.adminService.demoteToUser(user.id).subscribe({
        next: () => this.loadUsers()
      });
    }
  }

  onSearch() {
    this.currentPage = 1;
    this.loadUsers();
  }

  onRoleFilter() {
    this.currentPage = 1;
    this.loadUsers();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadUsers();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsers();
    }
  }
}
```

---

## 🎯 Quick Reference

### All Admin Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/admin/users` | GET | Get all users |
| `/api/admin/users/:userId/promote` | POST | Promote to admin |
| `/api/admin/users/:userId/demote` | POST | Demote to user |
| `/api/admin/sms` | GET | Get all SMS |
| `/api/admin/sms/send/:id` | POST | Send any SMS |
| `/api/admin/sms/:id` | DELETE | Delete any SMS |
| `/api/admin/sms/stats` | GET | Get SMS statistics |

### Required Imports for Angular

```typescript
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
```

### HTTP Client Setup

```typescript
// app.config.ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};
```

---

**Version**: 3.0.0  
**Last Updated**: January 15, 2026  
**For**: Angular 17+ Integration

