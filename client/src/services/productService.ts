import api from '../api/axios';
import type { Product, CreateProductDto, ProductDetailsDto } from '../types';

interface ApiResponse<T> {
  isSuccess: boolean;
  data: T;
}

export const productService = {
  async getAll(): Promise<Product[]> {
    const { data } = await api.get<ApiResponse<Product[]>>('/product');
    return data.data;
  },

  async getById(id: number): Promise<Product> {
    const { data } = await api.get<ApiResponse<Product>>(`/product/${id}`);
    return data.data;
  },

  async create(payload: CreateProductDto): Promise<Product> {
    const { data } = await api.post<ApiResponse<Product>>('/product/create', payload);
    return data.data;
  },

  async addDetails(id: number, payload: ProductDetailsDto): Promise<Product> {
    const { data } = await api.post<ApiResponse<Product>>(`/product/${id}/details`, payload);
    return data.data;
  },

  async activate(id: number): Promise<Product> {
    const { data } = await api.post<ApiResponse<Product>>(`/product/${id}/activate`);
    return data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/product/${id}`);
  },
};
