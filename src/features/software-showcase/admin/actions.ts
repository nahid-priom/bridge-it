'use server';

import { revalidatePath } from 'next/cache';
import { getAdminClient } from '@/lib/services/client';
import { getCurrentProfile } from '@/lib/auth/get-current-user';
import { isShowcaseViewerRole } from '@/src/features/ecommerce-showcase/config/roles';
import { ROUTES } from '@/lib/routes';

export type SoftwareAdminUpdateResult = { ok: true } | { ok: false; error: string };

export async function updateSoftwareProjectAdmin(
  slug: string,
  formData: FormData
): Promise<SoftwareAdminUpdateResult> {
  const profile = await getCurrentProfile();
  if (!profile || !isShowcaseViewerRole(profile.role)) {
    return { ok: false, error: 'Unauthorized' };
  }

  const title = String(formData.get('title') ?? '').trim();
  const shortDescription = String(formData.get('short_description') ?? '').trim();
  const featureSummary = String(formData.get('feature_summary') ?? '').trim();
  const startingPrice = Number(formData.get('starting_price') ?? 0);
  const priceSuffix = String(formData.get('price_suffix') ?? '+').trim() || '+';
  const seoTitle = String(formData.get('seo_title') ?? '').trim();
  const seoDescription = String(formData.get('seo_description') ?? '').trim();
  const seoKeywordsRaw = String(formData.get('seo_keywords') ?? '').trim();
  const sortOrder = Number(formData.get('sort_order') ?? 0);
  const featured = formData.get('featured') === 'on';
  const popular = formData.get('popular') === 'on';
  const published = formData.get('published') === 'on';

  const mainCategoryId = String(formData.get('main_category_id') ?? '').trim() || null;
  const taxonomyCategoryId = String(formData.get('taxonomy_category_id') ?? '').trim() || null;
  const childCategoryId = String(formData.get('child_category_id') ?? '').trim() || null;

  const featuresJson = String(formData.get('features_json') ?? '').trim();

  if (!title) return { ok: false, error: 'Title is required' };
  if (!Number.isFinite(startingPrice) || startingPrice < 0) {
    return { ok: false, error: 'Invalid starting price' };
  }

  const seoKeywords = seoKeywordsRaw
    ? seoKeywordsRaw.split(',').map((k) => k.trim()).filter(Boolean)
    : [];

  const supabase = await getAdminClient();
  if (!supabase) return { ok: false, error: 'Database unavailable' };

  const { data: project, error: fetchError } = await supabase
    .from('software_projects')
    .select('id')
    .eq('slug', slug)
    .is('deleted_at', null)
    .maybeSingle();
  if (fetchError || !project) return { ok: false, error: fetchError?.message ?? 'Not found' };

  const { error } = await supabase
    .from('software_projects')
    .update({
      title,
      short_description: shortDescription || null,
      feature_summary: featureSummary || shortDescription || null,
      starting_price: Math.round(startingPrice),
      price_suffix: priceSuffix,
      seo_title: seoTitle || null,
      seo_description: seoDescription || null,
      seo_keywords: seoKeywords,
      sort_order: Number.isFinite(sortOrder) ? Math.round(sortOrder) : 0,
      featured,
      popular,
      published,
      main_category_id: mainCategoryId,
      taxonomy_category_id: taxonomyCategoryId,
      child_category_id: childCategoryId,
      updated_at: new Date().toISOString(),
      updated_by: profile.id,
    })
    .eq('id', project.id);

  if (error) return { ok: false, error: error.message };

  if (featuresJson) {
    try {
      const parsed = JSON.parse(featuresJson) as Array<{
        title: string;
        short_description?: string | null;
        is_primary?: boolean;
        sort_order?: number;
      }>;
      await supabase
        .from('software_product_features')
        .update({ deleted_at: new Date().toISOString() })
        .eq('project_id', project.id)
        .is('deleted_at', null);

      const rows = parsed
        .filter((f) => f.title?.trim())
        .map((f, index) => ({
          project_id: project.id,
          title: f.title.trim(),
          short_description: f.short_description?.trim() || null,
          is_primary: Boolean(f.is_primary ?? index < 3),
          sort_order: f.sort_order ?? (index + 1) * 10,
          published: true,
        }));
      if (rows.length) {
        const { error: featError } = await supabase.from('software_product_features').insert(rows);
        if (featError) return { ok: false, error: featError.message };
      }
    } catch {
      return { ok: false, error: 'Invalid features payload' };
    }
  }

  revalidatePath(ROUTES.adminSoftwareProjects);
  revalidatePath(`${ROUTES.adminSoftwareProjects}/${slug}`);
  revalidatePath(ROUTES.softwareShowroom);
  revalidatePath(`${ROUTES.softwareShowroom}/${slug}`);
  revalidatePath('/');
  return { ok: true };
}
