import api from '../api/axios';
import type { AuthResponse, LoginCredentials, User } from '../types';

interface ApiResponse<T> {
  isSuccess: boolean;
  data: T;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return data.data;
  },

  async register(
    credentials: LoginCredentials & { name?: string; role?: string },
  ): Promise<AuthResponse> {
    const { data } = await api.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      credentials,
    );
    return data.data;
  },

  async getProfile(): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>('/user/profile');
    return data.data;
  },

  logout() {
    localStorage.removeItem('token');
  },

  getCurrentUser(): User | null {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('getCurrentUser: no token');
      return null;
    }
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.log('getCurrentUser: invalid token structure');
        return null;
      }
      // Fix base64url to base64 padding
      let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }
      const payload = JSON.parse(atob(base64));
      console.log('getCurrentUser payload:', payload);
      return {
        id: payload.id,
        email: payload.email,
        roleId: payload.roles?.[0]?.id || 1,
        isActive: true,
        createdAt: payload.iat ? new Date(payload.iat * 1000).toISOString() : new Date().toISOString(),
        updatedAt: payload.iat ? new Date(payload.iat * 1000).toISOString() : new Date().toISOString(),
      };
    } catch (e) {
      console.log('getCurrentUser error:', e);
      return null;
    }
  },
};
