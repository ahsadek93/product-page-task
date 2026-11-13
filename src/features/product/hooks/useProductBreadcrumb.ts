import type { Product } from '@/features/product/types/product';
import { crumbLabel } from '@/features/product/model/breadcrumb';

// Product name is null while loading, so the view can show a placeholder.
export function useProductBreadcrumb(categorySlug: string, collectionSlug: string, product: Product | undefined) {
  const categories = product?.categories ?? [];
  return {
    category: crumbLabel(categorySlug, categories),
    collection: crumbLabel(collectionSlug, categories),
    name: product?.name ?? null,
  };
}
