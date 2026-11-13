import logo from '@/layouts/header/assets/logo.png';
import divider from '@/layouts/header/assets/divider.svg';
import facebookIcon from './assets/facebook.svg';
import instagramIcon from './assets/instagram.svg';
import twitterIcon from './assets/twitter.svg';
import emailIcon from './assets/email.svg';
import arrowIcon from './assets/arrow.svg';
import underline from './assets/underline.svg';
import flag from './assets/flag.svg';
import chevronDown from './assets/chevron-down.svg';

const SOCIALS = [
  { label: 'Facebook', icon: facebookIcon },
  { label: 'Instagram', icon: instagramIcon },
  { label: 'Twitter', icon: twitterIcon },
  { label: 'Email', icon: emailIcon },
];

const COLUMNS = [
  { title: 'Shop', links: ['My account', 'Login', 'Wishlist', 'Cart'] },
  { title: 'Information', links: ['Shipping Policy', 'Returns & Refunds', 'Cookies Policy', 'Frequently asked'] },
  { title: 'Company', links: ['About us', 'Privacy Policy', 'Terms & Conditions', 'Contact Us'] },
];

function AppFooter() {
  return (
    <footer className="bg-[#f2f2f2] pb-8 pt-[62px] font-clash lg:pt-[72px]">
      <div className="mx-auto max-w-[1240px] px-5">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between md:gap-10">
          <div className="w-[310px]">
            <img src={logo} alt="John Lewis & Partners" loading="lazy" decoding="async" className="h-8 w-[170px] object-cover" />

            <form className="mt-10 w-[298px]" onSubmit={(e) => e.preventDefault()}>
              <div className="flex items-center justify-between">
                <input
                  type="email"
                  aria-label="Email"
                  placeholder="Get latest offers to your inbox"
                  className="w-full min-w-0 border-0 bg-transparent p-0 text-base font-medium leading-[1.6] tracking-[0.16px] text-[#141414] placeholder:text-[#787a7c] focus:ring-0"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="ml-8 shrink-0 rounded-md bg-[#141414] px-4 py-2 lg:rounded-lg"
                >
                  <img src={arrowIcon} alt="" width={20} height={20} className="-rotate-90 -scale-y-100" />
                </button>
              </div>
              <img src={underline} alt="" className="block h-px w-[298px]" />
            </form>

            <div className="mt-6 flex gap-4 lg:mt-5">
              {SOCIALS.map(({ label, icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full bg-white"
                >
                  <img src={icon} alt="" width={18} height={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-[58px] gap-y-[25px] lg:flex lg:gap-[120px]">
            {COLUMNS.map(({ title, links }) => (
              <div key={title} className="flex flex-col gap-4 lg:w-[134px]">
                <h3 className="h-[22px] text-lg font-medium leading-6 text-[#121212] lg:text-sm lg:font-semibold">
                  {title}
                </h3>
                <ul className="flex flex-col gap-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm leading-[22px] text-[#3e3e59] lg:text-[#141414]">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <img src={divider} alt="" className="mt-12 block h-px w-full lg:hidden" />
        <div className="flex flex-col gap-6 pt-9 lg:mt-[72px] lg:flex-row lg:items-start lg:justify-between lg:border-t lg:border-dashed lg:border-[#a3a3a3] lg:pt-6">
          <p className="text-sm leading-[22px] text-[#3e3e59]">© John Lewis plc 2001 - 2024</p>

          <div className="flex gap-4 self-end text-sm font-medium leading-6 text-[#121212] lg:gap-8 lg:self-auto">
            <button type="button" className="flex items-center gap-2">
              <span className="relative h-[14px] w-[18px] overflow-hidden">
                <img src={flag} alt="" className="absolute left-0 top-0 h-[14px] w-[25.65px] max-w-none" />
              </span>
              <span className="flex items-center gap-0.5">
                English
                <img src={chevronDown} alt="" width={18} height={18} />
              </span>
            </button>
            <button type="button" className="flex items-center gap-0.5">
              USD
              <img src={chevronDown} alt="" width={18} height={18} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default AppFooter;
