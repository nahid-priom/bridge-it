'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentProfile } from '@/lib/auth/get-current-user';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ROUTES } from '@/lib/routes';

export async function createSupportTicketAction(input: {
  subject: string;
  priority?: 'low' | 'medium' | 'high';
}) {
  const profile = await getCurrentProfile();
  if (!profile) return { error: 'Sign in to open a support ticket.' };

  const subject = input.subject?.trim();
  if (!subject || subject.length < 5) {
    return { error: 'Subject must be at least 5 characters.' };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { error: 'Database unavailable.' };

  const { error } = await supabase.from('client_support_tickets').insert({
    client_id: profile.id,
    subject,
    priority: input.priority ?? 'medium',
    status: 'open',
  } as never);

  if (error) return { error: error.message };

  revalidatePath(ROUTES.clientSupport);
  return { success: true as const };
}

export async function sendMarketplaceMessageAction(input: {
  conversationId: string;
  content: string;
}) {
  const profile = await getCurrentProfile();
  if (!profile) return { error: 'Sign in to send messages.' };

  const content = input.content?.trim();
  if (!content) return { error: 'Message cannot be empty.' };

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { error: 'Database unavailable.' };

  const { error } = await supabase.from('marketplace_messages').insert({
    conversation_id: input.conversationId,
    sender_id: profile.id,
    sender_role: 'buyer',
    content,
    message_type: 'text',
  } as never);

  if (error) return { error: error.message };

  await supabase
    .from('marketplace_conversations')
    .update({ last_message_at: new Date().toISOString() } as never)
    .eq('id', input.conversationId);

  revalidatePath(ROUTES.clientMessages);
  return { success: true as const };
}

export async function updateClientProfileAction(input: {
  fullName: string;
}) {
  const profile = await getCurrentProfile();
  if (!profile) return { error: 'Sign in to update settings.' };

  const fullName = input.fullName?.trim();
  if (!fullName) return { error: 'Name is required.' };

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { error: 'Database unavailable.' };

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: fullName } as never)
    .eq('id', profile.id);

  if (error) return { error: error.message };

  revalidatePath(ROUTES.clientSettings);
  revalidatePath(ROUTES.dashboard);
  return { success: true as const };
}
