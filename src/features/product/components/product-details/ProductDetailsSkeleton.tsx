// Mirrors ProductDetails' grid, sizes and gaps so nothing shifts when the real content lands.
const bone = 'rounded-md bg-[#f2f2f2] lg:rounded-lg';

function ProductDetailsSkeleton() {
  return (
    <section
      aria-busy="true"
      className="flex flex-col gap-14 motion-safe:animate-pulse lg:flex-row lg:items-start lg:justify-between lg:gap-10"
    >
      <span role="status" className="sr-only">
        Loading product…
      </span>

      {/* Gallery: main image + action column, thumbnails below */}
      <div className="grid grid-cols-[1fr_44px] gap-x-3 gap-y-5 lg:max-w-[545px] lg:flex-1 lg:grid-cols-[minmax(0,458px)_52px] lg:gap-x-[35px] lg:gap-y-6">
        <div className={`aspect-[458/610] ${bone}`} />
        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-5">
            <div className={`size-11 lg:size-[52px] ${bone}`} />
            <div className={`size-11 lg:size-[52px] ${bone}`} />
          </div>
          <div className="flex flex-col gap-4 lg:gap-5">
            <div className={`size-11 lg:size-[52px] ${bone}`} />
            <div className={`size-11 lg:size-[52px] ${bone}`} />
          </div>
        </div>
        <div className="col-span-2 grid grid-cols-5 gap-[14.7px] lg:col-span-1 lg:gap-5">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className={`aspect-[76/100] ${bone}`} />
          ))}
        </div>
      </div>

      {/* Info column */}
      <div className="flex flex-col gap-12 lg:w-[520px] lg:shrink-0 lg:gap-14">
        <div className="flex flex-col gap-6 lg:gap-7">
          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-3.5 lg:gap-5">
              <div className="flex flex-col gap-2 lg:gap-3">
                <div className={`h-4 w-32 lg:h-5 lg:w-40 ${bone}`} />
                <div className={`h-7 w-3/4 lg:h-[43px] ${bone}`} />
              </div>
              <div className="flex items-center justify-between">
                <div className={`h-6 w-36 lg:h-[34px] lg:w-48 ${bone}`} />
                <div className={`h-6 w-28 lg:h-7 lg:w-36 ${bone}`} />
              </div>
            </div>
            <div className="h-px w-full bg-[#f2f2f2]" />
          </div>

          <div className="flex flex-col gap-8 lg:gap-10">
            <div className="flex flex-col gap-2.5">
              <div className={`h-5 w-28 lg:h-6 ${bone}`} />
              <div className={`h-4 w-full ${bone}`} />
              <div className={`h-4 w-full ${bone}`} />
              <div className={`h-4 w-2/3 ${bone}`} />
            </div>

            {/* Color swatches */}
            <div className="flex flex-col gap-[18px]">
              <div className={`h-6 w-32 ${bone}`} />
              <div className="flex gap-3.5">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className={`h-10 flex-1 lg:w-[75px] lg:flex-none ${bone}`} />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="flex flex-col gap-[18px]">
              <div className={`h-6 w-24 ${bone}`} />
              <div className="grid grid-cols-4 gap-x-3.5 gap-y-[22px] lg:grid-cols-6">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className={`h-10 ${bone}`} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col items-start gap-[18px] lg:flex-row lg:gap-6">
          <div className={`h-14 w-[296px] lg:h-[58px] ${bone}`} />
          <div className={`h-14 w-[170px] lg:h-[58px] lg:w-[200px] ${bone}`} />
        </div>
      </div>
    </section>
  );
}

export default ProductDetailsSkeleton;
