import { useEffect, useRef } from 'react';
import type { Product } from '../../data/types';

export interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const previewFrameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!product) return;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
      if (previewFrameRef.current) previewFrameRef.current.src = ''; // stop playback on close
    };
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 font-mono" role="dialog" aria-modal="true" aria-labelledby="pmodal-title">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-base border border-line-strong shadow-[0_20px_60px_rgba(0,0,0,0.7)] max-h-full overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-3 border-b border-line-strong bg-panel">
          <div className="flex items-center gap-3">
            <span className="text-accent font-mono text-xs font-bold">{product.num}</span>
            <span className="text-fg-faint font-mono text-[10px] uppercase tracking-[0.35em]">Product Detail</span>
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
              style={{ background: product.hex, boxShadow: `0 0 8px ${product.hex}` }}
            />
            <div>
              <h2 id="pmodal-title" className="font-display text-2xl font-bold uppercase tracking-tight text-fg leading-none">
                {product.title}
              </h2>
              <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-fg-faint">{product.tagline}</p>
            </div>
          </div>

          <div className="aspect-[16/10] w-full bg-inset border border-line grain-overlay-dark relative overflow-hidden flex items-center justify-center">
            {product.image ? (
              <img src={product.image} alt={product.title} className="w-full h-full object-contain" />
            ) : (
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-fg-faint/40">Cover art</span>
            )}
          </div>

          {product.preview && (
            <div className="flex flex-col gap-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-accent block">Preview</span>
              <iframe
                ref={previewFrameRef}
                title="Audio preview"
                src={product.preview}
                width="100%"
                height={152}
                style={{ borderRadius: 12 }}
                frameBorder={0}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>
          )}

          <p className="font-body text-sm leading-relaxed text-fg-muted">{product.detail}</p>

          <div className="flex items-end justify-between border-t border-line pt-4">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-fg-faint block">Price</span>
              <span className="font-display text-3xl font-bold text-accent leading-none">{product.price}</span>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-fg-faint text-right max-w-[50%]">{product.note}</span>
          </div>

          <div className="border-t border-line pt-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-accent block mb-3">What's inside</span>
            <ul className="flex flex-col gap-2.5">
              {product.features.map((feature, i) => (
                <li key={i} className="flex gap-2.5 font-body text-[12px] leading-snug text-fg-muted">
                  <span className="text-accent shrink-0 mt-px">+</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-line pt-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-accent block mb-3">Specs</span>
            <ul className="flex flex-col gap-2">
              {product.meta.map((row, i) => (
                <li key={i} className="flex justify-between font-mono text-[11px] uppercase tracking-wide text-fg-muted">
                  <span className="text-fg-faint">{row.label}</span>
                  <span className="font-bold">{row.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            disabled
            className="w-full text-center py-4 bg-raised text-fg-faint font-mono font-black text-[12px] uppercase tracking-[0.3em] cursor-not-allowed"
          >
            Buy &mdash; Coming Soon
          </button>
          <a href="/contact" className="w-full text-center font-mono text-[10px] uppercase tracking-[0.25em] text-fg-faint hover:text-accent transition-colors">
            Questions? Get in touch &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
