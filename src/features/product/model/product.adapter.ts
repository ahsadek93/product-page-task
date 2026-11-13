import type { ProductDto } from '@/features/product/types/product.dto';
import type { Product } from '@/features/product/types/product';

// Trust boundary: fail loudly on fields the page can't render without, instead of showing undefined/NaN.
function check(ok: boolean, field: string) {
  if (!ok) throw new Error(`Invalid product response: ${field}`);
}

const saleOrNull = (sale: number) => (sale > 0 ? sale : null);

export function toProduct(dto: ProductDto): Product {
  check(typeof dto?.id === 'string', 'id');
  check(typeof dto.name === 'string', 'name');
  check(typeof dto.price === 'number', 'price');

  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    price: dto.price,
    salePrice: saleOrNull(dto.sale_price),
    descriptionHtml: dto.description ?? '',
    images: [...new Set([dto.thumb, ...(dto.images ?? [])].filter(Boolean))],
    options: (dto.variations ?? []).map((v) => ({
      name: v.name,
      type: v.type === 'image' ? 'image' : 'button',
      values: (v.props ?? []).map((p) => ({ id: p.id, name: p.name, image: p.value || undefined })),
    })),
    variants: (dto.variants ?? []).map((v) => ({
      id: v.id,
      price: v.price,
      salePrice: saleOrNull(v.sale_price),
      quantity: v.quantity,
      options: Object.fromEntries((v.variation_props ?? []).map((p) => [p.variation, p.variation_prop])),
    })),
    categories: (dto.categories ?? []).map(({ id, name, slug }) => ({ id, name, slug })),
  };
}
