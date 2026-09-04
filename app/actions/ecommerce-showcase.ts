'use server';

import { revalidatePath } from 'next/cache';
import { getAdminClient, getServerClient } from '@/lib/services/client';
import { assertShowcaseEditor, assertShowcaseViewer, isSuperAdminRole } from '@/src/features/ecommerce-showcase/api/auth';
import { adminGetPages } from '@/src/features/ecommerce-showcase/api/admin';
import {
  deleteProjectImage,
  uploadProjectCover,
  uploadProjectPageImage,
} from '@/src/features/ecommerce-showcase/services/projectImageService';
import {
  leadFormSchema,
  projectFormSchema,
  slugifyTitle,
  websiteOrderFormSchema,
  type ProjectFormValues,
} from '@/src/features/ecommerce-showcase/schemas/project';
import { WEBSITE_ORDER_STATUSES } from '@/src/features/ecommerce-showcase/config/constants';
import type { WebsiteOrderStatus } from '@/src/features/ecommerce-showcase/types';
import type { LeadStatus } from '@/src/features/ecommerce-showcase/config/constants';
import { HOMEPAGE_SECTION_MAX, HOMEPAGE_SECTIONS } from '@/src/features/ecommerce-showcase/config/constants';
import type { HomepageSectionKey } from '@/src/features/ecommerce-showcase/types';
import { getPageType } from '@/src/features/ecommerce-showcase/config/page-types';

function revalidateShowcase(slug?: string, projectId?: string) {
  revalidatePath('/');
  revalidatePath('/websites');
  revalidatePath('/ecommerce', 'layout');
  revalidatePath('/admin/ecommerce-projects');
  revalidatePath('/admin/ecommerce-projects/homepage');
  if (projectId) revalidatePath(`/admin/ecommerce-projects/${projectId}`);
  if (slug) revalidatePath(`/websites/${slug}`);
}

type ShowcaseDb = NonNullable<Awaited<ReturnType<typeof getAdminClient>>>;

async function uniqueProjectSlug(supabase: ShowcaseDb, base: string) {
  const root = slugifyTitle(base) || 'untitled-website';
  for (let i = 0; i < 30; i++) {
    const candidate = i === 0 ? root : `${root}-${i + 1}`;
    const { data } = await supabase
      .from('ecommerce_projects')
      .select('id')
      .eq('slug', candidate)
      .is('deleted_at', null)
      .maybeSingle();
    if (!data) return candidate;
  }
  return `${root}-${Date.now()}`;
}

async function ensureHomepagePage(supabase: ShowcaseDb, projectId: string) {
  const { data: existing } = await supabase
    .from('ecommerce_project_pages')
    .select('id')
    .eq('project_id', projectId)
    .eq('page_type', 'homepage')
    .is('deleted_at', null)
    .maybeSingle();
  if (existing?.id) return existing.id as string;
  const { data, error } = await supabase
    .from('ecommerce_project_pages')
    .insert({
      project_id: projectId,
      page_type: 'homepage',
      page_name: 'Homepage',
      slug: 'homepage',
      sort_order: 0,
      published: true,
    })
    .select('id')
    .single();
  if (error) throw new Error(error.message);
  return data.id as string;
}

export async function createProjectAction(input: ProjectFormValues) {
  const auth = await assertShowcaseEditor();
  if ('error' in auth) return { error: auth.error };
  const parsed = projectFormSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid project' };

  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Database is not configured' };

  const slug = await uniqueProjectSlug(supabase, parsed.data.slug || parsed.data.title);
  const { data, error } = await supabase
    .from('ecommerce_projects')
    .insert({
      ...parsed.data,
      slug,
      published: false,
      created_by: auth.profile.id,
      updated_by: auth.profile.id,
    })
    .select('id, slug')
    .single();

  if (error) return { error: error.message };
  try {
    await ensureHomepagePage(supabase, data.id as string);
  } catch (pageError) {
    return { error: pageError instanceof Error ? pageError.message : 'Could not create homepage page' };
  }
  revalidateShowcase(data.slug, data.id as string);
  return { data: { id: data.id as string, slug: data.slug as string } };
}

export async function ensureDraftProjectAction(input: {
  title?: string;
  slug?: string;
  short_description?: string;
  full_description?: string;
  category_id?: string;
  technology_stack?: string[];
  website_type?: string;
  industry?: string;
  starting_price?: number;
  currency?: string;
}) {
  const auth = await assertShowcaseEditor();
  if ('error' in auth) return { error: auth.error };
  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Database is not configured' };

  const title = input.title?.trim() || 'Untitled website';
  const slug = await uniqueProjectSlug(supabase, input.slug || title);
  const { data, error } = await supabase
    .from('ecommerce_projects')
    .insert({
      title,
      slug,
      short_description: input.short_description?.trim() || null,
      full_description: input.full_description?.trim() || null,
      category_id: input.category_id || null,
      technology_stack: input.technology_stack?.length ? input.technology_stack : ['Next.js'],
      website_type: input.website_type || null,
      industry: input.industry || null,
      starting_price: input.starting_price ?? 0,
      currency: input.currency ?? 'BDT',
      published: false,
      created_by: auth.profile.id,
      updated_by: auth.profile.id,
    })
    .select('id, slug')
    .single();

  if (error) return { error: error.message };
  try {
    await ensureHomepagePage(supabase, data.id as string);
  } catch (pageError) {
    return { error: pageError instanceof Error ? pageError.message : 'Could not create homepage page' };
  }
  revalidateShowcase(data.slug as string, data.id as string);
  return { data: { id: data.id as string, slug: data.slug as string } };
}

export async function updateProjectAction(id: string, input: ProjectFormValues) {
  const auth = await assertShowcaseEditor();
  if ('error' in auth) return { error: auth.error };
  const parsed = projectFormSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid project' };

  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Database is not configured' };

  const { data, error } = await supabase
    .from('ecommerce_projects')
    .update({
      ...parsed.data,
      updated_by: auth.profile.id,
    })
    .eq('id', id)
    .select('slug')
    .single();

  if (error) return { error: error.message };
  revalidateShowcase(data?.slug as string | undefined, id);
  return { data: { id } };
}

export async function toggleProjectFlagAction(
  id: string,
  field: 'published' | 'featured',
  value: boolean
) {
  const auth = await assertShowcaseEditor();
  if ('error' in auth) return { error: auth.error };
  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Database is not configured' };

  if (field === 'published' && value) {
    const { data: project } = await supabase
      .from('ecommerce_projects')
      .select('title, slug, category_id, starting_price, cover_image_url, cover_image_path')
      .eq('id', id)
      .maybeSingle();
    if (!project?.title?.trim()) return { error: 'Add a project title before publishing.' };
    if (!project?.slug?.trim()) return { error: 'Add a slug before publishing.' };
    if (!project?.category_id) return { error: 'Select a category before publishing.' };
    if (!(Number(project.starting_price) > 0)) return { error: 'Set a starting price before publishing.' };
    if (!project.cover_image_url && !project.cover_image_path) {
      return { error: 'Upload a cover image before publishing.' };
    }
    const { data: homepage } = await supabase
      .from('ecommerce_project_pages')
      .select('image_url')
      .eq('project_id', id)
      .eq('page_type', 'homepage')
      .is('deleted_at', null)
      .maybeSingle();
    if (!homepage?.image_url) {
      return { error: 'Please upload a Homepage screenshot before publishing.' };
    }
  }

  const { data, error } = await supabase
    .from('ecommerce_projects')
    .update({ [field]: value, updated_by: auth.profile.id })
    .eq('id', id)
    .select('slug')
    .single();
  if (error) return { error: error.message };
  revalidateShowcase(data?.slug as string | undefined, id);
  return { data: { id } };
}

export async function softDeleteProjectAction(id: string) {
  const auth = await assertShowcaseEditor();
  if ('error' in auth) return { error: auth.error };
  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Database is not configured' };
  const { data, error } = await supabase
    .from('ecommerce_projects')
    .update({
      deleted_at: new Date().toISOString(),
      published: false,
      updated_by: auth.profile.id,
    })
    .eq('id', id)
    .select('slug')
    .single();
  if (error) return { error: error.message };
  revalidateShowcase(data?.slug as string | undefined);
  return { data: { id } };
}

export async function restoreProjectAction(id: string) {
  const auth = await assertShowcaseEditor();
  if ('error' in auth) return { error: auth.error };
  if (!isSuperAdminRole(auth.profile.role)) return { error: 'Only Super Admin can restore projects.' };
  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Database is not configured' };
  const { error } = await supabase.from('ecommerce_projects').update({ deleted_at: null }).eq('id', id);
  if (error) return { error: error.message };
  revalidateShowcase();
  return { data: { id } };
}

export async function purgeProjectAction(id: string) {
  const auth = await assertShowcaseEditor();
  if ('error' in auth) return { error: auth.error };
  if (!isSuperAdminRole(auth.profile.role)) return { error: 'Only Super Admin can permanently delete.' };
  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Database is not configured' };
  const pages = await adminGetPages(id);
  const { data: project } = await supabase
    .from('ecommerce_projects')
    .select('cover_image_path, cover_fallback_path')
    .eq('id', id)
    .maybeSingle();
  await Promise.all([
    deleteProjectImage(project?.cover_image_path as string | undefined),
    deleteProjectImage(project?.cover_fallback_path as string | undefined),
    ...pages.flatMap((page) => [
      deleteProjectImage(page.image_path),
      deleteProjectImage(page.fallback_path),
      deleteProjectImage(page.thumbnail_path),
    ]),
  ]);
  const { error } = await supabase.from('ecommerce_projects').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidateShowcase();
  return { data: { id } };
}

export async function upsertPackagesAction(
  projectId: string,
  packages: Array<{
    id?: string;
    name: string;
    price: number;
    currency?: string;
    short_description?: string;
    features: string[];
    is_popular?: boolean;
    sort_order?: number;
    active?: boolean;
  }>
) {
  const auth = await assertShowcaseEditor();
  if ('error' in auth) return { error: auth.error };
  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Database is not configured' };

  const { data: existing } = await supabase
    .from('ecommerce_packages')
    .select('id')
    .eq('project_id', projectId)
    .is('deleted_at', null);

  const keepIds = new Set(packages.map((item) => item.id).filter(Boolean) as string[]);
  const toRemove = (existing ?? [])
    .map((row) => String((row as { id: string }).id))
    .filter((id) => !keepIds.has(id));

  if (toRemove.length > 0) {
    await supabase
      .from('ecommerce_packages')
      .update({ deleted_at: new Date().toISOString(), active: false })
      .in('id', toRemove);
  }

  for (const [index, pkg] of packages.entries()) {
    const payload = {
      project_id: projectId,
      name: pkg.name,
      price: pkg.price,
      currency: pkg.currency ?? 'BDT',
      short_description: pkg.short_description || null,
      features: pkg.features,
      is_popular: pkg.is_popular ?? false,
      sort_order: pkg.sort_order ?? index,
      active: pkg.active ?? true,
    };
    if (pkg.id) {
      const { error } = await supabase.from('ecommerce_packages').update(payload).eq('id', pkg.id);
      if (error) return { error: error.message };
    } else {
      const { error } = await supabase.from('ecommerce_packages').insert(payload);
      if (error) return { error: error.message };
    }
  }

  const minPrice = Math.min(...packages.map((item) => item.price));
  await supabase.from('ecommerce_projects').update({ starting_price: minPrice }).eq('id', projectId);
  revalidateShowcase();
  return { data: { ok: true } };
}

export async function createPageRecordAction(input: {
  projectId: string;
  page_type: string;
  page_name: string;
  slug: string;
  sort_order?: number;
}) {
  const auth = await assertShowcaseEditor();
  if ('error' in auth) return { error: auth.error };
  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Database is not configured' };
  const { data, error } = await supabase
    .from('ecommerce_project_pages')
    .insert({
      project_id: input.projectId,
      page_type: input.page_type,
      page_name: input.page_name,
      slug: input.slug,
      sort_order: input.sort_order ?? 0,
      published: true,
    })
    .select('id')
    .single();
  if (error) return { error: error.message };
  revalidateShowcase();
  return { data: { id: data.id as string } };
}

export async function uploadPageScreenshotAction(formData: FormData) {
  const auth = await assertShowcaseEditor();
  if ('error' in auth) return { error: auth.error };
  const projectId = String(formData.get('projectId') ?? '');
  const pageType = String(formData.get('pageType') ?? 'custom');
  const pageName = String(formData.get('pageName') ?? getPageType(pageType).label);
  let pageId = String(formData.get('pageId') ?? '');
  const file = formData.get('file');
  if (!projectId || !(file instanceof File)) return { error: 'Missing image upload data' };

  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Database is not configured' };

  if (!pageId && pageType !== 'custom') {
    const { data: existing } = await supabase
      .from('ecommerce_project_pages')
      .select('id')
      .eq('project_id', projectId)
      .eq('page_type', pageType)
      .is('deleted_at', null)
      .order('sort_order', { ascending: true })
      .limit(1)
      .maybeSingle();
    pageId = (existing?.id as string | undefined) ?? '';
  }

  if (!pageId) {
    const { count } = await supabase
      .from('ecommerce_project_pages')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', projectId)
      .is('deleted_at', null);
    const slugRoot = slugifyTitle(pageName) || pageType || 'page';
    let slug = slugRoot;
    for (let i = 0; i < 20; i++) {
      const candidate = i === 0 ? slugRoot : `${slugRoot}-${i + 1}`;
      const { data: clash } = await supabase
        .from('ecommerce_project_pages')
        .select('id')
        .eq('project_id', projectId)
        .eq('slug', candidate)
        .is('deleted_at', null)
        .maybeSingle();
      if (!clash) {
        slug = candidate;
        break;
      }
    }
    const { data: created, error: createError } = await supabase
      .from('ecommerce_project_pages')
      .insert({
        project_id: projectId,
        page_type: pageType,
        page_name: pageName,
        slug,
        sort_order: count ?? 0,
        published: true,
      })
      .select('id')
      .single();
    if (createError || !created) return { error: createError?.message ?? 'Could not create page' };
    pageId = created.id as string;
  }

  try {
    const previous = await supabase
      .from('ecommerce_project_pages')
      .select('image_path, fallback_path, thumbnail_path')
      .eq('id', pageId)
      .maybeSingle();
    const uploaded = await uploadProjectPageImage({
      projectId,
      pageId,
      pageType,
      fileBuffer: Buffer.from(await file.arrayBuffer()),
      contentType: file.type || 'image/png',
      fileName: file.name || 'page.png',
    });
    const { error } = await supabase
      .from('ecommerce_project_pages')
      .update({
        image_url: uploaded.image_url,
        image_path: uploaded.image_path,
        fallback_url: uploaded.fallback_url,
        fallback_path: uploaded.fallback_path,
        thumbnail_url: uploaded.thumbnail_url,
        thumbnail_path: uploaded.thumbnail_path,
        image_width: uploaded.image_width,
        image_height: uploaded.image_height,
      })
      .eq('id', pageId);
    if (error) return { error: error.message };
    const prev = previous.data;
    const stale = [prev?.image_path, prev?.fallback_path, prev?.thumbnail_path].filter(
      (path): path is string =>
        Boolean(path) &&
        path !== uploaded.image_path &&
        path !== uploaded.fallback_path &&
        path !== uploaded.thumbnail_path
    );
    await Promise.all(stale.map((path) => deleteProjectImage(path)));
    revalidateShowcase(undefined, projectId);
    return {
      data: {
        id: pageId,
        image_url: uploaded.image_url,
        thumbnail_url: uploaded.thumbnail_url,
      },
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Upload failed' };
  }
}

export async function updatePageRecordAction(
  id: string,
  patch: Partial<{
    page_type: string;
    page_name: string;
    slug: string;
    sort_order: number;
    published: boolean;
    is_featured: boolean;
  }>
) {
  const auth = await assertShowcaseEditor();
  if ('error' in auth) return { error: auth.error };
  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Database is not configured' };
  const { error } = await supabase.from('ecommerce_project_pages').update(patch).eq('id', id);
  if (error) return { error: error.message };
  revalidateShowcase();
  return { data: { id } };
}

export async function reorderPagesAction(projectId: string, orderedIds: string[]) {
  const auth = await assertShowcaseEditor();
  if ('error' in auth) return { error: auth.error };
  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Database is not configured' };
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from('ecommerce_project_pages').update({ sort_order: index }).eq('id', id).eq('project_id', projectId)
    )
  );
  revalidateShowcase();
  return { data: { ok: true } };
}

export async function deletePageAction(id: string) {
  const auth = await assertShowcaseEditor();
  if ('error' in auth) return { error: auth.error };
  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Database is not configured' };
  const { data } = await supabase
    .from('ecommerce_project_pages')
    .select('image_path, fallback_path, thumbnail_path, project_id')
    .eq('id', id)
    .maybeSingle();
  await Promise.all([
    deleteProjectImage(data?.image_path as string | undefined),
    deleteProjectImage(data?.fallback_path as string | undefined),
    deleteProjectImage(data?.thumbnail_path as string | undefined),
  ]);
  const { error } = await supabase
    .from('ecommerce_project_pages')
    .update({ deleted_at: new Date().toISOString(), published: false })
    .eq('id', id);
  if (error) return { error: error.message };
  revalidateShowcase();
  return { data: { id } };
}

export async function uploadPageImageAction(formData: FormData) {
  const auth = await assertShowcaseEditor();
  if ('error' in auth) return { error: auth.error };
  const projectId = String(formData.get('projectId') ?? '');
  const pageId = String(formData.get('pageId') ?? '');
  const pageType = String(formData.get('pageType') ?? 'custom');
  const file = formData.get('file');
  if (!projectId || !pageId || !(file instanceof File)) return { error: 'Missing image upload data' };

  const buffer = Buffer.from(await file.arrayBuffer());
  try {
    const uploaded = await uploadProjectPageImage({
      projectId,
      pageId,
      pageType,
      fileBuffer: buffer,
      contentType: file.type || 'image/png',
      fileName: file.name || 'page.png',
    });
    const supabase = await getAdminClient();
    if (!supabase) return { error: 'Database is not configured' };
    const { error } = await supabase
      .from('ecommerce_project_pages')
      .update({
        image_url: uploaded.image_url,
        image_path: uploaded.image_path,
        fallback_url: uploaded.fallback_url,
        fallback_path: uploaded.fallback_path,
        thumbnail_url: uploaded.thumbnail_url,
        thumbnail_path: uploaded.thumbnail_path,
        image_width: uploaded.image_width,
        image_height: uploaded.image_height,
      })
      .eq('id', pageId);
    if (error) return { error: error.message };
    revalidateShowcase();
    return { data: uploaded };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Upload failed' };
  }
}

export async function uploadCoverAction(formData: FormData) {
  const auth = await assertShowcaseEditor();
  if ('error' in auth) return { error: auth.error };
  const projectId = String(formData.get('projectId') ?? '');
  const file = formData.get('file');
  if (!projectId || !(file instanceof File)) return { error: 'Missing cover image' };
  const accepted = new Set(['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/avif']);
  if (file.type && !accepted.has(file.type)) {
    return { error: 'Upload a PNG, JPEG, WebP, or AVIF image' };
  }
  try {
    const uploaded = await uploadProjectCover({
      projectId,
      fileBuffer: Buffer.from(await file.arrayBuffer()),
      contentType: file.type || 'image/png',
    });
    const supabase = await getAdminClient();
    if (!supabase) return { error: 'Database is not configured' };
    const { data, error } = await supabase
      .from('ecommerce_projects')
      .update({ ...uploaded, updated_by: auth.profile.id })
      .eq('id', projectId)
      .select('slug')
      .single();
    if (error) return { error: error.message };
    revalidateShowcase(data?.slug as string | undefined);
    return { data: uploaded };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Cover upload failed' };
  }
}

export async function deleteCoverAction(projectId: string) {
  const auth = await assertShowcaseEditor();
  if ('error' in auth) return { error: auth.error };
  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Database is not configured' };
  const { data } = await supabase
    .from('ecommerce_projects')
    .select('cover_image_path, cover_fallback_path, slug')
    .eq('id', projectId)
    .maybeSingle();
  await Promise.all([
    deleteProjectImage(data?.cover_image_path as string | undefined),
    deleteProjectImage(data?.cover_fallback_path as string | undefined),
  ]);
  const { error } = await supabase
    .from('ecommerce_projects')
    .update({
      cover_image_url: null,
      cover_image_path: null,
      cover_fallback_url: null,
      cover_fallback_path: null,
      og_image_url: null,
      updated_by: auth.profile.id,
    })
    .eq('id', projectId);
  if (error) return { error: error.message };
  revalidateShowcase(data?.slug as string | undefined);
  return { data: { ok: true } };
}

export async function submitShowcaseLeadAction(input: {
  name: string;
  phone: string;
  business_name?: string;
  message?: string;
  project_id?: string;
  package_id?: string;
  source?: string;
}) {
  const parsed = leadFormSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid form' };
  const supabase = await getServerClient();
  if (!supabase) return { error: 'Unable to submit right now. Please try again.' };

  const { data, error } = await supabase.rpc('submit_project_lead', {
    p_name: parsed.data.name,
    p_phone: parsed.data.phone,
    p_business_name: parsed.data.business_name || null,
    p_message: parsed.data.message || null,
    p_project_id: input.project_id || null,
    p_package_id: parsed.data.package_id || input.package_id || null,
    p_website_url: null,
    p_preferred_contact: 'phone',
    p_source: input.source ?? 'project_page',
  });

  if (error) return { error: error.message };
  return { data: { id: data as string } };
}

export async function updateLeadStatusAction(id: string, status: LeadStatus) {
  const auth = await assertShowcaseViewer();
  if ('error' in auth) return { error: auth.error };
  const editor = await assertShowcaseEditor();
  if ('error' in editor) return { error: editor.error };
  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Database is not configured' };
  const { error } = await supabase.from('project_leads').update({ status }).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/ecommerce-leads');
  return { data: { id } };
}

const HOMEPAGE_KEYS = HOMEPAGE_SECTIONS.map((section) => section.key);

function isHomepageKey(value: string): value is HomepageSectionKey {
  return (HOMEPAGE_KEYS as readonly string[]).includes(value);
}

function placementLimitMessage(message: string) {
  if (message.includes('already has')) {
    return `This homepage section already has ${HOMEPAGE_SECTION_MAX} templates. Remove one before adding another.`;
  }
  return message;
}

export async function setHomepagePlacementAction(sectionKey: string, projectId: string) {
  const auth = await assertShowcaseEditor();
  if ('error' in auth) return { error: auth.error };
  if (!isHomepageKey(sectionKey)) return { error: 'Invalid homepage section' };
  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Database is not configured' };

  const { count } = await supabase
    .from('ecommerce_homepage_placements')
    .select('id', { count: 'exact', head: true })
    .eq('section_key', sectionKey)
    .eq('active', true);
  if ((count ?? 0) >= HOMEPAGE_SECTION_MAX) {
    return {
      error: `This homepage section already has ${HOMEPAGE_SECTION_MAX} templates. Remove one before adding another.`,
    };
  }

  const { data: last } = await supabase
    .from('ecommerce_homepage_placements')
    .select('sort_order')
    .eq('section_key', sectionKey)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from('ecommerce_homepage_placements').upsert(
    {
      section_key: sectionKey,
      project_id: projectId,
      active: true,
      sort_order: Number(last?.sort_order ?? -1) + 1,
    },
    { onConflict: 'section_key,project_id' }
  );
  if (error) return { error: placementLimitMessage(error.message) };
  revalidateShowcase(undefined, projectId);
  return { data: { ok: true } };
}

export async function removeHomepagePlacementAction(sectionKey: string, projectId: string) {
  const auth = await assertShowcaseEditor();
  if ('error' in auth) return { error: auth.error };
  if (!isHomepageKey(sectionKey)) return { error: 'Invalid homepage section' };
  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Database is not configured' };
  const { error } = await supabase
    .from('ecommerce_homepage_placements')
    .delete()
    .eq('section_key', sectionKey)
    .eq('project_id', projectId);
  if (error) return { error: error.message };
  revalidateShowcase(undefined, projectId);
  return { data: { ok: true } };
}

export async function reorderHomepagePlacementAction(placementId: string, direction: 'up' | 'down') {
  const auth = await assertShowcaseEditor();
  if ('error' in auth) return { error: auth.error };
  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Database is not configured' };

  const { data: current } = await supabase
    .from('ecommerce_homepage_placements')
    .select('id, section_key, sort_order')
    .eq('id', placementId)
    .maybeSingle();
  if (!current) return { error: 'Placement not found' };

  const query = supabase
    .from('ecommerce_homepage_placements')
    .select('id, sort_order')
    .eq('section_key', current.section_key)
    .eq('active', true);
  const siblingQuery =
    direction === 'up'
      ? query.lt('sort_order', current.sort_order).order('sort_order', { ascending: false }).limit(1)
      : query.gt('sort_order', current.sort_order).order('sort_order', { ascending: true }).limit(1);
  const { data: sibling } = await siblingQuery.maybeSingle();
  if (!sibling) return { data: { ok: true } };

  const a = Number(current.sort_order);
  const b = Number(sibling.sort_order);
  const { error: firstError } = await supabase
    .from('ecommerce_homepage_placements')
    .update({ sort_order: b })
    .eq('id', current.id);
  if (firstError) return { error: firstError.message };
  const { error: secondError } = await supabase
    .from('ecommerce_homepage_placements')
    .update({ sort_order: a })
    .eq('id', sibling.id);
  if (secondError) return { error: secondError.message };
  revalidateShowcase();
  return { data: { ok: true } };
}

export async function syncProjectHomepageSectionsAction(projectId: string, sectionKeys: string[]) {
  const auth = await assertShowcaseEditor();
  if ('error' in auth) return { error: auth.error };
  const desired = Array.from(new Set(sectionKeys.filter(isHomepageKey)));
  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Database is not configured' };

  const { data: existing } = await supabase
    .from('ecommerce_homepage_placements')
    .select('section_key')
    .eq('project_id', projectId)
    .eq('active', true);
  const current = new Set(
    (existing ?? []).map((row) => String((row as { section_key: string }).section_key) as HomepageSectionKey)
  );

  for (const key of current) {
    if (!desired.includes(key)) {
      const removed = await removeHomepagePlacementAction(key, projectId);
      if (removed.error) return removed;
    }
  }
  for (const key of desired) {
    if (!current.has(key)) {
      const added = await setHomepagePlacementAction(key, projectId);
      if (added.error) return added;
    }
  }
  revalidateShowcase(undefined, projectId);
  return { data: { ok: true } };
}

export async function placeWebsiteOrderAction(input: {
  project_id: string;
  package_id: string;
  customer_name: string;
  phone: string;
  business_name?: string;
  notes?: string;
}) {
  const parsed = websiteOrderFormSchema.safeParse({
    customer_name: input.customer_name,
    phone: input.phone,
    business_name: input.business_name ?? '',
    package_id: input.package_id,
    notes: input.notes ?? '',
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid order' };

  const supabase = await getServerClient();
  if (!supabase) return { error: 'Unable to place the order right now. Please try again.' };

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { error: 'Sign in to place an order', needsAuth: true as const };
  }

  const { data, error } = await supabase.rpc('place_ecommerce_website_order', {
    p_project_id: input.project_id,
    p_package_id: parsed.data.package_id,
    p_customer_name: parsed.data.customer_name,
    p_phone: parsed.data.phone,
    p_business_name: parsed.data.business_name || null,
    p_notes: parsed.data.notes || null,
  });

  if (error) return { error: error.message };
  revalidatePath('/dashboard/orders');
  revalidatePath('/admin/ecommerce-orders');
  return { data: { id: data as string } };
}

export async function updateWebsiteOrderStatusAction(id: string, status: WebsiteOrderStatus) {
  const auth = await assertShowcaseEditor();
  if ('error' in auth) return { error: auth.error };
  if (!WEBSITE_ORDER_STATUSES.includes(status)) return { error: 'Invalid status' };
  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Database is not configured' };
  const { error } = await supabase.from('ecommerce_website_orders').update({ status }).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/ecommerce-orders');
  revalidatePath('/dashboard/orders');
  return { data: { id } };
}
