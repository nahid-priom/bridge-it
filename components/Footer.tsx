'use client';

import React from 'react';
import Link from 'next/link';
import { BridgeLogo } from '@/components/brand/BridgeLogo';
import { FOOTER_BRAND_DESCRIPTION, FOOTER_COLUMNS } from '@/data/homeContent';

const SOCIAL = [
  { label: 'Facebook', letter: 'f', href: '#' },
  { label: 'Instagram', letter: 'ig', href: '#' },
  { label: 'LinkedIn', letter: 'in', href: '#' },
  { label: 'YouTube', letter: 'yt', href: '#' },
] as const;

function FooterColumn({ title, links }: { title: string; links: readonly { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-slate-400 hover:text-deshi-green transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const Footer: React.FC = () => {
  return (
    <footer className="deshi-footer text-slate-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* 5 columns: brand (2) + buyers + sellers + categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-10">
          <div className="sm:col-span-2">
            <BridgeLogo variant="footer" theme="dark" className="mb-4" />
            <p className="text-sm text-slate-400 leading-relaxed mb-5 max-w-xs">
              {FOOTER_BRAND_DESCRIPTION}
            </p>
            <div className="flex gap-2">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-400 hover:text-deshi-green hover:border-deshi-green/30 transition-colors"
                >
                  {s.letter}
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Websites" links={FOOTER_COLUMNS.solutions} />
          <FooterColumn title="Support" links={FOOTER_COLUMNS.support} />
          <FooterColumn title="Popular" links={FOOTER_COLUMNS.categories} />
        </div>

        {/* Company links + copyright — single row */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider shrink-0">
                Company
              </span>
              <nav
                className="flex flex-wrap items-center gap-x-4 gap-y-2"
                aria-label="Company"
              >
                {FOOTER_COLUMNS.company.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-deshi-green transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            <p className="text-xs text-slate-500 shrink-0 lg:text-right">
              © {new Date().getFullYear()} Bridge IT Park. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
