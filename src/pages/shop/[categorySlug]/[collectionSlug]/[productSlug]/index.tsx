import { useParams } from 'react-router';
import Breadcrumb from '@/shared/components/breadcrumb/Breadcrumb';
import ProductDetails from '@/features/product/components/product-details/ProductDetails';
import ProductDetailsSkeleton from '@/features/product/components/product-details/ProductDetailsSkeleton';
import ProductError from '@/features/product/components/product-details/ProductError';
import ProductGrid from '@/features/product/components/product-grid/ProductGrid';
import ProductReviews from '@/features/product/components/product-reviews/ProductReviews';
import { useProduct } from '@/features/product/hooks/useProduct';
import { useProductBreadcrumb } from '@/features/product/hooks/useProductBreadcrumb';
import dashedLine from '@/shared/assets/dashed-line-wide.svg';

// Figma puts a dashed line between sections, with the same gap on both sides.
const Divider = () => <img src={dashedLine} alt="" className="my-14 block h-[0.5px] w-full lg:my-20" />;

function ProductPage() {
  const { categorySlug = '', collectionSlug = '', productSlug = '' } = useParams();
  const { data: product, isPending, isError } = useProduct(productSlug);
  const crumbs = useProductBreadcrumb(categorySlug, collectionSlug, product);

  // Middle crumbs are text: no category/collection pages exist yet.
  return (
    <div className="mx-auto max-w-[1240px] px-5 pb-14 pt-6 lg:pb-20">
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
        {isPending ? <ProductDetailsSkeleton /> : isError ? <ProductError /> : <ProductDetails product={product} />}
      </div>
      <Divider />
      <ProductGrid title="Related Product" />
      <Divider />
      <ProductReviews />
      <Divider />
      <ProductGrid title="Popular this week" />
    </div>
  );
}

export default ProductPage;
