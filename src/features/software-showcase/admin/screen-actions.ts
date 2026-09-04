'use server';

import { revalidatePath } from 'next/cache';
import { getAdminClient } from '@/lib/services/client';
import { getCurrentProfile } from '@/lib/auth/get-current-user';
import { isShowcaseViewerRole } from '@/src/features/ecommerce-showcase/config/roles';
import { ROUTES } from '@/lib/routes';
import { SOFTWARE_BUCKET } from '../config/constants';
import {
  encodeCoverCard,
  encodeCoverDetail,
  encodeScreenPreview,
  encodeScreenThumb,
} from '../utils/image-pipeline';
import {
  coverCardPath,
  coverDetailPath,
  screenPreviewPath,
  screenThumbPath,
} from '../utils/storage-paths';

export type ScreenActionResult = { ok: true } | { ok: false; error: string };

async function requireAdmin() {
  const profile = await getCurrentProfile();
  if (!profile || !isShowcaseViewerRole(profile.role)) return null;
  return profile;
}

function revalidateSoftware(slug: string) {
  revalidatePath(ROUTES.adminSoftwareProjects);
  revalidatePath(`${ROUTES.adminSoftwareProjects}/${slug}`);
  revalidatePath(ROUTES.softwareShowroom);
  revalidatePath(`${ROUTES.softwareShowroom}/${slug}`);
  revalidatePath('/');
}

function publicUrl(supabase: NonNullable<Awaited<ReturnType<typeof getAdminClient>>>, path: string) {
  return supabase!.storage.from(SOFTWARE_BUCKET).getPublicUrl(path).data.publicUrl;
}

async function nextAssetVersion(
  supabase: NonNullable<Awaited<ReturnType<typeof getAdminClient>>>,
  projectId: string,
  current: number | null | undefined
) {
  const next = Math.max(1, Number(current ?? 1)) + 1;
  await supabase
    .from('software_projects')
    .update({ asset_version: next, updated_at: new Date().toISOString() })
    .eq('id', projectId);
  return next;
}

export async function uploadSoftwareCover(
  slug: string,
  formData: FormData
): Promise<ScreenActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' };
  const supabase = await getAdminClient();
  if (!supabase) return { ok: false, error: 'Database unavailable' };

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: 'File required' };

  const { data: project, error: projectError } = await supabase
    .from('software_projects')
    .select('id, slug, asset_version, cover_card_path, cover_detail_path')
    .eq('slug', slug)
    .is('deleted_at', null)
    .maybeSingle();
  if (projectError || !project) return { ok: false, error: projectError?.message ?? 'Project not found' };

  const buffer = Buffer.from(await file.arrayBuffer());
  const [card, detail] = await Promise.all([encodeCoverCard(buffer), encodeCoverDetail(buffer)]);
  const version = await nextAssetVersion(supabase, project.id, project.asset_version);
  const cardPath = coverCardPath(slug, version);
  const detailPath = coverDetailPath(slug, version);

  const [cardUp, detailUp] = await Promise.all([
    supabase.storage.from(SOFTWARE_BUCKET).upload(cardPath, card.buffer, {
      contentType: card.contentType,
      upsert: true,
      cacheControl: '31536000, immutable',
    }),
    supabase.storage.from(SOFTWARE_BUCKET).upload(detailPath, detail.buffer, {
      contentType: detail.contentType,
      upsert: true,
      cacheControl: '31536000, immutable',
    }),
  ]);
  if (cardUp.error) return { ok: false, error: cardUp.error.message };
  if (detailUp.error) return { ok: false, error: detailUp.error.message };

  const obsolete = [project.cover_card_path, project.cover_detail_path].filter(
    (p): p is string => Boolean(p) && p !== cardPath && p !== detailPath
  );

  const { error } = await supabase
    .from('software_projects')
    .update({
      cover_card_path: cardPath,
      cover_card_url: publicUrl(supabase, cardPath),
      cover_detail_path: detailPath,
      cover_detail_url: publicUrl(supabase, detailPath),
      og_image_url: publicUrl(supabase, detailPath),
      asset_version: version,
      updated_at: new Date().toISOString(),
    })
    .eq('id', project.id);
  if (error) return { ok: false, error: error.message };

  if (obsolete.length) {
    await supabase.storage.from(SOFTWARE_BUCKET).remove(obsolete);
  }

  revalidateSoftware(slug);
  return { ok: true };
}

export async function removeSoftwareCover(slug: string): Promise<ScreenActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' };
  const supabase = await getAdminClient();
  if (!supabase) return { ok: false, error: 'Database unavailable' };

  const { error } = await supabase
    .from('software_projects')
    .update({
      cover_card_path: null,
      cover_card_url: null,
      cover_detail_path: null,
      cover_detail_url: null,
      updated_at: new Date().toISOString(),
    })
    .eq('slug', slug)
    .is('deleted_at', null);
  if (error) return { ok: false, error: error.message };
  revalidateSoftware(slug);
  return { ok: true };
}

export async function uploadSoftwareScreen(
  slug: string,
  formData: FormData
): Promise<ScreenActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' };
  const supabase = await getAdminClient();
  if (!supabase) return { ok: false, error: 'Database unavailable' };

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: 'File required' };

  const screenName = String(formData.get('screen_name') ?? file.name.replace(/\.[^.]+$/, '')).trim();
  const moduleName = String(formData.get('module_name') ?? screenName).trim();
  const shortCaption = String(formData.get('short_caption') ?? '').trim() || null;
  const screenKey =
    String(formData.get('screen_key') ?? '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || `screen-${Date.now()}`;

  const { data: project } = await supabase
    .from('software_projects')
    .select('id, asset_version')
    .eq('slug', slug)
    .is('deleted_at', null)
    .maybeSingle();
  if (!project) return { ok: false, error: 'Project not found' };

  const { data: existingMeta } = await supabase
    .from('software_project_screens')
    .select('id, image_path, thumbnail_path, sort_order')
    .eq('project_id', project.id)
    .eq('screen_key', screenKey)
    .is('deleted_at', null)
    .maybeSingle();

  const { data: maxOrder } = await supabase
    .from('software_project_screens')
    .select('sort_order')
    .eq('project_id', project.id)
    .is('deleted_at', null)
    .order('sort_order', { ascending: false })
    .limit(1);
  const nextOrder = existingMeta ? Number(existingMeta.sort_order) : Number(maxOrder?.[0]?.sort_order ?? 0) + 10;

  const buffer = Buffer.from(await file.arrayBuffer());
  const [preview, thumb] = await Promise.all([encodeScreenPreview(buffer), encodeScreenThumb(buffer)]);
  const version = await nextAssetVersion(supabase, project.id, project.asset_version);
  const previewPath = screenPreviewPath(slug, version, screenKey);
  const thumbPath = screenThumbPath(slug, version, screenKey);

  const [pUp, tUp] = await Promise.all([
    supabase.storage.from(SOFTWARE_BUCKET).upload(previewPath, preview.buffer, {
      contentType: preview.contentType,
      upsert: true,
      cacheControl: '31536000, immutable',
    }),
    supabase.storage.from(SOFTWARE_BUCKET).upload(thumbPath, thumb.buffer, {
      contentType: thumb.contentType,
      upsert: true,
      cacheControl: '31536000, immutable',
    }),
  ]);
  if (pUp.error) return { ok: false, error: pUp.error.message };
  if (tUp.error) return { ok: false, error: tUp.error.message };

  const row = {
    project_id: project.id,
    screen_key: screenKey,
    screen_name: screenName || screenKey,
    module_name: moduleName || screenName,
    short_caption: shortCaption,
    image_path: previewPath,
    image_url: publicUrl(supabase, previewPath),
    thumbnail_path: thumbPath,
    thumbnail_url: publicUrl(supabase, thumbPath),
    image_width: preview.width,
    image_height: preview.height,
    sort_order: nextOrder,
    is_featured: false,
    published: true,
    deleted_at: null,
    updated_at: new Date().toISOString(),
  };

  if (existingMeta?.id) {
    const { error } = await supabase.from('software_project_screens').update(row).eq('id', existingMeta.id);
    if (error) return { ok: false, error: error.message };
    const obsolete = [existingMeta.image_path, existingMeta.thumbnail_path].filter(
      (p): p is string => Boolean(p) && p !== previewPath && p !== thumbPath
    );
    if (obsolete.length) await supabase.storage.from(SOFTWARE_BUCKET).remove(obsolete);
  } else {
    const { error } = await supabase.from('software_project_screens').insert(row);
    if (error) return { ok: false, error: error.message };
  }

  revalidateSoftware(slug);
  return { ok: true };
}

export async function updateSoftwareScreenMeta(
  slug: string,
  screenId: string,
  formData: FormData
): Promise<ScreenActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' };
  const supabase = await getAdminClient();
  if (!supabase) return { ok: false, error: 'Database unavailable' };

  const { error } = await supabase
    .from('software_project_screens')
    .update({
      screen_name: String(formData.get('screen_name') ?? '').trim() || undefined,
      module_name: String(formData.get('module_name') ?? '').trim() || null,
      short_caption: String(formData.get('short_caption') ?? '').trim() || null,
      is_featured: formData.get('is_featured') === 'on',
      published: formData.get('published') === 'on',
      sort_order: Number(formData.get('sort_order') ?? 0),
      updated_at: new Date().toISOString(),
    })
    .eq('id', screenId);
  if (error) return { ok: false, error: error.message };
  revalidateSoftware(slug);
  return { ok: true };
}

export async function deleteSoftwareScreen(slug: string, screenId: string): Promise<ScreenActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' };
  const supabase = await getAdminClient();
  if (!supabase) return { ok: false, error: 'Database unavailable' };
  const { error } = await supabase
    .from('software_project_screens')
    .update({ deleted_at: new Date().toISOString(), published: false })
    .eq('id', screenId);
  if (error) return { ok: false, error: error.message };
  revalidateSoftware(slug);
  return { ok: true };
}

export async function moveSoftwareScreen(
  slug: string,
  screenId: string,
  direction: 'up' | 'down'
): Promise<ScreenActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' };
  const supabase = await getAdminClient();
  if (!supabase) return { ok: false, error: 'Database unavailable' };

  const { data: project } = await supabase
    .from('software_projects')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();
  if (!project) return { ok: false, error: 'Project not found' };

  const { data: screens } = await supabase
    .from('software_project_screens')
    .select('id, sort_order')
    .eq('project_id', project.id)
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });

  const list = screens ?? [];
  const index = list.findIndex((s) => s.id === screenId);
  if (index < 0) return { ok: false, error: 'Screen not found' };
  const swapWith = direction === 'up' ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= list.length) return { ok: true };

  const a = list[index];
  const b = list[swapWith];
  await Promise.all([
    supabase.from('software_project_screens').update({ sort_order: b.sort_order }).eq('id', a.id),
    supabase.from('software_project_screens').update({ sort_order: a.sort_order }).eq('id', b.id),
  ]);
  revalidateSoftware(slug);
  return { ok: true };
}
