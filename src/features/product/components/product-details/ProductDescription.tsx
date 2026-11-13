import { useLayoutEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';

// Collapsed height ≈ 8 lines of the 1.3 line-height body text.
const CLIP = 'max-h-[10.4em]';

// ponytail: overflow measured on mount/content change only; add a ResizeObserver if width changes must re-check it
function ProductDescription({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);

  // BE description is merchant HTML: sanitize before injecting
  const clean = DOMPurify.sanitize(html);

  useLayoutEffect(() => {
    const el = ref.current;
    if (el) setOverflows(el.scrollHeight > el.clientHeight + 1);
  }, [clean]);

  const clipped = overflows && !expanded;

  return (
    <div className="flex flex-col items-start gap-2.5">
      <div
        id="product-description"
        ref={ref}
        className={`overflow-hidden text-sm leading-[1.3] text-[#666] lg:text-base [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5 ${
          expanded ? '' : CLIP
        } ${clipped ? '[mask-image:linear-gradient(to_bottom,black_60%,transparent)]' : ''}`}
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
          {expanded ? 'See Less' : 'See More....'}
        </button>
      )}
    </div>
  );
}

export default ProductDescription;
