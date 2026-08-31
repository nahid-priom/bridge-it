import type { BitpProject, BitpProjectStage } from '@/types/bitp';
import { getServerClient, getAdminClient } from '@/lib/services/client';

const PROJECT_SELECT = `
  *,
  stages:project_stages(*)
`;

export async function getClientProjects(clientId: string): Promise<BitpProject[]> {
  const supabase = await getServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('projects')
    .select(PROJECT_SELECT)
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[projects.service]', error.message);
    return [];
  }

  return ((data ?? []) as BitpProject[]).map((p) => ({
    ...p,
    stages: ((p.stages as BitpProjectStage[]) ?? []).sort((a, b) => a.sort_order - b.sort_order),
  }));
}

export async function getProjectById(
  projectId: string,
  clientId?: string
): Promise<BitpProject | null> {
  const supabase = await getServerClient();
  if (!supabase) return null;

  let query = supabase.from('projects').select(PROJECT_SELECT).eq('id', projectId);
  if (clientId) query = query.eq('client_id', clientId);

  const { data, error } = await query.maybeSingle();
  if (error || !data) return null;

  const project = data as BitpProject;
  project.stages = ((project.stages as BitpProjectStage[]) ?? []).sort(
    (a, b) => a.sort_order - b.sort_order
  );
  return project;
}

export async function getAllProjectsAdmin(): Promise<BitpProject[]> {
  const admin = await getAdminClient();
  const supabase = admin ?? (await getServerClient());
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('projects')
    .select(PROJECT_SELECT)
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data ?? []) as BitpProject[];
}

export async function createProjectFromOrderAdmin(
  orderId: string,
  clientId: string,
  title: string,
  stages: { title: string; description?: string; sort_order: number }[]
) {
  const admin = await getAdminClient();
  if (!admin) return { project: null, error: 'Admin client not configured' };

  const { data: project, error } = await admin
    .from('projects')
    .insert({
      order_id: orderId,
      client_id: clientId,
      title,
      status: 'in_progress',
      progress_percent: 0,
      start_date: new Date().toISOString().slice(0, 10),
    })
    .select('*')
    .single();

  if (error || !project) return { project: null, error: error?.message };

  if (stages.length > 0) {
    await admin.from('project_stages').insert(
      stages.map((s) => ({
        project_id: project.id,
        title: s.title,
        description: s.description ?? null,
        sort_order: s.sort_order,
        status: s.sort_order === 0 ? 'in_progress' : 'pending',
      }))
    );
  }

  return { project: project as BitpProject, error: null };
}

export async function updateProjectStageAdmin(
  stageId: string,
  status: BitpProjectStage['status']
) {
  const admin = await getAdminClient();
  if (!admin) return { error: 'Admin client not configured' };

  const updates: Record<string, unknown> = { status };
  if (status === 'in_progress') updates.started_at = new Date().toISOString();
  if (status === 'completed') updates.completed_at = new Date().toISOString();

  const { error } = await admin.from('project_stages').update(updates).eq('id', stageId);
  return { error: error?.message ?? null };
}
