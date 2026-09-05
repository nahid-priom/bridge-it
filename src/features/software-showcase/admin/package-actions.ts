'use server';

import { revalidatePath } from 'next/cache';
import { getAdminClient } from '@/lib/services/client';
import { ROUTES } from '@/lib/routes';
import { SOFTWARE_FEATURE_GROUP_ORDER } from '../public/package-features';

function slugifyFeatureKey(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export type PackageFeatureInput = {
  id?: string;
  feature_key?: string;
  label: string;
  feature_group: string;
  is_included: boolean;
  is_highlighted: boolean;
  display_order: number;
};

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
}): Promise<{ error?: string; id?: string }> {
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
    revalidatePath(`${ROUTES.adminSoftwareProjects}/${input.project_slug}`);
    revalidatePath('/software');
    return { id: input.id };
  }

  const { data, error } = await supabase.from('software_packages').insert(payload).select('id').single();
  if (error) return { error: error.message };

  revalidatePath(`${ROUTES.adminSoftwareProjects}/${input.project_slug}`);
  revalidatePath('/software');
  return { id: data?.id as string | undefined };
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

export async function replaceSoftwarePackageFeaturesAction(input: {
  package_id: string;
  project_slug: string;
  features: PackageFeatureInput[];
}): Promise<{ error?: string }> {
  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Database unavailable' };

  const now = new Date().toISOString();
  const cleaned = input.features
    .map((feature, index) => {
      const label = feature.label.trim();
      if (!label) return null;
      const group =
        feature.feature_group.trim() ||
        SOFTWARE_FEATURE_GROUP_ORDER[SOFTWARE_FEATURE_GROUP_ORDER.length - 1];
      const featureKey =
        (feature.feature_key?.trim() || slugifyFeatureKey(label) || `feature-${index}`).slice(0, 80);
      return {
        package_id: input.package_id,
        feature_key: featureKey,
        label,
        feature_group: group,
        is_included: feature.is_included !== false,
        is_highlighted: Boolean(feature.is_highlighted),
        display_order: feature.display_order ?? index,
        updated_at: now,
        deleted_at: null,
      };
    })
    .filter(Boolean) as Array<{
    package_id: string;
    feature_key: string;
    label: string;
    feature_group: string;
    is_included: boolean;
    is_highlighted: boolean;
    display_order: number;
    updated_at: string;
    deleted_at: null;
  }>;

  // Soft-delete existing rows, then insert the editor payload.
  const { error: softDeleteError } = await supabase
    .from('software_package_features')
    .update({ deleted_at: now, updated_at: now })
    .eq('package_id', input.package_id)
    .is('deleted_at', null);

  if (softDeleteError) return { error: softDeleteError.message };

  if (cleaned.length > 0) {
    const { error: insertError } = await supabase.from('software_package_features').insert(cleaned);
    if (insertError) return { error: insertError.message };
  }

  const includedLabels = cleaned.filter((f) => f.is_included).map((f) => f.label);
  await supabase
    .from('software_packages')
    .update({ features: includedLabels, updated_at: now })
    .eq('id', input.package_id);

  revalidatePath(`${ROUTES.adminSoftwareProjects}/${input.project_slug}`);
  revalidatePath('/software');
  return {};
}
