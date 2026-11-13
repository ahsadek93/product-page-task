import type { ProductOption } from '@/features/product/types/product';
import type { VariantSelection } from '@/features/product/hooks/useVariantSelection';
import SwapText from '@/shared/components/swap-text/SwapText';

type ProductOptionsProps = Pick<VariantSelection, 'selection' | 'select' | 'unavailableReason'> & {
  options: ProductOption[];
};

// A "color" option without images: use the value's name as a CSS colour when the browser knows it ("brown" yes, "biege" no).
const cssColor = (option: { name: string }, value: string) =>
  option.name.toLowerCase() === 'color' && CSS.supports('color', value) ? value : undefined;

const UNAVAILABLE = { 'sold-out': 'Sold out', missing: 'Not available' } as const;

function ProductOptions({ options, selection, select, unavailableReason }: ProductOptionsProps) {
  // Native tooltip on disabled options says why; undefined = selectable, no tooltip.
  const reasonOf = (name: string, value: string) => {
    const reason = unavailableReason(name, value);
    return reason ? UNAVAILABLE[reason] : undefined;
  };

  return (
    <>
      {options.map((option) => {
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
              <div role="group" aria-label={option.name} className="flex gap-3.5">
                {option.values.map((value) => {
                  const reason = reasonOf(option.name, value.name);
                  return (
                    <button
                      key={value.id}
                      type="button"
                      aria-label={reason ? `${value.name}, ${reason}` : value.name}
                      aria-pressed={value.name === selected}
                      disabled={reason !== undefined}
                      title={reason}
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
                  );
                })}
              </div>
            ) : (
              <div
                role="group"
                aria-label={option.name}
                className="grid grid-cols-4 gap-x-3.5 gap-y-[22px] lg:grid-cols-6"
              >
                {option.values.map((value) => {
                  const reason = reasonOf(option.name, value.name);
                  return (
                    <button
                      key={value.id}
                      type="button"
                      aria-label={reason ? `${value.name}, ${reason}` : undefined}
                      aria-pressed={value.name === selected}
                      disabled={reason !== undefined}
                      title={reason}
                      onClick={() => select(option.name, value.name)}
                      className="h-10 rounded-md border border-[#e6e6e6] motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out disabled:cursor-not-allowed disabled:text-[#b8b8b8] disabled:line-through text-xl font-semibold leading-[1.2] text-[#525252] aria-pressed:border-[#333] aria-pressed:bg-[#ebebeb] aria-pressed:text-[#141414] lg:rounded-lg"
                    >
                      {value.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

export default ProductOptions;
