import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PromoBar } from './PromoBar';

describe('PromoBar', () => {
  beforeEach(() => window.localStorage.clear());

  it('renders the offer when not previously dismissed', () => {
    render(<PromoBar />);
    expect(screen.getByText('50% OFF your first order')).toBeInTheDocument();
  });

  it('does not render when previously dismissed', () => {
    window.localStorage.setItem('promo-firstorder-dismissed', '1');
    const { container } = render(<PromoBar />);
    expect(container).toBeEmptyDOMElement();
  });

  it('dismisses and persists on close', async () => {
    render(<PromoBar />);
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss offer' }));
    expect(screen.queryByText('50% OFF your first order')).not.toBeInTheDocument();
    expect(window.localStorage.getItem('promo-firstorder-dismissed')).toBe('1');
  });
});
