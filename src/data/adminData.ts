import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  ShieldCheck,
  Store,
  Users,
  ShoppingBag,
  Scale,
  FolderTree,
  Sparkles,
  BarChart3,
  Settings,
} from 'lucide-react';

export type AdminSection =
  | 'overview'
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

export const adminNavItems: AdminNavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'seller-verification', label: 'Seller Verification', icon: ShieldCheck },
  { id: 'sellers', label: 'Sellers', icon: Store },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'orders', label: 'Orders & Escrow', icon: ShoppingBag },
  { id: 'disputes', label: 'Disputes', icon: Scale },
  { id: 'categories', label: 'Categories', icon: FolderTree },
  { id: 'featured', label: 'Featured Services', icon: Sparkles },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Platform Settings', icon: Settings },
];

export interface AdminStats {
  totalSellers: number;
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingVerification: number;
  activeDisputes: number;
  platformCommission: number;
  escrowBalance: number;
}

export const initialAdminStats: AdminStats = {
  totalSellers: 248,
  totalCustomers: 1842,
  totalOrders: 5621,
  totalRevenue: 4250000,
  pendingVerification: 14,
  activeDisputes: 7,
  platformCommission: 637500,
  escrowBalance: 890000,
};

export interface AdminActivity {
  id: string;
  type: 'verification' | 'order' | 'dispute' | 'seller' | 'payment';
  title: string;
  description: string;
  time: string;
}

export const adminActivities: AdminActivity[] = [
  { id: 'a1', type: 'verification', title: 'New seller application', description: 'PixelCraft Studio submitted verification documents', time: '5 min ago' },
  { id: 'a2', type: 'dispute', title: 'Dispute opened', description: 'Order #BR-4521 — delivery quality mismatch', time: '18 min ago' },
  { id: 'a3', type: 'order', title: 'High-value order', description: '৳85,000 escrow order placed for 3D animation package', time: '42 min ago' },
  { id: 'a4', type: 'payment', title: 'Escrow released', description: '৳12,500 released to MotionHive BD', time: '1 hr ago' },
  { id: 'a5', type: 'seller', title: 'Seller featured', description: 'CodeBridge Labs promoted to homepage spotlight', time: '2 hrs ago' },
];

export interface AdminPendingAction {
  id: string;
  label: string;
  count: number;
  section: AdminSection;
  priority: 'high' | 'medium' | 'low';
}

export const adminPendingActions: AdminPendingAction[] = [
  { id: 'pa1', label: 'Seller verifications pending', count: 14, section: 'seller-verification', priority: 'high' },
  { id: 'pa2', label: 'Open disputes', count: 7, section: 'disputes', priority: 'high' },
  { id: 'pa3', label: 'Escrow releases awaiting review', count: 23, section: 'orders', priority: 'medium' },
  { id: 'pa4', label: 'Featured placement requests', count: 5, section: 'featured', priority: 'low' },
];

export interface TopCategoryStat {
  id: string;
  name: string;
  nameBn: string;
  orders: number;
  revenue: number;
  growth: string;
}

export const topCategories: TopCategoryStat[] = [
  { id: 'tc1', name: '2D Animation', nameBn: '২ডি অ্যানিমেশন', orders: 842, revenue: 1240000, growth: '+18%' },
  { id: 'tc2', name: 'Web Development', nameBn: 'ওয়েব ডেভেলপমেন্ট', orders: 621, revenue: 980000, growth: '+12%' },
  { id: 'tc3', name: 'Video Ads', nameBn: 'ভিডিও বিজ্ঞাপন', orders: 534, revenue: 720000, growth: '+24%' },
  { id: 'tc4', name: 'UI/UX Design', nameBn: 'ইউআই/ইউএক্স', orders: 412, revenue: 560000, growth: '+9%' },
];

export interface TopSellerStat {
  id: string;
  name: string;
  company: string;
  revenue: number;
  orders: number;
  rating: number;
}

export const topSellers: TopSellerStat[] = [
  { id: 'ts1', name: 'Rahim Ahmed', company: 'MotionHive BD', revenue: 485000, orders: 156, rating: 4.9 },
  { id: 'ts2', name: 'Fatima Khan', company: 'PixelCraft Studio', revenue: 392000, orders: 128, rating: 4.8 },
  { id: 'ts3', name: 'Karim Hassan', company: 'CodeBridge Labs', revenue: 356000, orders: 112, rating: 4.9 },
  { id: 'ts4', name: 'Nusrat Jahan', company: 'DesignFlow Pro', revenue: 298000, orders: 94, rating: 4.7 },
];

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

export const initialVerificationQueue: VerificationRequest[] = [
  { id: 'v1', sellerName: 'Sakib Rahman', company: 'AnimatePro BD', category: '2D Animation', documentsStatus: 'complete', profileCompletion: 92, riskLevel: 'low', submittedDate: '2025-05-22', status: 'pending' },
  { id: 'v2', sellerName: 'Tasnim Akter', company: 'WebNova Solutions', category: 'Web Development', documentsStatus: 'partial', profileCompletion: 78, riskLevel: 'medium', submittedDate: '2025-05-21', status: 'pending' },
  { id: 'v3', sellerName: 'Imran Hossain', company: 'AdSpark Media', category: 'Video Ads', documentsStatus: 'complete', profileCompletion: 88, riskLevel: 'low', submittedDate: '2025-05-21', status: 'pending' },
  { id: 'v4', sellerName: 'Priya Das', company: 'UI Masters', category: 'UI/UX Design', documentsStatus: 'missing', profileCompletion: 45, riskLevel: 'high', submittedDate: '2025-05-20', status: 'pending' },
  { id: 'v5', sellerName: 'Arif Islam', company: 'DevStack IT', category: 'Software', documentsStatus: 'complete', profileCompletion: 95, riskLevel: 'low', submittedDate: '2025-05-19', status: 'approved' },
];

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

export const initialAdminSellers: AdminSeller[] = [
  { id: 's1', name: 'Rahim Ahmed', company: 'MotionHive BD', category: '2D Animation', status: 'active', totalOrders: 156, revenue: 485000, rating: 4.9, featured: true },
  { id: 's2', name: 'Fatima Khan', company: 'PixelCraft Studio', category: 'Video Ads', status: 'active', totalOrders: 128, revenue: 392000, rating: 4.8, featured: true },
  { id: 's3', name: 'Karim Hassan', company: 'CodeBridge Labs', category: 'Web Development', status: 'active', totalOrders: 112, revenue: 356000, rating: 4.9, featured: false },
  { id: 's4', name: 'Nusrat Jahan', company: 'DesignFlow Pro', category: 'UI/UX Design', status: 'suspended', totalOrders: 94, revenue: 298000, rating: 4.7, featured: false },
  { id: 's5', name: 'Jamal Uddin', company: 'BoostAgency BD', category: 'Digital Marketing', status: 'pending', totalOrders: 12, revenue: 45000, rating: 4.2, featured: false },
];

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

export const initialAdminCustomers: AdminCustomer[] = [
  { id: 'c1', name: 'Ayesha Begum', email: 'ayesha@email.com', phone: '+880 17XX-XXXXXX', orders: 8, totalSpending: 125000, status: 'active', joinDate: '2024-08-12' },
  { id: 'c2', name: 'Mohammad Ali', email: 'mali@email.com', phone: '+880 18XX-XXXXXX', orders: 15, totalSpending: 245000, status: 'active', joinDate: '2024-06-03' },
  { id: 'c3', name: 'Sadia Rahman', email: 'sadia@email.com', phone: '+880 19XX-XXXXXX', orders: 3, totalSpending: 42000, status: 'active', joinDate: '2025-01-20' },
  { id: 'c4', name: 'Tanvir Chowdhury', email: 'tanvir@email.com', phone: '+880 16XX-XXXXXX', orders: 22, totalSpending: 380000, status: 'active', joinDate: '2023-11-15' },
  { id: 'c5', name: 'Laboni Saha', email: 'laboni@email.com', phone: '+880 15XX-XXXXXX', orders: 1, totalSpending: 8500, status: 'suspended', joinDate: '2025-05-10' },
];

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

export const initialAdminOrders: AdminOrder[] = [
  { id: 'BR-4521', customer: 'Ayesha Begum', seller: 'MotionHive BD', service: '2D Character Animation', amount: 15000, paymentStatus: 'completed', escrowStatus: 'held', deliveryStatus: 'in-review', disputeStatus: 'open' },
  { id: 'BR-4518', customer: 'Mohammad Ali', seller: 'PixelCraft Studio', service: 'Video Ad Package', amount: 28000, paymentStatus: 'completed', escrowStatus: 'held', deliveryStatus: 'in-review', disputeStatus: 'pending' },
  { id: 'BR-4512', customer: 'Tanvir Chowdhury', seller: 'CodeBridge Labs', service: 'E-commerce Website', amount: 85000, paymentStatus: 'completed', escrowStatus: 'held', deliveryStatus: 'pending', disputeStatus: 'pending' },
  { id: 'BR-4505', customer: 'Sadia Rahman', seller: 'DesignFlow Pro', service: 'UI/UX Redesign', amount: 35000, paymentStatus: 'completed', escrowStatus: 'released', deliveryStatus: 'completed', disputeStatus: 'resolved' },
  { id: 'BR-4498', customer: 'Laboni Saha', seller: 'BoostAgency BD', service: 'Social Media Boost', amount: 8500, paymentStatus: 'refunded', escrowStatus: 'refunded', deliveryStatus: 'cancelled', disputeStatus: 'resolved' },
];

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

export const initialAdminDisputes: AdminDispute[] = [
  {
    id: 'd1',
    orderId: 'BR-4521',
    customer: 'Ayesha Begum',
    seller: 'MotionHive BD',
    service: '2D Character Animation',
    amount: 15000,
    customerComplaint: 'Delivered animation does not match the agreed storyboard. Quality is below expectations.',
    sellerResponse: 'Client requested major revisions after approval. We offered a revision round at no extra cost.',
    status: 'open',
    openedDate: '2025-05-22',
  },
  {
    id: 'd2',
    orderId: 'BR-4518',
    customer: 'Mohammad Ali',
    seller: 'PixelCraft Studio',
    service: 'Video Ad Package',
    amount: 28000,
    customerComplaint: 'Final video has watermark issues and wrong aspect ratio for Facebook ads.',
    sellerResponse: 'Aspect ratio was specified as Instagram Reels in the brief. Happy to export Facebook format.',
    status: 'in-review',
    openedDate: '2025-05-21',
  },
];

export interface AdminCategory {
  id: string;
  icon: string;
  nameEn: string;
  nameBn: string;
  serviceCount: number;
  sellerCount: number;
  featured: boolean;
}

export const initialAdminCategories: AdminCategory[] = [
  { id: 'cat1', icon: '🎬', nameEn: '2D Animation', nameBn: '২ডি অ্যানিমেশন', serviceCount: 342, sellerCount: 48, featured: true },
  { id: 'cat2', icon: '🌐', nameEn: 'Web Development', nameBn: 'ওয়েব ডেভেলপমেন্ট', serviceCount: 289, sellerCount: 62, featured: true },
  { id: 'cat3', icon: '📹', nameEn: 'Video Ads', nameBn: 'ভিডিও বিজ্ঞাপন', serviceCount: 198, sellerCount: 35, featured: false },
  { id: 'cat4', icon: '🎨', nameEn: 'UI/UX Design', nameBn: 'ইউআই/ইউএক্স ডিজাইন', serviceCount: 156, sellerCount: 41, featured: true },
  { id: 'cat5', icon: '📱', nameEn: 'Mobile Apps', nameBn: 'মোবাইল অ্যাপ', serviceCount: 124, sellerCount: 28, featured: false },
];

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

export const initialFeaturedItems: FeaturedItem[] = [
  { id: 'f1', type: 'seller', name: 'MotionHive BD', subtitle: 'Top 2D Animation Seller', placement: 'homepage', promotionStatus: 'active', startDate: '2025-05-01', endDate: '2025-06-01' },
  { id: 'f2', type: 'service', name: 'Premium Explainer Video', subtitle: 'PixelCraft Studio', placement: 'category', promotionStatus: 'active', startDate: '2025-05-10', endDate: '2025-05-31' },
  { id: 'f3', type: 'seller', name: 'CodeBridge Labs', subtitle: 'Featured Web Developer', placement: 'both', promotionStatus: 'scheduled', startDate: '2025-06-01', endDate: '2025-07-01' },
];

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success';
}

export const adminNotifications: AdminNotification[] = [
  { id: 'n1', title: 'New verification request', message: 'AnimatePro BD submitted documents for review.', time: '5m ago', read: false, type: 'info' },
  { id: 'n2', title: 'Dispute escalated', message: 'Order BR-4521 requires admin attention.', time: '18m ago', read: false, type: 'warning' },
  { id: 'n3', title: 'Escrow threshold alert', message: 'Platform escrow balance exceeded ৳8L.', time: '1h ago', read: true, type: 'success' },
];

export interface SearchResultGroup {
  type: 'sellers' | 'customers' | 'orders' | 'categories';
  label: string;
  items: { id: string; title: string; subtitle: string }[];
}

export function buildSearchResults(query: string): SearchResultGroup[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const sellers = initialAdminSellers
    .filter((s) => s.name.toLowerCase().includes(q) || s.company.toLowerCase().includes(q))
    .map((s) => ({ id: s.id, title: s.name, subtitle: s.company }));

  const customers = initialAdminCustomers
    .filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
    .map((c) => ({ id: c.id, title: c.name, subtitle: c.email }));

  const orders = initialAdminOrders
    .filter((o) => o.id.toLowerCase().includes(q) || o.service.toLowerCase().includes(q))
    .map((o) => ({ id: o.id, title: o.id, subtitle: o.service }));

  const categories = initialAdminCategories
    .filter((c) => c.nameEn.toLowerCase().includes(q) || c.nameBn.includes(q))
    .map((c) => ({ id: c.id, title: c.nameEn, subtitle: c.nameBn }));

  const groups: SearchResultGroup[] = [];
  if (sellers.length) groups.push({ type: 'sellers', label: 'Sellers', items: sellers });
  if (customers.length) groups.push({ type: 'customers', label: 'Customers', items: customers });
  if (orders.length) groups.push({ type: 'orders', label: 'Orders', items: orders });
  if (categories.length) groups.push({ type: 'categories', label: 'Categories', items: categories });
  return groups;
}

export const monthlyRevenueData = [320, 380, 410, 395, 450, 520, 480, 560, 610, 580, 640, 720];
export const orderGrowthData = [120, 145, 132, 168, 190, 175, 210, 225, 240, 218, 265, 290];

export function formatCurrency(amount: number): string {
  if (amount >= 100000) return `৳${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `৳${(amount / 1000).toFixed(0)}K`;
  return `৳${amount.toLocaleString('en-BD')}`;
}
