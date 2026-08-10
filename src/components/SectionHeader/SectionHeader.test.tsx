import { render, screen } from '@testing-library/react';
import { SectionHeader } from './SectionHeader';

describe('SectionHeader', () => {
  it('renders the label and an optional numeral', () => {
    render(<SectionHeader num="01" label="Our Work" />);
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('Our Work')).toBeInTheDocument();
  });

  it('omits the numeral when not given, and renders meta content', () => {
    render(<SectionHeader label="Reviews" meta={<span>4 reviews</span>} />);
    expect(screen.queryByText('01')).not.toBeInTheDocument();
    expect(screen.getByText('4 reviews')).toBeInTheDocument();
  });
});
