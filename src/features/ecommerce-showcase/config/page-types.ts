export const PAGE_TYPES = [
  { id: 'homepage', label: 'Homepage', shortLabel: 'Homepage', folder: 'homepage', selectable: true },
  { id: 'landing_page', label: 'Landing Page', shortLabel: 'Landing', folder: 'landing', selectable: true },
  { id: 'shop', label: 'Shop', shortLabel: 'Shop', folder: 'shop', selectable: true },
  { id: 'category', label: 'Category', shortLabel: 'Category', folder: 'shop', selectable: true },
  { id: 'product_details', label: 'Product Details', shortLabel: 'Product', folder: 'product', selectable: true },
  { id: 'cart', label: 'Cart', shortLabel: 'Cart', folder: 'cart', selectable: true },
  { id: 'checkout', label: 'Checkout', shortLabel: 'Checkout', folder: 'checkout', selectable: true },
  { id: 'about', label: 'About', shortLabel: 'About', folder: 'about', selectable: true },
  { id: 'contact', label: 'Contact', shortLabel: 'Contact', folder: 'contact', selectable: true },
  { id: 'mobile_view', label: 'Mobile View', shortLabel: 'Mobile', folder: 'mobile', selectable: true },
  { id: 'custom', label: 'Custom Page', shortLabel: 'Custom', folder: 'original', selectable: true },
  { id: 'collection', label: 'Collection', shortLabel: 'Collection', folder: 'shop', selectable: true },
  { id: 'dashboard', label: 'Dashboard', shortLabel: 'Dashboard', folder: 'original', selectable: false },
] as const;

export type PageTypeId = (typeof PAGE_TYPES)[number]['id'];

export const PAGE_TYPE_IDS = PAGE_TYPES.map((item) => item.id);

export const SELECTABLE_PAGE_TYPES = PAGE_TYPES.filter((item) => item.selectable);

export const SLOT_PAGE_TYPES = SELECTABLE_PAGE_TYPES.filter((item) => item.id !== 'custom');

export const PAGE_FILTER_CHIPS = [
  { id: 'all', label: 'All' },
  ...PAGE_TYPES.filter((item) => item.id !== 'custom' && item.id !== 'dashboard').map((item) => ({
    id: item.id,
    label: item.shortLabel,
  })),
] as const;

export function getPageType(id: string) {
  return PAGE_TYPES.find((item) => item.id === id) ?? PAGE_TYPES.find((item) => item.id === 'custom') ?? PAGE_TYPES[0];
}

export function pageTypeFolder(id: string): string {
  return getPageType(id).folder;
}

export function pageHasImage(page: { image_url?: string | null; fallback_url?: string | null; thumbnail_url?: string | null }) {
  return Boolean(page.image_url || page.fallback_url || page.thumbnail_url);
}

export function defaultPreviewPage<
  T extends { page_type: string; image_url?: string | null; fallback_url?: string | null; thumbnail_url?: string | null },
>(pages: T[]): T | undefined {
  const withImage = pages.filter(pageHasImage);
  return withImage.find((page) => page.page_type === 'homepage') ?? withImage[0];
}
