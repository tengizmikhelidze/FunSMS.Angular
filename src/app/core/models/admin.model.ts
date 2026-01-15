import { SmsMessage } from './sms.model';
import { User } from './user.model';

// Query Parameters Interface
export interface AdminSmsQueryParams {
  page?: number; // Will be converted to offset
  limit?: number; // Default 50
  sent_status?: 0 | 1;
  user_id?: string;
  status?: 'pending' | 'sent' | 'failed' | 'delivered';
  recipient_phone?: string;
  sender_name?: string;
  provider?: string;
  date_from?: string; // ISO date string
  date_to?: string; // ISO date string
}

// Response Interface
export interface AdminSmsListResponse {
  success: boolean;
  data: {
    messages: SmsMessage[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
    filters: {
      limit?: number;
      offset?: number;
      sent_status?: 0 | 1;
      user_id?: string;
      status?: string;
      recipient_phone?: string;
      sender_name?: string;
      provider?: string;
      date_from?: string;
      date_to?: string;
    };
  };
}

// User Query Parameters
export interface AdminUsersQueryParams {
  page?: number;
  limit?: number;
  role?: 'user' | 'admin';
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// User List Response
export interface AdminUserListResponse {
  success: boolean;
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Generic API Response
export interface AdminApiResponse {
  success: boolean;
  message: string;
  sms?: SmsMessage;
  user?: User;
}

