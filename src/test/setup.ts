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

// jsdom does not implement ResizeObserver — stub it so components that
// observe their container (Visualiser) don't crash. Tests that need real
// resize behavior mock 'three' entirely, so this stub is never asked to do
// anything but exist.
if (!window.ResizeObserver) {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}
