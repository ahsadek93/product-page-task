import Breadcrumb from '../../../../../shared/components/breadcrumb/Breadcrumb';
import ProductDetails from '../../../../../features/product/components/product-details/ProductDetails';
import RelatedProducts from '../../../../../features/product/components/related-products/RelatedProducts';

function ProductPage() {
  // ponytail: sample labels until product data is wired in; middle crumbs are text, no category/collection pages exist
  return (
    <div className="mx-auto max-w-[1240px] px-5 py-6">
      <Breadcrumb
        items={[
          { label: 'Homepage', to: '/' },
          { label: 'Women' },
          { label: "Women's Shirts & Tops" },
          { label: 'Long Sleeve Overshirt, Khaki, 6' },
        ]}
      />
      <div className="mt-6 lg:mt-10">
        <ProductDetails />
      </div>
      <div className="mt-16 lg:mt-24">
        <RelatedProducts />
      </div>
    </div>
  );
}

export default ProductPage;
