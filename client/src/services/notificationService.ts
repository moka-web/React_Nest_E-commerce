import api from '../api/axios';
import type { Notification } from '../types';

interface ApiResponse<T> {
  isSuccess: boolean;
  data: T;
}

export const notificationService = {
  async getAll(): Promise<Notification[]> {
    const { data } = await api.get<ApiResponse<Notification[]>>('/notifications');
    return data.data;
  },

  async getUnreadCount(): Promise<number> {
    const { data } = await api.get<{ count: number }>('/notifications/unread-count');
    return data.count;
  },

  async markAsRead(id: number): Promise<void> {
    await api.patch(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await api.patch('/notifications/read-all');
  },
};