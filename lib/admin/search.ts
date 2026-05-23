import type { SearchResultGroup } from '@/types/admin';
import type { AdminDashboardData } from '@/types/admin';

export function buildAdminSearchResults(
  query: string,
  data: Pick<AdminDashboardData, 'sellers' | 'customers' | 'orders' | 'categories'>
): SearchResultGroup[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const groups: SearchResultGroup[] = [];
  const sellers = data.sellers
    .filter((s) => s.name.toLowerCase().includes(q) || s.company.toLowerCase().includes(q))
    .map((s) => ({ id: s.id, title: s.name, subtitle: s.company }));
  if (sellers.length) groups.push({ type: 'sellers', label: 'Sellers', items: sellers });

  const categories = data.categories
    .filter((c) => c.nameEn.toLowerCase().includes(q) || c.nameBn.includes(q))
    .map((c) => ({ id: c.id, title: c.nameEn, subtitle: c.nameBn }));
  if (categories.length) groups.push({ type: 'categories', label: 'Categories', items: categories });

  return groups;
}
