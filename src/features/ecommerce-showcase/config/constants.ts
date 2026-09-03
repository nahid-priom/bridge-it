export const SHOWCASE_BUCKET = 'ecommerce-showcase';

export const BITP_ECOMMERCE_SOLUTIONS_SLUG = 'ecommerce-solutions';

export const SHOWCASE_CURRENCY = 'BDT';

export const GALLERY_PAGE_SIZE = 12;

/** Compact page tabs for /websites listing only (homepage keeps PAGE_FILTER_CHIPS). */
export const LISTING_VIEW_TABS = [
  { id: 'all', label: 'All' },
  { id: 'homepage', label: 'Homepage' },
  { id: 'landing_page', label: 'Landing' },
  { id: 'product_details', label: 'Product' },
  { id: 'cart', label: 'Cart' },
  { id: 'checkout', label: 'Checkout' },
] as const;

export const LISTING_CATEGORIES = [
  { id: 'all', label: 'All', slug: undefined },
  { id: 'fashion', label: 'Fashion', slug: 'fashion' },
  { id: 'electronics', label: 'Electronics', slug: 'electronics' },
  { id: 'grocery', label: 'Grocery', slug: 'grocery' },
  { id: 'beauty', label: 'Beauty', slug: 'cosmetics' },
  { id: 'furniture', label: 'Furniture', slug: 'furniture' },
] as const;

export const PRICE_FILTERS = [
  { id: 'all', label: 'All prices' },
  { id: 'under-80k', label: 'Under ৳80,000', maxPrice: 80000 },
  { id: '80-100k', label: '৳80,000 – ৳1,00,000', minPrice: 80000, maxPrice: 100000 },
  { id: '100k-plus', label: '৳1,00,000+', minPrice: 100000 },
] as const;

export const DEVICE_VIEWPORTS = {
  desktop: { width: 1440, label: 'Desktop' },
  tablet: { width: 768, label: 'Tablet' },
  mobile: { width: 390, label: 'Mobile' },
} as const;

export const SHOWCASE_IMAGE_ACCEPT =
  'image/png,image/jpeg,image/webp,image/avif,.png,.jpg,.jpeg,.webp,.avif';

export type DeviceViewport = keyof typeof DEVICE_VIEWPORTS;

export const IMAGE_TARGETS = {
  cover: { width: 1600, quality: 70 },
  desktop: { width: 1920, quality: 72 },
  tablet: { width: 1024, quality: 70 },
  mobile: { width: 900, quality: 68 },
  thumbnail: { width: 720, quality: 62 },
} as const;

export const LEAD_STATUSES = [
  'new',
  'contacted',
  'qualified',
  'proposal_sent',
  'converted',
  'closed',
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const SEO_KEYWORD_IDEAS = [
  'custom ecommerce website Bangladesh',
  'ecommerce website development',
  'Next.js ecommerce website',
  'React ecommerce website Bangladesh',
  'custom online shop',
  'Laravel ecommerce website',
  'high performance ecommerce website',
  'premium ecommerce website',
  'courier automation website',
  'fraud checker ecommerce',
] as const;

export const WEBSITE_TYPES = [
  { id: 'fashion_store', label: 'Fashion E-commerce' },
  { id: 'electronics_store', label: 'Electronics E-commerce' },
  { id: 'grocery_store', label: 'Grocery E-commerce' },
  { id: 'cosmetics_store', label: 'Beauty E-commerce' },
  { id: 'furniture_store', label: 'Furniture E-commerce' },
  { id: 'single_product', label: 'Single Product Store' },
  { id: 'wholesale', label: 'Wholesale / B2B' },
  { id: 'multi_vendor', label: 'Multi Vendor' },
  { id: 'local_shop', label: 'Local Shop' },
] as const;

export const INDUSTRIES = [
  { id: 'fashion', label: 'Fashion & Lifestyle' },
  { id: 'electronics', label: 'Electronics & Gadgets' },
  { id: 'grocery', label: 'Grocery & Organic Food' },
  { id: 'organic_food', label: 'Organic Food' },
  { id: 'cosmetics', label: 'Beauty & Cosmetics' },
  { id: 'furniture', label: 'Furniture & Home Decor' },
  { id: 'jewellery', label: 'Jewellery' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'wholesale', label: 'Wholesale' },
  { id: 'b2b', label: 'B2B' },
] as const;

export const TECHNOLOGY_OPTIONS = [
  { id: 'Next.js', slug: 'nextjs' },
  { id: 'React', slug: 'react' },
  { id: 'Laravel', slug: 'laravel' },
  { id: 'TypeScript', slug: 'typescript' },
  { id: 'Supabase', slug: 'supabase' },
  { id: 'PostgreSQL', slug: 'postgresql' },
  { id: 'Tailwind CSS', slug: 'tailwindcss' },
  { id: 'Node.js', slug: 'nodejs' },
] as const;
