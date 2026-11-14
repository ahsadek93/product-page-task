import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { CartItem } from '@/features/cart/types/cart';

type CartState = {
  items: CartItem[];
  isOpen: boolean; // drawer; not persisted
  // Drives the toast; id changes on every add. `added` is how many actually went in (0 = already at the stock cap).
  lastAdded: { item: CartItem; id: number; added: number } | null;
  add: (item: CartItem) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
};

// notes: stock cap is the snapshot from add time; re-check against the API at checkout
const clamp = (item: CartItem, quantity: number) => Math.min(quantity, item.maxQuantity ?? Infinity);

// localStorage is outside our control: a malformed line (e.g. no `options`) would crash the header or CartLine.
const isCartItem = (v: unknown): v is CartItem => {
  if (typeof v !== 'object' || v === null) return false;
  const i = v as Record<string, unknown>;
  return (
    typeof i.variantId === 'string' &&
    typeof i.name === 'string' &&
    typeof i.image === 'string' &&
    Number.isFinite(i.price) &&
    Number.isInteger(i.quantity) &&
    (i.quantity as number) > 0 &&
    typeof i.options === 'object' &&
    i.options !== null &&
    (i.maxQuantity === null || Number.isFinite(i.maxQuantity))
  );
};

export const useCartStore = create<CartState>()(
  persist(
    immer((set) => ({
      items: [],
      isOpen: false,
      lastAdded: null,
      // Same variant again → bump quantity instead of a second line.
      add: (item) =>
        set((s) => {
          const line = s.items.find((i) => i.variantId === item.variantId);
          const before = line?.quantity ?? 0;
          const quantity = clamp(line ?? item, before + item.quantity);
          if (line) line.quantity = quantity;
          else s.items.push({ ...item, quantity });
          s.lastAdded = { item, id: (s.lastAdded?.id ?? 0) + 1, added: quantity - before };
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
    {
      name: 'cart',
      partialize: (s) => ({ items: s.items }),
      // Also runs with `persisted === undefined` when nothing is stored.
      merge: (persisted, current) => {
        const items = (persisted as { items?: unknown } | undefined)?.items;
        return { ...current, items: Array.isArray(items) ? items.filter(isCartItem) : [] };
      },
    },
  ),
);

// Another tab changed the cart: reload it, so this tab's next write doesn't overwrite it with stale items.
window.addEventListener('storage', (e) => {
  if (e.key === 'cart' || e.key === null) void useCartStore.persist.rehydrate(); // null = storage cleared
});

export const cartCount = (items: CartItem[]) => items.reduce((n, i) => n + i.quantity, 0);
export const cartSubtotal = (items: CartItem[]) => items.reduce((sum, i) => sum + i.price * i.quantity, 0);
