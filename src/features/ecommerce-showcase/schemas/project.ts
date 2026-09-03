import { z } from 'zod';
import { PAGE_TYPE_IDS } from '../config/page-types';
import { LEAD_STATUSES } from '../config/constants';

export const projectFormSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z
    .string()
    .min(2, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens'),
  short_description: z.string().min(8, 'Add a short description').max(220, 'Keep it under 220 characters'),
  full_description: z.string().min(20, 'Add a fuller description'),
  category_id: z.string().uuid('Select a category'),
  technology_stack: z.array(z.string()).min(1, 'Select at least one technology'),
  website_type: z.string().min(1, 'Select a website type'),
  industry: z.string().min(1, 'Select an industry'),
  starting_price: z.coerce.number().min(0),
  currency: z.string().default('BDT'),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  seo_title: z.string().max(70, 'SEO title should be 70 characters or fewer').optional().or(z.literal('')),
  seo_description: z
    .string()
    .max(160, 'Meta description should be 160 characters or fewer')
    .optional()
    .or(z.literal('')),
  seo_keywords: z.array(z.string()).default([]),
  sort_order: z.coerce.number().int().min(0).default(0),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

export const packageFormSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Package name is required'),
  price: z.coerce.number().min(0),
  currency: z.string().default('BDT'),
  short_description: z.string().optional().or(z.literal('')),
  features: z.array(z.string().min(1)).min(1, 'Add at least one feature'),
  is_popular: z.boolean().default(false),
  sort_order: z.coerce.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

export type PackageFormValues = z.infer<typeof packageFormSchema>;

export const pageFormSchema = z.object({
  page_type: z.enum(PAGE_TYPE_IDS as unknown as [string, ...string[]]),
  page_name: z.string().min(1, 'Page name is required'),
  slug: z.string().min(1),
  published: z.boolean().default(true),
  is_featured: z.boolean().default(false),
});

export const leadFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z
    .string()
    .min(8, 'Phone is required')
    .regex(/^[0-9+\-\s]{8,20}$/, 'Enter a valid phone number'),
  business_name: z.string().optional().or(z.literal('')),
  package_id: z.union([z.literal(''), z.string().uuid()]).optional(),
  message: z.string().max(800).optional().or(z.literal('')),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;

export const leadStatusSchema = z.enum(LEAD_STATUSES);

export function slugifyTitle(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
