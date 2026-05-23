import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { buildBreadcrumbsFromPathname } from '@/lib/seo/breadcrumbs';

/** Server-rendered JSON-LD for a known public path */
export function PageBreadcrumbJsonLd({ path }: { path: string }) {
  const items = buildBreadcrumbsFromPathname(path);
  return <BreadcrumbJsonLd items={items} />;
}
