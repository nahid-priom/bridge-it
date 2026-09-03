import type { SeedBrand } from './brands';
import { CANONICAL_PACKAGES, type SeedPackage } from './packages';
import type { PageTypeId } from '../config/page-types';

const PAGES: Array<{ type: PageTypeId; name: string; slug: string }> = [
  { type: 'homepage', name: 'Homepage', slug: 'homepage' },
  { type: 'landing_page', name: 'Landing Page', slug: 'landing' },
  { type: 'collection', name: 'Collection', slug: 'collection' },
  { type: 'product_details', name: 'Product Details', slug: 'product' },
  { type: 'cart', name: 'Cart', slug: 'cart' },
  { type: 'checkout', name: 'Checkout', slug: 'checkout' },
  { type: 'about', name: 'About', slug: 'about' },
  { type: 'mobile_view', name: 'Mobile', slug: 'mobile' },
];

const pkgs = CANONICAL_PACKAGES as SeedPackage[];
const tech = ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'] as const;
const techReact = ['React', 'TypeScript', 'Supabase', 'Tailwind CSS'] as const;
const techLaravel = ['Laravel', 'React', 'PostgreSQL', 'Tailwind CSS'] as const;

function brand(
  partial: Omit<SeedBrand, 'previousSlugs' | 'starting_price' | 'currency' | 'published' | 'packages' | 'pages' | 'technology_stack'> & {
    technology_stack?: string[];
    pages?: SeedBrand['pages'];
  }
): SeedBrand {
  return {
    previousSlugs: [],
    starting_price: 5000,
    currency: 'BDT',
    published: true,
    packages: pkgs,
    pages: partial.pages ?? [...PAGES],
    technology_stack: partial.technology_stack ?? [...tech],
    ...partial,
  };
}

/** Wave-3 expansion: 30 additional ecommerce showcase brands (sort_order 21–50). */
export const WAVE3_SEED_BRANDS: SeedBrand[] = [
  brand({
    slug: 'lumera-perfume',
    title: 'LUMÉRA',
    short_description: 'Luxury fragrance boutique for perfume, attar, and gift sets.',
    full_description:
      'LUMÉRA is a black-and-ivory fragrance e-commerce design with soft gold accents and cinematic bottle photography. Quiet navigation, product spotlight heroes, and a refined checkout help perfume brands present attars, body mists, and gift sets with editorial clarity.',
    categorySlug: 'cosmetics',
    website_type: 'cosmetics_store',
    industry: 'fragrance',
    featured: true,
    sort_order: 21,
    seo_title: 'Perfume E-commerce Website Design | Bridge IT Park',
    seo_description:
      'Explore a luxury fragrance e-commerce website design for perfume, attar, body mist and gift sets.',
    seo_keywords: ['perfume ecommerce', 'fragrance website Bangladesh', 'luxury perfume shop'],
  }),
  brand({
    slug: 'beanora-coffee',
    title: 'BEANORA',
    short_description: 'Premium artisan coffee store for beans, brewing tools, and gifts.',
    full_description:
      'BEANORA is a warm espresso-brown coffee commerce design. Lifestyle photography, roast stories, and weight-based product options help coffee brands sell beans, ground coffee, brewing tools, and gift boxes.',
    categorySlug: 'grocery',
    website_type: 'grocery_store',
    industry: 'coffee',
    featured: false,
    sort_order: 22,
    seo_title: 'Coffee Shop E-commerce Website Design | Bridge IT Park',
    seo_description:
      'Browse a premium artisan coffee e-commerce website for beans, ground coffee, brewing tools and gifts.',
    seo_keywords: ['coffee ecommerce', 'coffee beans online shop', 'artisan coffee website'],
  }),
  brand({
    slug: 'greenroot-organic',
    title: 'GREENROOT',
    short_description: 'Farm-to-home organic grocery for vegetables, fruits, and staples.',
    full_description:
      'GREENROOT is a cream and deep-green organic commerce design distinct from neighbourhood grocery templates. Farm photography, weekly harvest grids, and trusted COD checkout help organic shops sell produce, staples, and honey.',
    categorySlug: 'grocery',
    website_type: 'grocery_store',
    industry: 'organic_food',
    featured: false,
    sort_order: 23,
    seo_title: 'Organic Grocery E-commerce Website Design | Bridge IT Park',
    seo_description:
      'See a farm-to-home organic grocery website design for vegetables, fruits, staples and honey.',
    seo_keywords: ['organic grocery ecommerce', 'farm fresh website', 'organic food online shop'],
  }),
  brand({
    slug: 'gamenova-store',
    title: 'GAMENOVA',
    short_description: 'Premium gaming commerce for keyboards, headsets, and chairs.',
    full_description:
      'GAMENOVA is a dark graphite gaming storefront with restrained electric accents—no neon overload. Cinematic product lighting and spec-forward cards help gear brands sell keyboards, mice, headsets, controllers, and chairs.',
    categorySlug: 'electronics',
    website_type: 'electronics_store',
    industry: 'gaming',
    technology_stack: [...techReact],
    featured: true,
    sort_order: 24,
    seo_title: 'Gaming Store E-commerce Website Design | Bridge IT Park',
    seo_description:
      'Preview a premium gaming e-commerce website for keyboards, mouse, headsets, controllers and chairs.',
    seo_keywords: ['gaming ecommerce', 'gaming gear website', 'esports shop Bangladesh'],
  }),
  brand({
    slug: 'soundora-audio',
    title: 'SOUNDORA',
    short_description: 'Minimal premium audio commerce for headphones, speakers, and mics.',
    full_description:
      'SOUNDORA is a dark, warm-lit audio boutique. Huge product spotlights, clean specs, and a quiet checkout help audio brands sell headphones, speakers, earbuds, DACs, and microphones.',
    categorySlug: 'electronics',
    website_type: 'electronics_store',
    industry: 'audio',
    featured: false,
    sort_order: 25,
    seo_title: 'Audio Equipment E-commerce Website Design | Bridge IT Park',
    seo_description:
      'Explore a minimal premium audio e-commerce website for headphones, speakers, earbuds and microphones.',
    seo_keywords: ['audio ecommerce', 'headphones online shop', 'speaker store website'],
  }),
  brand({
    slug: 'camerix-photography',
    title: 'CAMERIX',
    short_description: 'Professional camera and photography gear storefront.',
    full_description:
      'CAMERIX is a cinematic camera equipment design with close-up lens photography. Kit builders, body/lens options, and trusted checkout help photo shops sell cameras, lenses, gimbals, lights, and bags.',
    categorySlug: 'electronics',
    website_type: 'electronics_store',
    industry: 'photography',
    technology_stack: [...techLaravel],
    featured: true,
    sort_order: 26,
    seo_title: 'Camera Shop E-commerce Website Design | Bridge IT Park',
    seo_description:
      'Browse a professional camera e-commerce website for cameras, lenses, gimbals, lights and bags.',
    seo_keywords: ['camera ecommerce', 'photography gear website', 'lens shop Bangladesh'],
  }),
  brand({
    slug: 'bookora-books',
    title: 'BOOKORA',
    short_description: 'Modern bookstore for Bangla, English, business, and children’s books.',
    full_description:
      'BOOKORA is a warm paper-and-cream bookstore design with dark green accents. Magazine-style merchandising helps bookshops sell Bangla and English titles, business books, and children’s collections.',
    categorySlug: 'lifestyle',
    website_type: 'local_shop',
    industry: 'books',
    featured: false,
    sort_order: 27,
    seo_title: 'Bookstore E-commerce Website Design | Bridge IT Park',
    seo_description:
      'See a modern bookstore e-commerce website for Bangla, English, business and children books.',
    seo_keywords: ['bookstore ecommerce', 'online book shop Bangladesh', 'Bangla books website'],
  }),
  brand({
    slug: 'techdesk-office',
    title: 'TECHDESK',
    short_description: 'Clean productivity commerce for laptops, monitors, and desks.',
    full_description:
      'TECHDESK is a clean white office-technology storefront—distinct from broad gadget catalogs. Split heroes and workstation bundles help brands sell laptops, monitors, keyboards, desks, and accessories.',
    categorySlug: 'electronics',
    website_type: 'electronics_store',
    industry: 'office_tech',
    featured: false,
    sort_order: 28,
    seo_title: 'Office Tech E-commerce Website Design | Bridge IT Park',
    seo_description:
      'Preview a productivity-focused office technology website for laptops, monitors, keyboards and desks.',
    seo_keywords: ['office tech ecommerce', 'laptop monitor shop', 'workstation website'],
  }),
  brand({
    slug: 'sleepnest-bedding',
    title: 'SLEEPNEST',
    short_description: 'Soft premium bedding for sheets, pillows, and comforters.',
    full_description:
      'SLEEPNEST is a white-and-beige bedding lifestyle design. Warm bedroom photography and fabric-first product pages help home brands sell bedsheets, pillows, comforters, and mattress accessories.',
    categorySlug: 'furniture',
    website_type: 'furniture_store',
    industry: 'bedding',
    featured: false,
    sort_order: 29,
    seo_title: 'Bedding E-commerce Website Design | Bridge IT Park',
    seo_description:
      'Explore a premium bedding e-commerce website for bedsheets, pillows, comforters and accessories.',
    seo_keywords: ['bedding ecommerce', 'bedsheet online shop', 'home textile website'],
  }),
  brand({
    slug: 'kitchora-kitchen',
    title: 'KITCHORA',
    short_description: 'Premium modern kitchenware for cookware, knives, and dinnerware.',
    full_description:
      'KITCHORA is a modern kitchen commerce design with bento-style category tiles. Realistic cookware photography helps kitchen brands sell pots, knives, storage, dinnerware, and small appliances.',
    categorySlug: 'furniture',
    website_type: 'furniture_store',
    industry: 'kitchenware',
    featured: false,
    sort_order: 30,
    seo_title: 'Kitchenware E-commerce Website Design | Bridge IT Park',
    seo_description:
      'Browse a premium kitchenware e-commerce website for cookware, knives, storage and dinnerware.',
    seo_keywords: ['kitchenware ecommerce', 'cookware online shop', 'kitchen store website'],
  }),
  brand({
    slug: 'toolmate-hardware',
    title: 'TOOLMATE',
    short_description: 'Industrial-clean hardware store for drills, kits, and safety gear.',
    full_description:
      'TOOLMATE is an industrial-but-clean tools commerce design. Category-first navigation and kit cards help hardware shops sell drills, hand tools, electrical tools, tool kits, and safety equipment.',
    categorySlug: 'specialty',
    website_type: 'local_shop',
    industry: 'hardware',
    technology_stack: [...techLaravel],
    featured: false,
    sort_order: 31,
    seo_title: 'Hardware Tools E-commerce Website Design | Bridge IT Park',
    seo_description:
      'See a clean hardware e-commerce website for drills, hand tools, tool kits and safety equipment.',
    seo_keywords: ['hardware ecommerce', 'tools online shop', 'power tools website Bangladesh'],
  }),
  brand({
    slug: 'ridevault-cycling',
    title: 'RIDEVAULT',
    short_description: 'Sports editorial cycling store for bikes, helmets, and apparel.',
    full_description:
      'RIDEVAULT is a sports-editorial cycling design with full-bleed lifestyle heroes. Clear category grids help bike shops sell bicycles, helmets, apparel, lights, and accessories.',
    categorySlug: 'sports',
    website_type: 'local_shop',
    industry: 'cycling',
    featured: false,
    sort_order: 32,
    seo_title: 'Cycling Store E-commerce Website Design | Bridge IT Park',
    seo_description:
      'Preview a premium cycling e-commerce website for bicycles, helmets, apparel and accessories.',
    seo_keywords: ['cycling ecommerce', 'bicycle shop website', 'bike gear online shop'],
  }),
  brand({
    slug: 'travelora-gear',
    title: 'TRAVELORA',
    short_description: 'Premium travel lifestyle store for luggage and organizers.',
    full_description:
      'TRAVELORA is a premium travel-gear design with destination lifestyle photography. Product stories and size guides help brands sell luggage, backpacks, organizers, and travel accessories.',
    categorySlug: 'lifestyle',
    website_type: 'local_shop',
    industry: 'travel',
    featured: false,
    sort_order: 33,
    seo_title: 'Travel Gear E-commerce Website Design | Bridge IT Park',
    seo_description:
      'Explore a premium travel gear e-commerce website for luggage, backpacks and organizers.',
    seo_keywords: ['travel gear ecommerce', 'luggage online shop', 'backpack store website'],
  }),
  brand({
    slug: 'hijabe-modest-fashion',
    title: 'HIJABÉ',
    short_description: 'Premium editorial modest fashion for hijab, abaya, and dresses.',
    full_description:
      'HIJABÉ is a premium modest-fashion editorial storefront—not a generic template. Lookbook merchandising and refined filters help brands sell hijab, abaya, modest dresses, and accessories.',
    categorySlug: 'fashion',
    website_type: 'fashion_store',
    industry: 'modest_fashion',
    featured: false,
    sort_order: 34,
    seo_title: 'Modest Fashion E-commerce Website Design | Bridge IT Park',
    seo_description:
      'Browse a premium modest fashion e-commerce website for hijab, abaya, dresses and accessories.',
    seo_keywords: ['modest fashion ecommerce', 'hijab online shop', 'abaya website Bangladesh'],
  }),
  brand({
    slug: 'panjabi-house',
    title: 'PANJABI HOUSE',
    short_description: 'Premium Bangladeshi festive fashion for Panjabi and traditional wear.',
    full_description:
      'PANJABI HOUSE is a festive Bangladeshi menswear design with realistic South Asian fashion photography. Collection rooms for Panjabi, pajama, and waistcoat help clothing businesses sell traditional wear with confidence.',
    categorySlug: 'fashion',
    website_type: 'fashion_store',
    industry: 'panjabi',
    featured: true,
    sort_order: 35,
    seo_title: 'Panjabi E-commerce Website Design | Bridge IT Park',
    seo_description:
      'Explore a premium responsive Panjabi and traditional fashion e-commerce website for Bangladeshi clothing businesses.',
    seo_keywords: ['panjabi ecommerce', 'traditional fashion website', 'Eid panjabi online shop'],
  }),
  brand({
    slug: 'sareeva',
    title: 'SAREEVA',
    short_description: 'Luxury South Asian saree editorial for Jamdani, silk, and party wear.',
    full_description:
      'SAREEVA is a luxury saree editorial commerce design. Magazine layouts and fabric-first galleries help boutiques sell Jamdani, silk, cotton, and party sarees with cinematic clarity.',
    categorySlug: 'fashion',
    website_type: 'fashion_store',
    industry: 'saree',
    featured: true,
    sort_order: 36,
    seo_title: 'Saree E-commerce Website Design | Bridge IT Park',
    seo_description:
      'See a luxury saree e-commerce website design for Jamdani, silk, cotton and party sarees.',
    seo_keywords: ['saree ecommerce', 'Jamdani online shop', 'silk saree website Bangladesh'],
  }),
  brand({
    slug: 'deshi-craft',
    title: 'DESHI CRAFT',
    short_description: 'Bangladeshi artisan marketplace for jute, handmade decor, and gifts.',
    full_description:
      'DESHI CRAFT is an artisan marketplace design with mosaic craft photography—no cartoons. Maker stories and category mosaics help craft brands sell jute products, baskets, bags, and handmade gifts.',
    categorySlug: 'lifestyle',
    website_type: 'multi_vendor',
    industry: 'handicraft',
    featured: false,
    sort_order: 37,
    seo_title: 'Handicraft E-commerce Website Design | Bridge IT Park',
    seo_description:
      'Preview a Bangladeshi handicraft e-commerce website for jute products, decor, baskets and gifts.',
    seo_keywords: ['handicraft ecommerce', 'jute products website', 'artisan marketplace Bangladesh'],
  }),
  brand({
    slug: 'furnova-furniture',
    title: 'FURNOVA',
    short_description: 'Architectural luxury furniture for sofas, beds, and dining.',
    full_description:
      'FURNOVA is an architectural luxury furniture design—visually distinct from gallery-calm HomeNest. Minimal whitespace, large room photography, and finish options help furniture brands sell sofas, beds, dining, and storage.',
    categorySlug: 'furniture',
    website_type: 'furniture_store',
    industry: 'furniture',
    technology_stack: [...techLaravel],
    featured: true,
    sort_order: 38,
    seo_title: 'Luxury Furniture E-commerce Website Design | Bridge IT Park',
    seo_description:
      'Explore an architectural luxury furniture website for sofas, beds, dining tables and storage.',
    seo_keywords: ['furniture ecommerce', 'luxury sofa website', 'dining table online shop'],
  }),
  brand({
    slug: 'lightora-lighting',
    title: 'LIGHTORA',
    short_description: 'Dark architectural lighting store for pendants, lamps, and outdoor.',
    full_description:
      'LIGHTORA is a dark cinematic lighting showroom. Dramatic interior photography and size/temperature options help lighting brands sell pendants, lamps, wall lights, and outdoor fixtures.',
    categorySlug: 'furniture',
    website_type: 'furniture_store',
    industry: 'lighting',
    featured: true,
    sort_order: 39,
    seo_title: 'Lighting Store E-commerce Website Design | Bridge IT Park',
    seo_description:
      'Browse a premium lighting e-commerce website for pendant lights, lamps and outdoor lighting.',
    seo_keywords: ['lighting ecommerce', 'pendant light shop', 'lamp store website'],
  }),
  brand({
    slug: 'tileora-tiles',
    title: 'TILEORA',
    short_description: 'Premium tiles and sanitary showroom for floors, basins, and faucets.',
    full_description:
      'TILEORA is a premium architectural tiles and sanitary design. Split heroes and room visualizers help showrooms sell floor tiles, wall tiles, basins, faucets, and bathroom accessories.',
    categorySlug: 'specialty',
    website_type: 'local_shop',
    industry: 'tiles',
    featured: false,
    sort_order: 40,
    seo_title: 'Tiles & Sanitary E-commerce Website Design | Bridge IT Park',
    seo_description:
      'See a premium tiles and sanitary e-commerce website for floor tiles, basins and faucets.',
    seo_keywords: ['tiles ecommerce', 'sanitary ware website', 'bathroom fittings online shop'],
  }),
  brand({
    slug: 'skinlab-care',
    title: 'SKINLAB',
    short_description: 'Clinical modern skincare for serums, cleansers, and sunscreen.',
    full_description:
      'SKINLAB is a clean clinical skincare design—distinct from soft luxury beauty. Science-inspired cards and routine builders help brands sell serum, cleanser, moisturizer, and sunscreen without medical claims.',
    categorySlug: 'cosmetics',
    website_type: 'cosmetics_store',
    industry: 'skincare',
    featured: false,
    sort_order: 41,
    seo_title: 'Skincare E-commerce Website Design | Bridge IT Park',
    seo_description:
      'Preview a clinical modern skincare e-commerce website for serum, cleanser, moisturizer and sunscreen.',
    seo_keywords: ['skincare ecommerce', 'serum online shop', 'clinical beauty website'],
  }),
  brand({
    slug: 'hairora-care',
    title: 'HAIRORA',
    short_description: 'Premium hair-care editorial for shampoo, oil, and styling.',
    full_description:
      'HAIRORA is a premium hair-care editorial storefront. Carousel-led discovery and routine kits help brands sell shampoo, conditioner, hair oil, serum, and styling products.',
    categorySlug: 'cosmetics',
    website_type: 'cosmetics_store',
    industry: 'haircare',
    featured: false,
    sort_order: 42,
    seo_title: 'Hair Care E-commerce Website Design | Bridge IT Park',
    seo_description:
      'Explore a premium hair care e-commerce website for shampoo, conditioner, hair oil and serum.',
    seo_keywords: ['haircare ecommerce', 'shampoo online shop', 'hair oil website Bangladesh'],
  }),
  brand({
    slug: 'chocora-chocolate',
    title: 'CHOCORA',
    short_description: 'Dark chocolate luxury store for truffles and gift boxes.',
    full_description:
      'CHOCORA is a dark chocolate luxury design with product-spotlight heroes. Occasion filters and gift builders help confectioners sell premium chocolates, truffles, and gift boxes.',
    categorySlug: 'grocery',
    website_type: 'grocery_store',
    industry: 'chocolate',
    featured: true,
    sort_order: 43,
    seo_title: 'Chocolate Gift E-commerce Website Design | Bridge IT Park',
    seo_description:
      'Browse a luxury chocolate e-commerce website for premium chocolates, truffles and gift boxes.',
    seo_keywords: ['chocolate ecommerce', 'gift chocolate website', 'truffle online shop'],
  }),
  brand({
    slug: 'sweetbox-bakery',
    title: 'SWEETBOX',
    short_description: 'Bright premium bakery for cakes, desserts, and gift boxes.',
    full_description:
      'SWEETBOX is a bright bakery commerce design with realistic dessert photography. Mosaic category tiles and occasion CTAs help bakeries sell cakes, cookies, desserts, and gift boxes.',
    categorySlug: 'grocery',
    website_type: 'grocery_store',
    industry: 'bakery',
    featured: false,
    sort_order: 44,
    seo_title: 'Bakery E-commerce Website Design | Bridge IT Park',
    seo_description:
      'See a premium bakery e-commerce website for cakes, desserts, cookies and gift boxes.',
    seo_keywords: ['bakery ecommerce', 'cake online shop', 'dessert website Bangladesh'],
  }),
  brand({
    slug: 'fishmart-seafood',
    title: 'FISHMART',
    short_description: 'Clean fresh seafood commerce for local fish and family packs.',
    full_description:
      'FISHMART is a clean fresh-seafood design—not a generic grocery clone. Category-first catch-of-day grids and COD delivery messaging help fish sellers sell local fish, seafood, frozen packs, and family packs.',
    categorySlug: 'grocery',
    website_type: 'grocery_store',
    industry: 'seafood',
    featured: false,
    sort_order: 45,
    seo_title: 'Fish & Seafood E-commerce Website Design | Bridge IT Park',
    seo_description:
      'Preview a fresh fish and seafood e-commerce website for local fish, frozen packs and family packs.',
    seo_keywords: ['fish ecommerce', 'seafood online shop', 'fresh fish website Bangladesh'],
  }),
  brand({
    slug: 'meatmart-premium',
    title: 'MEATMART',
    short_description: 'Premium fresh meat commerce for beef, mutton, and chicken.',
    full_description:
      'MEATMART is a premium meat commerce design with tasteful food photography. Split heroes and cut guides help butchers sell beef, mutton, chicken, and ready-to-cook products.',
    categorySlug: 'grocery',
    website_type: 'grocery_store',
    industry: 'meat',
    featured: false,
    sort_order: 46,
    seo_title: 'Meat Shop E-commerce Website Design | Bridge IT Park',
    seo_description:
      'Explore a premium meat e-commerce website for beef, mutton, chicken and ready-to-cook products.',
    seo_keywords: ['meat ecommerce', 'beef mutton online shop', 'halal meat website'],
  }),
  brand({
    slug: 'pharmora-health',
    title: 'PHARMORA',
    short_description: 'Clean OTC health store for personal care and wellness essentials.',
    full_description:
      'PHARMORA is a trustworthy OTC health and personal-care design. Clean cards and clear categories help pharmacies sell personal care, first aid, wellness, baby care, and hygiene—without prescription drug flows or treatment claims.',
    categorySlug: 'specialty',
    website_type: 'local_shop',
    industry: 'otc_health',
    featured: false,
    sort_order: 47,
    seo_title: 'Health Store E-commerce Website Design | Bridge IT Park',
    seo_description:
      'Browse a clean OTC health and personal care e-commerce website for wellness and hygiene essentials.',
    seo_keywords: ['health store ecommerce', 'personal care website', 'OTC wellness online shop'],
  }),
  brand({
    slug: 'sportiva-sports',
    title: 'SPORTIVA',
    short_description: 'Dynamic sports commerce for football, cricket, and fitness gear.',
    full_description:
      'SPORTIVA is a dynamic sports-equipment design with full-bleed athletic heroes. Bold hierarchy helps sports shops sell football, cricket, badminton, fitness equipment, and sportswear.',
    categorySlug: 'sports',
    website_type: 'local_shop',
    industry: 'sports',
    featured: false,
    sort_order: 48,
    seo_title: 'Sports Equipment E-commerce Website Design | Bridge IT Park',
    seo_description:
      'See a dynamic sports e-commerce website for football, cricket, badminton and fitness equipment.',
    seo_keywords: ['sports ecommerce', 'cricket gear website', 'football shop Bangladesh'],
  }),
  brand({
    slug: 'agrimart-store',
    title: 'AGRIMART',
    short_description: 'Modern agriculture supplies for farm tools and irrigation.',
    full_description:
      'AGRIMART is a modern agriculture commerce design. Category-first tool grids help agri shops sell farm tools, irrigation accessories, feed accessories, and general farm equipment—without restricted chemicals.',
    categorySlug: 'specialty',
    website_type: 'local_shop',
    industry: 'agriculture',
    technology_stack: [...techLaravel],
    featured: false,
    sort_order: 49,
    seo_title: 'Agriculture Supplies E-commerce Website Design | Bridge IT Park',
    seo_description:
      'Preview a modern agriculture supplies e-commerce website for farm tools and irrigation accessories.',
    seo_keywords: ['agriculture ecommerce', 'farm tools website', 'irrigation shop Bangladesh'],
  }),
  brand({
    slug: 'partybox-events',
    title: 'PARTYBOX',
    short_description: 'Premium party and event supplies for décor and gift packaging.',
    full_description:
      'PARTYBOX is a colorful-but-premium event supplies design without childish clutter. Bento commerce tiles help event sellers sell decorations, gift packaging, balloons, accessories, and party sets.',
    categorySlug: 'lifestyle',
    website_type: 'local_shop',
    industry: 'events',
    featured: false,
    sort_order: 50,
    seo_title: 'Party Supplies E-commerce Website Design | Bridge IT Park',
    seo_description:
      'Explore a premium party and event supplies e-commerce website for décor, balloons and gift packaging.',
    seo_keywords: ['party supplies ecommerce', 'event décor website', 'balloon shop online'],
  }),
];
