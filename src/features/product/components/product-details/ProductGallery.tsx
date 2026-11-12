import mainImage from './assets/image-main.png';
import thumb1 from './assets/thumb-1.png';
import thumb2 from './assets/thumb-2.png';
import thumb3 from './assets/thumb-3.png';
import thumb4 from './assets/thumb-4.png';
import thumb5 from './assets/thumb-5.png';
import shareIcon from './assets/share.svg';
import heartIcon from './assets/heart.svg';
import chevronIcon from './assets/chevron.svg';

// ponytail: static Figma content, becomes props when product data is wired in
const thumbnails = [thumb1, thumb2, thumb3, thumb4, thumb5];

const actionClass = 'rounded-md bg-[#f2f2f2] p-3 lg:rounded-lg lg:p-4';

// Mobile: thumbnails span under image + action column. Desktop: thumbnails sit under the image only.
function ProductGallery() {
  return (
    <div className="grid grid-cols-[1fr_44px] gap-x-3 gap-y-5 lg:max-w-[545px] lg:flex-1 lg:grid-cols-[minmax(0,458px)_52px] lg:gap-x-[35px] lg:gap-y-6">
      <div className="aspect-[458/610] overflow-hidden rounded-lg bg-[#f2f2f2]">
        <img src={mainImage} alt="Long Sleeve Overshirt, Khaki" className="size-full object-cover" />
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
        <div className="flex flex-col gap-4 lg:gap-5">
          <button type="button" aria-label="Previous image" className={actionClass}>
            <img src={chevronIcon} alt="" width={20} height={20} className="-rotate-90" />
          </button>
          <button type="button" aria-label="Next image" className={actionClass}>
            <img src={chevronIcon} alt="" width={20} height={20} className="rotate-90" />
          </button>
        </div>
      </div>

      <ul className="col-span-2 grid grid-cols-5 gap-[14.7px] lg:col-span-1 lg:gap-5">
        {thumbnails.map((src, i) => (
          <li key={i}>
            <button
              type="button"
              aria-label={`View image ${i + 1}`}
              className="block aspect-[76/100] w-full overflow-hidden rounded-md bg-[#f2f2f2] lg:rounded-lg"
            >
              <img src={src} alt="" className="size-full object-cover" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductGallery;
