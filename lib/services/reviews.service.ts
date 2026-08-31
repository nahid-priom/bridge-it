import type { BitpReview } from '@/types/bitp';
import type { PlatformTestimonial } from '@/types';
import { getServerClient } from '@/lib/services/client';

export async function getApprovedReviews(limit = 6): Promise<BitpReview[]> {
  const supabase = await getServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('approved', true)
    .order('sort_order', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('[reviews.service]', error.message);
    return [];
  }
  return (data ?? []) as BitpReview[];
}

export function reviewsToTestimonials(reviews: BitpReview[]): PlatformTestimonial[] {
  return reviews.map((r) => ({
    id: r.id,
    name: r.client_name,
    role: [r.designation, r.company_name].filter(Boolean).join(', ') || 'Client',
    comment: r.review,
    rating: r.rating,
    accentColor: '#10B981',
    avatar: r.avatar_url ?? undefined,
  }));
}

export async function getAllReviewsAdmin(): Promise<BitpReview[]> {
  const supabase = await getServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data ?? []) as BitpReview[];
}
