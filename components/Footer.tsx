'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { BridgeLogo } from '@/components/brand/BridgeLogo';
import { SocialLinks } from '@/components/shared/SocialLinks';
import {
  FOOTER_BRAND_DESCRIPTION,
  FOOTER_BRAND_HEADLINE,
  FOOTER_BRAND_TAGLINE,
  FOOTER_COLUMNS,
} from '@/data/homeContent';
import {
  OFFICIAL_WEBSITE,
  WHATSAPP_CHAT_CTA,
  WHATSAPP_ORDER_CTA,
} from '@/lib/config/social-links';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/cn';

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div className="min-w-0">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-white">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-slate-400 transition-colors hover:text-[#60a5fa]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ExternalTextLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm text-slate-400 transition-colors hover:text-[#60a5fa]"
    >
      {children}
    </a>
  );
}

function WhatsAppCta({
  href,
  label,
  variant = 'primary',
}: {
  href: string;
  label: string;
  variant?: 'primary' | 'outline';
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex min-h-11 w-full items-center justify-center rounded-xl px-4 text-sm font-semibold transition-colors sm:w-auto',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60a5fa] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1220]',
        variant === 'primary'
          ? 'bg-[#25D366] text-[#052e16] hover:bg-[#1ebe57]'
          : 'border border-white/15 bg-white/5 text-white hover:border-[#25D366]/50 hover:bg-white/10'
      )}
    >
      {label}
    </a>
  );
}

export function Footer() {
  return (
    <footer className="deshi-footer max-w-full min-w-0 overflow-x-hidden text-slate-300">
      <div className="mx-auto w-full max-w-[1480px] min-w-0 px-4 py-10 sm:px-6 md:py-12 lg:px-8 xl:px-10">
        <div className="grid min-w-0 grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="min-w-0 sm:col-span-2 lg:col-span-4">
            <BridgeLogo variant="footer" theme="dark" className="mb-3" />
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#60a5fa]">
              {FOOTER_BRAND_TAGLINE}
            </p>
            <p className="mt-3 max-w-sm font-display text-lg font-bold leading-snug text-white">
              {FOOTER_BRAND_HEADLINE}
            </p>
            <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-slate-400">
              {FOOTER_BRAND_DESCRIPTION}
            </p>

            <div className="mt-5 flex max-w-full min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap">
              <WhatsAppCta href={WHATSAPP_CHAT_CTA.url} label={WHATSAPP_CHAT_CTA.label} />
              <WhatsAppCta
                href={WHATSAPP_ORDER_CTA.url}
                label={WHATSAPP_ORDER_CTA.label}
                variant="outline"
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <FooterColumn title="Solutions" links={FOOTER_COLUMNS.solutions} />
          </div>
          <div className="lg:col-span-2">
            <FooterColumn title="Quick Links" links={FOOTER_COLUMNS.quickLinks} />
          </div>

          <div className="min-w-0 lg:col-span-4">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-white">Contact</h3>
            <ul className="space-y-2.5">
              <li>
                <ExternalTextLink href={OFFICIAL_WEBSITE}>Website</ExternalTextLink>
              </li>
              <li>
                <ExternalTextLink href={WHATSAPP_CHAT_CTA.url}>WhatsApp</ExternalTextLink>
              </li>
              <li>
                <ExternalTextLink href={WHATSAPP_ORDER_CTA.url}>
                  Order Directly on WhatsApp
                </ExternalTextLink>
              </li>
            </ul>

            <h3 className="mb-3 mt-6 text-xs font-bold uppercase tracking-wider text-white">
              Follow Us
            </h3>
            <SocialLinks />
          </div>
        </div>

        <div className="mt-8 flex max-w-full min-w-0 flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Bridge IT Park. All Rights Reserved.
          </p>
          <nav
            className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500"
            aria-label="Legal"
          >
            <Link href={ROUTES.about} className="transition-colors hover:text-[#60a5fa]">
              Privacy Policy
            </Link>
            <Link href={ROUTES.about} className="transition-colors hover:text-[#60a5fa]">
              Terms & Conditions
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
