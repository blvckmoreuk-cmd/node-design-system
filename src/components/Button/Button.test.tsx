import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders as a link with the primary classes by default', () => {
    render(<Button href="/contact">Start a Project</Button>);
    const link = screen.getByRole('link', { name: 'Start a Project' });
    expect(link).toHaveAttribute('href', '/contact');
    expect(link.className).toContain('bg-accent-dim');
  });

  it('renders the secondary variant', () => {
    render(<Button href="/prices" variant="secondary">Rates</Button>);
    expect(screen.getByRole('link', { name: 'Rates' }).className).toContain('bg-panel');
  });

  it('renders as a button and fires onClick when no href is given', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Do it</Button>);
    const button = screen.getByRole('button', { name: 'Do it' });
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });
});
