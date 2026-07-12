export type Role = 'admin' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive?: boolean;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  isActive: boolean;
  category?: Category;
  categoryId?: string;
  createdAt?: string;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  product?: Product;
}

export interface Order {
  id: string;
  userId: string;
  user?: User;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  shippingAddress?: string;
  createdAt: string;
}
