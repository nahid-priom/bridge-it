import 'server-only';

import { cache } from 'react';
import { getServerClient } from '@/lib/services/client';
import type { CatalogUrlRedirect } from '../types';
import { normalizeCatalogPath } from '../utils/paths';

const REDIRECT_SELECT = 'id, from_path, to_path, permanent, active';

function mapRedirect(row: Record<string, unknown>): CatalogUrlRedirect {
  return {
    id: String(row.id),
    from_path: String(row.from_path),
    to_path: String(row.to_path),
    permanent: Boolean(row.permanent),
    active: Boolean(row.active),
  };
}

async function lookupRedirectUncached(fromPath: string): Promise<CatalogUrlRedirect | null> {
  const normalized = normalizeCatalogPath(fromPath);
  const supabase = await getServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('catalog_url_redirects')
    .select(REDIRECT_SELECT)
    .eq('from_path', normalized)
    .eq('active', true)
    .maybeSingle();

  if (error) {
    console.error('[catalog] lookupRedirect', error.message);
    return null;
  }
  if (!data) return null;
  return mapRedirect(data as Record<string, unknown>);
}

const lookupRedirectCached = cache(lookupRedirectUncached);

export async function lookupRedirect(fromPath: string): Promise<CatalogUrlRedirect | null> {
  return lookupRedirectCached(fromPath);
}
