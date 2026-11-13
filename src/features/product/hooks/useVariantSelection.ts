import { useState } from 'react';
import type { Product } from '@/features/product/types/product';
import { useCartStore } from '@/features/cart/model/cart.store';
import { defaultSelection, findVariant, isAvailable, nextSelection, priceOf, stockOf, toCartItem } from '@/features/product/model/variant';

export function useVariantSelection(product: Product) {
  const [selection, setSelection] = useState(() => defaultSelection(product));
  const variant = findVariant(product.variants, selection);
  const { add, setOpen } = useCartStore.getState(); // actions are stable; no subscription needed
  const stock = stockOf(product, variant);
  const addToCart = () => add(toCartItem(product, selection, variant)); // header badge pop is the feedback

  return {
    canAddToCart: (product.variants.length === 0 || variant !== undefined) && stock?.canOrder !== false,
    addToCart,
    checkoutNow: () => {
      addToCart();
      setOpen(true);
    },
    selection,
    select: (name: string, value: string) => setSelection((s) => nextSelection(product, s, name, value)),
    isAvailable: (name: string, value: string) => isAvailable(product, selection, name, value),
    variant, // undefined = combination doesn't exist
    stock,
    ...priceOf(product, variant),
  };
}

export type VariantSelection = ReturnType<typeof useVariantSelection>;
