'use server';

import { revalidatePath } from 'next/cache';
import { getAdminClient } from '@/lib/services/client';
import { getCurrentProfile } from '@/lib/auth/get-current-user';
import { isShowcaseViewerRole } from '@/src/features/ecommerce-showcase/config/roles';
import { ROUTES } from '@/lib/routes';

export type TaxonomyActionResult = { ok: true; id?: string } | { ok: false; error: string };

async function requireAdmin() {
  const profile = await getCurrentProfile();
  if (!profile || !isShowcaseViewerRole(profile.role)) return null;
  return profile;
}

function slugify(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function revalidateTaxonomy() {
  revalidatePath(ROUTES.adminShowcaseTaxonomy);
  revalidatePath(ROUTES.softwareShowroom);
  revalidatePath('/');
}

export async function upsertShowcaseMain(formData: FormData): Promise<TaxonomyActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' };
  const supabase = await getAdminClient();
  if (!supabase) return { ok: false, error: 'Database unavailable' };

  const id = String(formData.get('id') ?? '').trim() || undefined;
  const name = String(formData.get('name') ?? '').trim();
  const slug = slugify(String(formData.get('slug') ?? name));
  const description = String(formData.get('description') ?? '').trim() || null;
  const sortOrder = Number(formData.get('sort_order') ?? 0);
  const active = formData.get('active') === 'on' || formData.get('active') === 'true';

  if (!name || !slug) return { ok: false, error: 'Name and slug required' };

  const payload = {
    name,
    slug,
    description,
    sort_order: Number.isFinite(sortOrder) ? Math.round(sortOrder) : 0,
    active,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    const { error } = await supabase.from('showcase_main_categories').update(payload).eq('id', id);
    if (error) return { ok: false, error: error.message };
    revalidateTaxonomy();
    return { ok: true, id };
  }

  const { data, error } = await supabase.from('showcase_main_categories').insert(payload).select('id').single();
  if (error) return { ok: false, error: error.message };
  revalidateTaxonomy();
  return { ok: true, id: data.id };
}

export async function upsertShowcaseCategory(formData: FormData): Promise<TaxonomyActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' };
  const supabase = await getAdminClient();
  if (!supabase) return { ok: false, error: 'Database unavailable' };

  const id = String(formData.get('id') ?? '').trim() || undefined;
  const mainCategoryId = String(formData.get('main_category_id') ?? '').trim();
  const name = String(formData.get('name') ?? '').trim();
  const slug = slugify(String(formData.get('slug') ?? name));
  const description = String(formData.get('description') ?? '').trim() || null;
  const sortOrder = Number(formData.get('sort_order') ?? 0);
  const active = formData.get('active') === 'on' || formData.get('active') === 'true';

  if (!mainCategoryId || !name || !slug) return { ok: false, error: 'Main category, name and slug required' };

  const payload = {
    main_category_id: mainCategoryId,
    name,
    slug,
    description,
    sort_order: Number.isFinite(sortOrder) ? Math.round(sortOrder) : 0,
    active,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    const { error } = await supabase.from('showcase_categories').update(payload).eq('id', id);
    if (error) return { ok: false, error: error.message };
    revalidateTaxonomy();
    return { ok: true, id };
  }

  const { data, error } = await supabase.from('showcase_categories').insert(payload).select('id').single();
  if (error) return { ok: false, error: error.message };
  revalidateTaxonomy();
  return { ok: true, id: data.id };
}

export async function upsertShowcaseChild(formData: FormData): Promise<TaxonomyActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' };
  const supabase = await getAdminClient();
  if (!supabase) return { ok: false, error: 'Database unavailable' };

  const id = String(formData.get('id') ?? '').trim() || undefined;
  const categoryId = String(formData.get('category_id') ?? '').trim();
  const name = String(formData.get('name') ?? '').trim();
  const slug = slugify(String(formData.get('slug') ?? name));
  const description = String(formData.get('description') ?? '').trim() || null;
  const sortOrder = Number(formData.get('sort_order') ?? 0);
  const active = formData.get('active') === 'on' || formData.get('active') === 'true';

  if (!categoryId || !name || !slug) return { ok: false, error: 'Category, name and slug required' };

  const payload = {
    category_id: categoryId,
    name,
    slug,
    description,
    sort_order: Number.isFinite(sortOrder) ? Math.round(sortOrder) : 0,
    active,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    const { error } = await supabase.from('showcase_child_categories').update(payload).eq('id', id);
    if (error) return { ok: false, error: error.message };
    revalidateTaxonomy();
    return { ok: true, id };
  }

  const { data, error } = await supabase.from('showcase_child_categories').insert(payload).select('id').single();
  if (error) return { ok: false, error: error.message };
  revalidateTaxonomy();
  return { ok: true, id: data.id };
}

export async function setTaxonomyActive(
  table: 'showcase_main_categories' | 'showcase_categories' | 'showcase_child_categories',
  id: string,
  active: boolean
): Promise<TaxonomyActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' };
  const supabase = await getAdminClient();
  if (!supabase) return { ok: false, error: 'Database unavailable' };
  const { error } = await supabase.from(table).update({ active, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidateTaxonomy();
  return { ok: true, id };
}
