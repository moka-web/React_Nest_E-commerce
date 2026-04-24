import api from '../api/axios';
import type { AuthResponse, LoginCredentials, User } from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  async register(
    credentials: LoginCredentials & { name?: string },
  ): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>(
      '/auth/register',
      credentials,
    );
    return data;
  },

  async getProfile(): Promise<User> {
    const { data } = await api.get<User>('/user/profile');
    return data;
  },

  logout() {
    localStorage.removeItem('token');
  },

  getCurrentUser(): User | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub,
        email: payload.email,
        roleId: payload.roleId,
        isActive: payload.isActive,
        createdAt: payload.iat ? new Date(payload.iat * 1000).toISOString() : new Date().toISOString(),
        updatedAt: payload.iat ? new Date(payload.iat * 1000).toISOString() : new Date().toISOString(),
      };
    } catch {
      return null;
    }
  },
};
