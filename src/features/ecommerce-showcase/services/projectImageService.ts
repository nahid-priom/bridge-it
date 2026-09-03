import 'server-only';

import { getAdminClient } from '@/lib/services/client';
import { SHOWCASE_BUCKET } from '../config/constants';
import {
  removeStorageObject,
  uploadDirectCover,
  uploadProcessedPageImage,
} from '../api/admin';

export async function uploadProjectCover(options: {
  projectId: string;
  fileBuffer: Buffer;
  contentType: string;
}) {
  return uploadDirectCover(options);
}

export async function replaceProjectImage(options: {
  projectId: string;
  fileBuffer: Buffer;
  contentType: string;
}) {
  return uploadDirectCover(options);
}

export async function uploadProjectPageImage(options: {
  projectId: string;
  pageId: string;
  pageType: string;
  fileBuffer: Buffer;
  contentType: string;
  fileName: string;
}) {
  return uploadProcessedPageImage(options);
}

export async function deleteProjectImage(objectPath: string | null | undefined) {
  return removeStorageObject(objectPath);
}

export async function getProjectImageUrl(objectPath: string): Promise<string | null> {
  const supabase = await getAdminClient();
  if (!supabase || !objectPath) return null;
  return supabase.storage.from(SHOWCASE_BUCKET).getPublicUrl(objectPath).data.publicUrl ?? null;
}

export { SHOWCASE_BUCKET };
