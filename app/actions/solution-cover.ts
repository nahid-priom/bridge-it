'use server';

import { revalidatePath } from 'next/cache';
import { assertAdminAction } from '@/lib/auth/admin-action';
import {
  bulkGenerateCovers,
  fetchBitpCoverRecordById,
  generateAndStoreCover,
  removeCover,
  uploadCustomCover,
  type BulkCoverProgress,
} from '@/lib/services/solution-cover.service';
import type { CoverEntityType } from '@/lib/solutions/coverTypes';

const REVALIDATE_PATHS = ['/', '/admin', '/solutions', '/pricing', '/marketplace', '/products'] as const;

function revalidateCatalog() {
  for (const path of REVALIDATE_PATHS) revalidatePath(path);
}

export async function generateSolutionCoverAction(input: {
  productId: string;
  customPrompt?: string;
}) {
  const admin = await assertAdminAction();
  if ('error' in admin) return { error: admin.error };

  try {
    const record = await fetchBitpCoverRecordById(input.productId);
    if (!record) return { error: 'Product not found' };

    const result = await generateAndStoreCover(record, input.customPrompt);
    revalidateCatalog();
    return { data: result };
  } catch (err) {
    console.error('[generateSolutionCoverAction]', err);
    return { error: 'Cover image generation failed. Please retry.' };
  }
}

export async function uploadSolutionCoverAction(formData: FormData) {
  const admin = await assertAdminAction();
  if ('error' in admin) return { error: admin.error };

  const file = formData.get('file');
  const productId = formData.get('productId');

  if (!(file instanceof File) || !productId || typeof productId !== 'string') {
    return { error: 'File and productId are required' };
  }

  if (!file.type.startsWith('image/')) {
    return { error: 'Only image files are allowed' };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { error: 'Image must be under 5MB' };
  }

  try {
    const record = await fetchBitpCoverRecordById(productId);
    if (!record) return { error: 'Product not found' };

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadCustomCover(record, buffer, file.type);
    revalidateCatalog();
    return { data: result };
  } catch (err) {
    console.error('[uploadSolutionCoverAction]', err);
    return { error: 'Cover image upload failed. Please retry.' };
  }
}

export async function removeSolutionCoverAction(productId: string) {
  const admin = await assertAdminAction();
  if ('error' in admin) return { error: admin.error };

  try {
    const record = await fetchBitpCoverRecordById(productId);
    if (!record) return { error: 'Product not found' };

    await removeCover(record);
    revalidateCatalog();
    return { success: true };
  } catch (err) {
    console.error('[removeSolutionCoverAction]', err);
    return { error: 'Failed to remove cover image.' };
  }
}

export async function bulkGenerateSolutionCoversAction(input?: {
  entityTypes?: CoverEntityType[];
  force?: boolean;
}) {
  const admin = await assertAdminAction();
  if ('error' in admin) return { error: admin.error };

  try {
    const progress = await bulkGenerateCovers({
      entityTypes: input?.entityTypes,
      onlyMissing: !input?.force,
      concurrency: 2,
    });
    revalidateCatalog();
    return { data: progress };
  } catch (err) {
    console.error('[bulkGenerateSolutionCoversAction]', err);
    return { error: 'Bulk cover generation failed. Please retry.' };
  }
}

export async function updateCoverPromptAction(input: {
  productId: string;
  prompt: string;
}) {
  const admin = await assertAdminAction();
  if ('error' in admin) return { error: admin.error };

  const { getAdminClient } = await import('@/lib/services/client');
  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Supabase not configured' };

  const { error } = await supabase
    .from('products')
    .update({ cover_image_prompt: input.prompt })
    .eq('id', input.productId);

  if (error) {
    console.error('[updateCoverPromptAction]', error.message);
    return { error: 'Failed to save prompt.' };
  }

  return { success: true };
}
