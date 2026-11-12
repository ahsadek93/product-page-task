import Breadcrumb from '../../../shared/components/breadcrumb/Breadcrumb';

function CategoryPage() {
  // ponytail: sample labels until category data is wired in
  return (
    <div className="mx-auto max-w-[1240px] px-5 py-6">
      <Breadcrumb items={[{ label: 'Homepage', to: '/' }, { label: 'Women' }]} />
    </div>
  );
}

export default CategoryPage;
