'use server';

import { getCurrentUser } from '@/lib/auth/get-current-user';
import { getServerClient } from '@/lib/services/client';

export async function uploadRequirementFileAction(
  formData: FormData
): Promise<{ path?: string; error?: string; needsAuth?: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { error: 'Please sign in to upload files', needsAuth: true as const };

  const file = formData.get('file') as File | null;
  if (!file || file.size === 0) return { error: 'No file provided' };

  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) return { error: 'File must be under 10MB' };

  const supabase = await getServerClient();
  if (!supabase) return { error: 'Storage not configured' };

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
  const path = `${user.id}/${Date.now()}-${safeName || `upload.${ext}`}`;

  const { error } = await supabase.storage.from('client-requirements').upload(path, file, {
    upsert: false,
    contentType: file.type || undefined,
  });

  if (error) return { error: error.message };
  return { path };
}
