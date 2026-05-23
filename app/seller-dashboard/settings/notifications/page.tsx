import { buildPageMetadata } from '@/lib/metadata';
import { SellerSettingsNav } from '@/components/seller-dashboard/SellerSettingsNav';

export const metadata = buildPageMetadata({
  title: 'Notification Preferences',
  path: '/seller-dashboard/settings/notifications',
  noIndex: true,
});

const PREFS = [
  'New order received',
  'Buyer message',
  'Order delivered',
  'Review received',
  'Payout processed',
  'Weekly performance summary',
];

export default function SellerNotificationSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black font-display text-text-primary">Notifications</h1>
        <p className="text-sm text-text-secondary mt-1">Choose what you want to be notified about.</p>
      </div>
      <SellerSettingsNav />
      <ul className="rounded-2xl border border-border-subtle bg-surface/80 divide-y divide-border-subtle max-w-2xl">
        {PREFS.map((label) => (
          <li key={label} className="px-5 py-4 flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-text-primary">{label}</span>
            <input type="checkbox" defaultChecked className="rounded" />
          </li>
        ))}
      </ul>
    </div>
  );
}
