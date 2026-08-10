import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const css = readFileSync(join(import.meta.dirname, 'tokens.css'), 'utf-8');

describe('design tokens', () => {
  it('defines the exact surface, text, and accent colours from the source site', () => {
    expect(css).toContain('--color-page: #0c0e11;');
    expect(css).toContain('--color-base: #171a20;');
    expect(css).toContain('--color-panel: #1b1f26;');
    expect(css).toContain('--color-inset: #121519;');
    expect(css).toContain('--color-raised: #23272f;');
    expect(css).toContain('--color-tint: #191d23;');
    expect(css).toContain('--color-line: #21262e;');
    expect(css).toContain('--color-line-strong: #333a44;');
    expect(css).toContain('--color-fg: #ffffff;');
    expect(css).toContain('--color-fg-muted: #e0e3e8;');
    expect(css).toContain('--color-fg-faint: #7d8794;');
    expect(css).toContain('--color-accent: #2f6fed;');
    expect(css).toContain('--color-accent-bright: #5a8ff5;');
    expect(css).toContain('--color-accent-dim: #0d47a1;');
  });

  it('defines the type-role and spacing/radius tokens', () => {
    expect(css).toContain('--radius-control: 4px;');
    expect(css).toContain('--radius-panel: 8px;');
    expect(css).toContain('--spacing-card: 16px;');
    expect(css).toContain('--spacing-section: 32px;');
    expect(css).toContain('--spacing-gap: 64px;');
    expect(css).toMatch(/--font-display:.*Space Grotesk/);
    expect(css).toMatch(/--font-mono:.*JetBrains Mono/);
    expect(css).toMatch(/--font-body:.*Inter/);
  });
});
