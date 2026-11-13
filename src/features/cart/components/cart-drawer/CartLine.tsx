import type { CartItem } from '@/features/cart/types/cart';
import { formatPrice } from '@/shared/utils/formatPrice';

type CartLineProps = {
  item: CartItem;
  onQuantity: (quantity: number) => void;
  onRemove: () => void;
};

const stepper =
  'flex size-9 items-center justify-center text-lg focus-visible:-outline-offset-2 text-ink-600 motion-safe:transition-colors motion-safe:duration-200 hover:bg-surface-selected hover:text-ink-900 disabled:cursor-not-allowed disabled:text-ink-200 disabled:hover:bg-transparent';

function CartLine({ item, onQuantity, onRemove }: CartLineProps) {
  return (
    <li className="flex gap-4 py-6">
      <img src={item.image} alt="" className="size-24 shrink-0 rounded-lg bg-surface object-cover" />

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 leading-[1.2]">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-start justify-between gap-3">
            <p className="text-base font-semibold text-ink-800">{item.name}</p>
            <p className="shrink-0 text-base font-semibold text-ink-900">{formatPrice(item.price * item.quantity)}</p>
          </div>
          {Object.entries(item.options).map(([name, value]) => (
            <p key={name} className="text-sm font-medium capitalize text-ink-300">
              {name}: <span className="text-ink-800">{value}</span>
            </p>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center overflow-hidden rounded-md border border-line">
            <button
              type="button"
              aria-label={`Decrease ${item.name} quantity`}
              onClick={() => onQuantity(item.quantity - 1)}
              className={stepper}
            >
              −
            </button>
            <span aria-live="polite" className="w-8 text-center text-base font-semibold text-ink-900">
              {item.quantity}
            </span>
            <button
              type="button"
              aria-label={`Increase ${item.name} quantity`}
              disabled={item.quantity >= (item.maxQuantity ?? Infinity)}
              onClick={() => onQuantity(item.quantity + 1)}
              className={stepper}
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="text-sm font-medium text-ink-400 underline hover:text-ink-900"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}

export default CartLine;
