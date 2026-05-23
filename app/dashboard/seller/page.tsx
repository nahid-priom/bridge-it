import Link from 'next/link';
import { requireSeller } from '@/lib/auth/require-seller';
import { buildPageMetadata } from '@/lib/metadata';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  MessageCircle,
  Star,
  Megaphone,
  Settings,
} from 'lucide-react';

export const metadata = buildPageMetadata({
  title: 'Seller Dashboard',
  path: '/dashboard/seller',
  noIndex: true,
});

const sections = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard/seller' },
  { icon: Package, label: 'My Services', href: '/dashboard/seller' },
  { icon: ShoppingBag, label: 'Orders', href: '/messages' },
  { icon: MessageCircle, label: 'Messages', href: '/messages' },
  { icon: Star, label: 'Reviews', href: '/dashboard/seller' },
  { icon: Megaphone, label: 'Promotions / Ads', href: '/dashboard/seller' },
  { icon: Settings, label: 'Profile Settings', href: '/dashboard/seller' },
];

export default async function SellerDashboardPage() {
  const profile = await requireSeller();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <div className="mb-8">
        <h1 className="text-3xl font-black font-display text-text-primary">Seller Dashboard</h1>
        <p className="text-text-secondary mt-1">
          Welcome, {profile.full_name ?? 'Seller'}. Manage services, orders, and promotions.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map(({ icon: Icon, label, href }) => (
          <Link
            key={label}
            href={href}
            className="rounded-2xl border border-border-subtle bg-surface/80 p-5 hover:border-bridge-primary/40 transition-colors flex items-center gap-3"
          >
            <Icon className="w-5 h-5 text-bridge-primary" />
            <span className="font-semibold text-text-primary text-sm">{label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-border-subtle bg-background-soft p-6 text-sm text-text-secondary">
        <p className="font-semibold text-text-primary mb-2">Publishing rules</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>New services start as <strong>draft</strong> or <strong>pending_review</strong>.</li>
          <li>Promoted ads require admin approval — no misleading claims.</li>
          <li>Use Supabase-backed listings when configured; demo data fills gaps locally.</li>
        </ul>
      </div>
    </div>
  );
}
