import dotIcon from './assets/dot.svg';
import starIcon from './assets/star.svg';
import dashedLine from './assets/dashed-line.svg';

// ponytail: static Figma content and fixed selections, become props when product data is wired in
const colors = [
  { name: 'Royal Brown', hex: '#534029' },
  { name: 'Light Grey', hex: '#ebebeb' },
  { name: 'Blue', hex: '#3a6a90' },
  { name: 'Black', hex: '#11171d' },
];
const sizes = ['6', '8', '10', '14', '18', '20'];
const selectedColor = 'Royal Brown';
const selectedSize = '8';

function ProductInfo() {
  return (
    <div className="flex flex-col gap-[38px] font-clash lg:w-[520px] lg:shrink-0">
      <div className="flex flex-col gap-12 lg:gap-14">
        <div className="flex flex-col gap-6 lg:gap-7">
          {/* Heading, price, rating */}
          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-3.5 lg:gap-5">
              <div className="flex flex-col gap-2 leading-[1.2] lg:gap-3">
                <p className="text-[13px] font-medium tracking-[0.01em] text-[#8f8f8f] lg:text-base">John Lewis ANYDAY</p>
                <h1 className="text-[23px] font-semibold tracking-[-0.005em] text-[#292929] lg:text-4xl">
                  Long Sleeve Overshirt, Khaki, 6
                </h1>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 leading-[1.2]">
                  <s className="text-sm font-medium text-[#666] lg:text-lg">£40.00</s>
                  <span className="text-xl font-semibold text-[#141414] lg:text-[28px]">£28.00</span>
                </div>
                <div className="flex items-center gap-1 leading-none lg:gap-2">
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
              <p className="text-sm leading-[1.3] text-[#666] lg:text-base">
                Boba etiam ut bulla tea est potus dilectus singulari compositione saporum et textuum, quae in Taiwan
                annis 1980 orta sunt. Boba refert ad pilas masticas tapiocas in fundo potus inventas, quae typice
                lacte tea nigro sapiuntur. Boba phaenomenon.{' '}
                <button type="button" className="font-medium text-black">
                  See More....
                </button>
              </p>
            </div>

            <div className="flex flex-col gap-[18px]">
              <p className="text-lg font-medium leading-[1.2] text-[#8f8f8f] lg:text-xl">
                Color: <span className="font-semibold text-[#292929]">{selectedColor}</span>
              </p>
              <div className="flex gap-3.5">
                {colors.map((color) =>
                  color.name === selectedColor ? (
                    <button
                      key={color.name}
                      type="button"
                      aria-label={color.name}
                      aria-pressed="true"
                      className="h-10 flex-1 rounded-md border border-[#141414] bg-white p-[5px] lg:w-[75px] lg:flex-none lg:rounded-lg"
                    >
                      <span className="block size-full rounded" style={{ backgroundColor: color.hex }} />
                    </button>
                  ) : (
                    <button
                      key={color.name}
                      type="button"
                      aria-label={color.name}
                      aria-pressed="false"
                      className="h-10 flex-1 rounded-md lg:w-[75px] lg:flex-none lg:rounded-lg"
                      style={{ backgroundColor: color.hex }}
                    />
                  ),
                )}
              </div>
            </div>

            <div className="flex flex-col gap-[18px]">
              <div className="flex items-center justify-between leading-[1.2]">
                <p className="text-xl font-medium text-[#8f8f8f]">
                  Size: <span className="font-semibold text-[#292929]">{selectedSize}</span>
                </p>
                <button type="button" className="text-base font-medium text-[#525252] underline">
                  View Size Chart
                </button>
              </div>
              <div className="grid grid-cols-4 gap-x-3.5 gap-y-[22px] lg:grid-cols-6">
                {sizes.map((size) => {
                  const selected = size === selectedSize;
                  return (
                    <button
                      key={size}
                      type="button"
                      aria-pressed={selected}
                      className={`h-10 rounded-md border text-xl font-semibold leading-[1.2] lg:rounded-lg ${
                        selected ? 'border-[#333] bg-[#ebebeb] text-[#141414]' : 'border-[#e6e6e6] text-[#525252]'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-start gap-[18px] text-lg leading-[1.2] lg:flex-row lg:gap-6 lg:text-xl">
          <button
            type="button"
            className="w-[296px] rounded-md bg-[#141414] py-[17px] font-semibold text-white lg:rounded-lg"
          >
            Add To Cart
          </button>
          <button
            type="button"
            className="rounded-md border border-[#b8b8b8] bg-white px-[35px] py-[17px] font-medium text-[#333] lg:h-[58px] lg:w-[200px] lg:rounded-lg lg:px-0"
          >
            Checkout Now
          </button>
        </div>
      </div>

      <button type="button" className="hidden self-start text-base font-medium leading-[1.2] text-[#7a7a7a] underline lg:block">
        Delivery T&amp;C
      </button>
    </div>
  );
}

export default ProductInfo;
