// Our shape — what the app uses.
export type OptionValue = { id: string; name: string; image?: string };

export type ProductOption = {
  name: string; // e.g. 'color'
  type: 'image' | 'button';
  values: OptionValue[];
};

export type ProductVariant = {
  id: string;
  price: number;
  salePrice: number | null;
  quantity: number;
  options: Record<string, string>; // { color: 'brown', size: '40' }
};

export type Category = { id: string; name: string; slug: string };

export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  descriptionHtml: string;
  images: string[]; // thumb first
  options: ProductOption[];
  variants: ProductVariant[];
  categories: Category[];
  quantity: number; // stock when the product has no variants
  trackStock: boolean; // false = quantities are meaningless, always orderable
  blockOrdersWhenOutOfStock: boolean;
};
