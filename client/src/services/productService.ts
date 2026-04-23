import api from '../api/axios';
import type { Product, CreateProductDto, ProductDetailsDto } from '../types';

export const productService = {
  async getById(id: number): Promise<Product> {
    const { data } = await api.get<Product>(`/product/${id}`);
    return data;
  },

  async create(payload: CreateProductDto): Promise<Product> {
    const { data } = await api.post<Product>('/product/create', payload);
    return data;
  },

  async addDetails(id: number, payload: ProductDetailsDto): Promise<Product> {
    const { data } = await api.post<Product>(`/product/${id}/details`, payload);
    return data;
  },

  async activate(id: number): Promise<Product> {
    const { data } = await api.post<Product>(`/product/${id}/activate`);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/product/${id}`);
  },
};
