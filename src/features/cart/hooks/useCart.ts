import { useShallow } from 'zustand/react/shallow';
import { cartCount, cartSubtotal, useCartStore } from '@/features/cart/model/cart.store';

export function useCart() {
  const { items, ...rest } = useCartStore(
    useShallow(({ items, isOpen, lastAdded, add, setQuantity, remove, clear, setOpen }) => ({
      items,
      isOpen,
      lastAdded,
      add,
      setQuantity,
      remove,
      clear,
      setOpen,
    })),
  );
  return { items, count: cartCount(items), subtotal: cartSubtotal(items), ...rest };
}
