import 'server-only';

import { getCurrentProfile } from '@/lib/auth/get-current-user';
import {
  getMarketplaceSellerByLegacyOrUser,
  getOrCreateBuyerWallet,
  listBuyerOrders,
  listOrderMilestones,
  listUserNotifications,
  listWalletTransactions,
} from '@/lib/db/marketplace-unified';
import { getDbClient } from '@/lib/db/server';
import { dbSuccess, type DbResult } from '@/lib/db/result';
import {
  getClientDashboardOverview as getDemoOverview,
  demoOrders,
  demoProjects,
  demoStats,
  demoTransactions,
  demoInvoices,
  demoMessages,
  demoSellers,
  demoActivities,
  demoNotifications,
  demoSpendingByMonth,
  demoProjectCompletion,
  demoMilestones,
} from '@/lib/client-dashboard/demo-data';
import type {
  ClientChatMessage,
  ClientDashboardOverview,
  ClientInvoice,
  ClientMessage,
  ClientOrder,
  ClientProject,
  ClientProjectDetail,
  ClientPurchasedProduct,
  ClientPurchasedService,
  ClientSeller,
  ClientTransaction,
  SupportTicket,
} from '@/types/client-dashboard';
import type { MarketplaceOrderRow } from '@/types/marketplace-unified';

function mapOrderStatus(
  status: string
): ClientOrder['status'] {
  const map: Record<string, ClientOrder['status']> = {
    pending: 'pending',
    paid: 'active',
    in_progress: 'active',
    delivered: 'delivered',
    completed: 'delivered',
    disputed: 'active',
    refunded: 'refunded',
    cancelled: 'cancelled',
  };
  return map[status] ?? 'pending';
}

function mapPaymentStatus(status: string): ClientOrder['paymentStatus'] {
  if (status === 'paid') return 'paid';
  if (status === 'failed') return 'failed';
  if (status === 'refunded') return 'refunded';
  return 'pending';
}

async function enrichOrders(rows: MarketplaceOrderRow[]): Promise<ClientOrder[]> {
  const supabase = await getDbClient();
  const sellerIds = [...new Set(rows.map((r) => r.seller_id).filter(Boolean))] as string[];

  const sellerMap = new Map<string, { name: string; avatar?: string }>();
  if (supabase && sellerIds.length) {
    const { data } = await supabase
      .from('marketplace_sellers')
      .select('id, full_name, avatar_url')
      .in('id', sellerIds);
    for (const s of data ?? []) {
      sellerMap.set(s.id, { name: s.full_name, avatar: s.avatar_url ?? undefined });
    }
  }

  return rows.map((o) => {
    const seller = o.seller_id ? sellerMap.get(o.seller_id) : undefined;
    const meta = o.metadata as { title?: string; order_type?: string };
    return {
      id: o.id,
      orderNumber: o.order_number,
      type: (meta.order_type === 'product' ? 'product' : 'service') as ClientOrder['type'],
      title: meta.title ?? `Order ${o.order_number}`,
      sellerName: seller?.name ?? 'Seller',
      sellerAvatar: seller?.avatar,
      amount: Number(o.total_amount),
      currency: o.currency,
      deliveryDate: o.delivery_date ?? o.created_at.slice(0, 10),
      paymentStatus: mapPaymentStatus(o.payment_status),
      status: mapOrderStatus(o.status),
      createdAt: o.created_at,
    };
  });
}

export async function getClientDashboardOverviewData(): Promise<ClientDashboardOverview> {
  const profile = await getCurrentProfile();
  if (!profile) return getDemoOverview();

  const [ordersRes, walletRes, notificationsRes] = await Promise.all([
    listBuyerOrders(profile.id),
    getOrCreateBuyerWallet(profile.id),
    listUserNotifications(profile.id, 10),
  ]);

  const hasDbOrders = ordersRes.configured && !ordersRes.error && ordersRes.data.length > 0;
  const hasWallet = walletRes.configured && !walletRes.error && walletRes.data?.id;

  if (!hasDbOrders && !hasWallet) {
    return getDemoOverview();
  }

  const orders = hasDbOrders ? await enrichOrders(ordersRes.data) : demoOrders;
  const wallet = walletRes.configured && !walletRes.error ? walletRes.data : null;

  let transactions: ClientTransaction[] = demoTransactions;
  if (wallet?.id) {
    const txRes = await listWalletTransactions(wallet.id);
    if (txRes.configured && !txRes.error && txRes.data.length) {
      transactions = txRes.data.map((t) => ({
        id: t.id,
        type: t.transaction_type as ClientTransaction['type'],
        label: t.label,
        amount: Number(t.amount),
        currency: t.currency,
        date: t.created_at.slice(0, 10),
        status: t.status === 'paid' ? 'paid' : t.status === 'failed' ? 'failed' : 'pending',
      }));
    }
  }

  const activeProjects = orders.filter((o) => o.type === 'service' && o.status === 'active').length;

  const serviceOrders = orders.filter((o) => o.type === 'service');
  const projects: ClientProject[] =
    serviceOrders.length > 0
      ? serviceOrders.slice(0, 6).map((o) => ({
          id: o.id,
          title: o.title,
          sellerId: o.sellerName,
          sellerName: o.sellerName,
          sellerAvatar: o.sellerAvatar,
          progress: o.status === 'delivered' ? 100 : 50,
          milestoneStatus: o.status,
          dueDate: o.deliveryDate,
          budget: o.amount,
          currency: o.currency,
          status: o.status === 'active' ? 'in_progress' : o.status === 'delivered' ? 'completed' : 'pending_review',
          category: o.type === 'service' ? 'Service' : 'Product',
        }))
      : demoProjects;

  return {
    stats: {
      activeProjects: activeProjects || demoStats.activeProjects,
      totalOrders: orders.length,
      pendingPayments: orders.filter((o) => o.paymentStatus === 'pending').length,
      walletBalance: wallet ? Number(wallet.balance) : demoStats.walletBalance,
      completedProjects: orders.filter((o) => o.status === 'delivered').length,
      activeSellers: new Set(orders.map((o) => o.sellerName)).size,
      currency: wallet?.currency ?? 'BDT',
    },
    projects,
    orders: orders.slice(0, 5),
    activities: demoActivities,
    notifications:
      notificationsRes.configured && !notificationsRes.error && notificationsRes.data.length
        ? notificationsRes.data.map((n) => ({
            id: n.id,
            title: n.title,
            body: n.body ?? '',
            type: 'order' as const,
            read: Boolean(n.read_at),
            createdAt: n.created_at,
          }))
        : demoNotifications,
    spendingByMonth: demoSpendingByMonth,
    projectCompletion: demoProjectCompletion,
  };
}

export async function getClientOrdersData(): Promise<ClientOrder[]> {
  const profile = await getCurrentProfile();
  if (!profile) return demoOrders;

  const res = await listBuyerOrders(profile.id);
  if (!res.configured || res.error || !res.data.length) return demoOrders;
  return enrichOrders(res.data);
}

export async function getClientProjectDetailData(
  projectId: string
): Promise<ClientProjectDetail | null> {
  const demoProject = demoProjects.find((p) => p.id === projectId);
  const profile = await getCurrentProfile();

  if (!profile) {
    if (!demoProject) return null;
    return {
      ...demoProject,
      description: 'Project synced from marketplace when signed in.',
      milestones: demoMilestones.filter((m) => m.projectId === projectId),
      activities: demoActivities,
      invoices: demoInvoices.slice(0, 2),
      transactions: demoTransactions.slice(0, 4),
    };
  }

  const ordersRes = await listBuyerOrders(profile.id);
  const order = ordersRes.data?.find((o) => o.id === projectId);
  if (!order) {
    if (!demoProject) return null;
    return {
      ...demoProject,
      description: 'Project synced from marketplace when signed in.',
      milestones: demoMilestones.filter((m) => m.projectId === projectId),
      activities: demoActivities,
      invoices: demoInvoices.slice(0, 2),
      transactions: demoTransactions.slice(0, 4),
    };
  }

  const milestonesRes = await listOrderMilestones(order.id);
  const sellerRes = order.seller_id
    ? await getMarketplaceSellerByLegacyOrUser({ sellerId: order.seller_id })
    : dbSuccess(null);

  const base: ClientProject = {
    id: order.id,
    title: (order.metadata as { title?: string })?.title ?? `Project ${order.order_number}`,
    sellerId: order.seller_id ?? '',
    sellerName: sellerRes.data?.fullName ?? 'Seller',
    sellerAvatar: sellerRes.data?.avatarUrl ?? undefined,
    progress: milestonesRes.data?.[0]?.progress ?? 0,
    milestoneStatus: milestonesRes.data?.[0]?.status ?? 'pending',
    dueDate: order.delivery_date ?? order.created_at.slice(0, 10),
    budget: Number(order.total_amount),
    currency: order.currency,
    status: 'in_progress',
    category: 'Service',
  };

  return {
    ...base,
    description: (order.metadata as { description?: string })?.description ?? base.title,
    milestones: (milestonesRes.data ?? []).map((m) => ({
      id: m.id,
      projectId: order.id,
      title: m.title,
      progress: m.progress,
      dueDate: m.due_date ?? '',
      amount: Number(m.amount),
      currency: m.currency,
      status:
        m.status === 'in_review'
          ? 'in_review'
          : m.status === 'approved'
            ? 'approved'
            : m.status === 'paid'
              ? 'paid'
              : 'pending',
    })),
    activities: demoActivities,
    invoices: demoInvoices.slice(0, 2),
    transactions: demoTransactions.slice(0, 4),
  };
}

export async function getClientInvoicesData(): Promise<ClientInvoice[]> {
  const profile = await getCurrentProfile();
  if (!profile) return demoInvoices;

  const supabase = await getDbClient();
  if (!supabase) return demoInvoices;

  const { data: invoices } = await supabase
    .from('marketplace_invoices')
    .select('*')
    .eq('buyer_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (!invoices?.length) return demoInvoices;

  const sellerIds = [...new Set(invoices.map((i) => i.seller_id).filter(Boolean))] as string[];
  const { data: sellers } =
    sellerIds.length > 0
      ? await supabase.from('marketplace_sellers').select('id, full_name').in('id', sellerIds)
      : { data: [] };
  const sellerMap = new Map((sellers ?? []).map((s) => [s.id, s.full_name]));

  return invoices.map((inv) => {
    return {
      id: inv.id,
      invoiceNumber: inv.invoice_number,
      sellerName: (inv.seller_id && sellerMap.get(inv.seller_id)) ?? 'Seller',
      amount: Number(inv.amount),
      currency: inv.currency,
      status: inv.status as ClientInvoice['status'],
      issuedAt: inv.issued_at,
      dueAt: inv.due_at ?? inv.issued_at,
    };
  });
}

export async function getClientMessagesData(): Promise<ClientMessage[]> {
  const profile = await getCurrentProfile();
  if (!profile) return demoMessages;

  const supabase = await getDbClient();
  if (!supabase) return demoMessages;

  const { data: conversations } = await supabase
    .from('marketplace_conversations')
    .select('*')
    .eq('buyer_id', profile.id)
    .order('last_message_at', { ascending: false })
    .limit(20);

  if (!conversations?.length) return demoMessages;

  const sellerIds = [...new Set(conversations.map((c) => c.seller_id))];
  const { data: sellers } = await supabase
    .from('marketplace_sellers')
    .select('id, full_name, avatar_url')
    .in('id', sellerIds);

  const sellerMap = new Map((sellers ?? []).map((s) => [s.id, s]));

  return conversations.map((c) => {
    const seller = sellerMap.get(c.seller_id);
    return {
      id: c.id,
      sellerId: seller?.id ?? c.seller_id,
      sellerName: seller?.full_name ?? 'Seller',
      sellerAvatar: seller?.avatar_url ?? undefined,
      lastMessage: c.subject ?? 'Conversation',
      lastAt: c.last_message_at,
      unread: 0,
      isOnline: false,
    };
  });
}

export async function getClientSellersData(): Promise<ClientSeller[]> {
  const profile = await getCurrentProfile();
  if (!profile) return demoSellers;

  const ordersRes = await listBuyerOrders(profile.id, 100);
  if (!ordersRes.configured || ordersRes.error || !ordersRes.data.length) return demoSellers;

  const supabase = await getDbClient();
  if (!supabase) return demoSellers;

  const sellerIds = [...new Set(ordersRes.data.map((o) => o.seller_id).filter(Boolean))] as string[];
  const { data } = await supabase
    .from('marketplace_sellers')
    .select('id, full_name, avatar_url, rating, response_time')
    .in('id', sellerIds);

  if (!data?.length) return demoSellers;

  return data.map((s) => ({
    id: s.id,
    name: s.full_name,
    avatar: s.avatar_url ?? undefined,
    rating: Number(s.rating ?? 4.5),
    activeProjects: ordersRes.data!.filter((o) => o.seller_id === s.id && o.status === 'in_progress').length,
    responseTime: s.response_time ?? '1 hour',
    isOnline: false,
  }));
}

function mapDbTransaction(t: {
  id: string;
  transaction_type: string;
  label: string;
  amount: number | string;
  currency: string;
  created_at: string;
  status: string;
}): ClientTransaction {
  return {
    id: t.id,
    type: t.transaction_type as ClientTransaction['type'],
    label: t.label,
    amount: Number(t.amount),
    currency: t.currency,
    date: t.created_at.slice(0, 10),
    status: t.status === 'paid' ? 'paid' : t.status === 'failed' ? 'failed' : 'pending',
  };
}

export async function getClientTransactionsData(): Promise<ClientTransaction[]> {
  const profile = await getCurrentProfile();
  if (!profile) return [];

  const walletRes = await getOrCreateBuyerWallet(profile.id);
  if (!walletRes.data?.id) return [];

  const txRes = await listWalletTransactions(walletRes.data.id, 50);
  if (!txRes.configured || txRes.error) return [];
  return txRes.data.map(mapDbTransaction);
}

export async function getClientPurchasedProductsData(): Promise<ClientPurchasedProduct[]> {
  const orders = await getClientOrdersData();
  return orders
    .filter((o) => o.type === 'product')
    .map((o) => ({
      id: o.id,
      name: o.title,
      vendor: o.sellerName,
      orderStatus: o.status,
      trackingId: o.orderNumber,
    }));
}

export async function getClientPurchasedServicesData(): Promise<ClientPurchasedService[]> {
  const orders = await getClientOrdersData();
  return orders
    .filter((o) => o.type === 'service')
    .map((o) => ({
      id: o.id,
      title: o.title,
      sellerName: o.sellerName,
      revisionsLeft: 2,
      status: o.status,
      deliveryFiles: 0,
      dueDate: o.deliveryDate,
    }));
}

export async function getClientSupportTicketsData(): Promise<SupportTicket[]> {
  const profile = await getCurrentProfile();
  if (!profile) return [];

  const supabase = await getDbClient();
  if (!supabase) return [];

  type TicketRow = {
    id: string;
    subject: string;
    priority: string;
    status: string;
    updated_at: string;
  };

  const { data: tickets } = (await (
    supabase as unknown as {
      from: (table: string) => {
        select: (cols: string) => {
          eq: (col: string, val: string) => {
            order: (col: string, opts: { ascending: boolean }) => {
              limit: (n: number) => Promise<{ data: TicketRow[] | null }>;
            };
          };
        };
      };
    }
  )
    .from('client_support_tickets')
    .select('id, subject, priority, status, updated_at')
    .eq('client_id', profile.id)
    .order('updated_at', { ascending: false })
    .limit(50)) as { data: TicketRow[] | null };

  if (!tickets?.length) return [];

  return tickets.map((t) => ({
    id: t.id.slice(0, 8).toUpperCase(),
    subject: t.subject,
    priority: (t.priority ?? 'medium') as SupportTicket['priority'],
    status: (t.status ?? 'open') as SupportTicket['status'],
    updatedAt: t.updated_at.slice(0, 10),
    messages: 0,
  }));
}

export async function getConversationMessagesData(
  conversationId: string
): Promise<ClientChatMessage[]> {
  const profile = await getCurrentProfile();
  if (!profile) return [];

  const supabase = await getDbClient();
  if (!supabase) return [];

  type MessageRow = {
    id: string;
    sender_id: string;
    sender_role: string;
    content: string;
    created_at: string;
  };

  const { data: messages } = (await (
    supabase as unknown as {
      from: (table: string) => {
        select: (cols: string) => {
          eq: (col: string, val: string) => {
            order: (col: string, opts: { ascending: boolean }) => {
              limit: (n: number) => Promise<{ data: MessageRow[] | null }>;
            };
          };
        };
      };
    }
  )
    .from('marketplace_messages')
    .select('id, sender_id, sender_role, content, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(100)) as { data: MessageRow[] | null };

  if (!messages?.length) return [];

  return messages.map((m) => ({
    id: m.id,
    from: m.sender_id === profile.id ? 'client' : 'seller',
    text: m.content,
    time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }));
}
