import type { Product } from '@/features/product/types/product';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';

function ProductDetails({ product }: { product: Product }) {
  return (
    <section className="flex flex-col gap-14 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
      <ProductGallery images={product.images} name={product.name} />
      <ProductInfo product={product} />
    </section>
  );
}

export default ProductDetails;
