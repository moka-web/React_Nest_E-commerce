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
};
