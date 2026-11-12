import { Fragment } from 'react';
import { Link } from 'react-router';
import arrowRight from './arrow-right.svg';

export type BreadcrumbItem = {
  label: string;
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
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <Fragment key={`${item.label}-${i}`}>
              {isLast ? (
                <li aria-current="page" className="basis-full text-sm text-[#292929] lg:basis-auto lg:text-base">
                  {item.label}
                </li>
              ) : (
                <>
                  <li className="text-[13px] text-[#8f8f8f] lg:text-base">
                    {item.to ? <Link to={item.to}>{item.label}</Link> : item.label}
                  </li>
                  <li aria-hidden="true">
                    <img src={arrowRight} alt="" width={12} height={12} />
                  </li>
                </>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
