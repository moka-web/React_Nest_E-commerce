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
  accessToken: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// ============ PRODUCTS ============
export interface Product {
  id: number;
  name?: string;
  code?: string;
  title?: string;
  description?: string;
  categoryId: number;
  merchantId: number;
  isActive: boolean;
  variationType?: 'NONE' | 'OnlyOneSize' | 'OnlyColor' | 'SizeAndColor';
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  categoryId: number;
  name?: string;
  code?: string;
  description?: string;
  title?: string;
  variationType?: string;
}

export interface ProductDetailsDto {
  title: string;
  code: string;
  variationType: string;
  details: Record<string, unknown>;
  about: string[];
  description: string;
}

// ============ ORDERS ============
export interface Order {
  id: number;
  userId: number;
  productVariationId: number;
  countryCode: string;
  quantity: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'FULFILLED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  productVariationId: number;
  countryCode: string;
  quantity: number;
}

// ============ CATEGORY ============
export interface Category {
  id: number;
  name: string;
}

// ============ CART ============
export interface CartItem extends Product {
  quantity: number;
}
