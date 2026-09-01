'use server';

import { revalidatePath } from 'next/cache';
import { assertAdminAction } from '@/lib/auth/admin-action';
import { getAdminClient } from '@/lib/services/client';
import type { SoftwareDemoConfig, SoftwareFeatureFlags } from '@/types/bitp';

const REVALIDATE = ['/', '/admin', '/solutions/software', '/demo/software'] as const;

function revalidateSoftware() {
  for (const path of REVALIDATE) revalidatePath(path);
}

export async function listSoftwareDemoConfigsAction() {
  const admin = await assertAdminAction();
  if ('error' in admin) return { error: admin.error };

  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Supabase not configured' };

  const { data, error } = await supabase
    .from('software_demo_configs')
    .select('*, product:products(id, name, slug, status, category_id)')
    .order('package_level');

  if (error) return { error: error.message };
  return {
    configs: (data ?? []).map((row) => ({
      ...row,
      feature_flags: (row.feature_flags ?? {}) as SoftwareFeatureFlags,
      workflow_config: Array.isArray(row.workflow_config) ? row.workflow_config : [],
    })) as SoftwareDemoConfig[],
  };
}

export async function getSoftwareDemoConfigAction(configId: string) {
  const admin = await assertAdminAction();
  if ('error' in admin) return { error: admin.error };

  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Supabase not configured' };

  const [{ data: config, error }, { data: modules }] = await Promise.all([
    supabase.from('software_demo_configs').select('*').eq('id', configId).maybeSingle(),
    supabase.from('software_demo_modules').select('*').eq('demo_config_id', configId).order('sort_order'),
  ]);

  if (error) return { error: error.message };
  if (!config) return { error: 'Config not found' };

  return {
    config: {
      ...config,
      feature_flags: (config.feature_flags ?? {}) as SoftwareFeatureFlags,
      workflow_config: Array.isArray(config.workflow_config) ? config.workflow_config : [],
      modules: modules ?? [],
    } as SoftwareDemoConfig,
  };
}

export async function updateSoftwareDemoConfigAction(input: {
  id: string;
  demo_title?: string;
  demo_description?: string | null;
  business_type?: string;
  active?: boolean;
  feature_flags?: SoftwareFeatureFlags;
  workflow_config?: string[];
}) {
  const admin = await assertAdminAction();
  if ('error' in admin) return { error: admin.error };

  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Supabase not configured' };

  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.demo_title !== undefined) payload.demo_title = input.demo_title;
  if (input.demo_description !== undefined) payload.demo_description = input.demo_description;
  if (input.business_type !== undefined) payload.business_type = input.business_type;
  if (input.active !== undefined) payload.active = input.active;
  if (input.feature_flags !== undefined) payload.feature_flags = input.feature_flags;
  if (input.workflow_config !== undefined) payload.workflow_config = input.workflow_config;

  const { data, error } = await supabase
    .from('software_demo_configs')
    .update(payload)
    .eq('id', input.id)
    .select('*')
    .single();

  if (error) return { error: error.message };
  revalidateSoftware();
  return { config: data };
}

export async function toggleSoftwareDemoModuleAction(moduleId: string, active: boolean) {
  const admin = await assertAdminAction();
  if ('error' in admin) return { error: admin.error };

  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Supabase not configured' };

  const { error } = await supabase.from('software_demo_modules').update({ active }).eq('id', moduleId);
  if (error) return { error: error.message };

  revalidateSoftware();
  return { success: true };
}
