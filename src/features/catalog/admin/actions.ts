'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentProfile } from '@/lib/auth/get-current-user';
import { getAdminClient } from '@/lib/services/client';
import { isShowcaseEditorRole } from '@/src/features/ecommerce-showcase/config/roles';
import { ROUTES } from '@/lib/routes';
import type { CatalogCategoryRoot } from '@/src/features/catalog/types';

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function upsertCatalogIndustryAction(input: {
  id?: string;
  category_root: CatalogCategoryRoot;
  name: string;
  slug?: string;
  short_description?: string;
  seo_title?: string;
  seo_description?: string;
  seo_h1?: string;
  seo_intro?: string;
  sort_order?: number;
  active?: boolean;
}): Promise<{ error?: string; warning?: string }> {
  const profile = await getCurrentProfile();
  if (!profile || !isShowcaseEditorRole(profile.role)) {
    return { error: 'Unauthorized' };
  }

  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Database unavailable' };

  const name = input.name.trim();
  if (!name) return { error: 'Name is required' };

  const slug = slugify(input.slug?.trim() || name);
  if (!slug) return { error: 'Slug is required' };

  let warning: string | undefined;
  if (input.id && input.slug) {
    const { data: existing } = await supabase
      .from('catalog_industries')
      .select('slug')
      .eq('id', input.id)
      .maybeSingle();
    if (existing && existing.slug !== slug) {
      warning =
        'Slug changed. Indexed URLs may break — add a catalog_url_redirects row from the old path.';
      const fromPath = `/${input.category_root}/${existing.slug}`;
      const toPath = `/${input.category_root}/${slug}`;
      await supabase.from('catalog_url_redirects').upsert(
        {
          from_path: fromPath,
          to_path: toPath,
          permanent: true,
          active: true,
        },
        { onConflict: 'from_path' }
      );
    }
  }

  const payload = {
    category_root: input.category_root,
    name,
    slug,
    short_description: input.short_description?.trim() || null,
    seo_title: input.seo_title?.trim() || null,
    seo_description: input.seo_description?.trim() || null,
    seo_h1: input.seo_h1?.trim() || null,
    seo_intro: input.seo_intro?.trim() || null,
    sort_order: input.sort_order ?? 0,
    active: input.active ?? true,
    updated_at: new Date().toISOString(),
  };

  if (input.id) {
    const { error } = await supabase.from('catalog_industries').update(payload).eq('id', input.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from('catalog_industries').insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath(ROUTES.adminCatalogIndustries);
  revalidatePath(`/${input.category_root}`);
  return warning ? { warning } : {};
}
