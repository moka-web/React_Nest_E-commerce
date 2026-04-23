import api from '../api/axios';
import type { Order, CreateOrderDto } from '../types';

export const orderService = {
  async create(payload: CreateOrderDto): Promise<Order> {
    const { data } = await api.post<Order>('/order', payload);
    return data;
  },

  async cancel(id: number): Promise<Order> {
    const { data } = await api.patch<Order>(`/order/${id}/cancel`);
    return data;
  },
};
