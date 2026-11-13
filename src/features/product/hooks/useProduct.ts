import { useQuery } from '@tanstack/react-query';
import { getProduct } from '../model/api';

export const useProduct = (slug: string) =>
  useQuery({ queryKey: ['product', slug], queryFn: () => getProduct(slug) });
