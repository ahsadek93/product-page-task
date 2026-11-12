import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';

function ProductDetails() {
  return (
    <section className="flex flex-col gap-14 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
      <ProductGallery />
      <ProductInfo />
    </section>
  );
}

export default ProductDetails;
