import { useCartStore } from '@/features/cart/model/cart.store';

// Write-only access for other features: no subscription, so callers don't re-render on cart changes.
export function useCartActions() {
  const { add, setOpen } = useCartStore.getState(); // actions are stable references
  return { add, open: () => setOpen(true) };
}
