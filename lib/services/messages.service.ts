import type { BitpConversationThread, BitpMessage } from '@/types/bitp';
import { getServerClient, getAdminClient } from '@/lib/services/client';

export async function getClientThreads(clientId: string): Promise<BitpConversationThread[]> {
  const supabase = await getServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('conversation_threads')
    .select('*')
    .eq('client_id', clientId)
    .order('updated_at', { ascending: false });

  if (error) return [];
  return (data ?? []) as BitpConversationThread[];
}

export async function getThreadMessages(threadId: string): Promise<BitpMessage[]> {
  const supabase = await getServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true });

  if (error) return [];
  return (data ?? []) as BitpMessage[];
}

export async function sendMessage(input: {
  thread_id: string;
  sender_id: string;
  body: string;
}) {
  const supabase = await getServerClient();
  if (!supabase) return { message: null, error: 'Database not configured' };

  const { data, error } = await supabase
    .from('messages')
    .insert({
      thread_id: input.thread_id,
      sender_id: input.sender_id,
      body: input.body,
      is_read: false,
    })
    .select('*')
    .single();

  if (error) return { message: null, error: error.message };

  await supabase
    .from('conversation_threads')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', input.thread_id);

  return { message: data as BitpMessage, error: null };
}

export async function getOrCreateSupportThread(clientId: string, orderId?: string) {
  const supabase = await getServerClient();
  if (!supabase) return { thread: null, error: 'Database not configured' };

  let query = supabase
    .from('conversation_threads')
    .select('*')
    .eq('client_id', clientId);

  if (orderId) query = query.eq('order_id', orderId);
  else query = query.is('order_id', null);

  const { data: existing } = await query.maybeSingle();
  if (existing) return { thread: existing as BitpConversationThread, error: null };

  const { data, error } = await supabase
    .from('conversation_threads')
    .insert({
      client_id: clientId,
      order_id: orderId ?? null,
      subject: orderId ? 'Order Support' : 'General Support',
    })
    .select('*')
    .single();

  if (error) return { thread: null, error: error.message };
  return { thread: data as BitpConversationThread, error: null };
}

export async function getAllThreadsAdmin(): Promise<BitpConversationThread[]> {
  const admin = await getAdminClient();
  if (!admin) return [];

  const { data, error } = await admin
    .from('conversation_threads')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) return [];
  return (data ?? []) as BitpConversationThread[];
}

export async function createNotification(input: {
  user_id: string;
  title: string;
  message: string;
  type: string;
  reference_type?: string;
  reference_id?: string;
}) {
  const admin = await getAdminClient();
  if (!admin) return;

  await admin.from('notifications').insert({
    user_id: input.user_id,
    title: input.title,
    message: input.message,
    type: input.type,
    reference_type: input.reference_type ?? null,
    reference_id: input.reference_id ?? null,
    is_read: false,
  });
}

export async function getUserNotifications(userId: string) {
  const supabase = await getServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) return [];
  return data ?? [];
}
