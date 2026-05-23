import type { PlatformTestimonial, TestimonialsSectionContent } from '@/types';

/** Home page “What Our Users Say” section copy — edit here or replace via CMS/API later */
export const testimonialsSectionContent: TestimonialsSectionContent = {
  badgeEmoji: '💬',
  badgeLabel: 'Testimonials',
  title: 'What Our',
  titleHighlight: 'Users Say',
  subtitle: 'Real feedback from buyers and sellers on Bridge',
  autoRotateMs: 6000,
};

export const platformTestimonials: PlatformTestimonial[] = [
  {
    id: 't1',
    name: 'Rahim Ahmed',
    role: 'Business Owner',
    comment:
      'Bridge transformed how I find digital services. The quality of sellers and the anti-piracy protection gave me confidence to invest in premium animations for my brand.',
    rating: 5,
    accentColor: '#6C3CE1',
  },
  {
    id: 't2',
    name: 'Fatima Khan',
    role: 'Marketing Manager',
    comment:
      'The custom URL feature is a game-changer! I share my seller link on Facebook ads and customers land directly on my Bridge profile. Sales increased by 300%.',
    rating: 5,
    accentColor: '#06D6A0',
  },
  {
    id: 't3',
    name: 'Karim Hassan',
    role: 'Freelancer',
    comment:
      'As a video editor, Bridge gives me the perfect platform to showcase my work with watermark protection. The messaging system makes client communication so easy.',
    rating: 5,
    accentColor: '#F59E0B',
  },
  {
    id: 't4',
    name: 'Nusrat Jahan',
    role: 'Startup Founder',
    comment:
      'We got our entire website and app built through Bridge. The escrow payment system ensured quality delivery. Highly recommend for any digital project!',
    rating: 5,
    accentColor: '#EC4899',
  },
];

export function getTestimonialById(id: string): PlatformTestimonial | undefined {
  return platformTestimonials.find((t) => t.id === id);
}
