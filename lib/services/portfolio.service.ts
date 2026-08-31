import type { BitpPortfolioItem } from '@/types/bitp';
import { getServerClient } from '@/lib/services/client';

export async function getFeaturedPortfolio(limit = 6): Promise<BitpPortfolioItem[]> {
  const supabase = await getServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('portfolio_items')
    .select('*')
    .eq('status', 'published')
    .eq('featured', true)
    .order('sort_order', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('[portfolio.service]', error.message);
    return [];
  }
  return (data ?? []) as BitpPortfolioItem[];
}

export async function getPublishedPortfolio(limit = 24): Promise<BitpPortfolioItem[]> {
  const supabase = await getServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('portfolio_items')
    .select('*')
    .eq('status', 'published')
    .order('sort_order', { ascending: true })
    .limit(limit);

  if (error) return [];
  return (data ?? []) as BitpPortfolioItem[];
}

export async function getPortfolioBySlug(slug: string): Promise<BitpPortfolioItem | null> {
  const supabase = await getServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('portfolio_items')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) return null;
  return data as BitpPortfolioItem | null;
}

export async function getAllPortfolioAdmin(): Promise<BitpPortfolioItem[]> {
  const supabase = await getServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('portfolio_items')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) return [];
  return (data ?? []) as BitpPortfolioItem[];
}
