import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SuccessPopup } from './SuccessPopup';

describe('SuccessPopup', () => {
  afterEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('does not render when the query param is absent', () => {
    window.history.replaceState(null, '', '/contact');
    const { container } = render(<SuccessPopup />);
    expect(container).toBeEmptyDOMElement();
  });

  it('opens and strips the query param when ?success=true is present', () => {
    window.history.replaceState(null, '', '/contact?success=true');
    render(<SuccessPopup />);
    expect(screen.getByText('Message Sent')).toBeInTheDocument();
    expect(window.location.search).toBe('');
  });

  it('closes when Done is clicked', async () => {
    window.history.replaceState(null, '', '/contact?success=true');
    render(<SuccessPopup />);
    await userEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(screen.queryByText('Message Sent')).not.toBeInTheDocument();
  });
});
