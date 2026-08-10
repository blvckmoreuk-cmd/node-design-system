import { render, screen } from '@testing-library/react';
import { SectionFrame } from './SectionFrame';

describe('SectionFrame', () => {
  it('renders children inside the default max-w-4xl frame', () => {
    render(<SectionFrame><p>content</p></SectionFrame>);
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('accepts a custom max-width class', () => {
    const { container } = render(<SectionFrame max="max-w-5xl"><p>x</p></SectionFrame>);
    expect(container.firstChild).toHaveClass('max-w-5xl');
    expect(container.firstChild).not.toHaveClass('max-w-4xl');
  });
});
