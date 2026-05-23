import type { Product, ProductCategoryKey } from '@/types/product';
import { getCategoryByKey } from '@/data/productCategories';
import { pickProductImage } from '@/data/productCategoryImages';
import { enrichProductDetailFields } from '@/data/productDetailContent';

const SELLERS = [
  { name: 'AnimateX Studio', slug: 'animatex-studio', level: 'Top Rated' },
  { name: '3D Craft Labs', slug: '3d-craft-labs', level: 'Level 2' },
  { name: 'AdSpark Media', slug: 'adspark-media', level: 'Top Rated' },
  { name: 'TechNova BD', slug: 'technova-bd', level: 'Level 2' },
  { name: 'PixelVault', slug: 'pixelvault', level: 'Rising Talent' },
  { name: 'SkillForge Academy', slug: 'skillforge-academy', level: 'Top Rated' },
  { name: 'GrowthPulse Agency', slug: 'growthpulse-agency', level: 'Level 2' },
  { name: 'EditLab Pro', slug: 'editlab-pro', level: 'Top Rated' },
  { name: 'MotionHive', slug: 'motionhive', level: 'Rising Talent' },
  { name: 'CodeNest Labs', slug: 'codenest-labs', level: 'Top Rated' },
];

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

type CategorySeed = {
  key: ProductCategoryKey;
  label: string;
  titles: string[];
  descriptions: string[];
  tagPrefix: string[];
  priceBase: number;
};

const SEEDS: CategorySeed[] = [
  {
    key: '2d-animation',
    label: '2D Animation',
    tagPrefix: ['2D', 'Animation'],
    priceBase: 120,
    titles: [
      'Professional 2D Explainer Animation',
      'Logo Animation Package',
      'Character Animation for Brand',
      'Motion Graphics Social Pack',
      'Social Media Animated Ads',
      'Animated Intro & Outro',
      'Whiteboard Animation Video',
      'Product Animation Showcase',
      'Animated Reels Bundle',
      'Cartoon Business Video',
    ],
    descriptions: [
      'Clean explainer animations for brands and startups.',
      'Smooth logo reveals with brand-matched motion.',
      'Expressive character animation for campaigns.',
      'Scroll-stopping motion graphics for social feeds.',
      'Short animated ads optimized for conversions.',
      'Professional intro/outro sequences for video.',
      'Engaging whiteboard-style storytelling.',
      'Product-focused 2D animation for eCommerce.',
      'Vertical reels pack for Instagram & TikTok.',
      'Friendly cartoon-style business promos.',
    ],
  },
  {
    key: '3d-animation',
    label: '3D Animation',
    tagPrefix: ['3D', 'Render'],
    priceBase: 250,
    titles: [
      '3D Character Modeling',
      'Product Visualization Render',
      '3D Logo Animation',
      'Architectural Walkthrough',
      'Game-Ready 3D Assets',
      '3D Product Promo Video',
      '3D Mascot Design',
      'Realistic 3D Rendering',
      '3D Motion Promo Video',
      'NFT Collectible 3D Model',
    ],
    descriptions: [
      'High-quality character models for games and ads.',
      'Photoreal product renders for marketing.',
      'Premium 3D logo motion with lighting.',
      'Immersive architectural flythrough videos.',
      'Optimized assets for real-time engines.',
      'Cinematic product promos in 3D.',
      'Memorable mascot design and rigging.',
      'Studio-grade still and motion renders.',
      'Dynamic 3D motion for brand films.',
      'Collectible 3D art for digital drops.',
    ],
  },
  {
    key: 'video-advertising',
    label: 'Video Advertising',
    tagPrefix: ['Video', 'Ads'],
    priceBase: 95,
    titles: [
      'Facebook Video Ad',
      'YouTube Video Ad',
      'TikTok Ad Creative',
      'Product Promo Video',
      'Brand Commercial',
      'Short Video Sales Ad',
      'Launch Campaign Video',
      'UGC-Style Ad Video',
      'Real Estate Promo',
      'eCommerce Ad Creative',
    ],
    descriptions: [
      'Conversion-focused ads for Meta platforms.',
      'YouTube pre-roll and in-feed ad packages.',
      'Native TikTok creatives with hooks.',
      'Product-first promos for online stores.',
      'Brand story commercials with CTA.',
      'Fast-paced sales videos for offers.',
      'Launch films for new products.',
      'Authentic UGC-style ad production.',
      'Property showcase videos with grading.',
      'Performance ads for eCommerce brands.',
    ],
  },
  {
    key: 'software-company',
    label: 'Software Company',
    tagPrefix: ['Software', 'SaaS'],
    priceBase: 450,
    titles: [
      'Custom Web Application',
      'SaaS Dashboard',
      'ERP System',
      'POS Software',
      'CRM System',
      'eCommerce Website',
      'Mobile App UI & Frontend',
      'Booking System',
      'Inventory Management',
      'Business Automation Software',
    ],
    descriptions: [
      'Tailored web apps for your workflow.',
      'Analytics dashboards with role-based access.',
      'Enterprise resource planning modules.',
      'Retail POS with inventory sync.',
      'Sales CRM with pipeline tracking.',
      'Full-stack eCommerce with payments.',
      'React Native / Flutter UI builds.',
      'Appointment booking with notifications.',
      'Stock control and reporting suite.',
      'Workflow automation across tools.',
    ],
  },
  {
    key: 'digital-products',
    label: 'Digital Products',
    tagPrefix: ['Digital', 'Template'],
    priceBase: 35,
    titles: [
      'UI Kit',
      'Dashboard Template',
      'Landing Page Template',
      'Social Media Template Pack',
      'Business Proposal Template',
      'Invoice Template',
      'Icon Pack',
      'Design System',
      'Notion Template',
      'Resume & CV Template',
    ],
    descriptions: [
      'Figma UI kit for SaaS products.',
      'Admin dashboard template with components.',
      'High-converting landing page layouts.',
      'Canva & Figma social templates.',
      'Editable proposal decks for clients.',
      'Professional invoice spreadsheets.',
      'Vector icon set for apps.',
      'Tokens, typography, and components.',
      'Productivity Notion workspace.',
      'Modern CV templates for job seekers.',
    ],
  },
  {
    key: 'online-courses',
    label: 'Online Courses',
    tagPrefix: ['Course', 'Learning'],
    priceBase: 49,
    titles: [
      'React Development Course',
      'Next.js Masterclass',
      'Digital Marketing Course',
      'UI/UX Design Course',
      'Freelancing Course',
      'Graphic Design Course',
      'Video Editing Course',
      'English Speaking Course',
      'Business Automation Course',
      'WordPress Course',
    ],
    descriptions: [
      'Hands-on React from basics to production.',
      'App Router, SSR, and deployment with Next.js.',
      'Full-funnel digital marketing playbook.',
      'Research, wireframes, and UI systems.',
      'Client acquisition for freelancers.',
      'Brand design fundamentals in Photoshop & AI.',
      'Premiere Pro editing workflows.',
      'Spoken English for professionals.',
      'Zapier & no-code automation.',
      'Build sites with WordPress & WooCommerce.',
    ],
  },
  {
    key: 'boosting-agency',
    label: 'Boosting Agency',
    tagPrefix: ['Ads', 'Boost'],
    priceBase: 75,
    titles: [
      'Facebook Page Boost',
      'Product Ad Boost',
      'Lead Generation Campaign',
      'Instagram Promotion',
      'YouTube Promotion',
      'TikTok Campaign',
      'Local Business Boost',
      'App Install Campaign',
      'eCommerce Sales Campaign',
      'Retargeting Campaign',
    ],
    descriptions: [
      'Grow page reach and engagement.',
      'Scale product catalog ads.',
      'Qualified leads with optimized forms.',
      'Reels and story promotion packages.',
      'Subscriber and view growth campaigns.',
      'Spark ads and creator collaborations.',
      'Geo-targeted local awareness.',
      'Mobile app install optimization.',
      'ROAS-focused store campaigns.',
      'Pixel-based retargeting funnels.',
    ],
  },
  {
    key: 'editing-services',
    label: 'Editing Services',
    tagPrefix: ['Editing', 'Post'],
    priceBase: 55,
    titles: [
      'Professional Video Editing',
      'YouTube Video Editing',
      'Reels Editing',
      'Color Grading',
      'Podcast Editing',
      'Wedding Video Editing',
      'Product Photo Editing',
      'Background Removal',
      'Thumbnail Design',
      'Short-Form Content Editing',
    ],
    descriptions: [
      'Cinematic cuts with sound design.',
      'Retention-focused YouTube edits.',
      'Fast-turnaround vertical reels.',
      'Film look color grading & LUTs.',
      'Clean audio and chapter markers.',
      'Story-driven wedding films.',
      'eCommerce photo retouching.',
      'Precise cutouts for catalogs.',
      'Click-worthy YouTube thumbnails.',
      'Batch editing for short-form creators.',
    ],
  },
];

const DELIVERY = ['Instant', '1 day', '2 days', '3 days', '5 days', '7 days', '10 days', '14 days'];

function buildCatalog(): Product[] {
  const list: Product[] = [];
  let n = 0;

  for (const seed of SEEDS) {
    seed.titles.forEach((title, i) => {
      n += 1;
      const seller = SELLERS[(n + i) % SELLERS.length];
      const price = seed.priceBase + (i % 5) * 25 + (n % 7) * 10;
      const featured = i === 0 || i === 3;
      const shortDescription = seed.descriptions[i];
      const image = pickProductImage(seed.key, i, n, title);
      const detail = enrichProductDetailFields(seed.key, title, shortDescription, image, i);
      list.push({
        id: `prod-${String(n).padStart(3, '0')}`,
        slug: `${seed.key}-${slugify(title)}`,
        title,
        shortDescription,
        ...detail,
        categoryKey: seed.key,
        categoryLabel: seed.label,
        sellerName: seller.name,
        sellerSlug: seller.slug,
        price,
        oldPrice: i % 3 === 0 ? Math.round(price * 1.35) : undefined,
        rating: Number((4.5 + (i % 5) * 0.1).toFixed(1)),
        reviews: 40 + n * 3 + i * 7,
        deliveryTime: DELIVERY[i % DELIVERY.length],
        image,
        badge: featured ? 'Featured' : i % 4 === 1 ? 'Popular' : undefined,
        tags: [...seed.tagPrefix, title.split(' ')[0]],
        sellerLevel: seller.level,
        isFeatured: featured,
        isPromoted: i % 2 === 0,
        createdAt: `2025-${String((i % 12) + 1).padStart(2, '0')}-15`,
      });
    });
  }

  return list;
}

export const products: Product[] = buildCatalog();

export function getCategoryByKeyFromProducts(key: string | null | undefined) {
  return getCategoryByKey(key);
}

export function getProductsByCategory(categoryKey: ProductCategoryKey | 'all' | null): Product[] {
  if (!categoryKey || categoryKey === 'all') return products;
  return products.filter((p) => p.categoryKey === categoryKey);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

/** Product count per category key (and `all` for total). */
export function getCategoryProductCounts(): Record<string, number> {
  const counts: Record<string, number> = { all: products.length };
  for (const p of products) {
    counts[p.categoryKey] = (counts[p.categoryKey] ?? 0) + 1;
  }
  return counts;
}

