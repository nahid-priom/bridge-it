'use client';

import type { SellerProfileSnapshot } from '@/lib/db/seller-dashboard';

export function SellerProfileForm({ profile }: { profile: SellerProfileSnapshot }) {
  return (
    <form className="rounded-2xl border border-border-subtle bg-surface/80 p-6 space-y-4 max-w-2xl">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-text-secondary">Display name</label>
          <input
            type="text"
            defaultValue={profile.fullName}
            className="mt-1 w-full rounded-xl border border-border-subtle bg-background px-4 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-text-secondary">Professional title</label>
          <input
            type="text"
            defaultValue={profile.title}
            className="mt-1 w-full rounded-xl border border-border-subtle bg-background px-4 py-2.5 text-sm"
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-text-secondary">Short bio</label>
        <textarea
          rows={2}
          defaultValue={profile.shortBio ?? ''}
          className="mt-1 w-full rounded-xl border border-border-subtle bg-background px-4 py-2.5 text-sm"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-text-secondary">About</label>
        <textarea
          rows={4}
          defaultValue={profile.about ?? ''}
          className="mt-1 w-full rounded-xl border border-border-subtle bg-background px-4 py-2.5 text-sm"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-text-secondary">Avatar URL</label>
        <input
          type="url"
          defaultValue={profile.avatarUrl ?? ''}
          placeholder="https://..."
          className="mt-1 w-full rounded-xl border border-border-subtle bg-background px-4 py-2.5 text-sm"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-text-secondary">Banner URL</label>
        <input
          type="url"
          defaultValue={profile.bannerUrl ?? ''}
          placeholder="https://..."
          className="mt-1 w-full rounded-xl border border-border-subtle bg-background px-4 py-2.5 text-sm"
        />
      </div>
      <p className="text-xs text-text-muted">
        Skills, languages, portfolio, and certifications sync to marketplace_seller_* tables.
      </p>
      <button
        type="button"
        className="rounded-xl bg-deshi-green px-5 py-2.5 text-sm font-bold text-white hover:bg-deshi-green-dark"
      >
        Save profile
      </button>
    </form>
  );
}
