// Raw BE shape of GET /products/slug/:store/:slug. Typed from a real response; never leaves model/.
// Lists are `| null` because the BE sends null for empty relations.

export type VariationPropDto = {
  id: string;
  name: string;
  variation_id: string;
  value?: string; // image URL, only on 'image' variations
};

export type VariationDto = {
  id: string;
  name: string;
  product_id: string;
  type: string; // 'image' | 'button' seen
  props: VariationPropDto[] | null;
};

export type VariantPropDto = {
  id: string;
  variation: string; // variation name, e.g. 'color'
  variation_prop: string; // prop name, e.g. 'brown'
  product_variant_id: string;
};

export type VariantDto = {
  id: string;
  product_id: string;
  price: number;
  sale_price: number; // 0 = no sale
  quantity: number;
  taager_code: string;
  variation_props: VariantPropDto[] | null;
};

export type CategoryDto = {
  id: string;
  created_at: string;
  updated_at: string;
  store_id: string;
  name: string;
  slug: string;
  thumb: string;
  position: number;
  show_in_header: boolean;
  children: CategoryDto[] | null;
  products: unknown[] | null;
};

export type ProductThemeSchemaDto = {
  id: string;
  created_at: string;
  updated_at: string;
  product_id: string;
  theme_key: string;
  product_theme_data: unknown | null;
};

export type ProductDto = {
  id: string;
  created_at: string;
  updated_at: string;
  store_id: string;
  name: string;
  slug: string;
  description: string; // HTML
  price: number;
  sale_price: number; // 0 = no sale
  thumb: string;
  images: string[] | null;
  position: number;
  hidden: boolean;

  // stock
  quantity: number;
  track_stock: boolean;
  disable_orders_for_no_stock: boolean;
  is_digital: boolean;

  // checkout / layout
  buy_now_text: string;
  custom_currency: string;
  is_free_shipping: boolean;
  is_fixed_bottom_buy: boolean;
  is_one_page_checkout: boolean;
  is_checkout_before_description: boolean;
  is_quantity_hidden: boolean;
  is_header_hidden: boolean;
  show_landing_in_same_page: boolean;
  hide_related_products: boolean;

  // marketing
  fake_visitors_min: number;
  fake_visitors_max: number;
  fake_timer_hours: number;
  is_cloaking_active: boolean;

  // third-party integrations
  is_taager_submit_active: boolean;
  is_ecombo_submit_active: boolean;
  is_mosaweq_submit_active: boolean;
  is_alturky_submit_active: boolean;
  is_jamaica_submit_active: boolean;
  is_engzny_submit_active: boolean;

  variations: VariationDto[] | null;
  variants: VariantDto[] | null;
  categories: CategoryDto[] | null;
  product_theme_schema: ProductThemeSchemaDto | null;
};
