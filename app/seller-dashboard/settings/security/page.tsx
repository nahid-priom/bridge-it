import { buildPageMetadata } from '@/lib/metadata';
import { SellerSettingsNav } from '@/components/seller-dashboard/SellerSettingsNav';

export const metadata = buildPageMetadata({
  title: 'Security Settings',
  path: '/seller-dashboard/settings/security',
  noIndex: true,
});

export default function SellerSecuritySettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black font-display text-text-primary">Security</h1>
        <p className="text-sm text-text-secondary mt-1">Password and account security for your seller account.</p>
      </div>
      <SellerSettingsNav />
      <form className="rounded-2xl border border-border-subtle bg-surface/80 p-6 space-y-4 max-w-md">
        <div>
          <label className="text-xs font-semibold text-text-secondary">New password</label>
          <input type="password" className="mt-1 w-full rounded-xl border border-border-subtle bg-background px-4 py-2.5 text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold text-text-secondary">Confirm password</label>
          <input type="password" className="mt-1 w-full rounded-xl border border-border-subtle bg-background px-4 py-2.5 text-sm" />
        </div>
        <button type="button" className="rounded-xl bg-deshi-green px-4 py-2.5 text-sm font-bold text-white">
          Update password
        </button>
      </form>
    </div>
  );
}
