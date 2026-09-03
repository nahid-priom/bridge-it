export const SHOWCASE_BUCKET = 'ecommerce-showcase';

export const BITP_ECOMMERCE_SOLUTIONS_SLUG = 'ecommerce-solutions';

export const SHOWCASE_CURRENCY = 'BDT';

export const GALLERY_PAGE_SIZE = 12;

/** Compact page tabs for /websites listing and homepage Design Gallery. */
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
  { id: 'grocery', label: 'Food', slug: 'grocery' },
  { id: 'beauty', label: 'Beauty', slug: 'cosmetics' },
  { id: 'furniture', label: 'Home', slug: 'furniture' },
  { id: 'lifestyle', label: 'Lifestyle', slug: 'lifestyle' },
  { id: 'sports', label: 'Sports', slug: 'sports' },
  { id: 'specialty', label: 'Specialty', slug: 'specialty' },
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
  { id: 'menswear', label: "Men's Fashion" },
  { id: 'kids_fashion', label: 'Kids Fashion' },
  { id: 'footwear', label: 'Shoes & Footwear' },
  { id: 'bags', label: 'Bags & Accessories' },
  { id: 'jewellery', label: 'Jewellery' },
  { id: 'watches', label: 'Watches' },
  { id: 'activewear', label: 'Gym / Activewear' },
  { id: 'electronics', label: 'Electronics & Gadgets' },
  { id: 'mobile', label: 'Mobile & Accessories' },
  { id: 'appliances', label: 'Home Appliances' },
  { id: 'grocery', label: 'Grocery & Organic Food' },
  { id: 'organic_food', label: 'Organic Food' },
  { id: 'nutrition', label: 'Healthy Food / Supplements' },
  { id: 'cosmetics', label: 'Beauty & Cosmetics' },
  { id: 'furniture', label: 'Furniture & Home Decor' },
  { id: 'stationery', label: 'Office / Stationery' },
  { id: 'pets', label: 'Pet Shop' },
  { id: 'baby', label: 'Baby Products' },
  { id: 'automotive', label: 'Automotive Accessories' },
  { id: 'gifts', label: 'Flowers & Gifts' },
  { id: 'fragrance', label: 'Perfume & Fragrance' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'audio', label: 'Audio' },
  { id: 'photography', label: 'Camera & Photography' },
  { id: 'books', label: 'Books' },
  { id: 'office_tech', label: 'Office Technology' },
  { id: 'bedding', label: 'Bedding' },
  { id: 'kitchenware', label: 'Kitchenware' },
  { id: 'hardware', label: 'Hardware & Tools' },
  { id: 'cycling', label: 'Bicycle & Cycling' },
  { id: 'travel', label: 'Travel Gear' },
  { id: 'modest_fashion', label: 'Modest Fashion' },
  { id: 'panjabi', label: 'Panjabi / Traditional Menswear' },
  { id: 'saree', label: 'Saree & Women\'s Fashion' },
  { id: 'handicraft', label: 'Handicraft' },
  { id: 'lighting', label: 'Lighting' },
  { id: 'tiles', label: 'Tiles & Sanitary' },
  { id: 'skincare', label: 'Skincare' },
  { id: 'haircare', label: 'Hair Care' },
  { id: 'chocolate', label: 'Chocolate & Gifts' },
  { id: 'bakery', label: 'Bakery' },
  { id: 'seafood', label: 'Fish & Seafood' },
  { id: 'meat', label: 'Meat' },
  { id: 'otc_health', label: 'OTC Health & Personal Care' },
  { id: 'sports', label: 'Sports Equipment' },
  { id: 'agriculture', label: 'Agriculture Supplies' },
  { id: 'events', label: 'Party & Events' },
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
