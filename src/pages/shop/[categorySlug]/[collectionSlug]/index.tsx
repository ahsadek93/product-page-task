import { useParams } from 'react-router';
import Breadcrumb from '../../../../shared/components/breadcrumb/Breadcrumb';

function CollectionPage() {
  const { categorySlug } = useParams();

  // ponytail: sample labels until collection data is wired in
  return (
    <div className="mx-auto max-w-[1240px] px-5 py-6">
      <Breadcrumb
        items={[
          { label: 'Homepage', to: '/' },
          { label: 'Women', to: `/shop/${categorySlug}` },
          { label: "Women's Shirts & Tops" },
        ]}
      />
    </div>
  );
}

export default CollectionPage;
