import { Link } from 'react-router';

// Not in Figma: styled from the page's own CTA buttons and type scale.
function ProductError() {
  return (
    <div role="alert" className="flex flex-col items-center gap-8 py-16 text-center font-clash leading-[1.2] lg:py-24">
      <span className="flex size-16 items-center justify-center rounded-full bg-surface" aria-hidden="true">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="text-ink-600"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7.5v5.5M12 16.5v.01" />
        </svg>
      </span>

      <div className="flex max-w-md flex-col gap-3">
        <h1 className="text-2xl font-semibold text-ink-800 lg:text-[28px]">Something went wrong</h1>
        <p className="text-base text-ink-500 lg:text-lg">We couldn't load this product. It may have been removed.</p>
      </div>

      <Link to="/" className="btn-primary px-8 text-lg">
        Back to homepage
      </Link>
    </div>
  );
}

export default ProductError;
