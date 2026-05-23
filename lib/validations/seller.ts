import { z } from 'zod';

export const sellerApplicationSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  businessName: z.string().min(2, 'Business name is required'),
  displayName: z.string().min(2, 'Display name is required'),
  categoryFocus: z.string().min(2, 'Category focus is required'),
  servicesOffered: z.string().min(3, 'List at least one service'),
  portfolioUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  linkedin: z.string().optional(),
  facebook: z.string().optional(),
  website: z.string().optional(),
  phone: z.string().min(6, 'Phone is required'),
  location: z.string().min(2, 'Location is required'),
  bio: z.string().min(40, 'Bio must be at least 40 characters'),
  experienceLevel: z.enum(['beginner', 'intermediate', 'expert', 'agency']),
  adInterest: z.boolean(),
  adBudgetRange: z.string().optional(),
  promotionCategory: z.string().optional(),
  promotionNote: z.string().optional(),
  principlesAccepted: z
    .boolean()
    .refine((v) => v === true, { message: 'You must accept the seller principles' }),
});

export type SellerApplicationInput = z.infer<typeof sellerApplicationSchema>;
