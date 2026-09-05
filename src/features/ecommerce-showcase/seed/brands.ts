import { projectFormSchema } from '../schemas/project';
import type { PageTypeId } from '../config/page-types';
import { CANONICAL_PACKAGES, type SeedPackage } from './packages';
import { WAVE3_SEED_BRANDS } from './brands-wave3';

export { BITP_ECOMMERCE_SOLUTIONS_SLUG } from '../config/constants';
export type { SeedPackage } from './packages';
export { CANONICAL_PACKAGES } from './packages';

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
  /** When set, use fixed package prices instead of DEFAULT_PACKAGES offsets. */
  packages?: SeedPackage[];
};

const STANDARD_NEW_PAGES: Array<{ type: PageTypeId; name: string; slug: string }> = [
  { type: 'homepage', name: 'Homepage', slug: 'homepage' },
  { type: 'landing_page', name: 'Landing Page', slug: 'landing' },
  { type: 'collection', name: 'Collection', slug: 'collection' },
  { type: 'product_details', name: 'Product Details', slug: 'product' },
  { type: 'cart', name: 'Cart', slug: 'cart' },
  { type: 'checkout', name: 'Checkout', slug: 'checkout' },
  { type: 'about', name: 'About', slug: 'about' },
  { type: 'mobile_view', name: 'Mobile', slug: 'mobile' },
];

const SEED_BRANDS_CORE: SeedBrand[] = [
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
    seo_title: 'Fashion E-commerce Website Template | Bridge IT Park',
    seo_description:
      'Explore a premium fashion e-commerce website template with responsive shopping, product, cart and checkout experiences.',
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
      'Techora is a premium electronics e-commerce template built for high-intent shoppers. Specification-first cards, comparison-friendly layouts, and a streamlined checkout help gadget brands convert with confidence.',
    categorySlug: 'electronics',
    website_type: 'electronics_store',
    industry: 'electronics',
    technology_stack: ['React', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    starting_price: 15000,
    currency: 'BDT',
    featured: true,
    published: true,
    sort_order: 2,
    seo_title: 'Electronics E-commerce Website Template | Bridge IT Park',
    seo_description:
      'Preview a modern electronics store template with landing, shop, product details, cart and checkout pages.',
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
      'FreshBasket is a grocery e-commerce website templateed for organic shops and local markets. Category browsing, weight-based products, and COD-ready checkout keep everyday ordering simple on desktop and mobile.',
    categorySlug: 'grocery',
    website_type: 'grocery_store',
    industry: 'grocery',
    technology_stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind CSS'],
    starting_price: 12000,
    currency: 'BDT',
    featured: true,
    published: true,
    sort_order: 3,
    seo_title: 'Grocery E-commerce Website Template | Bridge IT Park',
    seo_description:
      'Browse an organic grocery website template with shop, category, product, cart and mobile checkout experiences.',
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
    seo_title: 'Beauty E-commerce Website Template | Bridge IT Park',
    seo_description:
      'See a premium cosmetics website template with landing, collection, product details, cart and checkout pages.',
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
    seo_title: 'Furniture E-commerce Website Template | Bridge IT Park',
    seo_description:
      'Explore a furniture and home décor website template with collections, product pages, cart and checkout.',
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
  {
    slug: 'urbano-menswear',
    previousSlugs: [],
    title: 'URBANO Menswear',
    short_description: 'Editorial menswear storefront for shirts, polos, jackets, and lifestyle footwear.',
    full_description:
      'URBANO is a premium men\'s fashion e-commerce template built around black, charcoal, and off-white editorial photography. Lookbook heroes, refined product grids, and a confident checkout help menswear brands sell shirts, pants, jackets, and accessories with clarity.',
    categorySlug: 'fashion',
    website_type: 'fashion_store',
    industry: 'menswear',
    technology_stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    starting_price: 10000,
    currency: 'BDT',
    featured: true,
    published: true,
    sort_order: 6,
    seo_title: "Men's Fashion E-commerce Website Template | Bridge IT Park",
    seo_description:
      'Explore a premium responsive men\'s fashion e-commerce website template for clothing, footwear and lifestyle brands.',
    seo_keywords: ['menswear ecommerce', 'men fashion online shop', 'custom ecommerce Bangladesh'],
    pages: [...STANDARD_NEW_PAGES],
    packages: CANONICAL_PACKAGES,
  },
  {
    slug: 'littleloom-kids',
    previousSlugs: [],
    title: 'LITTLELOOM Kids',
    short_description: 'Clean premium children\'s store for kids clothing, shoes, toys, and accessories.',
    full_description:
      'LITTLELOOM is a premium kids fashion e-commerce template with soft cream, pastel blue, and warm yellow accents. Calm photography, clear size guidance, and a gentle checkout keep children\'s apparel and essentials easy to shop—without cartoon clutter.',
    categorySlug: 'fashion',
    website_type: 'fashion_store',
    industry: 'kids_fashion',
    technology_stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    starting_price: 10000,
    currency: 'BDT',
    featured: false,
    published: true,
    sort_order: 7,
    seo_title: 'Kids Fashion E-commerce Website Template | Bridge IT Park',
    seo_description:
      'Preview a premium children\'s fashion e-commerce website with clothing, shoes, toys and soft responsive shopping.',
    seo_keywords: ['kids fashion ecommerce', 'children clothing website', 'kids online shop Bangladesh'],
    pages: [...STANDARD_NEW_PAGES],
    packages: CANONICAL_PACKAGES,
  },
  {
    slug: 'stepora-footwear',
    previousSlugs: [],
    title: 'STEPORA Footwear',
    short_description: 'Modern sneaker and footwear store with bold neutrals and clear size shopping.',
    full_description:
      'STEPORA is a modern footwear e-commerce template for sneakers, formal shoes, running shoes, and sandals. White and black layouts, large product photography, and size-first product pages help footwear brands convert with confidence.',
    categorySlug: 'fashion',
    website_type: 'fashion_store',
    industry: 'footwear',
    technology_stack: ['React', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    starting_price: 10000,
    currency: 'BDT',
    featured: true,
    published: true,
    sort_order: 8,
    seo_title: 'Footwear E-commerce Website Template | Bridge IT Park',
    seo_description:
      'Browse a modern sneaker and footwear e-commerce website template with product grids, size options, cart and checkout.',
    seo_keywords: ['footwear ecommerce', 'sneaker shop website', 'shoe store Bangladesh'],
    pages: [...STANDARD_NEW_PAGES],
    packages: CANONICAL_PACKAGES,
  },
  {
    slug: 'veloura-bags',
    previousSlugs: [],
    title: 'VELOURA Bags',
    short_description: 'Premium leather and handbag boutique for handbags, wallets, and travel bags.',
    full_description:
      'VELOURA is a cream, brown, and charcoal handbag boutique design. Editorial bag photography, material storytelling, and a refined checkout support premium leather goods, backpacks, wallets, and travel accessories.',
    categorySlug: 'fashion',
    website_type: 'fashion_store',
    industry: 'bags',
    technology_stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    starting_price: 10000,
    currency: 'BDT',
    featured: false,
    published: true,
    sort_order: 9,
    seo_title: 'Bags & Accessories E-commerce Website Template | Bridge IT Park',
    seo_description:
      'See a premium handbag and leather goods e-commerce website with collection pages, product details and checkout.',
    seo_keywords: ['handbag ecommerce', 'leather bags website', 'accessories online shop'],
    pages: [...STANDARD_NEW_PAGES],
    packages: CANONICAL_PACKAGES,
  },
  {
    slug: 'gleamora-jewellery',
    previousSlugs: [],
    title: 'GLEAMORA Jewellery',
    short_description: 'Luxury jewellery commerce for rings, necklaces, earrings, and watches.',
    full_description:
      'GLEAMORA is a luxury jewellery e-commerce template in off-white, gold accents, and deep charcoal. Quiet typography, macro product photography, and trusted checkout help jewellery brands present rings, necklaces, earrings, bracelets, and watches.',
    categorySlug: 'fashion',
    website_type: 'fashion_store',
    industry: 'jewellery',
    technology_stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    starting_price: 10000,
    currency: 'BDT',
    featured: true,
    published: true,
    sort_order: 10,
    seo_title: 'Jewellery E-commerce Website Template | Bridge IT Park',
    seo_description:
      'Explore a luxury jewellery e-commerce website template for rings, necklaces, earrings and premium accessories.',
    seo_keywords: ['jewellery ecommerce', 'jewelry online shop', 'luxury jewellery website Bangladesh'],
    pages: [...STANDARD_NEW_PAGES],
    packages: CANONICAL_PACKAGES,
  },
  {
    slug: 'timevault-watches',
    previousSlugs: [],
    title: 'TIMEVAULT Watches',
    short_description: 'Luxury watch boutique for mechanical watches, smart watches, and straps.',
    full_description:
      'TIMEVAULT is a black, steel, and cream watch boutique design. Specification-forward cards, lifestyle photography, and a precise checkout help watch brands sell luxury timepieces, smart watches, straps, and accessories.',
    categorySlug: 'fashion',
    website_type: 'fashion_store',
    industry: 'watches',
    technology_stack: ['React', 'TypeScript', 'PostgreSQL', 'Tailwind CSS'],
    starting_price: 10000,
    currency: 'BDT',
    featured: false,
    published: true,
    sort_order: 11,
    seo_title: 'Watch Boutique E-commerce Website Template | Bridge IT Park',
    seo_description:
      'Preview a luxury watch e-commerce website with product details, strap options, cart and premium checkout.',
    seo_keywords: ['watch ecommerce', 'luxury watches website', 'smart watch online shop'],
    pages: [...STANDARD_NEW_PAGES],
    packages: CANONICAL_PACKAGES,
  },
  {
    slug: 'fitcore-activewear',
    previousSlugs: [],
    title: 'FITCORE Activewear',
    short_description: 'High-energy fitness commerce for gym clothing, sports shoes, and gear.',
    full_description:
      'FITCORE is a graphite-and-white activewear e-commerce template with subtle energetic accents. Performance product grids, kit builders, and mobile-first CTAs help gym and sports brands sell clothing, shoes, bags, and fitness gear.',
    categorySlug: 'fashion',
    website_type: 'fashion_store',
    industry: 'activewear',
    technology_stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    starting_price: 10000,
    currency: 'BDT',
    featured: false,
    published: true,
    sort_order: 12,
    seo_title: 'Activewear E-commerce Website Template | Bridge IT Park',
    seo_description:
      'Browse a premium gym and sports activewear e-commerce website with product grids, cart and checkout.',
    seo_keywords: ['activewear ecommerce', 'gym clothing website', 'sportswear online shop Bangladesh'],
    pages: [...STANDARD_NEW_PAGES],
    packages: CANONICAL_PACKAGES,
  },
  {
    slug: 'nutriva-foods',
    previousSlugs: [],
    title: 'NUTRIVA Foods',
    short_description: 'Modern nutrition store for protein foods, healthy snacks, and organic items.',
    full_description:
      'NUTRIVA is a white, green, and earth-tone nutrition e-commerce design. Clear category discovery, ingredient-forward cards, and COD-ready checkout help healthy food brands sell snacks, protein foods, organic items, and beverages—without medical claims.',
    categorySlug: 'grocery',
    website_type: 'grocery_store',
    industry: 'nutrition',
    technology_stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    starting_price: 10000,
    currency: 'BDT',
    featured: false,
    published: true,
    sort_order: 13,
    seo_title: 'Healthy Food E-commerce Website Template | Bridge IT Park',
    seo_description:
      'See a modern nutrition and healthy food e-commerce website for snacks, organic items and beverages.',
    seo_keywords: ['healthy food ecommerce', 'nutrition store website', 'organic snacks online shop'],
    pages: [...STANDARD_NEW_PAGES],
    packages: CANONICAL_PACKAGES,
  },
  {
    slug: 'petora',
    previousSlugs: [],
    title: 'PETORA',
    short_description: 'Premium pet commerce for food, toys, grooming, beds, and accessories.',
    full_description:
      'PETORA is a cream and green pet e-commerce template with warm neutrals and real pet photography. Category browsing for dogs and cats, clear product cards, and trusted checkout help pet brands sell food, toys, grooming, beds, and accessories.',
    categorySlug: 'lifestyle',
    website_type: 'local_shop',
    industry: 'pets',
    technology_stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    starting_price: 10000,
    currency: 'BDT',
    featured: false,
    published: true,
    sort_order: 14,
    seo_title: 'Pet Shop E-commerce Website Template | Bridge IT Park',
    seo_description:
      'Explore a premium pet store e-commerce website with food, toys, grooming products, cart and checkout.',
    seo_keywords: ['pet shop ecommerce', 'pet food website', 'pet store Bangladesh'],
    pages: [...STANDARD_NEW_PAGES],
    packages: CANONICAL_PACKAGES,
  },
  {
    slug: 'babynest-store',
    previousSlugs: [],
    title: 'BABYNEST',
    short_description: 'Premium baby care shop for clothing, feeding, toys, strollers, and essentials.',
    full_description:
      'BABYNEST is a cream, soft beige, and pastel baby e-commerce design. Calm layouts, age-based discovery, and a trusted checkout help parents shop baby care, clothing, feeding, toys, strollers, and everyday essentials.',
    categorySlug: 'lifestyle',
    website_type: 'local_shop',
    industry: 'baby',
    technology_stack: ['React', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    starting_price: 10000,
    currency: 'BDT',
    featured: false,
    published: true,
    sort_order: 15,
    seo_title: 'Baby Products E-commerce Website Template | Bridge IT Park',
    seo_description:
      'Browse a premium baby care e-commerce website for clothing, feeding, toys, strollers and essentials.',
    seo_keywords: ['baby products ecommerce', 'baby care website', 'baby store Bangladesh'],
    pages: [...STANDARD_NEW_PAGES],
    packages: CANONICAL_PACKAGES,
  },
  {
    slug: 'motogear-auto',
    previousSlugs: [],
    title: 'MOTOGEAR',
    short_description: 'Premium automotive accessories for cars, bikes, helmets, lights, and tools.',
    full_description:
      'MOTOGEAR is a black and dark-gray automotive accessories store with restrained red accents. Spec-forward cards, vehicle-fit filters, and a practical checkout help auto brands sell car and bike accessories, helmets, lights, cleaning kits, and tools.',
    categorySlug: 'lifestyle',
    website_type: 'local_shop',
    industry: 'automotive',
    technology_stack: ['Laravel', 'React', 'PostgreSQL', 'Tailwind CSS'],
    starting_price: 10000,
    currency: 'BDT',
    featured: false,
    published: true,
    sort_order: 16,
    seo_title: 'Automotive Accessories E-commerce Website Template | Bridge IT Park',
    seo_description:
      'Preview a premium automotive accessories e-commerce website for car and bike gear, helmets and tools.',
    seo_keywords: ['auto accessories ecommerce', 'bike gear website', 'car accessories online shop'],
    pages: [
      ...STANDARD_NEW_PAGES.slice(0, 7),
      { type: 'contact', name: 'Contact', slug: 'contact' },
      { type: 'mobile_view', name: 'Mobile', slug: 'mobile' },
    ],
    packages: CANONICAL_PACKAGES,
  },
  {
    slug: 'mobilehub-store',
    previousSlugs: [],
    title: 'MOBILEHUB',
    short_description: 'Mobile-first electronics commerce for phones, chargers, earbuds, and cases.',
    full_description:
      'MOBILEHUB is a white and dark-navy mobile accessories e-commerce design—distinct from broad electronics catalogs. Spec chips, accessory bundles, and a fast checkout help phone shops sell smartphones, chargers, earbuds, power banks, cases, and smart watches.',
    categorySlug: 'electronics',
    website_type: 'electronics_store',
    industry: 'mobile',
    technology_stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    starting_price: 10000,
    currency: 'BDT',
    featured: true,
    published: true,
    sort_order: 17,
    seo_title: 'Mobile Shop E-commerce Website Template | Bridge IT Park',
    seo_description:
      'Premium mobile phone and accessories e-commerce website with responsive product, cart and checkout experiences.',
    seo_keywords: ['mobile shop ecommerce', 'phone accessories website', 'smartphone store Bangladesh'],
    pages: [...STANDARD_NEW_PAGES],
    packages: CANONICAL_PACKAGES,
  },
  {
    slug: 'homeapply-appliances',
    previousSlugs: [],
    title: 'HOMEAPPLY',
    short_description: 'Clean large-appliance commerce for fridge, AC, TV, washing machines, and ovens.',
    full_description:
      'HOMEAPPLY is a white, navy, and cool-gray appliance e-commerce design. Spec comparison layouts, delivery messaging, and a trusted checkout help appliance retailers sell fridges, ACs, TVs, washing machines, ovens, and small appliances.',
    categorySlug: 'electronics',
    website_type: 'electronics_store',
    industry: 'appliances',
    technology_stack: ['Laravel', 'React', 'PostgreSQL', 'Tailwind CSS'],
    starting_price: 10000,
    currency: 'BDT',
    featured: false,
    published: true,
    sort_order: 18,
    seo_title: 'Home Appliances E-commerce Website Template | Bridge IT Park',
    seo_description:
      'Explore a clean home appliances e-commerce website for fridge, AC, TV, washing machine and small appliances.',
    seo_keywords: ['home appliances ecommerce', 'electronics appliance website', 'fridge AC online shop'],
    pages: [
      ...STANDARD_NEW_PAGES.slice(0, 7),
      { type: 'contact', name: 'Contact', slug: 'contact' },
      { type: 'mobile_view', name: 'Mobile', slug: 'mobile' },
    ],
    packages: CANONICAL_PACKAGES,
  },
  {
    slug: 'craftdesk-stationery',
    previousSlugs: [],
    title: 'CRAFTDESK',
    short_description: 'Premium stationery store for notebooks, pens, organizers, and creative tools.',
    full_description:
      'CRAFTDESK is a warm-white and forest-green stationery e-commerce design. Organized category grids, desk-lifestyle photography, and a calm checkout help stationery brands sell notebooks, pens, office tools, organizers, school items, and creative supplies.',
    categorySlug: 'furniture',
    website_type: 'local_shop',
    industry: 'stationery',
    technology_stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    starting_price: 10000,
    currency: 'BDT',
    featured: false,
    published: true,
    sort_order: 19,
    seo_title: 'Stationery E-commerce Website Template | Bridge IT Park',
    seo_description:
      'Browse a premium office and stationery e-commerce website for notebooks, pens, organizers and school items.',
    seo_keywords: ['stationery ecommerce', 'office supplies website', 'notebooks online shop'],
    pages: [...STANDARD_NEW_PAGES],
    packages: CANONICAL_PACKAGES,
  },
  {
    slug: 'bloomora-gifts',
    previousSlugs: [],
    title: 'BLOOMORA',
    short_description: 'Premium flower and gifting commerce for bouquets, gift boxes, and occasion gifts.',
    full_description:
      'BLOOMORA is a white, soft pink, and deep-green flower and gifts e-commerce design. Elegant bouquet photography, occasion filters, and a warm checkout help florists sell flowers, bouquets, gift boxes, chocolates, and occasion gifts.',
    categorySlug: 'lifestyle',
    website_type: 'local_shop',
    industry: 'gifts',
    technology_stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    starting_price: 10000,
    currency: 'BDT',
    featured: true,
    published: true,
    sort_order: 20,
    seo_title: 'Flower & Gifts E-commerce Website Template | Bridge IT Park',
    seo_description:
      'See a premium flower and gifting e-commerce website for bouquets, gift boxes, chocolates and occasions.',
    seo_keywords: ['flower ecommerce', 'gift shop website', 'bouquet online shop Bangladesh'],
    pages: [...STANDARD_NEW_PAGES],
    packages: CANONICAL_PACKAGES,
  },
];

export const SEED_BRANDS: SeedBrand[] = [...SEED_BRANDS_CORE, ...WAVE3_SEED_BRANDS];

/** Legacy offset packages for the original five projects only. */
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

export function resolveSeedPackages(brand: SeedBrand): Array<SeedPackage & { sort_order: number }> {
  if (brand.packages?.length) {
    return brand.packages.map((pkg, index) => ({ ...pkg, sort_order: index }));
  }
  return DEFAULT_PACKAGES.map((pkg, index) => ({
    name: pkg.name,
    price: brand.starting_price + pkg.priceOffset,
    short_description: pkg.short_description,
    features: pkg.features,
    is_popular: pkg.is_popular,
    sort_order: index,
  }));
}

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
