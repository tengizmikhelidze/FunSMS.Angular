export type AuthProvider = 'local' | 'google' | 'facebook' | 'apple';

export interface User {
  id: string;
  email: string;
  name: string;
  profile_picture?: string;
  provider: AuthProvider;
  provider_id?: string;
  is_email_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshTokenResponse {
  success: boolean;
  data: {
    accessToken: string;
  };
}

export interface ProfileResponse {
  success: boolean;
  data: {
    user: User;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Array<{
    msg: string;
    param: string;
    location: string;
  }>;
}
