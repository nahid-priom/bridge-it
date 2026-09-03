import path from 'node:path';
import { access } from 'node:fs/promises';

export type EcommerceSeedAsset = {
  slug: string;
  folder: string;
  cover: string;
  pages: Record<string, string>;
};

const STANDARD_NEW_PAGES: Record<string, string> = {
  homepage: 'homepage.png',
  landing: 'landing.png',
  collection: 'collection.png',
  product: 'product.png',
  cart: 'cart.png',
  checkout: 'checkout.png',
  about: 'about.png',
  mobile: 'mobile.png',
};

const STANDARD_WITH_CONTACT: Record<string, string> = {
  ...STANDARD_NEW_PAGES,
  contact: 'contact.png',
};

/**
 * Prepared local assets for showcase projects.
 * Primary root: seed-assets/ecommerce/{folder}/
 * Also checks generated Cursor assets and the legacy showcase tree.
 */
export const ECOMMERCE_SEED_PROJECTS: EcommerceSeedAsset[] = [
  {
    slug: 'noire-fashion',
    folder: 'noire-fashion',
    cover: 'cover.png',
    pages: {
      homepage: 'homepage.png',
      shop: 'shop.png',
      category: 'category.png',
      product: 'product.png',
      cart: 'cart.png',
      checkout: 'checkout.png',
      about: 'about.png',
      mobile: 'mobile.png',
    },
  },
  {
    slug: 'techora-electronics',
    folder: 'techora-electronics',
    cover: 'cover.png',
    pages: {
      homepage: 'homepage.png',
      landing: 'landing.png',
      shop: 'shop.png',
      product: 'product.png',
      cart: 'cart.png',
      checkout: 'checkout.png',
      contact: 'contact.png',
      mobile: 'mobile.png',
    },
  },
  {
    slug: 'freshbasket',
    folder: 'freshbasket',
    cover: 'cover.png',
    pages: {
      homepage: 'homepage.png',
      category: 'category.png',
      shop: 'shop.png',
      product: 'product.png',
      cart: 'cart.png',
      checkout: 'checkout.png',
      mobile: 'mobile.png',
    },
  },
  {
    slug: 'aura-beauty',
    folder: 'aura-beauty',
    cover: 'cover.png',
    pages: {
      homepage: 'homepage.png',
      landing: 'landing.png',
      collection: 'collection.png',
      product: 'product.png',
      cart: 'cart.png',
      checkout: 'checkout.png',
      about: 'about.png',
      mobile: 'mobile.png',
    },
  },
  {
    slug: 'homenest',
    folder: 'homenest',
    cover: 'cover.png',
    pages: {
      homepage: 'homepage.png',
      collection: 'collection.png',
      product: 'product.png',
      cart: 'cart.png',
      checkout: 'checkout.png',
      about: 'about.png',
      contact: 'contact.png',
      mobile: 'mobile.png',
    },
  },
  {
    slug: 'urbano-menswear',
    folder: 'urbano-menswear',
    cover: 'cover.png',
    pages: { ...STANDARD_NEW_PAGES },
  },
  {
    slug: 'littleloom-kids',
    folder: 'littleloom-kids',
    cover: 'cover.png',
    pages: { ...STANDARD_NEW_PAGES },
  },
  {
    slug: 'stepora-footwear',
    folder: 'stepora-footwear',
    cover: 'cover.png',
    pages: { ...STANDARD_NEW_PAGES },
  },
  {
    slug: 'veloura-bags',
    folder: 'veloura-bags',
    cover: 'cover.png',
    pages: { ...STANDARD_NEW_PAGES },
  },
  {
    slug: 'gleamora-jewellery',
    folder: 'gleamora-jewellery',
    cover: 'cover.png',
    pages: { ...STANDARD_NEW_PAGES },
  },
  {
    slug: 'timevault-watches',
    folder: 'timevault-watches',
    cover: 'cover.png',
    pages: { ...STANDARD_NEW_PAGES },
  },
  {
    slug: 'fitcore-activewear',
    folder: 'fitcore-activewear',
    cover: 'cover.png',
    pages: { ...STANDARD_NEW_PAGES },
  },
  {
    slug: 'nutriva-foods',
    folder: 'nutriva-foods',
    cover: 'cover.png',
    pages: { ...STANDARD_NEW_PAGES },
  },
  {
    slug: 'petora',
    folder: 'petora',
    cover: 'cover.png',
    pages: { ...STANDARD_NEW_PAGES },
  },
  {
    slug: 'babynest-store',
    folder: 'babynest-store',
    cover: 'cover.png',
    pages: { ...STANDARD_NEW_PAGES },
  },
  {
    slug: 'motogear-auto',
    folder: 'motogear-auto',
    cover: 'cover.png',
    pages: { ...STANDARD_WITH_CONTACT },
  },
  {
    slug: 'mobilehub-store',
    folder: 'mobilehub-store',
    cover: 'cover.png',
    pages: { ...STANDARD_NEW_PAGES },
  },
  {
    slug: 'homeapply-appliances',
    folder: 'homeapply-appliances',
    cover: 'cover.png',
    pages: { ...STANDARD_WITH_CONTACT },
  },
  {
    slug: 'craftdesk-stationery',
    folder: 'craftdesk-stationery',
    cover: 'cover.png',
    pages: { ...STANDARD_NEW_PAGES },
  },
  {
    slug: 'bloomora-gifts',
    folder: 'bloomora-gifts',
    cover: 'cover.png',
    pages: { ...STANDARD_NEW_PAGES },
  },
  ...[
    'lumera-perfume',
    'beanora-coffee',
    'greenroot-organic',
    'gamenova-store',
    'soundora-audio',
    'camerix-photography',
    'bookora-books',
    'techdesk-office',
    'sleepnest-bedding',
    'kitchora-kitchen',
    'toolmate-hardware',
    'ridevault-cycling',
    'travelora-gear',
    'hijabe-modest-fashion',
    'panjabi-house',
    'sareeva',
    'deshi-craft',
    'furnova-furniture',
    'lightora-lighting',
    'tileora-tiles',
    'skinlab-care',
    'hairora-care',
    'chocora-chocolate',
    'sweetbox-bakery',
    'fishmart-seafood',
    'meatmart-premium',
    'pharmora-health',
    'sportiva-sports',
    'agrimart-store',
    'partybox-events',
  ].map((slug) => ({
    slug,
    folder: slug,
    cover: 'cover.png',
    pages: { ...STANDARD_NEW_PAGES },
  })),
];

const PRIMARY_ROOT = path.join(process.cwd(), 'seed-assets/ecommerce');
const LEGACY_ROOT = path.join(process.cwd(), 'scripts/seed-assets/ecommerce-showcase');
const CURSOR_ASSETS = path.join(
  process.env.HOME ?? '',
  '.cursor/projects/home-priom-Desktop-bridge-it-park-smart-it-park/assets'
);

async function exists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export function getSeedAssetEntry(slug: string): EcommerceSeedAsset | undefined {
  return ECOMMERCE_SEED_PROJECTS.find((item) => item.slug === slug);
}

export async function resolveSeedAssetPath(
  entry: EcommerceSeedAsset,
  relativeFile: string,
  generatedName?: string
): Promise<string | null> {
  const candidates = [
    path.join(PRIMARY_ROOT, entry.folder, relativeFile),
    path.join(PRIMARY_ROOT, entry.folder, relativeFile.replace(/\.png$/i, '.webp')),
    path.join(PRIMARY_ROOT, entry.folder, relativeFile.replace(/\.png$/i, '.avif')),
    path.join(LEGACY_ROOT, entry.slug, relativeFile),
    path.join(LEGACY_ROOT, entry.folder, relativeFile),
    generatedName ? path.join(CURSOR_ASSETS, generatedName) : null,
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    if (await exists(candidate)) return candidate;
  }
  return null;
}

export async function resolveSeedCoverPath(entry: EcommerceSeedAsset): Promise<string | null> {
  return resolveSeedAssetPath(entry, entry.cover, `${entry.folder}-cover.png`);
}

export async function resolveSeedPagePath(
  entry: EcommerceSeedAsset,
  pageSlug: string
): Promise<string | null> {
  const mapped = entry.pages[pageSlug] ?? `${pageSlug}.png`;
  return resolveSeedAssetPath(entry, mapped, `${entry.folder}-${pageSlug}.png`);
}
