'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartStore {
  items: CartItem[];
  add: (product: Product) => void;
  remove: (productId: string) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      add: (product) => {
        const existing = get().items.find((i) => i.product.id === product.id);
        if (existing) {
          set({ items: get().items.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) });
        } else {
          set({ items: [...get().items, { product, quantity: 1 }] });
        }
      },

      remove: (productId) =>
        set({ items: get().items.filter((i) => i.product.id !== productId) }),

      increment: (productId) =>
        set({ items: get().items.map((i) => i.product.id === productId ? { ...i, quantity: i.quantity + 1 } : i) }),

      decrement: (productId) => {
        const item = get().items.find((i) => i.product.id === productId);
        if (!item) return;
        if (item.quantity === 1) {
          set({ items: get().items.filter((i) => i.product.id !== productId) });
        } else {
          set({ items: get().items.map((i) => i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i) });
        }
      },

      clear: () => set({ items: [] }),

      total: () =>
        get().items.reduce((acc, i) => acc + parseFloat(i.product.price) * i.quantity, 0),

      count: () =>
        get().items.reduce((acc, i) => acc + i.quantity, 0),
    }),
    { name: 'kramer-cart' }
  )
);
