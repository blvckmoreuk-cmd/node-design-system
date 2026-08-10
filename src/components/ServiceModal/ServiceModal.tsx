import { useEffect, useRef } from 'react';
import type { Service } from '../../data/services';

export interface ServiceModalProps {
  service: Service | null;
  onClose: () => void;
}

export function ServiceModal({ service, onClose }: ServiceModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!service) return;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [service, onClose]);

  if (!service) return null;

  const cta = service.shopHref
    ? { href: service.shopHref, label: 'Shop These →' }
    : { href: '/contact', label: 'Book This Service →' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 font-mono" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-base border border-line-strong shadow-[0_20px_60px_rgba(0,0,0,0.7)] max-h-full overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-3 border-b border-line-strong bg-panel">
          <div className="flex items-center gap-3">
            <span className="text-accent font-mono text-xs font-bold">{service.num}</span>
            <span className="text-fg-faint font-mono text-[10px] uppercase tracking-[0.35em]">Service Detail</span>
          </div>
          <button
            ref={closeRef}
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center border border-line-strong text-fg-faint hover:text-accent hover:border-accent transition-colors text-sm leading-none"
          >
            &times;
          </button>
        </div>

        <div className="p-6 md:p-8 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ background: service.hex, boxShadow: `0 0 8px ${service.hex}` }}
            />
            <div>
              <h2 id="modal-title" className="font-display text-2xl font-bold uppercase tracking-tight text-fg leading-none">
                {service.title}
              </h2>
              <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-fg-faint">{service.tagline}</p>
            </div>
          </div>

          <p className="font-body text-sm leading-relaxed text-fg-muted">{service.detail}</p>

          <div className="flex items-end justify-between border-t border-line pt-4">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-fg-faint block">From</span>
              <span className="font-display text-3xl font-bold text-accent leading-none">{service.price}</span>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-fg-faint text-right max-w-[50%]">{service.note}</span>
          </div>

          {service.firstOrderOffer && (
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">50% off your first order.</p>
          )}

          {service.revisions && (
            <div className="flex items-center gap-2.5 border-t border-line pt-4">
              <span className="text-accent leading-none">&#8635;</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-fg-muted">{service.revisions}</span>
            </div>
          )}

          <div className="border-t border-line pt-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-accent block mb-3">
              {service.reqsLabel || 'What to send'}
            </span>
            <ul className={`flex flex-col gap-2.5${service.reqs.length === 0 ? ' mt-0' : ''}`}>
              {service.reqs.map((req, i) => (
                <li key={i} className="flex gap-2.5 font-body text-[12px] leading-snug text-fg-muted">
                  <span className="text-accent shrink-0 mt-px">+</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <a
            href={cta.href}
            className="w-full text-center py-4 bg-accent-dim text-white font-mono font-black text-[12px] uppercase tracking-[0.3em] hover:bg-accent active:translate-y-px transition-all"
          >
            {cta.label}
          </a>
          <a href="/prices" className="w-full text-center font-mono text-[10px] uppercase tracking-[0.25em] text-fg-faint hover:text-accent transition-colors">
            View full price list &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
