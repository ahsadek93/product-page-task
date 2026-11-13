import type { Product } from '@/features/product/types/product';
import { useVariantSelection } from '@/features/product/hooks/useVariantSelection';
import { useAddToCart } from '@/features/product/hooks/useAddToCart';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';

function ProductDetails({ product }: { product: Product }) {
  const selection = useVariantSelection(product);
  const cart = useAddToCart(product, selection);

  return (
    <section className="flex flex-col gap-14 md:flex-row md:items-start md:justify-between md:gap-8 lg:gap-10">
      <title>{product.name}</title>
      <ProductGallery images={product.images} name={product.name} />
      <ProductInfo product={product} selection={selection} cart={cart} />
    </section>
  );
}

export default ProductDetails;
