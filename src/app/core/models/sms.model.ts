export interface SendSmsRequest {
  phone: string;
  senderName: string;
  message: string;
  scheduledAt?: string;
}

export interface SmsMessage {
  id: string;
  user_id: string;
  recipient_phone: string;
  sender_name: string;
  message_text: string;
  status: 'pending' | 'sent' | 'failed' | 'delivered';
  sent_status: 0 | 1; // 0 = unsent, 1 = sent
  provider: string;
  provider_message_id?: string;
  cost?: number;
  error_message?: string;
  scheduled_at?: string; // ISO date string
  sent_at?: string; // ISO date string
  delivered_at?: string; // ISO date string
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface MessageInfo {
  valid: boolean;
  length: number;
  parts: number;
}

export interface SendSmsResponse {
  success: boolean;
  message: string;
  data: {
    sms: SmsMessage;
    messageInfo: MessageInfo;
  };
}

export interface SmsHistoryResponse {
  success: boolean;
  data: {
    messages: SmsMessage[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  };
}

export interface SmsStatsResponse {
  success: boolean;
  data: {
    stats: {
      total: number;
      sent: number;
      failed: number;
      pending: number;
      delivered: number;
    };
  };
}

export interface SmsBalanceResponse {
  success: boolean;
  data: {
    balance: number;
    provider: string;
  };
}

export interface PhoneValidationResponse {
  success: boolean;
  data: {
    isValid: boolean;
    formatted: string;
    original: string;
  };
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
  errors?: Array<{
    msg: string;
    param: string;
    location: string;
  }>;
}

