import starIcon from './assets/star.svg';
import dotIcon from './assets/dot.svg';

export type ProductCardItem = {
  image: string;
  brand: string;
  price: string;
  name: string;
  rating: string;
  sold: string;
};

function ProductCard({ item }: { item: ProductCardItem }) {
  return (
    <article className="flex flex-col gap-[11.7px] font-clash lg:gap-4">
      <div className="aspect-[212/284] overflow-hidden rounded-md bg-[#f2f2f2] lg:rounded-lg">
        <img src={item.image} alt={item.name} className="size-full object-cover" />
      </div>
      <div className="flex flex-col gap-[5.8px] lg:gap-2">
        <div className="flex flex-col gap-[4.4px] lg:gap-1.5">
          <h3 className="text-sm font-semibold leading-[1.4] tracking-[-0.01em] text-[#292929] lg:text-lg">
            {item.brand}
          </h3>
          <p className="text-base font-semibold leading-[1.4] tracking-[-0.01em] text-[#141414] lg:text-xl">
            {item.price}
          </p>
          <p className="text-[13px] leading-[1.2] text-[#7a7a7a] lg:text-base">{item.name}</p>
        </div>
        <div className="flex items-center gap-[5.8px] text-xs leading-[1.6] lg:gap-2 lg:text-base">
          <img src={starIcon} alt="" width={24} height={24} className="size-3 lg:size-6" />
          <span className="text-[#0b0f0e]">
            {item.rating}
            <span className="sr-only"> out of 5 stars</span>
          </span>
          <img src={dotIcon} alt="" width={4} height={4} className="size-[3px] lg:size-1" />
          <span className="text-[#666]">{item.sold} Sold</span>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
