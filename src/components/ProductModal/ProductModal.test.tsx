import { render, screen, fireEvent } from '@testing-library/react';
import { ProductModal } from './ProductModal';
import type { Product } from '../../data/types';

const product: Product = {
  num: '01',
  title: 'Nodegen',
  tagline: 'Chord Generator / Stab Sequencer',
  detail: 'A VST for fast chord and stab sketching.',
  price: '£15',
  note: 'one-time purchase',
  hex: '#2f6fed',
  features: ['128 presets', 'MIDI export'],
  meta: [{ label: 'Format', value: 'VST3 / AU' }],
};

describe('ProductModal', () => {
  it('renders nothing when product is null', () => {
    const { container } = render(<ProductModal product={null} onClose={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders product details, features, and specs', () => {
    render(<ProductModal product={product} onClose={() => {}} />);
    expect(screen.getByRole('heading', { name: 'Nodegen' })).toBeInTheDocument();
    expect(screen.getByText('128 presets')).toBeInTheDocument();
    expect(screen.getByText('Format')).toBeInTheDocument();
    expect(screen.getByText('VST3 / AU')).toBeInTheDocument();
  });

  it('shows the cover-art placeholder when no image is given, and the buy button is disabled', () => {
    render(<ProductModal product={product} onClose={() => {}} />);
    expect(screen.getByText('Cover art')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Buy/ })).toBeDisabled();
  });

  it('calls onClose on Escape and the close button', () => {
    const onClose = vi.fn();
    render(<ProductModal product={product} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
