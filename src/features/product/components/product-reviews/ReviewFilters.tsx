import type { ReactNode } from 'react';
import starIcon from './assets/star.svg';
import chevronUp from './assets/chevron-up.svg';
import dashedLine from './assets/line-filter.svg';

const ratings = ['5', '4', '3', '2', '1'];
const topics = ['Product Quality', 'Seller Services', 'Product Price', 'Shipment', 'Match with Description'];

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="flex w-full items-center justify-between text-base font-semibold leading-[1.4] tracking-[-0.2px] text-ink-900">
        {title}
        <img src={chevronUp} alt="" width={12} height={12} className="-scale-y-100" />
      </legend>
      <div className="mt-3 flex flex-col gap-3">{children}</div>
    </fieldset>
  );
}

function FilterOption({ children }: { children: ReactNode }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-base font-semibold leading-[1.6] text-[#818b9c]">
      <span className="flex size-6 items-center justify-center">
        <input
          type="checkbox"
          className="size-[18px] cursor-pointer appearance-none border-[1.5px] border-[#c4c8cc] checked:border-ink-900 checked:bg-ink-900"
        />
      </span>
      {children}
    </label>
  );
}

// Desktop-only sidebar; mobile opens filters from the icon button in the review list header.
function ReviewFilters() {
  return (
    <aside className="hidden w-[278px] shrink-0 self-start rounded-lg border-[0.8px] border-dashed border-[#bbb] p-[22.4px] lg:block">
      <h3 className="text-xl font-semibold leading-[1.4] tracking-[-0.2px] text-ink-800">Reviews Filter</h3>
      <img src={dashedLine} alt="" className="mt-4 block h-[0.5px] w-full" />
      <div className="mt-6 flex flex-col gap-6">
        <FilterGroup title="Rating">
          {ratings.map((rating) => (
            <FilterOption key={rating}>
              <span className="flex items-center gap-1">
                <img src={starIcon} alt="" width={20} height={20} className="size-[18px]" />
                {rating}
                <span className="sr-only"> stars</span>
              </span>
            </FilterOption>
          ))}
        </FilterGroup>
        <img src={dashedLine} alt="" className="block h-[0.5px] w-full" />
        <FilterGroup title="Review Topics">
          {topics.map((topic) => (
            <FilterOption key={topic}>{topic}</FilterOption>
          ))}
        </FilterGroup>
      </div>
    </aside>
  );
}

export default ReviewFilters;
