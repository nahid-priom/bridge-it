'use server';

import { revalidatePath } from 'next/cache';
import { getAdminClient } from '@/lib/services/client';
import { ROUTES } from '@/lib/routes';

export async function upsertSoftwarePackageAction(input: {
  id?: string;
  project_id: string;
  project_slug: string;
  name: string;
  tier: string;
  price: number;
  short_description?: string;
  target_business_size?: string;
  badge?: string;
  features: string[];
  is_recommended?: boolean;
  is_popular?: boolean;
  sort_order?: number;
  active?: boolean;
}): Promise<{ error?: string }> {
  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Database unavailable' };

  const tier = input.tier.trim().toLowerCase();
  if (!tier) return { error: 'Tier is required' };
  if (input.price < 0) return { error: 'Price must be zero or greater' };

  const payload = {
    project_id: input.project_id,
    name: input.name.trim(),
    tier,
    price: Math.round(input.price),
    currency: 'BDT',
    payment_type: 'one_time',
    short_description: input.short_description?.trim() || null,
    target_business_size: input.target_business_size?.trim() || null,
    badge: input.badge?.trim() || null,
    features: input.features.filter(Boolean),
    is_recommended: Boolean(input.is_recommended),
    is_popular: Boolean(input.is_popular),
    sort_order: input.sort_order ?? 0,
    active: input.active ?? true,
    updated_at: new Date().toISOString(),
    deleted_at: null,
  };

  if (input.id) {
    const { error } = await supabase.from('software_packages').update(payload).eq('id', input.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from('software_packages').insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath(`${ROUTES.adminSoftwareProjects}/${input.project_slug}`);
  revalidatePath('/software');
  return {};
}

export async function softDeleteSoftwarePackageAction(input: {
  id: string;
  project_slug: string;
}): Promise<{ error?: string }> {
  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Database unavailable' };

  const { error } = await supabase
    .from('software_packages')
    .update({ deleted_at: new Date().toISOString(), active: false })
    .eq('id', input.id);

  if (error) return { error: error.message };
  revalidatePath(`${ROUTES.adminSoftwareProjects}/${input.project_slug}`);
  return {};
}
