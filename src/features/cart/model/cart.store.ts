import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { CartItem } from '@/features/cart/types/cart';

type CartState = {
  items: CartItem[];
  isOpen: boolean; // drawer; not persisted
  add: (item: CartItem) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
};

// ponytail: stock cap is the snapshot from add time; re-check against the API at checkout
const clamp = (item: CartItem, quantity: number) => Math.min(quantity, item.maxQuantity ?? Infinity);

export const useCartStore = create<CartState>()(
  persist(
    immer((set) => ({
      items: [],
      isOpen: false,
      // Same variant again → bump quantity instead of a second line.
      add: (item) =>
        set((s) => {
          const line = s.items.find((i) => i.variantId === item.variantId);
          if (line) line.quantity = clamp(line, line.quantity + item.quantity);
          else s.items.push({ ...item, quantity: clamp(item, item.quantity) });
        }),
      setQuantity: (variantId, quantity) =>
        set((s) => {
          if (quantity <= 0) s.items = s.items.filter((i) => i.variantId !== variantId);
          else {
            const line = s.items.find((i) => i.variantId === variantId);
            if (line) line.quantity = clamp(line, quantity);
          }
        }),
      remove: (variantId) => set((s) => void (s.items = s.items.filter((i) => i.variantId !== variantId))),
      clear: () => set({ items: [] }),
      setOpen: (isOpen) => set({ isOpen }),
    })),
    { name: 'cart', partialize: (s) => ({ items: s.items }) },
  ),
);

export const cartCount = (items: CartItem[]) => items.reduce((n, i) => n + i.quantity, 0);
export const cartSubtotal = (items: CartItem[]) => items.reduce((sum, i) => sum + i.price * i.quantity, 0);
