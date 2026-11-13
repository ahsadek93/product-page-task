import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useCart } from '@/features/cart/hooks/useCart';
import { formatPrice } from '@/shared/utils/formatPrice';
import dashedLine from '@/shared/assets/dashed-line.svg';
import CartLine from './CartLine';

const Separator = () => <img src={dashedLine} alt="" className="block h-[0.5px] w-full" />;

function CartDrawer() {
  const { items, count, subtotal, isOpen, setOpen, setQuantity, remove } = useCart();
  const close = () => setOpen(false);

  return (
    <Dialog open={isOpen} onClose={close} className="relative z-50 font-clash">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-[#141414]/40 duration-300 ease-out data-[closed]:opacity-0"
      />
      <div className="fixed inset-y-0 right-0 flex w-full max-w-[440px]">
        <DialogPanel
          transition
          className="flex w-full flex-col bg-white duration-300 ease-out data-[closed]:translate-x-full motion-reduce:duration-0"
        >
          <div className="flex items-center justify-between px-6 py-6 lg:px-8">
            <DialogTitle className="text-2xl font-semibold leading-[1.2] text-[#141414]">
              Your Cart {count > 0 && <span className="text-[#8f8f8f]">({count})</span>}
            </DialogTitle>
            <button
              type="button"
              aria-label="Close cart"
              onClick={close}
              className="-m-2 p-2 text-[#525252] hover:text-[#141414]"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M4 4l12 12M16 4L4 16" />
              </svg>
            </button>
          </div>
          <div className="px-6 lg:px-8">
            <Separator />
          </div>

          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center leading-[1.2]">
              <div className="flex flex-col gap-2">
                <p className="text-xl font-semibold text-[#292929]">Your cart is empty</p>
                <p className="text-base font-medium text-[#8f8f8f]">Items you add will show up here.</p>
              </div>
              <button type="button" onClick={close} className="btn-outline px-[35px] text-lg">
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <ul className="flex-1 divide-y divide-dashed divide-[#e6e6e6] overflow-y-auto px-6 lg:px-8">
                {items.map((item) => (
                  <CartLine
                    key={item.variantId}
                    item={item}
                    onQuantity={(q) => setQuantity(item.variantId, q)}
                    onRemove={() => remove(item.variantId)}
                  />
                ))}
              </ul>

              <div className="flex flex-col gap-6 px-6 pb-6 lg:px-8 lg:pb-8">
                <Separator />
                <div className="flex flex-col gap-2 leading-[1.2]">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-[#8f8f8f]">Subtotal</span>
                    <span className="text-xl font-semibold text-[#141414] lg:text-2xl">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="text-sm font-medium text-[#8f8f8f]">Shipping calculated at checkout.</p>
                </div>
                <div className="flex flex-col gap-3 text-lg leading-[1.2]">
                  <button type="button" className="btn-primary w-full">
                    Checkout Now
                  </button>
                  <button type="button" onClick={close} className="btn-outline w-full">
                    Continue Shopping
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default CartDrawer;
