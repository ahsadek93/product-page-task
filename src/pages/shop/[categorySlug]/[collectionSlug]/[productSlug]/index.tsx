import { useParams } from 'react-router';
import Breadcrumb from '@/shared/components/breadcrumb/Breadcrumb';
import ProductDetails from '@/features/product/components/product-details/ProductDetails';
import ProductDetailsSkeleton from '@/features/product/components/product-details/ProductDetailsSkeleton';
import RelatedProducts from '@/features/product/components/related-products/RelatedProducts';
import ProductReviews from '@/features/product/components/product-reviews/ProductReviews';
import { useProduct } from '@/features/product/hooks/useProduct';
import { useProductBreadcrumb } from '@/features/product/hooks/useProductBreadcrumb';

function ProductPage() {
  const { categorySlug = '', collectionSlug = '', productSlug = '' } = useParams();
  const { data: product, isPending, isError } = useProduct(productSlug);
  const crumbs = useProductBreadcrumb(categorySlug, collectionSlug, product);

  // Middle crumbs are text: no category/collection pages exist yet.
  return (
    <div className="mx-auto max-w-[1240px] px-5 py-6">
      <Breadcrumb
        items={[
          { label: 'Homepage', to: '/' },
          { label: crumbs.category },
          { label: crumbs.collection },
          {
            label: isPending ? (
              <span className="inline-block h-[1em] w-48 rounded bg-[#f2f2f2] align-middle motion-safe:animate-pulse" />
            ) : (
              (crumbs.name ?? 'Product')
            ),
          },
        ]}
      />
      <div className="mt-6 lg:mt-10">
        {isPending ? (
          <ProductDetailsSkeleton />
        ) : isError ? (
          <p className="py-16 text-center">Couldn't load this product.</p>
        ) : (
          <ProductDetails product={product} />
        )}
      </div>
      <div className="mt-16 lg:mt-24">
        <RelatedProducts />
      </div>
      <div className="mt-14 lg:mt-20">
        <ProductReviews />
      </div>
      <div className="mt-14 lg:mt-20">
        <RelatedProducts />
      </div>
    </div>
  );
}

export default ProductPage;
