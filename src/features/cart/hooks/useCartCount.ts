import { cartCount, useCartStore } from '@/features/cart/model/cart.store';

// Subscribes to the number only: re-renders when the count changes, not on drawer/toast state.
export const useCartCount = () => useCartStore((s) => cartCount(s.items));
