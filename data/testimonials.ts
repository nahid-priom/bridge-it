import type { PlatformTestimonial, TestimonialsSectionContent } from '@/types';
import { BRANDING } from '@/lib/config/branding';

/** Home page “What Our Users Say” section copy */
export const testimonialsSectionContent: TestimonialsSectionContent = {
  badgeEmoji: '💬',
  badgeLabel: 'Testimonials',
  title: 'What Our',
  titleHighlight: 'Clients Say',
  subtitle: `Real feedback from businesses working with ${BRANDING.appName}`,
  autoRotateMs: 6000,
};

export const platformTestimonials: PlatformTestimonial[] = [
  {
    id: 't1',
    name: 'Rahim Ahmed',
    role: 'Business Owner',
    comment:
      `${BRANDING.appName} transformed how we go digital. Their team delivered a polished website and marketing setup that gave us confidence to invest in our brand online.`,
    rating: 5,
    accentColor: '#6C3CE1',
  },
  {
    id: 't2',
    name: 'Fatima Khan',
    role: 'Marketing Manager',
    comment:
      'The digital marketing package was a game-changer. Our campaigns are now managed professionally and leads increased significantly within the first quarter.',
    rating: 5,
    accentColor: '#06D6A0',
  },
  {
    id: 't3',
    name: 'Karim Hassan',
    role: 'Operations Director',
    comment:
      `${BRANDING.appName} built our custom ERP module on time. The project dashboard and clear communication made the entire process smooth and transparent.`,
    rating: 5,
    accentColor: '#F59E0B',
  },
  {
    id: 't4',
    name: 'Nusrat Jahan',
    role: 'Startup Founder',
    comment:
      `We got our entire website and app built through ${BRANDING.appName}. Milestone-based delivery and secure payments ensured quality at every stage. Highly recommend!`,
    rating: 5,
    accentColor: '#EC4899',
  },
];
