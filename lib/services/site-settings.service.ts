import type { BitpSiteSetting } from '@/types/bitp';
import { getServerClient } from '@/lib/services/client';

export async function getPublicSiteSettings(): Promise<Record<string, string>> {
  const supabase = await getServerClient();
  if (!supabase) return {};

  const { data, error } = await supabase.from('site_settings').select('key, value');

  if (error) {
    console.error('[site-settings.service]', error.message);
    return {};
  }

  const map: Record<string, string> = {};
  for (const row of data ?? []) {
    map[row.key] = row.value ?? '';
  }
  return map;
}

export async function getSiteSetting(key: string, fallback = ''): Promise<string> {
  const settings = await getPublicSiteSettings();
  return settings[key] ?? fallback;
}

export async function getAllSiteSettingsAdmin(): Promise<BitpSiteSetting[]> {
  const supabase = await getServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase.from('site_settings').select('*').order('key');
  if (error) return [];
  return (data ?? []) as BitpSiteSetting[];
}
