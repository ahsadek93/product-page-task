import Stars from './Stars';
import starIcon from './assets/star.svg';
import ringTrack from './assets/ring-track.svg';
import ringArc from './assets/ring-arc.svg';
import ringTrackMobile from './assets/ring-track-m.svg';
import ringArcMobile from './assets/ring-arc-m.svg';

// notes: static Figma content, becomes props when reviews are fetched
const breakdown = [
  { stars: '5.0', count: 2823, fill: '84%' },
  { stars: '4.0', count: 38, fill: '47.5%' },
  { stars: '3.0', count: 4, fill: '15%' },
  { stars: '2.0', count: 0, fill: '0%' },
  { stars: '1.0', count: 0, fill: '0%' },
];

function ReviewSummary() {
  return (
    <div className="rounded border-[0.8px] border-dashed border-ink-200 p-[15px] md:flex md:gap-10 lg:gap-0 lg:rounded-lg lg:p-[22.4px]">
      <div className="flex items-center gap-4 md:shrink-0 md:self-start lg:w-[348px]">
        <div className="relative size-16 shrink-0 lg:size-[84px]">
          <img src={ringTrackMobile} alt="" className="absolute inset-0 size-full lg:hidden" />
          <img src={ringArcMobile} alt="" className="absolute inset-0 size-full lg:hidden" />
          <img src={ringTrack} alt="" className="absolute inset-0 hidden size-full lg:block" />
          <img src={ringArc} alt="" className="absolute inset-0 hidden size-full lg:block" />
          <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold leading-[1.4] tracking-[-0.2px] text-review-ink lg:text-xl">
            4.5<span className="sr-only"> out of 5</span>
          </span>
        </div>
        <div className="flex flex-col gap-1 lg:gap-2">
          <Stars />
          <p className="text-xs font-medium leading-[1.6] text-review-ink lg:text-base lg:font-normal lg:text-ink-600">
            from 1,25k reviews
          </p>
        </div>
      </div>

      <ul className="mt-6 flex flex-col gap-3 text-xs font-medium leading-[1.4] text-review-ink md:mt-0 md:flex-1 lg:text-base lg:leading-[1.6]">
        {breakdown.map((row) => (
          <li key={row.stars} className="flex items-center gap-3 lg:gap-[25px]">
            <span className="flex w-10 shrink-0 items-center lg:w-12 lg:gap-1">
              <span className="w-6 lg:w-auto">{row.stars}</span>
              <img src={starIcon} alt="" width={20} height={20} className="size-4 lg:size-5" />
            </span>
            <span className="h-2 flex-1 overflow-hidden bg-review-line lg:rounded-lg">
              <span className="block h-full bg-ink-800 lg:rounded-lg" style={{ width: row.fill }} />
            </span>
            <span className="w-[30px] shrink-0 text-right lg:w-[39px] lg:text-left">{row.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReviewSummary;
