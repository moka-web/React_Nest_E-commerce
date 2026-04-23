// ============ AUTH ============
export interface User {
  id: number;
  email: string;
  roleId: number;
  merchantId?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// ============ PRODUCTS ============
export interface Product {
  id: number;
  name: string;
  description?: string;
  categoryId: number;
  merchantId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  categoryId: number;
  description?: string;
}

export interface ProductDetailsDto {
  price?: number;
  currencyId?: number;
  colorId?: number;
  sizeId?: number;
  stock?: number;
}

// ============ ORDERS ============
export interface Order {
  id: number;
  userId: number;
  productVariationId: number;
  countryCode: string;
  quantity: number;
  total: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'fulfilled';
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  productVariationId: number;
  countryCode: string;
  quantity: number;
}
