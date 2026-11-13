import type { Product } from '@/features/product/types/product';
import { useVariantSelection } from '@/features/product/hooks/useVariantSelection';
import { useAddToCart } from '@/features/product/hooks/useAddToCart';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';

function ProductDetails({ product }: { product: Product }) {
  const selection = useVariantSelection(product);
  const cart = useAddToCart(product, selection);

  return (
    <section className="flex flex-col gap-14 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
      <ProductGallery images={product.images} name={product.name} />
      <ProductInfo product={product} selection={selection} cart={cart} />
    </section>
  );
}

export default ProductDetails;
