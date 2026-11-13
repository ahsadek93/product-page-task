import { useShallow } from 'zustand/react/shallow';
import { useCartStore } from '@/features/cart/model/cart.store';

// Only what the toast shows: re-renders on an add or when the drawer opens, not on quantity changes.
export const useCartToast = () =>
  useCartStore(useShallow(({ lastAdded, isOpen, setOpen }) => ({ lastAdded, isOpen, setOpen })));
