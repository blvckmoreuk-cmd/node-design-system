import '@testing-library/jest-dom/vitest';

// jsdom does not implement matchMedia — stub it so components that check
// prefers-reduced-motion (ReviewsCarousel, ClientMarquee's CSS, etc.) don't crash.
if (!window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as unknown as MediaQueryList;
}
