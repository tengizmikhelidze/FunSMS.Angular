import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AdminSmsQueryParams,
  AdminSmsListResponse,
  AdminUsersQueryParams,
  AdminUserListResponse,
  AdminApiResponse
} from '../models';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/admin`;

  /**
   * Get all users (admin only)
   * GET /api/admin/users
   */
  getAllUsers(params: AdminUsersQueryParams = {}): Observable<AdminUserListResponse> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      const value = (params as any)[key];
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<AdminUserListResponse>(`${this.API_URL}/users`, { params: httpParams });
  }

  /**
   * Get all SMS messages (admin only)
   * GET /api/admin/sms
   */
  getAllSms(params: AdminSmsQueryParams = {}): Observable<AdminSmsListResponse> {
    let httpParams = new HttpParams();

    // Convert page to offset (page 1 = offset 0)
    if (params.page) {
      const limit = params.limit || 20;
      const offset = (params.page - 1) * limit;
      httpParams = httpParams.set('offset', offset.toString());
    }

    // Add other parameters
    Object.keys(params).forEach(key => {
      if (key === 'page') return; // Skip page as we converted it to offset

      const value = (params as any)[key];
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<AdminSmsListResponse>(`${this.API_URL}/sms`, { params: httpParams }).pipe(
      map(response => ({
        ...response,
        data: {
          ...response.data,
          messages: response.data.messages.map(msg => ({
            ...msg,
            cost: msg.cost ? (typeof msg.cost === 'string' ? parseFloat(msg.cost) : msg.cost) : undefined
          }))
        }
      }))
    );
  }

  /**
   * Send any SMS message (admin only)
   * POST /api/admin/sms/send/:id
   */
  sendAnySms(smsId: string): Observable<AdminApiResponse> {
    return this.http.post<AdminApiResponse>(`${this.API_URL}/sms/send/${smsId}`, {});
  }

  /**
   * Delete any SMS message (admin only)
   * DELETE /api/admin/sms/:id
   */
  deleteAnySms(smsId: string): Observable<AdminApiResponse> {
    return this.http.delete<AdminApiResponse>(`${this.API_URL}/sms/${smsId}`);
  }

  /**
   * Promote user to admin
   * PUT /api/admin/users/:id/promote
   */
  promoteToAdmin(userId: string): Observable<AdminApiResponse> {
    return this.http.put<AdminApiResponse>(`${this.API_URL}/users/${userId}/promote`, {});
  }

  /**
   * Demote admin to user
   * PUT /api/admin/users/:id/demote
   */
  demoteToUser(userId: string): Observable<AdminApiResponse> {
    return this.http.put<AdminApiResponse>(`${this.API_URL}/users/${userId}/demote`, {});
  }

  /**
   * Delete user (admin only)
   * DELETE /api/admin/users/:id
   */
  deleteUser(userId: string): Observable<AdminApiResponse> {
    return this.http.delete<AdminApiResponse>(`${this.API_URL}/users/${userId}`);
  }
}

