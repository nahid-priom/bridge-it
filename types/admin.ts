import type { LucideIcon } from 'lucide-react';

export type AdminSection =
  | 'overview'
  | 'bitp-products'
  | 'bitp-categories'
  | 'bitp-orders'
  | 'bitp-projects'
  | 'bitp-quotations'
  | 'bitp-clients'
  | 'bitp-payments'
  | 'bitp-consultations'
  | 'bitp-portfolio'
  | 'bitp-reviews'
  | 'bitp-messages'
  | 'bitp-content'
  | 'bitp-software'
  | 'seller-applications'
  | 'seller-verification'
  | 'sellers'
  | 'customers'
  | 'orders'
  | 'disputes'
  | 'categories'
  | 'featured'
  | 'reports'
  | 'settings';

export type AdminStatus =
  | 'active'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'suspended'
  | 'in-review'
  | 'completed'
  | 'cancelled'
  | 'released'
  | 'held'
  | 'refunded'
  | 'open'
  | 'resolved'
  | 'low'
  | 'medium'
  | 'high';

export interface AdminNavItem {
  id: AdminSection;
  label: string;
  icon: LucideIcon;
}

export interface AdminStats {
  totalSellers: number;
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingVerification: number;
  pendingSellerApplications: number;
  activeDisputes: number;
  platformCommission: number;
  escrowBalance: number;
}

export interface AdminActivity {
  id: string;
  type: 'verification' | 'order' | 'dispute' | 'seller' | 'payment';
  title: string;
  description: string;
  time: string;
}

export interface AdminPendingAction {
  id: string;
  label: string;
  count: number;
  section: AdminSection;
  priority: 'high' | 'medium' | 'low';
}

export interface TopCategoryStat {
  id: string;
  name: string;
  nameBn: string;
  orders: number;
  revenue: number;
  growth: string;
}

export interface TopSellerStat {
  id: string;
  name: string;
  company: string;
  revenue: number;
  orders: number;
  rating: number;
}

export interface VerificationRequest {
  id: string;
  sellerName: string;
  company: string;
  category: string;
  documentsStatus: 'complete' | 'partial' | 'missing';
  profileCompletion: number;
  riskLevel: 'low' | 'medium' | 'high';
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface AdminSeller {
  id: string;
  name: string;
  company: string;
  category: string;
  status: AdminStatus;
  totalOrders: number;
  revenue: number;
  rating: number;
  featured: boolean;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpending: number;
  status: AdminStatus;
  joinDate: string;
}

export interface AdminOrder {
  id: string;
  customer: string;
  seller: string;
  service: string;
  amount: number;
  paymentStatus: AdminStatus;
  escrowStatus: AdminStatus;
  deliveryStatus: AdminStatus;
  disputeStatus: AdminStatus;
}

export interface AdminDispute {
  id: string;
  orderId: string;
  customer: string;
  seller: string;
  service: string;
  amount: number;
  customerComplaint: string;
  sellerResponse: string;
  status: 'open' | 'in-review' | 'resolved';
  openedDate: string;
}

export interface AdminCategory {
  id: string;
  icon: string;
  nameEn: string;
  nameBn: string;
  serviceCount: number;
  sellerCount: number;
  featured: boolean;
}

export interface FeaturedItem {
  id: string;
  type: 'seller' | 'service';
  name: string;
  subtitle: string;
  placement: 'homepage' | 'category' | 'both';
  promotionStatus: 'active' | 'scheduled' | 'expired';
  startDate: string;
  endDate: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success';
}

export interface SearchResultGroup {
  type: 'sellers' | 'customers' | 'orders' | 'categories';
  label: string;
  items: { id: string; title: string; subtitle: string }[];
}

export interface AdminDashboardData {
  stats: AdminStats;
  activities: AdminActivity[];
  pendingActions: AdminPendingAction[];
  sellers: AdminSeller[];
  customers: AdminCustomer[];
  orders: AdminOrder[];
  disputes: AdminDispute[];
  categories: AdminCategory[];
  featured: FeaturedItem[];
  verificationQueue: VerificationRequest[];
  notifications: AdminNotification[];
  topCategories: TopCategoryStat[];
  topSellers: TopSellerStat[];
  monthlyRevenueData: number[];
  orderGrowthData: number[];
}

export function formatCurrency(amount: number): string {
  if (amount >= 100000) return `৳${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `৳${(amount / 1000).toFixed(0)}K`;
  return `৳${amount.toLocaleString('en-BD')}`;
}
