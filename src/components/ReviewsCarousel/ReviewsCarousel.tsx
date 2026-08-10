import { useEffect, useState } from 'react';
import type { Testimonial } from '../../data/testimonials';
import { SectionHeader } from '../SectionHeader/SectionHeader';

export interface ReviewsCarouselProps {
  testimonials: Testimonial[];
}

const AUTOPLAY_MS = 6000;

export function ReviewsCarousel({ testimonials }: ReviewsCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = testimonials.length;

  useEffect(() => {
    if (n < 2 || paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % n), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [n, paused]);

  if (n === 0) return null;

  const go = (i: number) => setIndex(((i % n) + n) % n);

  return (
    <section
      className="reviews-carousel border-b border-line-strong"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <SectionHeader
        label="Reviews / What Clients Say"
        meta={<span className="text-fg-faint font-mono text-[9px] uppercase tracking-[0.2em]">{n} reviews</span>}
      />
      <div className="relative">
        <div className="overflow-hidden">
          <div
            data-testid="reviews-track"
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {testimonials.map((t, i) => (
              <figure key={i} className="w-full shrink-0 px-10 md:px-20 py-6 md:py-7 flex flex-col items-center text-center gap-3">
                <div className="flex gap-0.5 text-[11px]" aria-label={`${t.rating} out of 5`}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <span key={s} className={s < t.rating ? 'text-accent' : 'text-fg-faint/40'}>&#9733;</span>
                  ))}
                </div>
                <blockquote className={`font-body text-fg leading-relaxed max-w-xl ${t.quote.length > 200 ? 'text-xs md:text-sm' : 'text-sm md:text-[1rem]'}`}>
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="font-mono text-[9px] uppercase tracking-[0.25em] text-fg-faint">
                  {t.author} <span className="text-accent">&middot; via {t.source}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <button
          type="button"
          aria-label="Previous review"
          onClick={() => go(index - 1)}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center border border-line-strong bg-base/70 backdrop-blur-sm text-fg-faint hover:text-accent hover:border-accent transition-colors outline-none focus-visible:ring-1 focus-visible:ring-accent"
        >
          &#8249;
        </button>
        <button
          type="button"
          aria-label="Next review"
          onClick={() => go(index + 1)}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center border border-line-strong bg-base/70 backdrop-blur-sm text-fg-faint hover:text-accent hover:border-accent transition-colors outline-none focus-visible:ring-1 focus-visible:ring-accent"
        >
          &#8250;
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 pb-3.5 border-t border-line pt-3">
        {testimonials.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to review ${i + 1}`}
            onClick={() => go(i)}
            className={`w-2 h-2 rounded-full border transition-colors outline-none focus-visible:ring-1 focus-visible:ring-accent ${
              i === index ? 'bg-accent border-accent' : 'border-line-strong'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
