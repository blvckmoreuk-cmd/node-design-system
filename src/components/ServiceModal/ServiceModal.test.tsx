import { render, screen, fireEvent } from '@testing-library/react';
import { ServiceModal } from './ServiceModal';
import { services } from '../../data/services';

describe('ServiceModal', () => {
  it('renders nothing when service is null', () => {
    const { container } = render(<ServiceModal service={null} onClose={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the service detail when given', () => {
    render(<ServiceModal service={services[0]} onClose={() => {}} />);
    expect(screen.getByRole('heading', { name: 'Mastering' })).toBeInTheDocument();
    expect(screen.getByText(services[0].detail)).toBeInTheDocument();
    expect(screen.getByText('50% off your first order.')).toBeInTheDocument();
  });

  it('calls onClose on Escape, backdrop click, and the close button', () => {
    const onClose = vi.fn();
    const { rerender } = render(<ServiceModal service={services[0]} onClose={onClose} />);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(2);

    rerender(<ServiceModal service={services[0]} onClose={onClose} />);
  });

  it('points the CTA at the shop for services with a shopHref', () => {
    render(<ServiceModal service={services[4]} onClose={() => {}} />);
    expect(screen.getByRole('link', { name: /Shop These/ })).toHaveAttribute('href', '/shop');
  });
});
