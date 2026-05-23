/**
 * Unified marketplace operating system types.
 * Aligns public site, seller/client dashboards, and admin.
 */

export type MarketplaceOrderStatus =
  | 'pending'
  | 'paid'
  | 'in_progress'
  | 'delivered'
  | 'completed'
  | 'disputed'
  | 'refunded'
  | 'cancelled';

export type MarketplacePaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type MarketplaceMilestoneStatus =
  | 'pending'
  | 'in_review'
  | 'approved'
  | 'paid'
  | 'rejected';

export type MarketplaceSellerStatus = 'pending' | 'active' | 'suspended' | 'inactive';

export type MarketplaceWalletOwnerType = 'buyer' | 'seller' | 'platform';

export interface MarketplaceOrderRow {
  id: string;
  order_number: string;
  buyer_id: string;
  seller_id: string | null;
  status: MarketplaceOrderStatus;
  payment_status: MarketplacePaymentStatus;
  subtotal: number;
  platform_fee: number;
  total_amount: number;
  currency: string;
  delivery_date: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface MarketplaceOrderItemRow {
  id: string;
  order_id: string;
  item_type: 'product' | 'service';
  product_id: string | null;
  service_id: string | null;
  title: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface MarketplaceMilestoneRow {
  id: string;
  order_id: string;
  title: string;
  amount: number;
  currency: string;
  progress: number;
  status: MarketplaceMilestoneStatus;
  due_date: string | null;
  sort_order: number;
}

export interface MarketplaceWalletRow {
  id: string;
  owner_id: string;
  owner_type: MarketplaceWalletOwnerType;
  seller_id: string | null;
  balance: number;
  pending_balance: number;
  currency: string;
}

export interface MarketplaceTransactionRow {
  id: string;
  wallet_id: string;
  order_id: string | null;
  transaction_type: string;
  label: string;
  amount: number;
  currency: string;
  status: MarketplacePaymentStatus;
  created_at: string;
}

export interface MarketplaceNotificationRow {
  id: string;
  user_id: string;
  title: string;
  body: string | null;
  notification_type: string;
  read_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface MarketplaceConversationRow {
  id: string;
  buyer_id: string;
  seller_id: string;
  order_id: string | null;
  subject: string | null;
  last_message_at: string;
}

export interface MarketplaceMessageRow {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_role: 'buyer' | 'seller' | 'admin' | 'support';
  content: string;
  message_type: string;
  read_at: string | null;
  created_at: string;
}

export interface MarketplaceAnalyticsSnapshot {
  gmv: number;
  orderCount: number;
  activeSellers: number;
  activeBuyers: number;
  revenue: number;
  topCategories: { slug: string; name: string; count: number }[];
}

export interface MarketplaceSellerAccount {
  id: string;
  userId: string | null;
  slug: string;
  fullName: string;
  title: string;
  avatarUrl: string | null;
  status: MarketplaceSellerStatus;
  rating: number;
  totalOrders: number;
  isVerified: boolean;
  isFeatured: boolean;
}
