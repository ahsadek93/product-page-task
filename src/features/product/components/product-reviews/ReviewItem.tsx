import Stars from './Stars';
import likeIcon from './assets/like.svg';
import likeFilled from './assets/like-filled.svg';
import likeFilledMobile from './assets/like-filled-m.svg';

export type Review = {
  title: string;
  date: string;
  author: string;
  avatar: string;
  likes: number;
  liked?: boolean;
};

const actionClass =
  'flex h-8 items-center justify-center rounded-md border border-[#e4e9ee] lg:h-[50px] lg:rounded-lg';

// Mobile: buttons share the author row. Desktop: buttons sit bottom-right of the whole review.
function ReviewItem({ review }: { review: Review }) {
  return (
    <article className="grid grid-cols-[1fr_auto] items-center gap-x-4">
      <div className="col-span-2 flex flex-col gap-3 lg:col-span-1 lg:gap-4">
        <Stars />
        <div className="flex flex-col gap-0.5 lg:gap-1">
          <h4 className="text-sm font-semibold leading-[1.4] tracking-[-0.2px] text-[#141414] lg:text-lg">
            {review.title}
          </h4>
          <p className="text-xs leading-[1.6] text-[#818b9c] lg:text-base">{review.date}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 lg:mt-6 lg:gap-3">
        <img src={review.avatar} alt="" width={32} height={32} className="size-6 rounded-full lg:size-8" />
        <span className="text-xs font-medium leading-[1.6] text-[#0b0f0e] lg:text-base">{review.author}</span>
      </div>

      <div className="mt-4 flex gap-2 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:gap-4 lg:self-end">
        <button
          type="button"
          aria-pressed={review.liked ?? false}
          aria-label={`Helpful, ${review.likes} likes`}
          className={`${actionClass} gap-1 px-2.5 text-xs leading-[1.6] text-[#0b0f0e] lg:w-20 lg:gap-2 lg:px-3 lg:text-base`}
        >
          {review.liked ? (
            <>
              <img src={likeFilledMobile} alt="" width={20} height={20} className="lg:hidden" />
              <img src={likeFilled} alt="" width={24} height={24} className="hidden lg:block" />
            </>
          ) : (
            <img src={likeIcon} alt="" width={24} height={24} className="size-5 lg:size-6" />
          )}
          {review.likes}
        </button>
        <button type="button" aria-label="Not helpful" className={`${actionClass} w-8 lg:w-[50px]`}>
          <img src={likeIcon} alt="" width={24} height={24} className="size-5 -scale-y-100 lg:size-6" />
        </button>
      </div>
    </article>
  );
}

export default ReviewItem;
