import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ServiceCard } from './ServiceCard';
import { services } from '../../data/services';

describe('ServiceCard', () => {
  it('renders the service title, price, and tagline', () => {
    render(<ServiceCard service={services[0]} onOpen={() => {}} />);
    expect(screen.getByText('Mastering')).toBeInTheDocument();
    expect(screen.getByText('£30')).toBeInTheDocument();
    expect(screen.getByText('Loudness / Translation')).toBeInTheDocument();
  });

  it('shows the first-order offer badge only when set', () => {
    render(<ServiceCard service={services[0]} onOpen={() => {}} />);
    expect(screen.getByText('50% OFF 1ST ORDER')).toBeInTheDocument();

    render(<ServiceCard service={services[2]} onOpen={() => {}} />);
    expect(screen.queryAllByText('50% OFF 1ST ORDER')).toHaveLength(1); // still just the first render's
  });

  it('calls onOpen with the service when clicked', async () => {
    const onOpen = vi.fn();
    render(<ServiceCard service={services[0]} onOpen={onOpen} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onOpen).toHaveBeenCalledWith(services[0]);
  });
});
