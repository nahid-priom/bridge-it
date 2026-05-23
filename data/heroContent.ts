export type HeroCtaPage = 'home' | 'categories' | 'products' | 'about' | 'dashboard' | 'search';

export interface HeroSlide {
  id: string;
  image: string;
  badge: string;
  title: string;
  highlight: string;
  subtitle: string;
  primaryCta: string;
  primaryCtaPage: HeroCtaPage;
  secondaryCta?: string;
  secondaryCtaPage?: HeroCtaPage;
}

export interface PromotedServiceAd {
  id: string;
  image: string;
  title: string;
  description: string;
  seller: string;
  statusBadge: string;
  statusColor: string;
  categoryBadge: string;
  categoryGradient: string;
  rating: number;
  reviewCount: number;
  priceLabel: string;
}

export interface HeroTrustMetric {
  id: string;
  label: string;
  icon: 'users' | 'briefcase' | 'headphones';
  iconBg: string;
  iconColor: string;
}

export const heroSlides: HeroSlide[] = [
  {
    id: 'slide-1',
    image:
      'https://images.pexels.com/photos/20043053/pexels-photo-20043053.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600',
    badge: 'Smart Virtual IT Park',
    title: "Bangladesh's #1 Smart",
    highlight: 'Virtual IT Park',
    subtitle:
      'Buy, sell & discover premium digital services — animations, software, video ads, courses and more.',
    primaryCta: 'Explore Services',
    primaryCtaPage: 'categories',
    secondaryCta: 'Become a Seller',
    secondaryCtaPage: 'dashboard',
  },
  {
    id: 'slide-2',
    image:
      'https://images.pexels.com/photos/8728284/pexels-photo-8728284.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600',
    badge: 'Smart Virtual IT Park',
    title: 'Grow Your Business',
    highlight: 'With Bridge',
    subtitle:
      'Get your own custom URL, piracy-protected gallery & direct customer access from any platform.',
    primaryCta: 'Become a Seller',
    primaryCtaPage: 'dashboard',
    secondaryCta: 'Explore Services',
    secondaryCtaPage: 'categories',
  },
  {
    id: 'slide-3',
    image:
      'https://images.pexels.com/photos/29506609/pexels-photo-29506609.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600',
    badge: 'Smart Virtual IT Park',
    title: 'Secure Payments &',
    highlight: 'Guaranteed Delivery',
    subtitle:
      'Escrow protection, bKash/Nagad/Card support, real-time messaging & 24/7 customer support.',
    primaryCta: 'How It Works',
    primaryCtaPage: 'about',
    secondaryCta: 'Explore Services',
    secondaryCtaPage: 'categories',
  },
];

export const promotedServices: PromotedServiceAd[] = [
  {
    id: 'promo-1',
    image:
      'https://images.pexels.com/photos/8833485/pexels-photo-8833485.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=800',
    title: 'Professional 2D & 3D Animation',
    description: 'Stunning motion graphics for brands, ads, and social campaigns.',
    seller: 'AnimateX Studio',
    statusBadge: 'FEATURED AD',
    statusColor: '#EC4899',
    categoryBadge: 'Design & Creative',
    categoryGradient: 'from-violet-500 to-fuchsia-500',
    rating: 4.9,
    reviewCount: 127,
    priceLabel: 'From $150',
  },
  {
    id: 'promo-2',
    image:
      'https://images.pexels.com/photos/7988745/pexels-photo-7988745.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=800',
    title: 'Facebook & YouTube Video Ads',
    description: 'Scroll-stopping video ads optimized for conversion and reach.',
    seller: 'AdVision Pro',
    statusBadge: 'SPONSORED',
    statusColor: '#06D6A0',
    categoryBadge: 'Marketing',
    categoryGradient: 'from-emerald-500 to-teal-500',
    rating: 4.8,
    reviewCount: 215,
    priceLabel: 'From $80',
  },
  {
    id: 'promo-3',
    image:
      'https://images.pexels.com/photos/270694/pexels-photo-270694.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=800',
    title: 'Custom Software Development',
    description: 'Full-stack apps with React, Node.js, and secure cloud deployment.',
    seller: 'CodeBridge Solutions',
    statusBadge: 'PROMOTED',
    statusColor: '#06B6D4',
    categoryBadge: 'Development',
    categoryGradient: 'from-blue-500 to-cyan-500',
    rating: 5.0,
    reviewCount: 56,
    priceLabel: 'From $499',
  },
];

export const heroTrustMetrics: HeroTrustMetric[] = [
  {
    id: 'sellers',
    label: '100+ Sellers',
    icon: 'users',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
  },
  {
    id: 'services',
    label: '500+ Services',
    icon: 'briefcase',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    id: 'support',
    label: '24/7 Support',
    icon: 'headphones',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
  },
];

export const heroSearchQuickTags = [
  '2D Animation',
  '3D Render',
  'Video Ads',
  'Web Dev',
  'UI/UX',
  'Digital Marketing',
];
