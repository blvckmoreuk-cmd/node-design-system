import { render } from '@testing-library/react';
import { Logo } from './Logo';

describe('Logo', () => {
  it('renders the cobalt glow-dot mark at the default 128 size', () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 128 128');
    expect(svg).toHaveAttribute('width', '128');
    expect(svg).toHaveAttribute('height', '128');
    expect(container.querySelectorAll('circle')).toHaveLength(2);
  });

  it('respects a custom size', () => {
    const { container } = render(<Logo size={48} />);
    expect(container.querySelector('svg')).toHaveAttribute('width', '48');
  });
});
