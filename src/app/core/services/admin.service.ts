import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SmsMessage } from '../models/sms.model';
import { User } from '../models/user.model';

export interface GetSmsParams {
  page?: number;
  limit?: number;
  status?: 'pending' | 'sent' | 'failed' | 'delivered';
  sent?: boolean;
  userId?: string;
  phoneNumber?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  role?: 'user' | 'admin';
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
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

export interface AdminSmsListResponse {
  success: boolean;
  data: SmsMessage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse {
  success: boolean;
  message: string;
  sms?: SmsMessage;
  user?: User;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private readonly API_URL = '/api/admin';

  /**
   * Get all users (admin only)
   * GET /api/admin/users
   */
  getAllUsers(params: GetUsersParams = {}): Observable<UserListResponse> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      const value = (params as any)[key];
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<UserListResponse>(`${this.API_URL}/users`, { params: httpParams });
  }

  /**
   * Get all SMS messages (admin only)
   * GET /api/admin/sms
   */
  getAllSms(params: GetSmsParams = {}): Observable<AdminSmsListResponse> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      const value = (params as any)[key];
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<AdminSmsListResponse>(`${this.API_URL}/sms`, { params: httpParams });
  }

  /**
   * Send any SMS message (admin only)
   * POST /api/admin/sms/send/:id
   */
  sendAnySms(smsId: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/sms/send/${smsId}`, {});
  }

  /**
   * Delete any SMS message (admin only)
   * DELETE /api/admin/sms/:id
   */
  deleteAnySms(smsId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.API_URL}/sms/${smsId}`);
  }

  /**
   * Promote user to admin
   * PUT /api/admin/users/:id/promote
   */
  promoteToAdmin(userId: string): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.API_URL}/users/${userId}/promote`, {});
  }

  /**
   * Demote admin to user
   * PUT /api/admin/users/:id/demote
   */
  demoteToUser(userId: string): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.API_URL}/users/${userId}/demote`, {});
  }

  /**
   * Delete user (admin only)
   * DELETE /api/admin/users/:id
   */
  deleteUser(userId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.API_URL}/users/${userId}`);
  }
}

