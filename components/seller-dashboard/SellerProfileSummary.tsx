import Image from 'next/image';
import Link from 'next/link';
import { Star, ExternalLink } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import type { SellerProfileSnapshot } from '@/lib/db/seller-dashboard';

export function SellerProfileSummary({ profile }: { profile: SellerProfileSnapshot }) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-gradient-to-br from-surface/90 to-emerald-500/5 p-5 flex flex-wrap gap-4 items-center">
      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 border border-emerald-500/20">
        {profile.avatarUrl ? (
          <Image src={profile.avatarUrl} alt="" fill className="object-cover" sizes="64px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl font-black text-deshi-green">
            {profile.fullName.charAt(0)}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-[200px]">
        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          {profile.sellerLevel}
        </p>
        <h2 className="text-xl font-black text-text-primary">{profile.fullName}</h2>
        <p className="text-sm text-text-secondary">{profile.title}</p>
        <div className="flex items-center gap-3 mt-2 text-sm">
          <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
            <Star className="w-4 h-4 fill-amber-400" />
            {profile.rating.toFixed(1)}
          </span>
          <span className="text-text-muted">({profile.totalReviews} reviews)</span>
          {profile.isVerified && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Verified
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Link
          href={ROUTES.sellerDashboardProfile}
          className="inline-flex items-center justify-center rounded-xl border border-emerald-500/30 px-4 py-2 text-sm font-bold text-deshi-green hover:bg-emerald-500/10"
        >
          Edit profile
        </Link>
        <Link
          href={ROUTES.marketplaceSeller(profile.slug)}
          className="inline-flex items-center justify-center gap-1 rounded-xl bg-deshi-green px-4 py-2 text-sm font-bold text-white hover:bg-deshi-green-dark"
        >
          Public profile
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
