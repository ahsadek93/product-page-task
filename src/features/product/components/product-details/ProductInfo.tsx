import type { Product } from '@/features/product/types/product';
import type { VariantSelection } from '@/features/product/hooks/useVariantSelection';
import type { AddToCart } from '@/features/product/hooks/useAddToCart';
import { formatPrice } from '@/shared/utils/formatPrice';
import ProductOptions from './ProductOptions';
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

function ProductInfo({
  product,
  selection: { selection, select, unavailableReason, stock, price, salePrice },
  cart: { canAddToCart, addToCart, checkoutNow },
}: ProductInfoProps) {
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
                  <p className="text-[13px] font-medium capitalize tracking-[0.01em] text-ink-300 lg:text-base">
                    {categories[0]}
                  </p>
                )}
                <h1 className="text-[23px] font-semibold tracking-[-0.005em] text-ink-800 lg:text-4xl">
                  {product.name}
                </h1>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <div className="flex items-center gap-4 whitespace-nowrap leading-[1.2]">
                  {salePrice !== null && (
                    <s className="text-sm font-medium text-ink-500 lg:text-lg">
                      <span className="sr-only">Was </span>
                      {formatPrice(price)}
                    </s>
                  )}
                  <span className="text-xl font-semibold text-ink-900 lg:text-[28px]">
                    {salePrice !== null && <span className="sr-only">Now </span>}
                    {formatPrice(salePrice ?? price)}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-1 whitespace-nowrap leading-none lg:gap-2">
                  <span className="text-base text-ink-500 lg:text-xl">1,238 Sold</span>
                  <img src={dotIcon} alt="" width={6} height={6} />
                  <span className="flex items-center gap-1">
                    <span className="flex size-5 items-center justify-center lg:size-6">
                      <img src={starIcon} alt="" width={18.6738} height={17.8586} className="h-auto w-[78%]" />
                    </span>
                    <span className="text-xl font-semibold text-ink-900 lg:text-2xl">
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
              <h2 className="font-raleway text-lg font-bold leading-[1.2] text-ink-800 lg:text-xl">Description:</h2>
              <ProductDescription html={product.descriptionHtml} />
            </div>

            <ProductOptions
              options={product.options}
              selection={selection}
              select={select}
              unavailableReason={unavailableReason}
            />

            {/* Stock: untracked stores are always orderable, so they read as "In stock" */}
            <p role="status" className="flex items-center gap-2 text-base font-medium leading-[1.2] lg:text-lg">
              <span
                aria-hidden="true"
                className={`size-2 rounded-full ${
                  quantity === 0 ? 'bg-danger' : quantity <= LOW_STOCK ? 'bg-warning' : 'bg-success'
                }`}
              />
              <span className="text-ink-800">
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
          <button type="button" disabled={!canAddToCart} onClick={addToCart} className="btn-primary w-[296px]">
            Add To Cart
          </button>
          <button
            type="button"
            disabled={!canAddToCart}
            onClick={checkoutNow}
            className="btn-outline px-[35px] lg:h-[58px] lg:w-[200px] lg:px-0"
          >
            Checkout Now
          </button>
        </div>
      </div>

      <button
        type="button"
        className="hidden self-start text-base font-medium leading-[1.2] text-ink-400 underline lg:block"
      >
        Delivery T&amp;C
      </button>

      {/* Not in Figma: placed last so the designed layout (Delivery T&C under the CTA) stays intact */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 leading-[1.2]">
          <span className="text-base font-medium text-ink-300">Categories:</span>
          <ul className="flex flex-wrap gap-2">
            {categories.map((name) => (
              <li
                key={name}
                className="rounded-md border border-line px-3 py-1.5 text-sm font-medium capitalize text-ink-600"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ProductInfo;
