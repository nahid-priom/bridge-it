'use server';

import { revalidatePath } from 'next/cache';
import { assertAdminAction } from '@/lib/auth/admin-action';
import { slugify } from '@/lib/catalog/slugify';
import {
  bitpCategorySchema,
  bitpProductSchema,
  bitpPackageSchema,
  bitpPackageFeatureSchema,
} from '@/lib/validations/bitp-admin';
import {
  upsertCategoryAdmin,
  deleteCategoryAdmin,
} from '@/lib/services/categories.service';
import {
  upsertProductAdmin,
  deleteProductAdmin,
  upsertPackageAdmin,
  deletePackageAdmin,
  upsertPackageFeatureAdmin,
  deletePackageFeatureAdmin,
  getProductByIdAdmin,
} from '@/lib/services/products.service';
import { getAdminClient } from '@/lib/services/client';

const REVALIDATE_PATHS = ['/', '/admin', '/solutions', '/pricing'] as const;

function revalidateCatalog() {
  for (const path of REVALIDATE_PATHS) revalidatePath(path);
}

export async function upsertBitpCategoryAction(input: unknown) {
  const admin = await assertAdminAction();
  if ('error' in admin) return { error: admin.error };

  const parsed = bitpCategorySchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid category data' };
  }

  const data = { ...parsed.data };
  if (!data.slug.trim()) {
    data.slug = slugify(data.name);
  }

  const result = await upsertCategoryAdmin(data);
  if (result.error) return { error: result.error };

  revalidateCatalog();
  return { data: result.data };
}

export async function deleteBitpCategoryAction(id: string) {
  const admin = await assertAdminAction();
  if ('error' in admin) return { error: admin.error };

  const result = await deleteCategoryAdmin(id);
  if (result.error) return { error: result.error };

  revalidateCatalog();
  return { success: true };
}

export async function upsertBitpProductAction(input: unknown) {
  const admin = await assertAdminAction();
  if ('error' in admin) return { error: admin.error };

  const parsed = bitpProductSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid product data' };
  }

  const data = { ...parsed.data };
  if (!data.slug.trim()) {
    data.slug = slugify(data.name);
  }

  const result = await upsertProductAdmin(data);
  if (result.error) return { error: result.error };

  revalidateCatalog();
  return { data: result.data };
}

export async function deleteBitpProductAction(id: string) {
  const admin = await assertAdminAction();
  if ('error' in admin) return { error: admin.error };

  const result = await deleteProductAdmin(id);
  if (result.error) return { error: result.error };

  revalidateCatalog();
  return { success: true };
}

export async function getBitpProductForEditAction(id: string) {
  const admin = await assertAdminAction();
  if ('error' in admin) return { error: admin.error };

  const product = await getProductByIdAdmin(id);
  if (!product) return { error: 'Product not found' };
  return { data: product };
}

export async function upsertBitpPackageAction(input: unknown) {
  const admin = await assertAdminAction();
  if ('error' in admin) return { error: admin.error };

  const parsed = bitpPackageSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid package data' };
  }

  const result = await upsertPackageAdmin(parsed.data);
  if (result.error) return { error: result.error };

  revalidateCatalog();
  return { data: result.data };
}

export async function deleteBitpPackageAction(id: string) {
  const admin = await assertAdminAction();
  if ('error' in admin) return { error: admin.error };

  const result = await deletePackageAdmin(id);
  if (result.error) return { error: result.error };

  revalidateCatalog();
  return { success: true };
}

export async function upsertBitpPackageFeatureAction(input: unknown) {
  const admin = await assertAdminAction();
  if ('error' in admin) return { error: admin.error };

  const parsed = bitpPackageFeatureSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid feature data' };
  }

  const result = await upsertPackageFeatureAdmin(parsed.data);
  if (result.error) return { error: result.error };

  revalidateCatalog();
  return { data: result.data };
}

export async function deleteBitpPackageFeatureAction(id: string) {
  const admin = await assertAdminAction();
  if ('error' in admin) return { error: admin.error };

  const result = await deletePackageFeatureAdmin(id);
  if (result.error) return { error: result.error };

  revalidateCatalog();
  return { success: true };
}

export async function uploadProductMediaAction(formData: FormData) {
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

  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Supabase not configured' };

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const path = `${productId}/${safeName}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage
    .from('product-media')
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (uploadError) return { error: uploadError.message };

  const { data: urlData } = supabase.storage.from('product-media').getPublicUrl(path);
  return { url: urlData.publicUrl };
}
