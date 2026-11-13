import type { ReactNode } from 'react';
import { Link } from 'react-router';
import arrowRight from './arrow-right.svg';

export type BreadcrumbItem = {
  label: ReactNode; // node so callers can pass a loading placeholder
  to?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

// Last item is the current page. On mobile it wraps onto its own line.
function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="font-clash font-medium leading-[1.6]">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
        {items.map((item, i) =>
          i === items.length - 1 ? (
            <li key={i} aria-current="page" className="basis-full text-sm text-[#292929] lg:basis-auto lg:text-base">
              {item.label}
            </li>
          ) : (
            <li key={i} className="flex items-center gap-2 text-[13px] text-[#8f8f8f] lg:text-base">
              {item.to ? <Link to={item.to}>{item.label}</Link> : item.label}
              <img src={arrowRight} alt="" aria-hidden="true" width={12} height={12} />
            </li>
          ),
        )}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
