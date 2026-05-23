import { JsonLd } from '@/components/layout/JsonLd';
import { breadcrumbJsonLd } from '@/lib/structured-data';
import {
  breadcrumbItemsToJsonLd,
  type BreadcrumbItem,
} from '@/lib/seo/breadcrumbs';

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
}

/** Server-safe BreadcrumbList JSON-LD */
export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  if (items.length === 0) return null;
  const jsonItems = breadcrumbItemsToJsonLd(items);
  return <JsonLd data={breadcrumbJsonLd(jsonItems)} />;
}
