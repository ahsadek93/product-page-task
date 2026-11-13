import { useState, type MouseEvent } from 'react';
import shareIcon from './assets/share.svg';
import heartIcon from './assets/heart.svg';
import chevronIcon from './assets/chevron.svg';

type ProductGalleryProps = {
  images: string[];
  name: string;
};

// Hover darkens (mouse devices only, via hoverOnlyWhenSupported), press shrinks slightly.
const actionClass =
  'rounded-md bg-[#f2f2f2] p-3 motion-safe:transition motion-safe:duration-200 motion-safe:ease-out active:scale-95 hover:bg-[#e4e4e4] lg:rounded-lg lg:p-4';

// Mobile: thumbnails span under image + action column. Desktop: thumbnails sit under the image only.
function ProductGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');

  const show = (i: number) => {
    setActive((i + images.length) % images.length);
    setZoomed(false);
  };

  // Zoom follows the cursor; keyboard clicks (detail 0) zoom from the centre.
  const aim = (e: MouseEvent<HTMLElement>) => {
    if (e.detail === 0 && e.type === 'click') return setOrigin('50% 50%');
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <div className="grid grid-cols-[1fr_44px] gap-x-3 gap-y-5 md:sticky md:top-[99px] md:min-w-0 md:max-w-[545px] md:flex-1 lg:top-[121px] lg:grid-cols-[minmax(0,458px)_52px] lg:gap-x-[35px] lg:gap-y-6">
      <div className="aspect-[458/610] overflow-hidden rounded-lg bg-[#f2f2f2]">
        {/* Hover zooms on mouse devices, click/tap toggles zoom everywhere. No images → empty grey box. */}
        {images.length > 0 && (
          <button
            type="button"
            aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
            aria-pressed={zoomed}
            onMouseMove={aim}
            onMouseLeave={() => setZoomed(false)}
            onClick={(e) => {
              aim(e);
              setZoomed((z) => !z);
            }}
            className="group block size-full cursor-zoom-in aria-pressed:cursor-zoom-out"
          >
            <img
              key={active}
              src={images[active]}
              alt={`${name}, image ${active + 1} of ${images.length}`}
              fetchPriority="high"
              style={{ transformOrigin: origin }}
              className={`size-full object-cover motion-safe:animate-[fade-in_300ms_ease-out] motion-safe:transition-transform motion-safe:duration-300 [@media(hover:hover)]:group-hover:scale-[2] ${zoomed ? 'scale-[2]' : ''}`}
            />
          </button>
        )}
      </div>

      <div className="flex flex-col justify-between">
        <div className="flex flex-col gap-5">
          <button type="button" aria-label="Share" className={actionClass}>
            <img src={shareIcon} alt="" width={20} height={20} />
          </button>
          <button type="button" aria-label="Add to wishlist" className={actionClass}>
            <img src={heartIcon} alt="" width={20} height={20} />
          </button>
        </div>
        {images.length > 1 && (
          <div className="flex flex-col gap-4 lg:gap-5">
            <button type="button" aria-label="Previous image" className={actionClass} onClick={() => show(active - 1)}>
              <img src={chevronIcon} alt="" width={20} height={20} className="-rotate-90" />
            </button>
            <button type="button" aria-label="Next image" className={actionClass} onClick={() => show(active + 1)}>
              <img src={chevronIcon} alt="" width={20} height={20} className="rotate-90" />
            </button>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <ul className="col-span-2 grid grid-cols-5 gap-[14.7px] lg:col-span-1 lg:gap-5">
          {images.map((thumb, i) => (
            <li key={i}>
              <button
                type="button"
                aria-label={`View image ${i + 1}`}
                aria-current={i === active}
                onClick={() => show(i)}
                className="block aspect-[76/100] w-full overflow-hidden rounded-md bg-[#f2f2f2] ring-black aria-[current=true]:ring-1 lg:rounded-lg"
              >
                <img src={thumb} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProductGallery;
