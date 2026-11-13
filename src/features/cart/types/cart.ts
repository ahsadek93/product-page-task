// Snapshot taken at add time — cart never reads product, so price/name stay what the user saw.
export type CartItem = {
  variantId: string; // product id when the product has no variants
  name: string;
  image: string;
  price: number; // unit price actually charged (sale price when on sale)
  options: Record<string, string>; // { color: 'brown', size: '40' }
  quantity: number;
  maxQuantity: number | null; // stock at add time; null = no limit
};
