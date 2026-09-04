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
  const startingPrice = Number(formData.get('starting_price') ?? 0);
  const priceSuffix = String(formData.get('price_suffix') ?? '+').trim() || '+';
  const seoTitle = String(formData.get('seo_title') ?? '').trim();
  const seoDescription = String(formData.get('seo_description') ?? '').trim();
  const seoKeywordsRaw = String(formData.get('seo_keywords') ?? '').trim();
  const sortOrder = Number(formData.get('sort_order') ?? 0);
  const featured = formData.get('featured') === 'on';
  const popular = formData.get('popular') === 'on';
  const published = formData.get('published') === 'on';

  if (!title) return { ok: false, error: 'Title is required' };
  if (!Number.isFinite(startingPrice) || startingPrice < 0) {
    return { ok: false, error: 'Invalid starting price' };
  }

  const seoKeywords = seoKeywordsRaw
    ? seoKeywordsRaw.split(',').map((k) => k.trim()).filter(Boolean)
    : [];

  const supabase = await getAdminClient();
  if (!supabase) return { ok: false, error: 'Database unavailable' };

  const { error } = await supabase
    .from('software_projects')
    .update({
      title,
      short_description: shortDescription || null,
      starting_price: Math.round(startingPrice),
      price_suffix: priceSuffix,
      seo_title: seoTitle || null,
      seo_description: seoDescription || null,
      seo_keywords: seoKeywords,
      sort_order: Number.isFinite(sortOrder) ? Math.round(sortOrder) : 0,
      featured,
      popular,
      published,
      updated_at: new Date().toISOString(),
      updated_by: profile.id,
    })
    .eq('slug', slug)
    .is('deleted_at', null);

  if (error) return { ok: false, error: error.message };

  revalidatePath(ROUTES.adminSoftwareProjects);
  revalidatePath(`${ROUTES.adminSoftwareProjects}/${slug}`);
  revalidatePath(ROUTES.softwareShowroom);
  revalidatePath(`${ROUTES.softwareShowroom}/${slug}`);
  revalidatePath('/');
  return { ok: true };
}
