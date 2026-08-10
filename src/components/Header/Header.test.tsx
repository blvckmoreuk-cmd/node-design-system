import { render, screen } from '@testing-library/react';
import { Header } from './Header';

describe('Header', () => {
  it('renders the Node wordmark and all five nav items', () => {
    render(<Header currentPath="/" />);
    expect(screen.getByText('Node')).toBeInTheDocument();
    for (const label of ['About', 'Services', 'Shop', 'Portfolio', 'Contact']) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it('marks the current path active', () => {
    render(<Header currentPath="/services" />);
    const servicesLabel = screen.getByText('Services');
    expect(servicesLabel.className).toContain('text-fg');
    expect(servicesLabel.className).not.toContain('text-fg-faint');

    const aboutLabel = screen.getByText('About');
    expect(aboutLabel.className).toContain('text-fg-faint');
  });

  it('normalizes a trailing slash before comparing', () => {
    render(<Header currentPath="/services/" />);
    expect(screen.getByText('Services').className).toContain('text-fg');
  });
});
