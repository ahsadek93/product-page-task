import { useLayoutEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import SwapText from '@/shared/components/swap-text/SwapText';

// ponytail: heights measured on mount/content change only; add a ResizeObserver if width changes must re-check them
function ProductDescription({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [fullHeight, setFullHeight] = useState<number | null>(null); // null = fits, no toggle

  // BE description is merchant HTML: sanitize before injecting
  const clean = DOMPurify.sanitize(html);

  useLayoutEffect(() => {
    const el = ref.current;
    if (el) setFullHeight(el.scrollHeight > el.clientHeight + 1 ? el.scrollHeight : null);
  }, [clean]);

  const overflows = fullHeight !== null;
  const clipped = overflows && !expanded;

  return (
    <div className="relative flex flex-col items-start gap-2.5">
      <div
        id="product-description"
        ref={ref}
        // Collapsed: Figma's 5 lines (mobile) / 4 lines (desktop) of the 1.3 line height.
        // lg:text-base/[1.3], since plain lg:text-base would reset the line height to 24px.
        // max-height can't transition to `none`, so expand to the measured pixel height instead
        style={expanded && overflows ? { maxHeight: fullHeight } : undefined}
        className="max-h-[6.5em] overflow-hidden text-sm leading-[1.3] text-[#666] motion-safe:transition-[max-height] motion-safe:duration-300 motion-safe:ease-out lg:max-h-[5.2em] lg:text-base/[1.3] [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
        dangerouslySetInnerHTML={{ __html: clean }}
      />
      {overflows && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls="product-description"
          onClick={() => setExpanded((e) => !e)}
          // Collapsed: sits on the last visible line, fading out the text under it (page background is white)
          className={`text-sm font-medium text-black lg:text-base ${
            clipped
              ? 'absolute bottom-0 right-0 bg-[linear-gradient(to_right,transparent,white_1.5rem)] pl-8 leading-[1.3] lg:leading-[1.3]'
              : ''
          }`}
        >
          <SwapText text={expanded ? 'See Less' : 'See More....'} />
        </button>
      )}
    </div>
  );
}

export default ProductDescription;
