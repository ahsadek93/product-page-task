import type { Product, ProductVariant } from '@/features/product/types/product';
import type { CartItem } from '@/features/cart/types/cart';

export type Selection = Record<string, string>; // { color: 'brown', size: '40' }

const matches = (v: ProductVariant, selection: Selection) =>
  Object.entries(selection).every(([name, value]) => v.options[name] === value);

export const findVariant = (variants: ProductVariant[], selection: Selection) =>
  variants.find((v) => matches(v, selection));

// Out of stock only blocks a variant when the store tracks stock AND refuses orders without it.
const orderable = (product: Product, v: ProductVariant) =>
  !product.trackStock || !product.blockOrdersWhenOutOfStock || v.quantity > 0;

// First variant matching the picks, preferring one that can be ordered.
const bestVariant = (product: Product, selection: Selection) => {
  const fits = product.variants.filter((v) => matches(v, selection));
  return fits.find((v) => orderable(product, v)) ?? fits[0];
};

// Picks for the options that come before `name` (plus `name` itself when `include`).
const picksUpTo = (product: Product, selection: Selection, name: string, include: boolean) => {
  const i = product.options.findIndex((o) => o.name === name);
  return Object.fromEntries(product.options.slice(0, include ? i + 1 : i).map((o) => [o.name, selection[o.name]]));
};

// Each option is limited only by the options above it (size by color, never color by size),
// so every value of the first option stays reachable and disabled buttons can't trap the user.
// 'missing' = no variant has that combination; 'sold-out' = they exist but none can be ordered. null = selectable.
export const unavailableReason = (product: Product, selection: Selection, name: string, value: string) => {
  if (product.variants.length === 0) return null;
  const picks = { ...picksUpTo(product, selection, name, false), [name]: value };
  const fits = product.variants.filter((v) => matches(v, picks));
  if (fits.length === 0) return 'missing';
  return fits.some((v) => orderable(product, v)) ? null : 'sold-out';
};

// If the new pick breaks a later option (black has no 38, or black 38 is sold out), move the later
// options to the first variant that fits, preferring one that can be ordered.
export const nextSelection = (product: Product, selection: Selection, name: string, value: string) => {
  const wanted = { ...selection, [name]: value };
  if (product.variants.length === 0) return wanted;
  const exact = findVariant(product.variants, wanted);
  if (exact && orderable(product, exact)) return wanted;
  return bestVariant(product, picksUpTo(product, wanted, name, true))?.options ?? wanted;
};

// Start from a combination that exists (orderable if any is): a variant's, else the first value of each option.
export const defaultSelection = (product: Product): Selection =>
  bestVariant(product, {})?.options ??
  Object.fromEntries(product.options.flatMap((o) => (o.values[0] ? [[o.name, o.values[0].name]] : [])));

// null = store doesn't track stock, show nothing. Variant quantity wins; product quantity when there are no variants.
export const stockOf = (product: Product, variant?: ProductVariant) => {
  if (!product.trackStock) return null;
  const quantity = product.variants.length ? (variant?.quantity ?? 0) : product.quantity;
  return { quantity, canOrder: quantity > 0 || !product.blockOrdersWhenOutOfStock };
};

// Variant fields override the product's; 0/null on the variant means "not set" (the sample BE data
// has variants at 190 with no sale while the product says 160 on sale — product sale must still apply).
export const priceOf = (product: Product, variant?: ProductVariant) => {
  const price = variant?.price || product.price;
  const salePrice = variant?.salePrice ?? product.salePrice;
  return { price, salePrice: salePrice !== null && salePrice < price ? salePrice : null };
};

// Snapshot for the cart: the selected color's swatch beats the generic first image.
export const toCartItem = (
  product: Product,
  selection: Selection,
  variant: ProductVariant | undefined,
  quantity = 1,
): CartItem => {
  const { price, salePrice } = priceOf(product, variant);
  const imageOption = product.options.find((o) => o.type === 'image');
  const swatch = imageOption?.values.find((v) => v.name === selection[imageOption.name])?.image;
  return {
    variantId: variant?.id ?? product.id,
    name: product.name,
    image: swatch ?? product.images[0] ?? '',
    price: salePrice ?? price,
    options: variant?.options ?? selection,
    quantity,
    maxQuantity: product.blockOrdersWhenOutOfStock ? (stockOf(product, variant)?.quantity ?? null) : null,
  };
};
