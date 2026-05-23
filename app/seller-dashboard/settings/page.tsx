import { buildPageMetadata } from '@/lib/metadata';
import { SellerSettingsNav } from '@/components/seller-dashboard/SellerSettingsNav';

export const metadata = buildPageMetadata({
  title: 'Seller Settings',
  path: '/seller-dashboard/settings',
  noIndex: true,
});

export default function SellerSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black font-display text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary mt-1">Account, notifications, security, and seller preferences.</p>
      </div>
      <SellerSettingsNav />
      <div className="rounded-2xl border border-border-subtle bg-surface/80 p-6 space-y-4 max-w-2xl">
        <h2 className="font-bold text-text-primary">Profile settings</h2>
        <p className="text-sm text-text-secondary">
          Manage your seller display name, availability, and marketplace visibility from here.
        </p>
        <div>
          <label className="text-xs font-semibold text-text-secondary">Availability</label>
          <select className="mt-1 w-full rounded-xl border border-border-subtle bg-background px-4 py-2.5 text-sm">
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="away">Away</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-text-secondary">Marketplace visibility</label>
          <select className="mt-1 w-full rounded-xl border border-border-subtle bg-background px-4 py-2.5 text-sm">
            <option value="public">Public — appear in search</option>
            <option value="private">Private — direct links only</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="vacation" className="rounded" />
          <label htmlFor="vacation" className="text-sm text-text-primary">
            Vacation mode (pause new orders)
          </label>
        </div>
      </div>
    </div>
  );
}
