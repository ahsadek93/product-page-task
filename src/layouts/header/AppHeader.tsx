import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useCartCount } from '@/features/cart/hooks/useCartCount';
import { useCartActions } from '@/features/cart/hooks/useCartActions';
import logo from './assets/logo.png';
import searchIcon from './assets/search.svg';
import cartIcon from './assets/cart.svg';
import badge from './assets/badge.svg';
import menuIcon from './assets/menu.svg';
import chevronIcon from '@/shared/assets/chevron.svg';
import userIcon from './assets/user.svg';
import heartIcon from '@/shared/assets/heart.svg';
import divider from './assets/divider.svg';
import dividerDesktop from './assets/divider-desktop.svg';

function AppHeader() {
  const count = useCartCount();
  const { open } = useCartActions();
  const [scrolled, setScrolled] = useState(false);

  // Count changes since mount; 0 = no pop on page load with a restored cart.
  const [shownCount, setShownCount] = useState(count);
  const [bumps, setBumps] = useState(0);
  if (count !== shownCount) {
    setShownCount(count);
    setBumps((b) => b + 1);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    // Border as a 1px shadow so it adds no height when it appears.
    <header
      className={`sticky top-0 z-40 bg-white font-clash font-medium text-[#141414] motion-safe:transition-shadow motion-safe:duration-200 ${
        scrolled ? 'shadow-[0_1px_0_#e6e6e6]' : ''
      }`}
    >
      <div className="mx-auto max-w-[1240px] px-5">
        <div className="flex items-center justify-between py-6 lg:py-8">
          <Link to="/">
            <img
              src={logo}
              alt="John Lewis & Partners"
              className="h-[26px] w-[140px] object-cover lg:h-8 lg:w-[170px]"
            />
          </Link>
          <nav className="flex items-center gap-5 lg:gap-8">
            <button type="button" aria-label="Search" className="-m-2.5 p-2.5">
              <img src={searchIcon} alt="" width={20} height={20} />
            </button>
            <button type="button" className="hidden items-center gap-1 text-base leading-[1.6] lg:flex">
              Categories
              <img src={chevronIcon} alt="" width={20} height={20} className="-scale-y-100" />
            </button>
            <button type="button" className="hidden items-center gap-1 text-base leading-[1.6] lg:flex">
              <img src={userIcon} alt="" width={20} height={20} />
              Sign in
            </button>
            <button type="button" aria-label="Wishlist" className="-m-2.5 hidden p-2.5 lg:block">
              <img src={heartIcon} alt="" width={20} height={20} />
            </button>
            <button
              type="button"
              aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}
              onClick={open}
              className="relative -m-2.5 p-2.5"
            >
              <img src={cartIcon} alt="" width={20} height={20} />
              {count > 0 && (
                <span
                  key={bumps} // remount restarts the animation on every change
                  aria-hidden="true"
                  className={`absolute left-5 top-1.5 size-[13px] ${bumps ? 'motion-safe:animate-[pop_300ms_ease-out]' : ''}`}
                >
                  <img src={badge} alt="" width={13} height={13} />
                  <span className="absolute inset-0 flex items-center justify-center text-[8px] text-white">
                    {count > 9 ? '9+' : count}
                  </span>
                </span>
              )}
            </button>
            <button type="button" aria-label="Menu" className="-m-2.5 p-2.5 lg:hidden">
              <img src={menuIcon} alt="" width={20} height={20} />
            </button>
          </nav>
        </div>

        <img
          src={divider}
          alt=""
          className={`block h-px w-full motion-safe:transition-opacity motion-safe:duration-200 lg:hidden ${scrolled ? 'opacity-0' : ''}`}
        />
        <img
          src={dividerDesktop}
          alt=""
          className={`hidden h-px w-full motion-safe:transition-opacity motion-safe:duration-200 lg:block ${scrolled ? 'opacity-0' : ''}`}
        />
      </div>
    </header>
  );
}

export default AppHeader;
