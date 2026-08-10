import { useEffect, useState } from 'react';

const STORAGE_KEY = 'promo-firstorder-dismissed';

export function PromoBar() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      setDismissed(window.localStorage.getItem(STORAGE_KEY) === '1');
    } catch {
      setDismissed(false);
    }
  }, []);

  if (dismissed) return null;

  const close = () => {
    setDismissed(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* storage blocked */
    }
  };

  return (
    <div className="border-b border-line-strong bg-panel">
      <div className="relative max-w-4xl mx-auto flex items-center justify-center gap-3 px-4 py-2 font-mono">
        <a href="/contact" className="group flex items-center gap-2 no-underline text-center px-8">
          <span className="text-accent text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em]">
            50% OFF your first order
          </span>
          <span className="hidden sm:inline text-fg-muted text-[10px] uppercase tracking-[0.15em]">
            &mdash; half-price Mastering &amp; Mixing for new clients
          </span>
          <span className="text-fg-faint group-hover:text-accent transition-colors text-[11px]">&rarr;</span>
        </a>
        <button
          type="button"
          aria-label="Dismiss offer"
          onClick={close}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-fg-faint hover:text-accent focus-visible:text-accent focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent transition-colors text-sm leading-none"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
