export interface Testimonial {
  quote: string;
  author: string;
  source: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  { quote: 'Super professional, attentive to detail and clearly understands UKG/bass music. The track came back punchy, clean and club-ready. Really appreciated the communication and flexibility throughout. Looking forward to working together again.', author: 'brg_mzk (Italy)', source: 'Fiverr', rating: 5 },
  { quote: 'James was a pleasure to work with and delivered the perfect extended version for my track. Would recommend everyone to use him.', author: 'A-Niche (UK)', source: 'Direct', rating: 5 },
  { quote: 'Excellent working with James. Great communication throughout and really easy to work with. He took my track to the next level with the mix and master while keeping the original vibe intact. The vocals sat nicely in the mix, the low end felt much tighter, and the final master had plenty of punch without sounding overdone. Really happy with the result and would happily work with him again.', author: 'Sohl', source: 'Direct', rating: 5 },
  { quote: 'Great mixing and mastering service, also offered lessons on mixdowns which have massively improved my own projects. Highly recommend!', author: 'Frazer M', source: 'Direct', rating: 5 },
];
