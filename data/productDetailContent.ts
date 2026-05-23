import type { Product, ProductCategoryKey, ProductFaq } from '@/types/product';

export interface CategoryDetailTemplate {
  overview: string;
  descriptionLead: (title: string, shortDescription: string) => string;
  included: string[];
  process: string[];
  faqs: ProductFaq[];
}

function lead(short: string, body: string): string {
  return short.trim() + ' ' + body;
}

export const CATEGORY_DETAIL_TEMPLATES: Record<ProductCategoryKey, CategoryDetailTemplate> = {
  '2d-animation': {
    overview:
      'Professional 2D animation tailored to your brand voice, pacing, and campaign goals with clear storytelling and polished motion.',
    descriptionLead: (title, short) =>
      lead(
        short,
        'This ' +
          title.toLowerCase() +
          ' package focuses on expressive motion, readable typography, and brand-consistent frames that work across ads, explainers, and social placements. You receive structured story beats, smooth transitions, and export-ready files optimized for web and mobile.'
      ),
    included: [
      'Creative brief review and style direction',
      'Storyboard or animatic (scope-based)',
      '2D animation with brand colors and typography',
      'Sound-ready timing with optional SFX slots',
      'HD export (MP4) plus source project handoff',
      'One revision round included',
    ],
    process: [
      'Share your script, brand assets, and reference links',
      'We align on style frames and animation pacing',
      'First animated draft delivered for review',
      'Refinements applied and final files exported',
    ],
    faqs: [
      {
        question: 'What files do I need to provide?',
        answer:
          'Logo, brand colors, script or bullet points, and any reference videos help us match your visual direction quickly.',
      },
      {
        question: 'Can you match an existing brand style?',
        answer: 'Yes. Share style guides or sample videos and we will align motion, color, and typography accordingly.',
      },
    ],
  },
  '3d-animation': {
    overview:
      'High-quality 3D modeling, lighting, and rendering for product showcases, characters, and cinematic brand films.',
    descriptionLead: (title, short) =>
      lead(
        short,
        'Our ' +
          title.toLowerCase() +
          ' service covers modeling, materials, lighting, and render passes for marketing-ready visuals. Expect realistic surfaces, controlled camera moves, and polished compositing suitable for ads, landing pages, and presentations.'
      ),
    included: [
      'Concept alignment and reference board',
      '3D modeling and material setup',
      'Lighting, camera animation, and rendering',
      'Color-graded final video or still frames',
      'Preview drafts during production',
      'Organized project archive on delivery',
    ],
    process: [
      'Define product/character goals and references',
      'Blockout and camera approval',
      'Texture, light, and render iterations',
      'Final delivery with agreed formats',
    ],
    faqs: [
      {
        question: 'Do you provide source 3D files?',
        answer: 'Source files can be included when agreed in scope; otherwise we deliver agreed render outputs.',
      },
      {
        question: 'How long does rendering take?',
        answer: 'Timelines depend on complexity; we share a schedule after reviewing your brief.',
      },
    ],
  },
  'video-advertising': {
    overview:
      'Conversion-focused video ads engineered for hooks, clarity, and platform-native pacing on Meta, YouTube, and TikTok.',
    descriptionLead: (title, short) =>
      lead(
        short,
        'This ' +
          title.toLowerCase() +
          ' package is built to stop the scroll, communicate value fast, and drive clicks with strong CTAs, captions, and aspect ratios for paid social. We optimize pacing for retention and deliver ad-ready masters.'
      ),
    included: [
      'Hook-first script structure or edit plan',
      'Footage edit, typography, and branded overlays',
      'Platform aspect ratios (9:16, 1:1, 16:9)',
      'Caption-friendly safe zones',
      'Sound mix and export for ad managers',
      'Performance-oriented revision pass',
    ],
    process: [
      'Align on audience, offer, and platform',
      'Draft cut with hook and CTA placement',
      'Review and refine messaging/visual rhythm',
      'Export ad-ready files with naming spec',
    ],
    faqs: [
      {
        question: 'Can you work with my raw footage?',
        answer: 'Yes. Upload clips or a drive link with notes on key messages and brand rules.',
      },
      {
        question: 'Do you include licensed music?',
        answer: 'We can use royalty-safe library tracks or edit to your licensed audio when provided.',
      },
    ],
  },
  'software-company': {
    overview:
      'Scalable business software and web applications designed for reliability, clean UX, and maintainable architecture.',
    descriptionLead: (title, short) =>
      lead(
        short,
        'The ' +
          title.toLowerCase() +
          ' engagement includes discovery, UX planning, development, and handoff documentation so your team can operate confidently. We prioritize performance, security basics, and modular code structure.'
      ),
    included: [
      'Requirements workshop and scope document',
      'UI flows and component-based frontend',
      'API integration and data modeling',
      'Admin or dashboard modules as scoped',
      'Deployment guidance and README handoff',
      'Post-launch support window (as scoped)',
    ],
    process: [
      'Discovery and milestone planning',
      'Design prototypes and technical spec',
      'Iterative build with demo checkpoints',
      'QA, deployment, and knowledge transfer',
    ],
    faqs: [
      {
        question: 'What tech stack do you use?',
        answer: 'We typically use modern React/Next.js stacks and document alternatives during discovery.',
      },
      {
        question: 'Who owns the source code?',
        answer: 'Upon full payment, agreed source and assets are transferred per contract terms.',
      },
    ],
  },
  'digital-products': {
    overview:
      'Ready-to-use digital templates and resources you can customize immediately for design, business, and marketing workflows.',
    descriptionLead: (title, short) =>
      lead(
        short,
        'This ' +
          title.toLowerCase() +
          ' is crafted for fast customization with organized layers, sensible typography, and practical components. Ideal for teams that need production speed without sacrificing visual quality.'
      ),
    included: [
      'Editable source files (Figma/PSD/Notion as listed)',
      'Organized layers and naming conventions',
      'Typography and color styles documented',
      'Quick-start usage guide',
      'Commercial use license (as stated)',
      'Minor update email within 30 days',
    ],
    process: [
      'Purchase and instant file access',
      'Follow quick-start guide to customize',
      'Optional support for setup questions',
      'Deploy in your product or campaigns',
    ],
    faqs: [
      {
        question: 'Can I use this for client work?',
        answer: 'License terms allow commercial client use unless otherwise noted on the product page.',
      },
      {
        question: 'Will I receive updates?',
        answer: 'Minor fixes may be shared; major version updates may be a separate purchase.',
      },
    ],
  },
  'online-courses': {
    overview:
      'Structured online learning with practical modules, clear outcomes, and resources you can apply immediately.',
    descriptionLead: (title, short) =>
      lead(
        short,
        'The ' +
          title.toLowerCase() +
          ' curriculum blends concise lessons, exercises, and checkpoints so learners build real skills step by step. Content is organized for self-paced study with downloadable resources where applicable.'
      ),
    included: [
      'Module-based video lessons',
      'Downloadable templates or cheat sheets',
      'Quizzes or practice tasks per section',
      'Certificate of completion',
      'Community or Q&A access (if listed)',
      'Lifetime access to purchased materials',
    ],
    process: [
      'Enroll and access your learning dashboard',
      'Follow modules in recommended order',
      'Complete exercises and track progress',
      'Earn certificate after finishing requirements',
    ],
    faqs: [
      {
        question: 'How long do I have access?',
        answer: 'Standard purchases include lifetime access to course materials barring platform policy changes.',
      },
      {
        question: 'Is there instructor support?',
        answer: 'Support level varies by course; see module intro for response expectations.',
      },
    ],
  },
  'boosting-agency': {
    overview:
      'Campaign setup, audience targeting, and budget optimization to grow reach, leads, and sales on major ad platforms.',
    descriptionLead: (title, short) =>
      lead(
        short,
        'Our ' +
          title.toLowerCase() +
          ' service covers account audit, creative alignment, pixel/setup checks, and ongoing optimization for measurable growth. We focus on clear KPIs and transparent reporting.'
      ),
    included: [
      'Account and pixel/setup review',
      'Audience research and campaign structure',
      'Ad copy/creative alignment recommendations',
      'Budget and bidding strategy setup',
      'Weekly performance snapshot',
      'Optimization recommendations and tests',
    ],
    process: [
      'Kickoff with goals, offer, and tracking check',
      'Campaign build and launch with QA',
      'Monitor, optimize, and report learnings',
      'Scale winners and pause underperformers',
    ],
    faqs: [
      {
        question: 'Do you manage ad spend?',
        answer: 'Ad spend is billed in your ad account; we charge for management/strategy per package.',
      },
      {
        question: 'Which platforms are supported?',
        answer: 'Meta, Instagram, YouTube, and TikTok campaigns are commonly supported—confirm in brief.',
      },
    ],
  },
  'editing-services': {
    overview:
      'Professional post-production for retention, clarity, and platform-ready delivery—including edits, color, audio, and thumbnails.',
    descriptionLead: (title, short) =>
      lead(
        short,
        'This ' +
          title.toLowerCase() +
          ' service delivers polished timelines, balanced audio, and visuals tuned for your channel or brand. For thumbnail design, you get bold typography, strong contrast, and export sizes ready for YouTube and social campaigns.'
      ),
    included: [
      'Project intake and editing brief',
      'Assembly cut with pacing for retention',
      'Color correction and audio cleanup',
      'Captions or text overlays (if scoped)',
      'Export in agreed resolutions and codecs',
      'One structured revision round',
    ],
    process: [
      'Upload footage/assets and creative notes',
      'We deliver a first cut for review',
      'Apply revisions and finalize masters',
      'Hand off exports and thumbnail files',
    ],
    faqs: [
      {
        question: 'What is the typical turnaround?',
        answer: 'Turnaround depends on length and complexity; delivery time is shown on the listing.',
      },
      {
        question: 'Do you design YouTube thumbnails?',
        answer: 'Yes—thumbnail packages include platform-ready sizes with bold, readable typography.',
      },
    ],
  },
};

export function buildProductDescription(
  categoryKey: ProductCategoryKey,
  title: string,
  shortDescription: string
): string {
  const template = CATEGORY_DETAIL_TEMPLATES[categoryKey];
  if (title.toLowerCase().includes('thumbnail')) {
    return (
      'Get a professional, scroll-stopping thumbnail designed to increase clicks and improve your video presentation. ' +
      'This service includes clean typography, strong contrast, branded colors, and platform-ready export sizes for YouTube, Facebook, or social media campaigns. ' +
      shortDescription +
      ' You will receive layered source files when applicable plus PNG/JPEG exports optimized for clarity at small sizes.'
    );
  }
  return template.descriptionLead(title, shortDescription);
}

export function enrichProductDetailFields(
  categoryKey: ProductCategoryKey,
  title: string,
  shortDescription: string,
  image: string,
  index: number
): Pick<Product, 'description' | 'overview' | 'included' | 'process' | 'faqs' | 'gallery'> {
  const template = CATEGORY_DETAIL_TEMPLATES[categoryKey];
  const gallery =
    index % 3 === 0 ? [image, image] : index % 3 === 1 ? [image] : undefined;

  return {
    description: buildProductDescription(categoryKey, title, shortDescription),
    overview: template.overview,
    included: template.included,
    process: template.process,
    faqs: template.faqs,
    gallery,
  };
}
