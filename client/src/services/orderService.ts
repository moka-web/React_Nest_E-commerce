import api from '../api/axios';
import type { Order, CreateOrderDto } from '../types';

interface ApiResponse<T> {
  isSuccess: boolean;
  data: T;
}

export const orderService = {
  async getAll(): Promise<Order[]> {
    const { data } = await api.get<ApiResponse<Order[]>>('/order');
    return data.data;
  },

  async create(payload: CreateOrderDto): Promise<Order> {
    const { data } = await api.post<ApiResponse<Order>>('/order', payload);
    return data.data;
  },

  async cancel(id: number): Promise<Order> {
    const { data } = await api.patch<ApiResponse<Order>>(`/order/${id}/cancel`);
    return data.data;
  },
};
