import { Link } from 'react-router';

function HomePage() {
  return (
    <div className="flex h-full items-center justify-center py-24">
      <Link
        to="/products/Sneakers12"
        className="rounded-md bg-black px-6 py-3 text-white hover:bg-neutral-800"
      >
        Go to product page
      </Link>
    </div>
  );
}

export default HomePage;
