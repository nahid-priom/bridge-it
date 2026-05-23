'use client';

import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Subscribe to new rows for authenticated dashboard features.
 * Not used on public catalog pages.
 */
export function subscribeToTableInserts(
  table: 'messages' | 'notifications' | 'orders',
  filter: string,
  onInsert: (payload: unknown) => void
): RealtimeChannel | null {
  const supabase = createBrowserSupabaseClient();
  if (!supabase) return null;

  const channel = supabase
    .channel(`${table}:${filter}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table,
        filter,
      },
      (payload) => onInsert(payload.new)
    )
    .subscribe();

  return channel;
}

export function unsubscribeChannel(channel: RealtimeChannel | null) {
  if (!channel) return;
  const supabase = createBrowserSupabaseClient();
  void supabase?.removeChannel(channel);
}
