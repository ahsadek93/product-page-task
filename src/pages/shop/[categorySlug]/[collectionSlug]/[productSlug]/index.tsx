import { useParams } from 'react-router';
import Breadcrumb from '../../../../../shared/components/breadcrumb/Breadcrumb';

function ProductPage() {
  const { categorySlug, collectionSlug } = useParams();

  // ponytail: sample labels until product data is wired in
  return (
    <div className="mx-auto max-w-[1240px] px-5 py-6">
      <Breadcrumb
        items={[
          { label: 'Homepage', to: '/' },
          { label: 'Women', to: `/shop/${categorySlug}` },
          { label: "Women's Shirts & Tops", to: `/shop/${categorySlug}/${collectionSlug}` },
          { label: 'Long Sleeve Overshirt, Khaki, 6' },
        ]}
      />
    </div>
  );
}

export default ProductPage;
