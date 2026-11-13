import type { Product, ProductVariant } from '@/features/product/types/product';

export type Selection = Record<string, string>; // { color: 'brown', size: '40' }

export const findVariant = (variants: ProductVariant[], selection: Selection) =>
  variants.find((v) => Object.entries(selection).every(([name, value]) => v.options[name] === value));

// Picks for the options that come before `name` (plus `name` itself when `include`).
const picksUpTo = (product: Product, selection: Selection, name: string, include: boolean) => {
  const i = product.options.findIndex((o) => o.name === name);
  return Object.fromEntries(product.options.slice(0, include ? i + 1 : i).map((o) => [o.name, selection[o.name]]));
};

// Each option is limited only by the options above it (size by color, never color by size),
// so every value of the first option stays reachable and disabled buttons can't trap the user.
export const isAvailable = (product: Product, selection: Selection, name: string, value: string) =>
  product.variants.length === 0 ||
  findVariant(product.variants, { ...picksUpTo(product, selection, name, false), [name]: value }) !== undefined;

// If the new pick breaks a later option (black has no 38), move the later options to the first variant that fits.
export const nextSelection = (product: Product, selection: Selection, name: string, value: string) => {
  const wanted = { ...selection, [name]: value };
  if (product.variants.length === 0 || findVariant(product.variants, wanted)) return wanted;
  return findVariant(product.variants, picksUpTo(product, wanted, name, true))?.options ?? wanted;
};

// Start from a combination that exists: the first variant's, else the first value of each option.
export const defaultSelection = (product: Product): Selection =>
  product.variants[0]?.options ??
  Object.fromEntries(product.options.flatMap((o) => (o.values[0] ? [[o.name, o.values[0].name]] : [])));

// Variant fields override the product's; 0/null on the variant means "not set" (the sample BE data
// has variants at 190 with no sale while the product says 160 on sale — product sale must still apply).
export const priceOf = (product: Product, variant?: ProductVariant) => {
  const price = variant?.price || product.price;
  const salePrice = variant?.salePrice ?? product.salePrice;
  return { price, salePrice: salePrice !== null && salePrice < price ? salePrice : null };
};
