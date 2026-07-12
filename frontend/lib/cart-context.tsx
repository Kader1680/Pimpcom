'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { api } from './api';
import { Cart } from '@/types';
import { useAuth } from './auth-context';

interface CartContextValue {
  cart: Cart | null;
  loading: boolean;
  itemCount: number;
  total: number;
  refresh: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const data = await api.get<Cart>('/cart');
      setCart(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function addItem(productId: string, quantity = 1) {
    const data = await api.post<Cart>('/cart/items', { productId, quantity });
    setCart(data);
  }

  async function updateItem(itemId: string, quantity: number) {
    const data = await api.patch<Cart>(`/cart/items/${itemId}`, { quantity });
    setCart(data);
  }

  async function removeItem(itemId: string) {
    const data = await api.delete<Cart>(`/cart/items/${itemId}`);
    setCart(data);
  }

  async function clearCart() {
    await api.delete('/cart');
    setCart((c) => (c ? { ...c, items: [] } : c));
  }

  const itemCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const total =
    cart?.items?.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{ cart, loading, itemCount, total, refresh, addItem, updateItem, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
