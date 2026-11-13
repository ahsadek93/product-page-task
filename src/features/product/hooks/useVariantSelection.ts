import { useState } from 'react';
import type { Product } from '@/features/product/types/product';
import { defaultSelection, findVariant, isAvailable, nextSelection, priceOf, stockOf } from '@/features/product/model/variant';

export function useVariantSelection(product: Product) {
  const [selection, setSelection] = useState(() => defaultSelection(product));
  const variant = findVariant(product.variants, selection);

  return {
    selection,
    select: (name: string, value: string) => setSelection((s) => nextSelection(product, s, name, value)),
    isAvailable: (name: string, value: string) => isAvailable(product, selection, name, value),
    variant, // undefined = combination doesn't exist
    stock: stockOf(product, variant),
    ...priceOf(product, variant),
  };
}

export type VariantSelection = ReturnType<typeof useVariantSelection>;
