import { useLayoutEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import SwapText from '@/shared/components/swap-text/SwapText';

// Collapsed height ≈ 8 lines of the 1.3 line-height body text.
const CLIP = '10.4em';

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
    <div className="flex flex-col items-start gap-2.5">
      <div
        id="product-description"
        ref={ref}
        // max-height can't transition to `none`, so expand to the measured pixel height instead
        style={{ maxHeight: expanded && overflows ? fullHeight : CLIP }}
        className={`overflow-hidden text-sm leading-[1.3] text-[#666] motion-safe:transition-[max-height] motion-safe:duration-300 motion-safe:ease-out lg:text-base [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5 ${
          clipped ? '[mask-image:linear-gradient(to_bottom,black_60%,transparent)]' : ''
        }`}
        dangerouslySetInnerHTML={{ __html: clean }}
      />
      {overflows && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls="product-description"
          onClick={() => setExpanded((e) => !e)}
          className="text-sm font-medium text-black lg:text-base"
        >
          <SwapText text={expanded ? 'See Less' : 'See More....'} />
        </button>
      )}
    </div>
  );
}

export default ProductDescription;
