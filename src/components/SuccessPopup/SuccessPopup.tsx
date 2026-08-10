import { useEffect, useState } from 'react';

export interface SuccessPopupProps {
  queryParam?: string;
  title?: string;
  message?: string;
}

export function SuccessPopup({
  queryParam = 'success',
  title = 'Message Sent',
  message = "Thanks for reaching out. I'll reply same-day — check your inbox (and spam) for a response.",
}: SuccessPopupProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get(queryParam) !== 'true') return;
    url.searchParams.delete(queryParam);
    window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    setOpen(true);
  }, [queryParam]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-8 font-mono" role="dialog" aria-modal="true" aria-labelledby="success-title">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative z-10 w-full max-w-sm bg-base border border-line-strong shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
        <div className="flex items-center justify-between px-5 py-3 border-b border-line-strong bg-panel">
          <span className="text-fg-faint font-mono text-[10px] uppercase tracking-[0.35em]">Node // Enquiry</span>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="w-7 h-7 flex items-center justify-center border border-line-strong text-fg-faint hover:text-accent hover:border-accent transition-colors text-sm leading-none"
          >
            &times;
          </button>
        </div>
        <div className="p-6 md:p-8 flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 flex items-center justify-center rounded-full border border-accent text-accent text-2xl shadow-[0_0_18px_rgba(47,111,237,0.5)]">
            &check;
          </div>
          <div>
            <h2 id="success-title" className="font-display text-2xl font-bold uppercase tracking-tight text-fg leading-none">
              {title}
            </h2>
            <p className="mt-2.5 font-body text-sm leading-relaxed text-fg-muted">{message}</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full py-3.5 bg-accent-dim text-white font-mono font-black text-[12px] uppercase tracking-[0.3em] hover:bg-accent active:translate-y-px transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
