import { permanentRedirect } from 'next/navigation';
import { ROUTES } from '@/lib/routes';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

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

/** Permanent redirect: /creative-marketing → /marketing */
export default async function CreativeMarketingRedirect({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  permanentRedirect(`${ROUTES.marketingShowroom}${toQuery(sp)}`);
}
