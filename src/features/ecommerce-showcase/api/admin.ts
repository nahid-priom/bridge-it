import 'server-only';

import { createHash } from 'node:crypto';
import { getAdminClient } from '@/lib/services/client';
import { SHOWCASE_BUCKET } from '../config/constants';
import { processShowcaseImage } from '../utils/image-pipeline';
import {
  coverObjectPath,
  originalObjectPath,
  pageObjectPath,
} from '../utils/storage-paths';
import type { EcommercePackage, EcommerceProject, EcommerceProjectPage, HomepageSectionKey, ProjectLead } from '../types';
import { mapPackage, mapPage, mapProject } from './projects';

export async function adminListProjects(options: { includeDeleted?: boolean } = {}) {
  const supabase = await getAdminClient();
  if (!supabase) return [];
  let query = supabase.from('ecommerce_project_cards').select('*').order('updated_at', { ascending: false });
  if (!options.includeDeleted) query = query.is('deleted_at', null);
  const { data } = await query;
  return data ?? [];
}

export async function adminGetProject(id: string): Promise<EcommerceProject | null> {
  const supabase = await getAdminClient();
  if (!supabase) return null;
  const { data } = await supabase.from('ecommerce_projects').select('*').eq('id', id).maybeSingle();
  return data ? mapProject(data as Record<string, unknown>) : null;
}

export async function adminGetPages(projectId: string): Promise<EcommerceProjectPage[]> {
  const supabase = await getAdminClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from('ecommerce_project_pages')
    .select('*')
    .eq('project_id', projectId)
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });
  return (data ?? []).map((row) => mapPage(row as Record<string, unknown>));
}

export async function adminGetPackages(projectId: string): Promise<EcommercePackage[]> {
  const supabase = await getAdminClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from('ecommerce_packages')
    .select('*')
    .eq('project_id', projectId)
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });
  return (data ?? []).map((row) => mapPackage(row as Record<string, unknown>));
}

export async function adminListHomepagePlacements() {
  const supabase = await getAdminClient();
  if (!supabase) return [];
  const { data: rows } = await supabase
    .from('ecommerce_homepage_placements')
    .select('id, section_key, project_id, sort_order, active')
    .eq('active', true)
    .order('sort_order', { ascending: true });
  if (!rows?.length) return [];
  const ids = Array.from(new Set(rows.map((row) => String((row as { project_id: string }).project_id))));
  const { data: projects } = await supabase
    .from('ecommerce_projects')
    .select('id, title, slug, industry, cover_image_url, cover_fallback_url, published, deleted_at')
    .in('id', ids);
  const byId = new Map((projects ?? []).map((project) => [String((project as { id: string }).id), project]));
  return rows.map((row) => ({
    ...(row as Record<string, unknown>),
    ecommerce_projects: byId.get(String((row as { project_id: string }).project_id)) ?? null,
  }));
}

export async function adminListPublishedProjectOptions() {
  const supabase = await getAdminClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from('ecommerce_projects')
    .select('id, title, slug, industry, cover_image_url, cover_fallback_url')
    .eq('published', true)
    .is('deleted_at', null)
    .order('title', { ascending: true });
  return data ?? [];
}

export type HomepagePlacementRow = {
  id: string;
  section_key: HomepageSectionKey;
  project_id: string;
  sort_order: number;
  title: string;
  slug: string;
  industry: string | null;
  cover_image_url: string | null;
  cover_fallback_url: string | null;
};

export function mapAdminPlacement(row: Record<string, unknown>): HomepagePlacementRow | null {
  const project = row.ecommerce_projects as Record<string, unknown> | Record<string, unknown>[] | null;
  const p = Array.isArray(project) ? project[0] : project;
  if (!p || p.deleted_at) return null;
  return {
    id: String(row.id),
    section_key: String(row.section_key) as HomepageSectionKey,
    project_id: String(row.project_id),
    sort_order: Number(row.sort_order ?? 0),
    title: String(p.title ?? ''),
    slug: String(p.slug ?? ''),
    industry: (p.industry as string | null) ?? null,
    cover_image_url: (p.cover_image_url as string | null) ?? null,
    cover_fallback_url: (p.cover_fallback_url as string | null) ?? null,
  };
}

export async function adminListLeads(): Promise<ProjectLead[]> {
  const supabase = await getAdminClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from('project_leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);
  return (data ?? []) as ProjectLead[];
}

export async function uploadBuffer(path: string, buffer: Buffer, contentType: string) {
  const supabase = await getAdminClient();
  if (!supabase) throw new Error('Storage is not configured');
  const { error } = await supabase.storage.from(SHOWCASE_BUCKET).upload(path, buffer, {
    contentType,
    upsert: true,
    cacheControl: '31536000',
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(SHOWCASE_BUCKET).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

export async function removeStorageObject(path: string | null | undefined) {
  if (!path) return;
  const supabase = await getAdminClient();
  if (!supabase) return;
  await supabase.storage.from(SHOWCASE_BUCKET).remove([path]);
}

export async function uploadProcessedPageImage(options: {
  projectId: string;
  pageId: string;
  pageType: string;
  fileBuffer: Buffer;
  contentType: string;
  fileName: string;
}) {
  const processed = await processShowcaseImage(options.fileBuffer, options.contentType);
  const original = await uploadBuffer(
    originalObjectPath(options.projectId, options.fileName),
    processed.original,
    processed.originalContentType
  );
  const avifPath = pageObjectPath(options.projectId, options.pageType, options.pageId, 'desktop', 'avif');
  const webpPath = pageObjectPath(options.projectId, options.pageType, options.pageId, 'desktop', 'webp');
  const thumbPath = pageObjectPath(options.projectId, options.pageType, options.pageId, 'thumbnail', 'webp');
  const [avif, webp, thumb] = await Promise.all([
    uploadBuffer(avifPath, processed.desktop.avif, 'image/avif'),
    uploadBuffer(webpPath, processed.desktop.webp, 'image/webp'),
    uploadBuffer(thumbPath, processed.thumbnail.webp, 'image/webp'),
  ]);
  return {
    original,
    image_url: avif.publicUrl,
    image_path: avif.path,
    fallback_url: webp.publicUrl,
    fallback_path: webp.path,
    thumbnail_url: thumb.publicUrl,
    thumbnail_path: thumb.path,
    image_width: processed.desktop.width,
    image_height: processed.desktop.height,
    desktopBuffer: processed.desktop.webp,
  };
}

export async function uploadDirectCover(options: {
  projectId: string;
  fileBuffer: Buffer;
  contentType: string;
}) {
  const processed = await processShowcaseImage(options.fileBuffer, options.contentType);
  const version = createHash('sha1').update(processed.desktop.webp).digest('hex').slice(0, 10);
  const avifPath = coverObjectPath(options.projectId, 'avif', version);
  const webpPath = coverObjectPath(options.projectId, 'webp', version);
  const [avif, webp] = await Promise.all([
    uploadBuffer(avifPath, processed.desktop.avif, 'image/avif'),
    uploadBuffer(webpPath, processed.desktop.webp, 'image/webp'),
  ]);
  return {
    cover_image_url: avif.publicUrl,
    cover_image_path: avif.path,
    cover_fallback_url: webp.publicUrl,
    cover_fallback_path: webp.path,
    og_image_url: webp.publicUrl,
  };
}

