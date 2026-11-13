import { Fragment } from 'react';
import ReviewSummary from './ReviewSummary';
import ReviewFilters from './ReviewFilters';
import ReviewItem, { type Review } from './ReviewItem';
import avatar1 from './assets/avatar-1.png';
import avatar2 from './assets/avatar-2.png';
import avatar3 from './assets/avatar-3.png';
import avatar4 from './assets/avatar-4.png';
import filterIcon from './assets/filter.svg';
import arrowIcon from './assets/arrow-right.svg';
import separator from './assets/line-review.svg';
import separatorMobile from './assets/line-review-m.svg';

// ponytail: static Figma content and fixed selections, become props when reviews are fetched
const reviews: Review[] = [
  {
    title: 'This is amazing product I have.',
    date: 'July 2, 2020 03:29 PM',
    author: 'Darrell Steward',
    avatar: avatar1,
    likes: 128,
    liked: true,
  },
  {
    title: 'This is amazing product I have.',
    date: 'July 2, 2020 1:04 PM',
    author: 'Darlene Robertson',
    avatar: avatar2,
    likes: 82,
  },
  {
    title: 'This is amazing product I have.',
    date: 'June 26, 2020 10:03 PM',
    author: 'Kathryn Murphy',
    avatar: avatar3,
    likes: 9,
  },
  {
    title: 'This is amazing product I have.',
    date: 'July 7, 2020 10:14 AM',
    author: 'Ronald Richards',
    avatar: avatar4,
    likes: 124,
  },
];
const tabs = ['All Reviews', 'With Photo & Video', 'With Description'];
const pages = ['1', '2', '...', '19'];

const boxClass = 'rounded-md border font-medium leading-[1.6] lg:rounded-lg';

function ProductReviews() {
  return (
    <section className="font-clash">
      <h2 className="text-2xl font-semibold leading-[1.4] tracking-[-0.2px] text-[#141414] lg:text-[28px] lg:leading-[1.2] lg:tracking-normal">
        Product Reviews
      </h2>

      <div className="mt-4 lg:mt-[18px]">
        <ReviewSummary />
      </div>

      <div className="mt-6 lg:flex lg:justify-between lg:gap-10">
        <ReviewFilters />

        <div className="lg:max-w-[882px] lg:flex-1">
          <h3 className="text-base font-semibold leading-[1.4] tracking-[-0.2px] text-[#141414] lg:text-xl lg:text-[#292929]">
            Review Lists
          </h3>
          <div className="mt-4 flex items-start justify-between gap-2">
            <div className="flex flex-wrap gap-2 lg:gap-3">
              {tabs.map((tab, i) => (
                <button
                  key={tab}
                  type="button"
                  aria-pressed={i === 0}
                  className={`${boxClass} h-8 px-2.5 text-xs lg:h-auto lg:py-2.5 lg:text-sm ${
                    i === 0
                      ? 'border-[#333] bg-[#ebebeb] text-[#141414] lg:px-5'
                      : 'border-[#e4e9ee] text-[#0b0f0e] lg:border-[#e6e6e6] lg:px-4 lg:text-[#141414]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-label="Filter reviews"
              className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#e4e9ee] lg:hidden"
            >
              <img src={filterIcon} alt="" width={20} height={20} />
            </button>
          </div>

          <div className="mt-8 flex flex-col gap-6 lg:mt-[34px] lg:gap-8">
            {reviews.map((review, i) => (
              <Fragment key={i}>
                {i > 0 && (
                  <>
                    <img src={separatorMobile} alt="" className="block h-px w-full lg:hidden" />
                    <img src={separator} alt="" className="hidden h-[0.5px] w-full lg:block" />
                  </>
                )}
                <ReviewItem review={review} />
              </Fragment>
            ))}
          </div>

          <nav aria-label="Reviews pagination" className="mt-9 flex justify-center gap-[6.5px] lg:mt-8 lg:gap-2">
            {pages.map((page) =>
              page === '...' ? (
                <span
                  key={page}
                  className={`${boxClass} flex size-9 items-center justify-center border-[#e4e9ee] text-[11.5px] text-[#7a7a7a] lg:size-11 lg:text-sm`}
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  aria-current={page === '1' ? 'page' : undefined}
                  className={`${boxClass} size-9 text-[11.5px] lg:size-11 lg:text-sm ${
                    page === '1' ? 'border-[#333] bg-white text-[#141414]' : 'border-[#e4e9ee] text-[#7a7a7a]'
                  }`}
                >
                  {page}
                </button>
              ),
            )}
            <button type="button" aria-label="Next page" className="p-2 lg:p-2.5">
              <img src={arrowIcon} alt="" width={24} height={24} className="size-5 -rotate-90 lg:size-6" />
            </button>
          </nav>
        </div>
      </div>
    </section>
  );
}

export default ProductReviews;
