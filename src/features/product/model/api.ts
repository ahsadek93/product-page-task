import { api } from '@/shared/api/api';
import type { ProductDto } from '@/features/product/types/product.dto';
import { toProduct } from './product.adapter';

const STORE_SLUG = 'clear-theme';

export const getProduct = (slug: string) =>
  api<ProductDto>(`/products/slug/${STORE_SLUG}/${encodeURIComponent(slug)}?join=reviews`).then(toProduct);
