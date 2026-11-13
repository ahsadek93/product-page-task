import { useState } from 'react';

// Crossfades text changes: old and new share one grid cell, old fades out while new fades in,
// so there's never a frame with no text (the flicker a plain remount-fade has).
function SwapText({ text }: { text: string }) {
  const [current, setCurrent] = useState(text);
  const [previous, setPrevious] = useState<string | null>(null);

  // Adjust state during render when the prop changes (React's recommended alternative to an effect).
  if (text !== current) {
    setPrevious(current);
    setCurrent(text);
  }

  return (
    <span className="inline-grid">
      {previous !== null && (
        <span
          key={`out-${previous}`}
          aria-hidden="true"
          onAnimationEnd={() => setPrevious(null)}
          // reduced motion: no animation runs, so hide it instead of waiting for animationend
          className="[grid-area:1/1] motion-safe:animate-[fade-out_200ms_ease-out_forwards] motion-reduce:hidden"
        >
          {previous}
        </span>
      )}
      <span key={current} className="[grid-area:1/1] motion-safe:animate-[fade-in_200ms_ease-out]">
        {current}
      </span>
    </span>
  );
}

export default SwapText;
