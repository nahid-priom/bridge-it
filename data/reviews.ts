import type { ProductCategoryKey, ProductReview } from '@/types/product';
import { products } from '@/data/products';

const REVIEWERS = [
  'Rakib Hasan',
  'Nusrat Jahan',
  'Imran Chowdhury',
  'Sadia Rahman',
  'Tanvir Ahmed',
  'Maya Karim',
  'Fahim Hossain',
  'Priya Das',
];

const REVIEW_TITLES: Record<ProductCategoryKey, string[]> = {
  '2d-animation': [
    'Smooth animation and great storytelling',
    'Exactly matched our brand style',
    'Fast delivery and clean motion',
    'Professional explainer quality',
    'Loved the character animation',
  ],
  '3d-animation': [
    'Stunning 3D renders',
    'Product visualization looked premium',
    'Great lighting and materials',
    'Exceeded our launch expectations',
    'Solid communication throughout',
  ],
  'video-advertising': [
    'High-converting ad creative',
    'Hook worked perfectly on Meta',
    'Clear CTA and strong pacing',
    'Great for our product launch',
    'Ready-to-run ad exports',
  ],
  'software-company': [
    'Reliable development delivery',
    'Clean dashboard UX',
    'Well-documented handoff',
    'Scalable architecture',
    'Responsive support during build',
  ],
  'digital-products': [
    'Templates saved us weeks',
    'Easy to customize in Figma',
    'Professional layout system',
    'Worth every dollar',
    'Great value for teams',
  ],
  'online-courses': [
    'Practical lessons with real examples',
    'Clear learning path',
    'Helpful exercises each module',
    'Improved my skills quickly',
    'Instructor explanations were clear',
  ],
  'boosting-agency': [
    'Noticeable reach improvement',
    'Solid campaign structure',
    'Better leads after optimization',
    'Transparent reporting',
    'ROI improved within weeks',
  ],
  'editing-services': [
    'Very professional thumbnail design',
    'Retention improved after edit',
    'Clean color and audio',
    'Fast turnaround on reels',
    'Matches our channel branding',
  ],
};

const REVIEW_COMMENTS: Record<ProductCategoryKey, string[]> = {
  '2d-animation': [
    'The animation looked clean, on-brand, and ready for our campaign. Revisions were handled quickly.',
    'Story flow was clear and motion felt premium. Our team approved the first draft with minor tweaks.',
    'Great communication and exports were delivered in the formats we needed.',
  ],
  '3d-animation': [
    'Renders were sharp and lighting felt realistic. Perfect for our product landing page.',
    'The team understood our brief and delivered polished camera moves.',
    'Final files were organized and easy for marketing to use.',
  ],
  'video-advertising': [
    'The ad creative performed well in testing. Hook and pacing were on point.',
    'We launched the same week and saw stronger CTR than our previous assets.',
    'Captions and aspect ratios were prepared correctly for each platform.',
  ],
  'software-company': [
    'Milestones were met and code quality was solid. Documentation helped our internal team.',
    'UX felt modern and the admin flows were intuitive for staff.',
    'Deployment guidance made go-live straightforward.',
  ],
  'digital-products': [
    'Layers were organized and the style guide notes were helpful.',
    'We customized the kit for two client projects without issues.',
    'Download was instant and files matched the preview description.',
  ],
  'online-courses': [
    'Modules were structured well and examples were practical.',
    'I applied lessons the same day in client work.',
    'Certificate process was simple after completing quizzes.',
  ],
  'boosting-agency': [
    'Campaign setup was thorough and targeting improved lead quality.',
    'Weekly snapshots made it easy to understand performance.',
    'Optimization suggestions were actionable and tested quickly.',
  ],
  'editing-services': [
    'The design looked clean, bold, and matched my channel branding perfectly. I received the final file quickly and the thumbnail was ready to upload.',
    'Edit pacing improved watch time on our latest upload. Audio was balanced and crisp.',
    'Color grading gave our footage a consistent film look. Would order again.',
  ],
};

function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h + slug.charCodeAt(i) * (i + 1)) % 9973;
  return h;
}

function buildReviewsForProduct(slug: string, categoryKey: ProductCategoryKey): ProductReview[] {
  const h = hashSlug(slug);
  const count = 4 + (h % 3);
  const titles = REVIEW_TITLES[categoryKey];
  const comments = REVIEW_COMMENTS[categoryKey];
  const reviews: ProductReview[] = [];

  for (let i = 0; i < count; i++) {
    const idx = (h + i) % REVIEWERS.length;
    const rating = i === 0 || (h + i) % 4 !== 0 ? 5 : 4;
    const month = ((h + i) % 12) + 1;
    reviews.push({
      id: `rev-${slug}-${i}`,
      productSlug: slug,
      reviewerName: REVIEWERS[idx],
      rating,
      date: `2025-${String(month).padStart(2, '0')}-${String(10 + ((h + i) % 18)).padStart(2, '0')}`,
      title: titles[(h + i) % titles.length],
      comment: comments[(h + i) % comments.length],
      helpfulCount: 3 + ((h + i * 7) % 24),
      verified: (h + i) % 3 !== 0,
    });
  }

  return reviews;
}

const reviewIndex: ProductReview[] = products.flatMap((p) =>
  buildReviewsForProduct(p.slug, p.categoryKey)
);

export const productReviews: ProductReview[] = reviewIndex;

export function getReviewsByProductSlug(slug: string): ProductReview[] {
  return reviewIndex.filter((r) => r.productSlug === slug);
}
