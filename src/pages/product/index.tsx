import { useParams } from 'react-router';

function ProductPage() {
  const { slug } = useParams<{ slug: string }>();

  return <div className="p-8">Product: {slug}</div>;
}

export default ProductPage;
