import { render, screen } from '@testing-library/react';
import { ClientMarquee } from './ClientMarquee';

describe('ClientMarquee', () => {
  it('renders every client name twice for a seamless loop', () => {
    render(<ClientMarquee clients={['UKF', 'Motive']} />);
    expect(screen.getAllByText('UKF')).toHaveLength(2);
    expect(screen.getAllByText('Motive')).toHaveLength(2);
  });

  it('is labelled for assistive tech', () => {
    render(<ClientMarquee clients={['UKF']} />);
    expect(screen.getByLabelText('Clients')).toBeInTheDocument();
  });
});
