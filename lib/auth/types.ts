import type { UserRole } from '@/types/database.types';

export type AuthProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  seller_id: string | null;
};

export type SellerApplicationStatus = 'pending' | 'approved' | 'rejected' | 'needs_review';
