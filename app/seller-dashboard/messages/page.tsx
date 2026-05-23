import { buildPageMetadata } from '@/lib/metadata';
import {
  getSellerDashboardConversations,
  getSellerDashboardNotifications,
} from '@/lib/db/seller-dashboard';

export const metadata = buildPageMetadata({
  title: 'Seller Messages',
  path: '/seller-dashboard/messages',
  noIndex: true,
});

export default async function SellerMessagesPage() {
  const [convosRes, notifications] = await Promise.all([
    getSellerDashboardConversations(),
    getSellerDashboardNotifications(),
  ]);
  const conversations = convosRes.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black font-display text-text-primary">Messages</h1>
        <p className="text-sm text-text-secondary mt-1">Buyer conversations and order-linked chat.</p>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-surface/80 overflow-hidden">
        <div className="px-5 py-4 border-b border-border-subtle">
          <h2 className="font-bold text-text-primary">Conversations</h2>
        </div>
        {conversations.length === 0 ? (
          <p className="p-6 text-sm text-text-secondary">
            No conversations yet. Threads from marketplace_conversations appear here when buyers message you.
          </p>
        ) : (
          <ul className="divide-y divide-border-subtle">
            {conversations.map((c) => (
              <li key={c.id} className="px-5 py-4 flex justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                <div>
                  <p className="font-semibold text-text-primary">{c.subject ?? 'Order conversation'}</p>
                  <p className="text-xs text-text-secondary">{c.buyerLabel}</p>
                  {c.orderId && (
                    <p className="text-xs text-violet-600 mt-1">Linked to order</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  {c.unreadCount > 0 && (
                    <span className="inline-block text-xs font-bold bg-deshi-green text-white px-2 py-0.5 rounded-full mb-1">
                      {c.unreadCount} new
                    </span>
                  )}
                  <p className="text-xs text-text-muted">
                    {new Date(c.lastMessageAt).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="rounded-2xl border border-border-subtle bg-surface/80 divide-y divide-border-subtle">
          <div className="px-5 py-4 border-b border-border-subtle">
            <h2 className="font-bold text-text-primary">Notifications</h2>
          </div>
          {notifications.map((n) => (
            <div key={n.id} className="px-5 py-4">
              <p className="font-semibold text-text-primary">{n.title}</p>
              {n.body && <p className="text-sm text-text-secondary mt-1">{n.body}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
