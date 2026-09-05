import { permanentRedirect } from 'next/navigation';
import { getProductRefById } from '@/src/features/catalog';
import { getCreativeMarketingBySlug } from '@/src/features/creative-marketing-showcase/api/projects';
import { ROUTES } from '@/lib/routes';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function toQuery(sp: Record<string, string | string[] | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (value == null) continue;
    if (Array.isArray(value)) {
      for (const v of value) params.append(key, v);
    } else {
      params.set(key, value);
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

/** Permanent redirect: /creative-marketing/[slug] → /marketing/... */
export default async function CreativeMarketingSlugRedirect({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const qs = toQuery(sp);

  const project = await getCreativeMarketingBySlug(slug);
  if (project) {
    const catalogProduct = await getProductRefById('marketing', project.id);
    if (catalogProduct?.industry_slug) {
      permanentRedirect(
        `${ROUTES.marketingProduct(catalogProduct.industry_slug, project.slug)}${qs}`
      );
    }
  }

  permanentRedirect(`${ROUTES.marketingIndustry(slug)}${qs}`);
}
