function AnnouncementBar() {
  return (
    <div className="bg-ink-900 px-5 py-3 text-center font-clash font-medium">
      <p className="mx-auto max-w-[243px] text-left text-sm leading-[1.2] text-white lg:max-w-none lg:text-center">
        New season coming! Discount 10%
        <br className="lg:hidden" /> for all product! Checkout Now!{' '}
        <span className="inline-flex h-4 w-11 items-center justify-center rounded-[23px] bg-[#383838] align-bottom text-[11px] leading-none lg:ml-3 lg:h-[18px] lg:w-[49px] lg:align-middle lg:text-xs">
          20:40
        </span>
      </p>
    </div>
  );
}

export default AnnouncementBar;
