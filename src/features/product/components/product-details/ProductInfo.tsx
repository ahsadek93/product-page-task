import type { Product } from '@/features/product/types/product';
import type { VariantSelection } from '@/features/product/hooks/useVariantSelection';
import type { AddToCart } from '@/features/product/hooks/useAddToCart';
import { formatPrice } from '@/shared/utils/formatPrice';
import SwapText from '@/shared/components/swap-text/SwapText';
import ProductDescription from './ProductDescription';
import dotIcon from './assets/dot.svg';
import starIcon from './assets/star.svg';
import dashedLine from '@/shared/assets/dashed-line.svg';

type ProductInfoProps = {
  product: Product;
  selection: VariantSelection;
  cart: AddToCart;
};

// ponytail: fixed low-stock threshold; make it a store setting if merchants need to tune it
const LOW_STOCK = 5;

// A "color" option without images: use the value's name as a CSS colour when the browser knows it ("brown" yes, "biege" no).
const cssColor = (option: { name: string }, value: string) =>
  option.name.toLowerCase() === 'color' && CSS.supports('color', value) ? value : undefined;

const UNAVAILABLE = { 'sold-out': 'Sold out', missing: 'Not available' } as const;

function ProductInfo({
  product,
  selection: { selection, select, unavailableReason, stock, price, salePrice },
  cart: { canAddToCart, addToCart, checkoutNow },
}: ProductInfoProps) {
  // Native tooltip on disabled options says why; undefined = selectable, no tooltip.
  const reasonOf = (name: string, value: string) => {
    const reason = unavailableReason(name, value);
    return reason ? UNAVAILABLE[reason] : undefined;
  };
  const quantity = stock ? stock.quantity : Infinity; // null stock = not tracked
  // Dedupe by name: the API can list two categories with the same name (different slugs).
  const categories = [...new Set(product.categories.map((c) => c.name))];

  return (
    <div className="flex flex-col gap-[38px] font-clash md:w-[46%] md:shrink-0 lg:w-[520px]">
      <div className="flex flex-col gap-8 lg:gap-10">
        <div className="flex flex-col gap-6 lg:gap-7">
          {/* Heading, price, rating */}
          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-3.5 lg:gap-5">
              <div className="flex flex-col gap-2 leading-[1.2] lg:gap-3">
                {/* Figma shows a brand here; the API has none, so the first category fills the slot.
                    ponytail: sold count and rating below are static Figma values — the API has no sales or review data */}
                {categories[0] && (
                  <p className="text-[13px] font-medium capitalize tracking-[0.01em] text-[#8f8f8f] lg:text-base">
                    {categories[0]}
                  </p>
                )}
                <h1 className="text-[23px] font-semibold tracking-[-0.005em] text-[#292929] lg:text-4xl">
                  {product.name}
                </h1>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <div className="flex items-center gap-4 whitespace-nowrap leading-[1.2]">
                  {salePrice !== null && (
                    <s className="text-sm font-medium text-[#666] lg:text-lg">{formatPrice(price)}</s>
                  )}
                  <span className="text-xl font-semibold text-[#141414] lg:text-[28px]">
                    {formatPrice(salePrice ?? price)}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-1 whitespace-nowrap leading-none lg:gap-2">
                  <span className="text-base text-[#666] lg:text-xl">1,238 Sold</span>
                  <img src={dotIcon} alt="" width={6} height={6} />
                  <span className="flex items-center gap-1">
                    <span className="flex size-5 items-center justify-center lg:size-6">
                      <img src={starIcon} alt="" width={18.6738} height={17.8586} className="h-auto w-[78%]" />
                    </span>
                    <span className="text-xl font-semibold text-[#141414] lg:text-2xl">
                      4.5<span className="sr-only"> out of 5 stars</span>
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <img src={dashedLine} alt="" className="block h-[0.5px] w-full" />
          </div>

          {/* Description and options */}
          <div className="flex flex-col gap-8 lg:gap-10">
            <div className="flex flex-col gap-2.5">
              <h2 className="font-raleway text-lg font-bold leading-[1.2] text-[#292929] lg:text-xl">Description:</h2>
              <ProductDescription html={product.descriptionHtml} />
            </div>

            {product.options.map((option) => {
              const selected = selection[option.name];
              return (
                <div key={option.name} className="flex flex-col gap-[18px]">
                  <div className="flex items-center justify-between leading-[1.2]">
                    <p className="text-lg font-medium capitalize text-[#8f8f8f] lg:text-xl">
                      {option.name}:{' '}
                      <span className="font-semibold text-[#292929]">
                        <SwapText text={selected ?? ''} />
                      </span>
                    </p>
                    {option.name === 'size' && (
                      <button type="button" className="text-base font-medium text-[#525252] underline">
                        View Size Chart
                      </button>
                    )}
                  </div>

                  {option.type === 'image' || option.name.toLowerCase() === 'color' ? (
                    <div className="flex gap-3.5">
                      {option.values.map((value) => (
                        <button
                          key={value.id}
                          type="button"
                          aria-label={value.name}
                          aria-pressed={value.name === selected}
                          disabled={reasonOf(option.name, value.name) !== undefined}
                          title={reasonOf(option.name, value.name)}
                          onClick={() => select(option.name, value.name)}
                          className="h-10 flex-1 overflow-hidden disabled:cursor-not-allowed disabled:opacity-40 rounded-md bg-white ring-1 ring-transparent ring-offset-[4px] ring-offset-white motion-safe:transition-[box-shadow,opacity] motion-safe:duration-200 motion-safe:ease-out aria-pressed:ring-[#141414] lg:w-[75px] lg:flex-none lg:rounded-lg"
                        >
                          {/* Selection is a ring outside the box, so the image never resizes or re-crops.
                              No image → colour fill from the name → the name as text. */}
                          {value.image ? (
                            <img src={value.image} alt="" className="size-full object-cover" />
                          ) : cssColor(option, value.name) ? (
                            <span
                              className="block size-full border border-black/10 [border-radius:inherit]"
                              style={{ backgroundColor: value.name }}
                            />
                          ) : (
                            <span className="flex size-full items-center justify-center border border-[#e6e6e6] text-sm font-semibold capitalize text-[#525252] [border-radius:inherit]">
                              {value.name}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-x-3.5 gap-y-[22px] lg:grid-cols-6">
                      {option.values.map((value) => (
                        <button
                          key={value.id}
                          type="button"
                          aria-pressed={value.name === selected}
                          disabled={reasonOf(option.name, value.name) !== undefined}
                          title={reasonOf(option.name, value.name)}
                          onClick={() => select(option.name, value.name)}
                          className="h-10 rounded-md border border-[#e6e6e6] motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out disabled:cursor-not-allowed disabled:text-[#b8b8b8] disabled:line-through text-xl font-semibold leading-[1.2] text-[#525252] aria-pressed:border-[#333] aria-pressed:bg-[#ebebeb] aria-pressed:text-[#141414] lg:rounded-lg"
                        >
                          {value.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Stock: untracked stores are always orderable, so they read as "In stock" */}
            <p role="status" className="flex items-center gap-2 text-base font-medium leading-[1.2] lg:text-lg">
              <span
                aria-hidden="true"
                className={`size-2 rounded-full ${
                  quantity === 0 ? 'bg-[#d92d20]' : quantity <= LOW_STOCK ? 'bg-[#f79009]' : 'bg-[#12b76a]'
                }`}
              />
              <span className="text-[#292929]">
                {quantity === 0
                  ? stock?.canOrder
                    ? 'Out of stock, available to order'
                    : 'Out of stock'
                  : quantity <= LOW_STOCK
                    ? `Only ${quantity} left`
                    : 'In stock'}
              </span>
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-start gap-[18px] text-lg leading-[1.2] lg:flex-row lg:gap-6 lg:text-xl">
          <button
            type="button"
            disabled={!canAddToCart}
            onClick={addToCart}
            className="w-[296px] rounded-md bg-[#141414] py-[17px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 lg:rounded-lg"
          >
            Add To Cart
          </button>
          <button
            type="button"
            disabled={!canAddToCart}
            onClick={checkoutNow}
            className="rounded-md border border-[#b8b8b8] bg-white px-[35px] py-[17px] font-medium text-[#333] disabled:cursor-not-allowed disabled:opacity-40 lg:h-[58px] lg:w-[200px] lg:rounded-lg lg:px-0"
          >
            Checkout Now
          </button>
        </div>
      </div>

      {/* Not in Figma: placed below the CTA so the designed layout stays intact */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 leading-[1.2]">
          <span className="text-base font-medium text-[#8f8f8f]">Categories:</span>
          <ul className="flex flex-wrap gap-2">
            {categories.map((name) => (
              <li
                key={name}
                className="rounded-md border border-[#e6e6e6] px-3 py-1.5 text-sm font-medium capitalize text-[#525252]"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        className="hidden self-start text-base font-medium leading-[1.2] text-[#7a7a7a] underline lg:block"
      >
        Delivery T&amp;C
      </button>
    </div>
  );
}

export default ProductInfo;
