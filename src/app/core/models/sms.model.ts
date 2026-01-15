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
  provider: string;
  provider_message_id?: string;
  cost?: string;
  error_message?: string;
  scheduled_at?: Date;
  sent_at?: Date;
  delivered_at?: Date;
  created_at: Date;
  updated_at: Date;
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

