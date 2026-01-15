import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  SendSmsRequest,
  SendSmsResponse,
  SmsHistoryResponse,
  SmsStatsResponse,
  SmsBalanceResponse,
  PhoneValidationResponse,
  SmsMessage
} from '../models/sms.model';

@Injectable({
  providedIn: 'root'
})
export class SmsService {
  private http = inject(HttpClient);
  private readonly API_URL = '/api/sms';

  /**
   * Send an SMS message
   * POST /api/sms/send
   */
  sendSms(request: SendSmsRequest): Observable<SendSmsResponse> {
    return this.http.post<SendSmsResponse>(`${this.API_URL}/send`, request)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get SMS history with pagination
   * GET /api/sms/history
   */
  getHistory(limit: number = 50, offset: number = 0): Observable<SmsHistoryResponse> {
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());

    return this.http.get<SmsHistoryResponse>(`${this.API_URL}/history`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get SMS by ID
   * GET /api/sms/:id
   */
  getSmsById(id: string): Observable<{ success: boolean; data: { sms: SmsMessage } }> {
    return this.http.get<{ success: boolean; data: { sms: SmsMessage } }>(`${this.API_URL}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get SMS statistics
   * GET /api/sms/stats
   */
  getStats(): Observable<SmsStatsResponse> {
    return this.http.get<SmsStatsResponse>(`${this.API_URL}/stats`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Delete a pending SMS
   * DELETE /api/sms/:id
   */
  deleteSms(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.API_URL}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get account balance
   * GET /api/sms/balance
   */
  getBalance(): Observable<SmsBalanceResponse> {
    return this.http.get<SmsBalanceResponse>(`${this.API_URL}/balance`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Validate and format Georgian phone number
   * POST /api/sms/validate-phone
   */
  validatePhone(phone: string): Observable<PhoneValidationResponse> {
    return this.http.post<PhoneValidationResponse>(`${this.API_URL}/validate-phone`, { phone })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Calculate message length and parts
   * Helper method for client-side validation
   */
  calculateMessageInfo(message: string): { length: number; parts: number; charset: 'GSM' | 'Unicode' } {
    const length = message.length;
    const hasUnicode = /[^\x00-\x7F]/.test(message);
    const charset = hasUnicode ? 'Unicode' : 'GSM';
    const maxPerPart = hasUnicode ? 70 : 160;
    const parts = Math.ceil(length / maxPerPart);

    return { length, parts, charset };
  }

  /**
   * Format Georgian phone number
   * Helper method for client-side formatting
   */
  formatGeorgianPhone(phone: string): string {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');

    // Add +995 prefix if needed
    if (cleaned.startsWith('995')) {
      return '+' + cleaned;
    } else if (cleaned.startsWith('5') && cleaned.length === 9) {
      return '+995' + cleaned;
    }

    return phone;
  }

  /**
   * Validate Georgian phone number format
   * Helper method for client-side validation
   */
  isValidGeorgianPhone(phone: string): boolean {
    const pattern = /^\+?995[5]\d{8}$/;
    const cleaned = phone.replace(/\D/g, '');
    return pattern.test('+' + cleaned);
  }

  /**
   * Error handler
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error) {
      if (error.error.message) {
        errorMessage = error.error.message;
      } else if (error.error.errors && error.error.errors.length > 0) {
        errorMessage = error.error.errors.map((e: any) => e.msg).join(', ');
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error('SMS Service Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}


