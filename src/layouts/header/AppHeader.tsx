import { Link } from 'react-router';
import logo from './assets/logo.png';
import searchIcon from './assets/search.svg';
import cartIcon from './assets/cart.svg';
import badge from './assets/badge.svg';
import menuIcon from './assets/menu.svg';
import chevronIcon from './assets/chevron.svg';
import userIcon from './assets/user.svg';
import heartIcon from './assets/heart.svg';
import divider from './assets/divider.svg';
import dividerDesktop from './assets/divider-desktop.svg';

function AppHeader() {
  return (
    <header className="font-clash font-medium text-[#141414]">
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
            <button type="button" aria-label="Search">
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
            <button type="button" aria-label="Wishlist" className="hidden lg:block">
              <img src={heartIcon} alt="" width={20} height={20} />
            </button>
            <button type="button" aria-label="Cart" className="relative">
              <img src={cartIcon} alt="" width={20} height={20} />
              <span className="absolute -top-1 left-2.5 size-[13px]">
                <img src={badge} alt="" width={13} height={13} />
                <span className="absolute inset-0 flex items-center justify-center text-[8px] text-white">1</span>
              </span>
            </button>
            <button type="button" aria-label="Menu" className="lg:hidden">
              <img src={menuIcon} alt="" width={20} height={20} />
            </button>
          </nav>
        </div>

        <img src={divider} alt="" className="block h-px w-full lg:hidden" />
        <img src={dividerDesktop} alt="" className="hidden h-px w-full lg:block" />
      </div>
    </header>
  );
}

export default AppHeader;
