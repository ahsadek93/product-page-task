import { useEffect, useRef, useState } from 'react';
import { Transition } from '@headlessui/react';
import { useCart } from '@/features/cart/hooks/useCart';

const DURATION = 4000;

// Shows after every add; hover/focus pauses the auto-dismiss.
function CartToast() {
  const { lastAdded, isOpen, setOpen } = useCart();
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const hideLater = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setVisible(false), DURATION);
  };
  const pause = () => clearTimeout(timer.current);

  useEffect(() => {
    if (!lastAdded) return;
    setVisible(true);
    hideLater();
    return pause;
  }, [lastAdded?.id]);

  // Drawer opening (Checkout Now, View Cart) dismisses it for good, so it doesn't pop back when the drawer closes.
  if (isOpen && visible) setVisible(false);

  const item = lastAdded?.item;
  const options = item ? Object.values(item.options).join(' / ') : '';

  return (
    // Live region stays mounted so screen readers announce each add.
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-4 z-40 flex justify-center font-clash lg:inset-x-auto lg:bottom-6 lg:right-6">
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
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#12b76a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 8.5l3 3 7-7" />
              </svg>
              Added to cart
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
