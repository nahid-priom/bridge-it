import type { DemoService, DemoSortOption } from '@/types/demoMarketplace';

export const DEMO_PAGE_SIZE = 20;

export function formatQueryLabel(q: string): string {
  const trimmed = q.trim();
  if (!trimmed) return 'Website Development';
  return trimmed
    .split(/[-+_\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export function filterDemoServices(
  services: DemoService[],
  query: string,
  categoryFilter: string
): DemoService[] {
  const q = query.trim().toLowerCase();
  return services.filter((s) => {
    const matchesCategory =
      categoryFilter === 'all' ||
      s.category.toLowerCase().includes(categoryFilter.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(categoryFilter.toLowerCase()));

    if (!q) return matchesCategory;

    const haystack = [
      s.title,
      s.category,
      s.sellerName,
      ...s.tags,
    ]
      .join(' ')
      .toLowerCase();

    return matchesCategory && haystack.includes(q);
  });
}

export function sortDemoServices(
  services: DemoService[],
  sort: DemoSortOption
): DemoService[] {
  const copy = [...services];
  switch (sort) {
    case 'top-rated':
      return copy.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case 'price-low':
      return copy.sort((a, b) => a.price - b.price);
    case 'price-high':
      return copy.sort((a, b) => b.price - a.price);
    case 'fast-delivery':
      return copy.sort((a, b) => a.deliveryDays - b.deliveryDays);
    case 'recommended':
    default:
      return copy.sort(
        (a, b) =>
          b.rating * 1000 +
          b.reviewCount -
          (a.rating * 1000 + a.reviewCount)
      );
  }
}

export function paginateDemoServices<T>(
  items: T[],
  page: number,
  pageSize: number
): { items: T[]; totalPages: number; page: number } {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    totalPages,
    page: safePage,
  };
}

/** Pagination window with ellipsis for UI (e.g. 1 … 5 … 21) */
export function buildPaginationItems(
  current: number,
  total: number
): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const items: (number | 'ellipsis')[] = [1];
  if (current > 3) items.push('ellipsis');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let p = start; p <= end; p++) {
    if (!items.includes(p)) items.push(p);
  }

  if (current < total - 2) items.push('ellipsis');
  if (!items.includes(total)) items.push(total);
  return items;
}
