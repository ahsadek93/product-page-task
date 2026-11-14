import type { Category } from '@/features/product/types/product';

// 'shirts-tops' → 'Shirts Tops'
const humanize = (slug: string) =>
  slug
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

// URL segments give the path; a matching product category gives the real name, else the slug is humanized.
// notes: API categories are flat and don't model the URL hierarchy; fetch category pages if they get one
export const crumbLabel = (slug: string, categories: Category[]) =>
  categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase())?.name ?? humanize(slug);
