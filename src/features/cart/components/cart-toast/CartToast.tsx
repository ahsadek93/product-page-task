import { useEffect, useRef, useState } from 'react';
import { Transition } from '@headlessui/react';
import { useCartToast } from '@/features/cart/hooks/useCartToast';

const DURATION = 4000;

// Shows after every add; hover/focus pauses the auto-dismiss.
function CartToast() {
  const { lastAdded, isOpen, setOpen } = useCartToast();
  const [visible, setVisible] = useState(false);
  const [shownId, setShownId] = useState(lastAdded?.id);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const hideLater = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setVisible(false), DURATION);
  };
  const pause = () => clearTimeout(timer.current);

  // A new add (new id) shows the toast — adjusted during render, not in an effect.
  if (lastAdded && lastAdded.id !== shownId) {
    setShownId(lastAdded.id);
    setVisible(true);
  }

  // Each shown toast gets a fresh auto-dismiss timer.
  useEffect(() => {
    if (!visible) return;
    timer.current = setTimeout(() => setVisible(false), DURATION);
    return () => clearTimeout(timer.current);
  }, [visible, shownId]);

  // Drawer opening (Checkout Now, View Cart) dismisses it for good, so it doesn't pop back when the drawer closes.
  if (isOpen && visible) setVisible(false);

  const item = lastAdded?.item;
  // Nothing went in: the line was already at its stock cap, so say that instead of "Added".
  const capped = lastAdded?.added === 0;
  const options = item ? Object.values(item.options).join(' / ') : '';

  return (
    // Live region stays mounted so screen readers announce each add.
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-40 flex justify-center font-clash lg:inset-x-auto lg:bottom-6 lg:right-6"
    >
      <Transition show={visible && !!item}>
        <div
          onMouseEnter={pause}
          onMouseLeave={hideLater}
          onFocus={pause}
          onBlur={hideLater}
          className="pointer-events-auto flex w-full max-w-[400px] items-center gap-3.5 rounded-lg bg-[#141414] p-3 pr-4 text-white shadow-[0_8px_24px_rgba(20,20,20,0.18)] transition duration-300 ease-out data-[closed]:translate-y-3 data-[closed]:opacity-0 motion-reduce:transition-none lg:w-[380px]"
        >
          <img src={item?.image} alt="" className="size-12 shrink-0 rounded-md bg-[#2a2a2a] object-cover" />
          <div className="flex min-w-0 flex-1 flex-col gap-1 leading-[1.2]">
            <p className="flex items-center gap-1.5 text-base font-semibold">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke={capped ? '#f79009' : '#12b76a'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {capped ? <path d="M8 3.5v5.5M8 12.5v.01" /> : <path d="M3 8.5l3 3 7-7" />}
              </svg>
              {capped ? `Only ${item?.maxQuantity} available, all in your cart` : 'Added to cart'}
            </p>
            <p className="truncate text-sm font-medium capitalize text-[#b8b8b8]">
              {item?.name}
              {options && ` · ${options}`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="shrink-0 text-sm font-medium underline underline-offset-2 hover:text-[#b8b8b8]"
          >
            View Cart
          </button>
        </div>
      </Transition>
    </div>
  );
}

export default CartToast;
