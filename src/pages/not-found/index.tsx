import { Link } from 'react-router';

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center gap-8 py-16 text-center font-clash leading-[1.2] lg:py-24">
      <div className="flex max-w-md flex-col gap-3">
        <h1 className="text-2xl font-semibold text-[#292929] lg:text-[28px]">Page not found</h1>
        <p className="text-base text-[#666] lg:text-lg">The page you're looking for doesn't exist or has moved.</p>
      </div>
      <Link to="/" className="btn-primary px-8 text-lg">
        Back to homepage
      </Link>
    </div>
  );
}

export default NotFoundPage;
