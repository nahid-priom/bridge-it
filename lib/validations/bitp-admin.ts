import { z } from 'zod';

export const bitpCategorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, 'Name is required'),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  sort_order: z.coerce.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

export const bitpProductSchema = z.object({
  id: z.string().uuid().optional(),
  category_id: z.string().uuid('Select a category'),
  name: z.string().min(2, 'Name is required'),
  slug: z.string().min(2, 'Slug is required'),
  short_description: z.string().optional().nullable(),
  full_description: z.string().optional().nullable(),
  thumbnail: z.string().optional().nullable(),
  cover_image: z.string().optional().nullable(),
  cover_image_path: z.string().optional().nullable(),
  cover_image_alt: z.string().optional().nullable(),
  cover_image_prompt: z.string().optional().nullable(),
  cover_image_updated_at: z.string().optional().nullable(),
  product_type: z.enum([
    'service',
    'software',
    'website',
    'marketing',
    'creative',
    'digital_product',
    'subscription',
  ]),
  pricing_type: z.enum(['fixed', 'starting_from', 'package', 'custom_quote', 'subscription']),
  starting_price: z.coerce.number().min(0),
  currency: z.string().default('BDT'),
  delivery_time: z.string().optional().nullable(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  featured: z.boolean().default(false),
  popular: z.boolean().default(false),
  sort_order: z.coerce.number().int().min(0).default(0),
  demo_url: z.string().optional().nullable(),
  preview_url: z.string().optional().nullable(),
  target_customer: z.string().optional().nullable(),
  internal_demo_slug: z.string().optional().nullable(),
  showroom_featured: z.boolean().default(false),
  promotional_price: z.coerce.number().min(0).optional().nullable(),
  seo_title: z.string().optional().nullable(),
  seo_description: z.string().optional().nullable(),
  keywords: z.array(z.string()).default([]),
});

export const bitpPackageSchema = z.object({
  id: z.string().uuid().optional(),
  product_id: z.string().uuid(),
  name: z.string().min(1, 'Package name is required'),
  subtitle: z.string().optional().nullable(),
  price: z.coerce.number().min(0),
  old_price: z.coerce.number().min(0).optional().nullable(),
  currency: z.string().default('BDT'),
  billing_type: z.string().default('one_time'),
  delivery_days: z.coerce.number().int().min(0).optional().nullable(),
  revision_count: z.coerce.number().int().min(0).optional().nullable(),
  highlighted: z.boolean().default(false),
  badge_text: z.string().optional().nullable(),
  sort_order: z.coerce.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

export const bitpPackageFeatureSchema = z.object({
  id: z.string().uuid().optional(),
  package_id: z.string().uuid(),
  feature_text: z.string().min(1, 'Feature text is required'),
  included: z.boolean().default(true),
  sort_order: z.coerce.number().int().min(0).default(0),
});

export type BitpCategoryInput = z.infer<typeof bitpCategorySchema>;
export type BitpProductInput = z.infer<typeof bitpProductSchema>;
export type BitpPackageInput = z.infer<typeof bitpPackageSchema>;
export type BitpPackageFeatureInput = z.infer<typeof bitpPackageFeatureSchema>;
