'use server';

import { getCurrentUser } from '@/lib/auth/get-current-user';
import { getServerClient } from '@/lib/services/client';

export async function getProjectFileDownloadUrlAction(filePath: string): Promise<{ url?: string; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { error: 'Not authenticated' };

  const supabase = await getServerClient();
  if (!supabase) return { error: 'Storage not configured' };

  const { data: fileRow } = await supabase
    .from('project_files')
    .select('id, file_path, project_id')
    .eq('file_path', filePath)
    .maybeSingle();

  if (!fileRow) return { error: 'File not found' };

  const { data: project } = await supabase
    .from('projects')
    .select('client_id')
    .eq('id', fileRow.project_id)
    .maybeSingle();

  if (!project || project.client_id !== user.id) return { error: 'File not found' };

  const { data, error } = await supabase.storage.from('project-files').createSignedUrl(filePath, 3600);
  if (error) return { error: error.message };
  return { url: data.signedUrl };
}
