import { projectFormSchema } from '../schemas/project';
import type { PageTypeId } from '../config/page-types';

export { BITP_ECOMMERCE_SOLUTIONS_SLUG } from '../config/constants';

export type SeedBrand = {
  slug: string;
  previousSlugs: string[];
  title: string;
  short_description: string;
  full_description: string;
  categorySlug: string;
  website_type: string;
  industry: string;
  technology_stack: string[];
  starting_price: number;
  currency: string;
  featured: boolean;
  published: boolean;
  sort_order: number;
  seo_title: string;
  seo_description: string;
  seo_keywords: string[];
  pages: Array<{ type: PageTypeId; name: string; slug: string }>;
};

export const SEED_BRANDS: SeedBrand[] = [
  {
    slug: 'noire-fashion',
    previousSlugs: ['noire-fashion-ecommerce'],
    title: 'NOIRÉ Fashion',
    short_description: 'Premium fashion e-commerce experience with elegant product discovery and fast checkout.',
    full_description:
      'A premium fashion storefront designed for modern clothing and lifestyle brands. NOIRÉ pairs lookbook merchandising, refined product galleries, and a quiet checkout so boutiques can sell with cinematic clarity.',
    categorySlug: 'fashion',
    website_type: 'fashion_store',
    industry: 'fashion',
    technology_stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    starting_price: 10000,
    currency: 'BDT',
    featured: true,
    published: true,
    sort_order: 1,
    seo_title: 'Fashion E-commerce Website Design | Bridge IT Park',
    seo_description:
      'Explore a premium fashion e-commerce website design with responsive shopping, product, cart and checkout experiences.',
    seo_keywords: [
      'fashion ecommerce website',
      'custom ecommerce website',
      'online fashion shop',
      'ecommerce website Bangladesh',
    ],
    pages: [
      { type: 'homepage', name: 'Homepage', slug: 'homepage' },
      { type: 'shop', name: 'Shop', slug: 'shop' },
      { type: 'category', name: 'Category', slug: 'category' },
      { type: 'product_details', name: 'Product Details', slug: 'product' },
      { type: 'cart', name: 'Cart', slug: 'cart' },
      { type: 'checkout', name: 'Checkout', slug: 'checkout' },
      { type: 'about', name: 'About', slug: 'about' },
      { type: 'mobile_view', name: 'Mobile', slug: 'mobile' },
    ],
  },
  {
    slug: 'techora-electronics',
    previousSlugs: ['techora-electronics-store'],
    title: 'Techora Electronics',
    short_description: 'A modern gadget storefront for phones, audio, and accessories with a fast checkout.',
    full_description:
      'Techora is a premium electronics e-commerce design built for high-intent shoppers. Specification-first cards, comparison-friendly layouts, and a streamlined checkout help gadget brands convert with confidence.',
    categorySlug: 'electronics',
    website_type: 'electronics_store',
    industry: 'electronics',
    technology_stack: ['React', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    starting_price: 15000,
    currency: 'BDT',
    featured: true,
    published: true,
    sort_order: 2,
    seo_title: 'Electronics E-commerce Website Design | Bridge IT Park',
    seo_description:
      'Preview a modern electronics store design with landing, shop, product details, cart and checkout pages.',
    seo_keywords: [
      'electronics ecommerce website',
      'gadget shop website',
      'React ecommerce website Bangladesh',
      'custom online electronics store',
    ],
    pages: [
      { type: 'homepage', name: 'Homepage', slug: 'homepage' },
      { type: 'landing_page', name: 'Landing Page', slug: 'landing' },
      { type: 'shop', name: 'Shop', slug: 'shop' },
      { type: 'product_details', name: 'Product Details', slug: 'product' },
      { type: 'cart', name: 'Cart', slug: 'cart' },
      { type: 'checkout', name: 'Checkout', slug: 'checkout' },
      { type: 'contact', name: 'Contact', slug: 'contact' },
      { type: 'mobile_view', name: 'Mobile', slug: 'mobile' },
    ],
  },
  {
    slug: 'freshbasket',
    previousSlugs: ['freshbasket-grocery'],
    title: 'FreshBasket',
    short_description: 'Neighbourhood grocery design focused on fresh produce, weekly deals, and practical checkout.',
    full_description:
      'FreshBasket is a grocery e-commerce website designed for organic shops and local markets. Category browsing, weight-based products, and COD-ready checkout keep everyday ordering simple on desktop and mobile.',
    categorySlug: 'grocery',
    website_type: 'grocery_store',
    industry: 'grocery',
    technology_stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind CSS'],
    starting_price: 12000,
    currency: 'BDT',
    featured: true,
    published: true,
    sort_order: 3,
    seo_title: 'Grocery E-commerce Website Design | Bridge IT Park',
    seo_description:
      'Browse an organic grocery website design with shop, category, product, cart and mobile checkout experiences.',
    seo_keywords: [
      'grocery ecommerce website',
      'organic food online shop',
      'custom ecommerce website Bangladesh',
      'online grocery store design',
    ],
    pages: [
      { type: 'homepage', name: 'Homepage', slug: 'homepage' },
      { type: 'category', name: 'Category', slug: 'category' },
      { type: 'shop', name: 'Shop', slug: 'shop' },
      { type: 'product_details', name: 'Product Details', slug: 'product' },
      { type: 'cart', name: 'Cart', slug: 'cart' },
      { type: 'checkout', name: 'Checkout', slug: 'checkout' },
      { type: 'mobile_view', name: 'Mobile', slug: 'mobile' },
    ],
  },
  {
    slug: 'aura-beauty',
    previousSlugs: ['aura-beauty-cosmetics'],
    title: 'Aura Beauty',
    short_description: 'Calm cosmetics storefront for serums, creams, and routines with a low-friction checkout.',
    full_description:
      'Aura Beauty is a premium skincare and cosmetics e-commerce design. Soft typography, collection pages, and clinic-retail photography make routines easy to shop while checkout stays quiet and fast.',
    categorySlug: 'cosmetics',
    website_type: 'cosmetics_store',
    industry: 'cosmetics',
    technology_stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    starting_price: 15000,
    currency: 'BDT',
    featured: true,
    published: true,
    sort_order: 4,
    seo_title: 'Beauty E-commerce Website Design | Bridge IT Park',
    seo_description:
      'See a premium cosmetics website design with landing, collection, product details, cart and checkout pages.',
    seo_keywords: [
      'cosmetics ecommerce website',
      'skincare online shop',
      'beauty ecommerce website Bangladesh',
      'premium ecommerce website',
    ],
    pages: [
      { type: 'homepage', name: 'Homepage', slug: 'homepage' },
      { type: 'landing_page', name: 'Landing Page', slug: 'landing' },
      { type: 'collection', name: 'Collection', slug: 'collection' },
      { type: 'product_details', name: 'Product Details', slug: 'product' },
      { type: 'cart', name: 'Cart', slug: 'cart' },
      { type: 'checkout', name: 'Checkout', slug: 'checkout' },
      { type: 'about', name: 'About', slug: 'about' },
      { type: 'mobile_view', name: 'Mobile', slug: 'mobile' },
    ],
  },
  {
    slug: 'homenest',
    previousSlugs: ['homenest-furniture'],
    title: 'HomeNest',
    short_description: 'Gallery-like furniture store for sofas, lighting, and décor with a trusted checkout.',
    full_description:
      'HomeNest presents furniture and home décor in a calm gallery storefront. Large product photography, collection rooms, and a trusted checkout help shoppers choose sofas, lighting, and tables with confidence.',
    categorySlug: 'furniture',
    website_type: 'furniture_store',
    industry: 'furniture',
    technology_stack: ['Laravel', 'React', 'PostgreSQL', 'Tailwind CSS'],
    starting_price: 20000,
    currency: 'BDT',
    featured: true,
    published: true,
    sort_order: 5,
    seo_title: 'Furniture E-commerce Website Design | Bridge IT Park',
    seo_description:
      'Explore a furniture and home décor website design with collections, product pages, cart and checkout.',
    seo_keywords: [
      'furniture ecommerce website',
      'home decor online shop',
      'Laravel ecommerce website',
      'custom furniture store Bangladesh',
    ],
    pages: [
      { type: 'homepage', name: 'Homepage', slug: 'homepage' },
      { type: 'collection', name: 'Collection', slug: 'collection' },
      { type: 'product_details', name: 'Product Details', slug: 'product' },
      { type: 'cart', name: 'Cart', slug: 'cart' },
      { type: 'checkout', name: 'Checkout', slug: 'checkout' },
      { type: 'about', name: 'About', slug: 'about' },
      { type: 'contact', name: 'Contact', slug: 'contact' },
      { type: 'mobile_view', name: 'Mobile', slug: 'mobile' },
    ],
  },
];

export const DEFAULT_PACKAGES = [
  {
    name: 'Starter',
    priceOffset: 0,
    short_description: 'Launch-ready storefront with essential shopping pages',
    features: ['Homepage + shop + product + checkout', 'Mobile responsive', 'Basic admin', 'SEO setup'],
    is_popular: false,
  },
  {
    name: 'Business',
    priceOffset: 8000,
    short_description: 'Growth store with operations-ready customization',
    features: ['Everything in Starter', 'Courier-ready checkout', 'Inventory structure', 'Analytics-ready'],
    is_popular: true,
  },
  {
    name: 'Premium',
    priceOffset: 18000,
    short_description: 'Full custom commerce suite with priority delivery',
    features: ['Everything in Business', 'Custom modules', 'Priority delivery', 'Training & handover'],
    is_popular: false,
  },
];

export function assertSeedBrandForm(brand: SeedBrand, categoryId: string) {
  return projectFormSchema.parse({
    title: brand.title,
    slug: brand.slug,
    short_description: brand.short_description,
    full_description: brand.full_description,
    category_id: categoryId,
    technology_stack: brand.technology_stack,
    website_type: brand.website_type,
    industry: brand.industry,
    starting_price: brand.starting_price,
    currency: brand.currency,
    featured: brand.featured,
    published: brand.published,
    seo_title: brand.seo_title,
    seo_description: brand.seo_description,
    seo_keywords: brand.seo_keywords,
    sort_order: brand.sort_order,
  });
}
