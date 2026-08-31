import type { BitpQuotation } from '@/types/bitp';
import { getServerClient, getAdminClient } from '@/lib/services/client';

const QUOTATION_SELECT = `
  *,
  items:quotation_items(*)
`;

export async function getClientQuotations(clientId: string): Promise<BitpQuotation[]> {
  const supabase = await getServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('quotations')
    .select(QUOTATION_SELECT)
    .eq('client_id', clientId)
    .in('status', ['sent', 'accepted', 'rejected', 'expired'])
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data ?? []) as BitpQuotation[];
}

export async function getQuotationById(
  id: string,
  clientId?: string
): Promise<BitpQuotation | null> {
  const supabase = await getServerClient();
  if (!supabase) return null;

  let query = supabase.from('quotations').select(QUOTATION_SELECT).eq('id', id);
  if (clientId) query = query.eq('client_id', clientId);

  const { data, error } = await query.maybeSingle();
  if (error || !data) return null;
  return data as BitpQuotation;
}

export async function acceptQuotation(clientId: string, quotationId: string) {
  const supabase = await getServerClient();
  if (!supabase) return { error: 'Database not configured' };

  const { data: quote, error: fetchError } = await supabase
    .from('quotations')
    .select('*')
    .eq('id', quotationId)
    .eq('client_id', clientId)
    .eq('status', 'sent')
    .maybeSingle();

  if (fetchError || !quote) return { error: 'Quotation not found or not available' };

  const { error } = await supabase
    .from('quotations')
    .update({ status: 'accepted' })
    .eq('id', quotationId);

  if (error) return { error: error.message };

  if (quote.product_id) {
    const { createOrder } = await import('@/lib/services/orders.service');
    return createOrder(clientId, {
      product_id: quote.product_id,
      requirements: [],
      notes: `Created from quotation ${quote.quotation_number}`,
    });
  }

  return { error: null };
}

export async function getAllQuotationsAdmin(): Promise<BitpQuotation[]> {
  const admin = await getAdminClient();
  if (!admin) return [];

  const { data, error } = await admin
    .from('quotations')
    .select(QUOTATION_SELECT)
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data ?? []) as BitpQuotation[];
}

export async function createQuotationAdmin(input: {
  client_id: string;
  product_id?: string;
  title: string;
  description?: string;
  items: { description: string; quantity: number; unit_price: number }[];
  discount?: number;
  valid_until?: string;
  notes?: string;
}) {
  const admin = await getAdminClient();
  if (!admin) return { quotation: null, error: 'Admin client not configured' };

  const subtotal = input.items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);
  const discount = input.discount ?? 0;
  const total = subtotal - discount;

  const { data: quotation, error } = await admin
    .from('quotations')
    .insert({
      client_id: input.client_id,
      product_id: input.product_id ?? null,
      title: input.title,
      description: input.description ?? null,
      subtotal,
      discount,
      total,
      status: 'sent',
      valid_until: input.valid_until ?? null,
      notes: input.notes ?? null,
    })
    .select('*')
    .single();

  if (error || !quotation) return { quotation: null, error: error?.message };

  await admin.from('quotation_items').insert(
    input.items.map((item) => ({
      quotation_id: quotation.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total: item.quantity * item.unit_price,
    }))
  );

  return { quotation: quotation as BitpQuotation, error: null };
}
