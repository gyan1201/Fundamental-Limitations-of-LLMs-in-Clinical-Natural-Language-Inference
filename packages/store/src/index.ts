import { create } from 'zustand';
import type { CartItem } from '@gadget/types';

export type CartState = {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (productId, quantity = 1) => set((state) => {
    const existing = state.items.find((i) => i.productId === productId);
    if (existing) {
      return {
        items: state.items.map((i) => i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i)
      };
    }
    return { items: [...state.items, { productId, quantity }] };
  }),
  removeItem: (productId) => set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
  clear: () => set({ items: [] })
}));