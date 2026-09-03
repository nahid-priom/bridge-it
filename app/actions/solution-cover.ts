'use server';

import { revalidatePath } from 'next/cache';
import { assertAdminAction } from '@/lib/auth/admin-action';
import {
  fetchBitpCoverRecordById,
  removeCover,
  uploadCustomCover,
} from '@/lib/services/solution-cover.service';

const REVALIDATE_PATHS = ['/', '/admin', '/solutions', '/pricing', '/marketplace', '/products'] as const;
const ACCEPTED_TYPES = new Set(['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/avif']);

function revalidateCatalog() {
  for (const path of REVALIDATE_PATHS) revalidatePath(path);
}

export async function uploadSolutionCoverAction(formData: FormData) {
  const admin = await assertAdminAction();
  if ('error' in admin) return { error: admin.error };

  const file = formData.get('file');
  const productId = formData.get('productId');

  if (!(file instanceof File) || !productId || typeof productId !== 'string') {
    return { error: 'File and productId are required' };
  }

  if (!ACCEPTED_TYPES.has(file.type)) {
    return { error: 'Upload a PNG, JPEG, WebP, or AVIF image' };
  }

  if (file.size > 8 * 1024 * 1024) {
    return { error: 'Image must be under 8MB' };
  }

  try {
    const record = await fetchBitpCoverRecordById(productId);
    if (!record) return { error: 'Product not found' };

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadCustomCover(record, buffer);
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
