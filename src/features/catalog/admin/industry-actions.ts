'use server';

import { revalidatePath } from 'next/cache';
import { getAdminClient } from '@/lib/services/client';
import { ROUTES } from '@/lib/routes';
import type { CatalogCategoryRoot } from '@/src/features/catalog/types';

export async function updateCatalogIndustryAction(input: {
  id: string;
  name: string;
  slug: string;
  short_description?: string;
  seo_title?: string;
  seo_description?: string;
  seo_h1?: string;
  seo_intro?: string;
  sort_order?: number;
  active?: boolean;
}): Promise<{ error?: string }> {
  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Database unavailable' };

  const slug = input.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '');
  if (!slug) return { error: 'Slug is required' };

  const { data: existing } = await supabase
    .from('catalog_industries')
    .select('id, slug, category_root')
    .eq('id', input.id)
    .maybeSingle();

  const { error } = await supabase
    .from('catalog_industries')
    .update({
      name: input.name.trim(),
      slug,
      short_description: input.short_description?.trim() || null,
      seo_title: input.seo_title?.trim() || null,
      seo_description: input.seo_description?.trim() || null,
      seo_h1: input.seo_h1?.trim() || null,
      seo_intro: input.seo_intro?.trim() || null,
      sort_order: input.sort_order ?? 0,
      active: input.active ?? true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', input.id);

  if (error) return { error: error.message };

  // If slug changed, add redirect from old industry path
  if (existing && existing.slug !== slug) {
    const root = existing.category_root as CatalogCategoryRoot;
    const fromPath = `/${root}/${existing.slug}`;
    const toPath = `/${root}/${slug}`;
    await supabase.from('catalog_url_redirects').upsert(
      {
        from_path: fromPath,
        to_path: toPath,
        permanent: true,
        active: true,
      },
      { onConflict: 'from_path' }
    );

    // Update product canonical paths under this industry
    const table =
      root === 'software'
        ? 'software_projects'
        : root === 'websites'
          ? 'ecommerce_projects'
          : 'creative_marketing_projects';
    const { data: products } = await supabase
      .from(table)
      .select('id, slug')
      .eq('industry_id', input.id)
      .is('deleted_at', null);
    for (const product of products ?? []) {
      const newCanonical = `/${root}/${slug}/${product.slug}`;
      const oldCanonical = `/${root}/${existing.slug}/${product.slug}`;
      await supabase
        .from(table)
        .update({ canonical_path: newCanonical, updated_at: new Date().toISOString() })
        .eq('id', product.id);
      await supabase.from('catalog_url_redirects').upsert(
        {
          from_path: oldCanonical,
          to_path: newCanonical,
          permanent: true,
          active: true,
        },
        { onConflict: 'from_path' }
      );
    }
  }

  revalidatePath(ROUTES.adminCatalogIndustries);
  revalidatePath('/software');
  revalidatePath('/websites');
  revalidatePath('/marketing');
  return {};
}
