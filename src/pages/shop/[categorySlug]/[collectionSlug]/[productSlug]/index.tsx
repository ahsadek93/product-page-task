import Breadcrumb from '../../../../../shared/components/breadcrumb/Breadcrumb';

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
    </div>
  );
}

export default ProductPage;
