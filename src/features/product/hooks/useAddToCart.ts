import type { Product } from '@/features/product/types/product';
import type { VariantSelection } from '@/features/product/hooks/useVariantSelection';
import { useCartActions } from '@/features/cart/hooks/useCartActions';
import { toCartItem } from '@/features/product/model/variant';

export function useAddToCart(product: Product, { selection, variant, stock }: VariantSelection) {
  const cart = useCartActions();
  const addToCart = () => cart.add(toCartItem(product, selection, variant)); // header badge pop is the feedback

  return {
    canAddToCart: (product.variants.length === 0 || variant !== undefined) && stock?.canOrder !== false,
    addToCart,
    checkoutNow: () => {
      addToCart();
      cart.open();
    },
  };
}

export type AddToCart = ReturnType<typeof useAddToCart>;
