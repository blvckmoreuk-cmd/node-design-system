import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const css = readFileSync(join(import.meta.dirname, 'textures.css'), 'utf-8');

describe('shared textures', () => {
  it('defines the marquee track and its keyframes', () => {
    expect(css).toContain('.marquee-track');
    expect(css).toContain('@keyframes marquee');
  });

  it('defines the grain overlays and knob knurl texture', () => {
    expect(css).toContain('.grain-overlay');
    expect(css).toContain('.page-grain');
    expect(css).toContain('.grain-overlay-dark');
    expect(css).toContain('.knob-knurl');
    expect(css).toContain('.brushed-metal');
  });
});
