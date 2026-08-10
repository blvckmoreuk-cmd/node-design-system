import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReviewsCarousel } from './ReviewsCarousel';
import type { Testimonial } from '../../data/testimonials';

const testimonials: Testimonial[] = [
  { quote: 'Great work.', author: 'A', source: 'Direct', rating: 5 },
  { quote: 'Loved it.', author: 'B', source: 'Fiverr', rating: 4 },
  { quote: 'Solid mix.', author: 'C', source: 'Direct', rating: 5 },
];

describe('ReviewsCarousel', () => {
  it('renders the review count and all quotes', () => {
    render(<ReviewsCarousel testimonials={testimonials} />);
    expect(screen.getByText('3 reviews')).toBeInTheDocument();
    expect(screen.getByText('“Great work.”')).toBeInTheDocument();
  });

  it('advances the track when a dot is clicked', async () => {
    render(<ReviewsCarousel testimonials={testimonials} />);
    const track = screen.getByTestId('reviews-track');
    expect(track).toHaveStyle({ transform: 'translateX(-0%)' });

    await userEvent.click(screen.getByRole('button', { name: 'Go to review 3' }));
    expect(track).toHaveStyle({ transform: 'translateX(-200%)' });
  });

  it('wraps around with next/previous', async () => {
    render(<ReviewsCarousel testimonials={testimonials} />);
    const track = screen.getByTestId('reviews-track');

    await userEvent.click(screen.getByRole('button', { name: 'Previous review' }));
    expect(track).toHaveStyle({ transform: 'translateX(-200%)' }); // wraps to last slide
  });
});
