import { useQuery } from '@tanstack/react-query';
import { getProduct } from '@/features/product/model/api';

export const useProduct = (slug: string) =>
  useQuery({ queryKey: ['product', slug], queryFn: ({ signal }) => getProduct(slug, signal) });
